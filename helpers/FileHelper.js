const fs = require('fs');

class FileHelper {
  constructor() {}

  saveFileToDirectory(directory, filename, source) {
    this.checkDirectory(directory);

    fs.writeFile(`${directory}/${filename}`, source, 'utf-8', function (error) {
      if (error) {
        console.log('An error occured while writing to File.');
        return console.log(error);
      }

      console.log('File has been saved.');
    });
  }

  saveFile(filename, source) {
    this.saveFileToDirectory('output', filename, source);
  }

  streamToFileDirectory(directory, filename, callback) {
    this.checkDirectory(directory);

    const streamPath = `${directory}/${filename}`;
    let stream = fs.createWriteStream(streamPath);

    return stream;
  }

  streamToFile(filename) {
    return this.streamToFileDirectory('output', filename);
  }

  readFileFromDirectory(directory, filename) {
    return fs.readFileSync(`${directory}/${filename}`, 'utf8')
  }

  readFile(filename) {
    return this.readFileFromDirectory('output', filename);
  }

  checkDirectory(directory) {
    if (!fs.existsSync(directory)){
      fs.mkdirSync(directory);
    }
  }
}

module.exports = FileHelper;