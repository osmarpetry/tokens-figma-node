const fs = require('fs');
const jsonToCssVariables = require('json-to-css-variables');

var obj = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const fonts = (fontName, fonts) => {
  const fontsReturn = [];
  Object.entries(fonts).map((variableName) => {
    Object.entries(variableName[1]).map((variableObject) => {

      if (variableObject[0] !== 'type' && variableObject[0] !== 'value') {
        const value =
          fontName +
          '-' +
          variableName[0] +
          '-' +
          variableObject[0] +
          '-value: "' +
          variableObject[1].value +
          '";';

        const type =
          fontName +
          '-' +
          variableName[0] +
          '-' +
          variableObject[0] +
          '-type: "' +
          variableObject[1].type +
          '";';

        fontsReturn.push(value, type);
      } else {
        console.log(variableObject[0], variableObject[1])

        const value =
          fontName +
          '-' +
          variableName[0] +
          '-' +
          variableObject[0] +
          ': "' +
          variableObject[1] +
          '";';


        fontsReturn.push(value);
      }
    });
  });

  return fontsReturn;
};

fs.unlinkSync('tokens.css');
var stream = fs.createWriteStream('tokens.css');
stream.once('open', function (fd) {
  stream.write('body {' + '\n');

  Object.entries(obj.token).map((variableName) => {
    Object.entries(variableName[1]).map((b) => {
      let variables = [];
      b.map((variableSubName, index) => {
        if (index % 2 === 0) {
          variables.push(`   --${variableName[0]}-${variableSubName}`);
        } else {
          if (variableSubName.value) {
            variables[1] =
              variables[0] + '-value: "' + variableSubName.value + '";';
            variables[2] =
              variables[0] + '-type: "' + variableSubName.type + '";';
          } else {
            const font = fonts(variables[0], variableSubName);
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
      stream.write(variables[1] + '\n');
      stream.write(variables[2] + '\n');
    });
  });

  stream.write('}');
});
