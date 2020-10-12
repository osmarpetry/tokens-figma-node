const FigmaParser = require('./utils/FigmaParser');
const CssParser = require('./utils/CssParser');
const FileHelper = require('./helpers/FileHelper');

class Main {
  constructor() {}

  async execute() {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
      console.error('Missing required arguments');
      console.error('Usage: npm run parse [figmaApiKey] [figmaId] [outputDirectory]');
      process.exit(1);
    } 
    const [figmaApiKey, figmaId, outputDirectory] = args;

    const figma = new FigmaParser(figmaApiKey, figmaId);
    await figma.getStylesArtboard();
    await figma.parse();

    const filename = 'tokens.json';
    new FileHelper().saveFileToDirectory(outputDirectory, filename, JSON.stringify(figma.getBaseTokens(), null, 2));

    let tokensSource = figma.getBaseTokens();
    new CssParser().exportToDirectory(outputDirectory, tokensSource.token);
  }
}

new Main().execute();