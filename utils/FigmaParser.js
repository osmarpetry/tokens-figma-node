const ApiHelper = require('../helpers/ApiHelper');
const ObjectHelper = require('../helpers/ObjectHelper');

class FigmaParser {
  constructor(figmaApiKey, figmaId) {
    this.apiKey = figmaApiKey;
    this.id = figmaId;

    this.figmaTreeStructure = {};
    this.stylesArtboard = {};
    this.baseTokensJSON = {
      token: {
        grids: {},
        spacers: {},
        colors: {},
        fonts: {},
      },
    };
  }

  async getStylesArtboard() {
    const self = this;

    await new ApiHelper({
      endpoint: `https://api.figma.com/v1/files/${this.id}`,
      key: this.apiKey
    }).get()
      .then(async (result) => { 
        self.figmaTreeStructure = await result.json();

        await new ObjectHelper()
              .filterObjectChildrenByName(self.figmaTreeStructure.document.children, 'styles')
              .then((stylesArtboard) => {
                self.stylesArtboard = stylesArtboard;
              })
              .catch((error) => {
                console.error('No styles art board found.');
              });
      });
  }

  async parse() {
    await this.parseGrids();
    await this.parseSpacers();
    await this.parseColors();
    await this.parseFonts();
  }

  async parseGrids() {
    const self = this;
    const grids = {};

    await new ObjectHelper()
          .filterObjectChildrenByName(this.stylesArtboard, 'grids')
          .then((gridsArtboard) => {
            gridsArtboard.map((item) => {
              if (item.name && item.layoutGrids) {
                Object.assign(grids, {
                  [item.name]: {
                    count: {
                      value: item.layoutGrids[0].count,
                      type: 'grids',
                    },
                    gutter: {
                      value: `${item.layoutGrids[0].gutterSize}px`,
                      type: 'grids',
                    },
                    offset: {
                      value: `${item.layoutGrids[0].offset}px`,
                      type: 'grids',
                    },
                  },
                });
              }
            });        

            Object.assign(self.baseTokensJSON.token.grids, grids);
          })
          .catch((error) => {
            console.error('No grids art board found.');
          })

    return this;
  }

  async parseSpacers() {
    const self = this;
    const spacers = {};

    await new ObjectHelper()
          .filterObjectChildrenByName(this.stylesArtboard, 'spacers')
          .then((spacersArtboard) => {
            spacersArtboard.map((item) => {
              if (item.name && item.absoluteBoundingBox) {
                Object.assign(spacers, {
                  [item.name]: {
                    value: `${item.absoluteBoundingBox.height}px`,
                    type: 'spacers',
                  },
                });
              }
            });
            
            Object.assign(self.baseTokensJSON.token.spacers, spacers);
          })
          .catch((error) => {
            console.error('No spacers art board found.');
          });
    
    return this;
  }

  async parseColors() {
    const self = this;
    const palette = {};

    await new ObjectHelper()
          .filterObjectChildrenByName(this.stylesArtboard, 'palette')
          .then((paletteArtboard) => {
            paletteArtboard.map((item) => {
              function rbaObj(obj) {  
                return item.fills[0].color[obj] * 255; 
              }
          
              if (item.name && item.fills) {
                Object.assign(palette, {
                  [item.name]: {
                    value: `rgba(${rbaObj('r')}, ${rbaObj('g')}, ${rbaObj('b')}, ${item.fills[0].color.a})`,
                    type: 'color',
                  },
                });
              }
            });

            Object.assign(self.baseTokensJSON.token.colors, palette);
          })
          .catch((error) => {
            console.error('No palettes art board found.');
          });
    
    return this;
  }

  async parseFonts() {
    const self = this;
    const fontStyles = {};

    await new ObjectHelper()
          .filterObjectChildrenByName(this.stylesArtboard, 'typography')
          .then((fontStylesArtboard) => {
            fontStylesArtboard.map((fontItem, i) => {
              if (fontItem.children) {
                let subFonts = {};
          
                // get all sub fonts
                fontItem.children.map((subFontItem) => {
                  if (subFontItem.name && subFontItem.style) {
                    // merge multiple subfonts objects into one
                    Object.assign(subFonts, {
                      [subFontItem.name]: {
                        family: {
                          value: `${subFontItem.style.fontFamily}`,
                          type: 'typography',
                        },
                        size: {
                          value: `${subFontItem.style.fontSize}px`,
                          type: 'typography',
                        },
                        weight: {
                          value: subFontItem.style.fontWeight,
                          type: 'typography',
                        },
                        lineheight: {
                          value: `${subFontItem.style.lineHeightPercent}%`,
                          type: 'typography',
                        },
                        spacing: {
                          value:
                            subFontItem.style.letterSpacing !== 0
                              ? `${subFontItem.style.letterSpacing}px`
                              : 'normal',
                          type: 'typography',
                        },
                      },
                    });
                  }
                });
          
                let fontObj = {
                  [fontItem.name]: subFonts,
                };
          
                Object.assign(fontStyles, fontObj);
              } else if (fontItem.name && fontItem.style) {
                Object.assign(fontStyles, {
                  [fontItem.name]: {
                    family: {
                      value: `${fontItem.style.fontFamily}, ${fontItem.style.fontPostScriptName}`,
                      type: 'typography',
                    },
                    size: {
                      value: fontItem.style.fontSize,
                      type: 'typography',
                    },
                    weight: {
                      value: fontItem.style.fontWeight,
                      type: 'typography',
                    },
                    lineheight: {
                      value: `${fontItem.style.lineHeightPercent}%`,
                      type: 'typography',
                    },
                    spacing: {
                      value:
                        fontItem.style.letterSpacing !== 0
                          ? `${fontItem.style.letterSpacing}px`
                          : 'normal',
                      type: 'typography',
                    },
                  },
                });
              }
            });

            Object.assign(selft.baseTokensJSON.token.fonts, fontStyles);  
          })
          .catch((error) => {
            console.error('No font styles art board found.');
          });

    return this;
  }
  
  getBaseTokens() {
    return this.baseTokensJSON;
  }
}

module.exports = FigmaParser;