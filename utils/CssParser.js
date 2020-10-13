const FileHelper = require('../helpers/FileHelper');

class CssParser {
  constructor() {}

  exportToDirectory(directory, tokens) {
    const self = this;

    console.log(tokens);
    Object.entries(tokens).map((variableName) => {
      const filename = variableName[0] + '.css';
  
      let stream = new FileHelper().streamToFileDirectory(directory, filename);
  
      stream.once('open', function (fd) {
        stream.write(':root {' + '\n');

        const variableMapping = self.parse(variableName);
        variableMapping.map((variables) => {
          variables.map((line) => {
            stream.write(line);
          });
        });
  
        stream.write('}');  
      });
      
    });
  }

  export(tokens) {
    this.exportToDirectory('output', tokens);
  }

  parse(variableName) {
    const self = this;
    
    return Object.entries(variableName[1]).map((variable) => {
      let variables = [];
      
      variable.map((variableSubName, index) => {
        if (index % 2 === 0) {
          variables.push(`   --${variableName[0]}-${variableSubName}`);
        } else {
          if (variableSubName.value) {
            const toggledValue = self.toggleQuotes(variableSubName.value);
            variables[1] = `${variables[0]}-value: ${toggledValue};`;
          } else {
            const font = self.parseFonts(variables[0], variableSubName);

            font.map((fontVariable, index) => {
              if (index % 2 == 0) {
                variables[1] = fontVariable;
              } else {
                variables[2] = fontVariable;
              }
            });
          }
        }
      });

      return [variables[1] + '\n'];
    });
  }

  parseFonts(fontName, fonts) {
    var self = this;
    const parsedFonts = [];

    Object.entries(fonts).map((variableName) => {
      Object.entries(variableName[1]).map((variableObject) => {
        let fontCssLine = `${fontName}-${variableName[0]}-${variableObject[0]}`;

        if (variableObject[0] !== 'type' && variableObject[0] !== 'value') {
          fontCssLine += `-value: ${self.toggleQuotes(variableObject[1].value)};`
        } else {
          fontCssLine += `: ${self.toggleQuotes(variableObject[1])};`;
        }

        parsedFonts.push(fontCssLine);
      });
    });

    return parsedFonts;
  }

  toggleQuotes(value) {
    const cantHave = parseFloat(value) > 0 || value.substring(0, 1) === 'r';
    if (!cantHave) {
      return `"${value}"`;
    }

    return value;
  };
}

module.exports = CssParser;