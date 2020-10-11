const fs = require('fs');

const fontsVariables = (fontName, fonts) => {
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
          '-value: ' +
          checkIfCanHaveQuotes(variableObject[1].value) +
          ';';

        fontsReturn.push(value);
      } else {
        const value =
          fontName +
          '-' +
          variableName[0] +
          '-' +
          variableObject[0] +
          ': ' +
          checkIfCanHaveQuotes(variableObject[1]) +
          ';';

        fontsReturn.push(value);
      }
    });
  });

  return fontsReturn;
};

const checkIfCanHaveQuotes = (variableValue) => {
  const cantHave =
    parseFloat(variableValue) > 0 || variableValue.substring(0, 1) === 'r';

  if (cantHave) {
    return variableValue;
  } else {
    return '"' + variableValue + '"';
  }
};

const parser = (variableName) => {
  return Object.entries(variableName[1]).map((variable) => {
    let variables = [];
    variable.map((variableSubName, index) => {
      if (index % 2 === 0) {
        variables.push(`   --${variableName[0]}-${variableSubName}`);
      } else {
        if (variableSubName.value) {
          variables[1] =
            variables[0] +
            '-value: ' +
            checkIfCanHaveQuotes(variableSubName.value) +
            ';';
        } else {
          const font = fontsVariables(variables[0], variableSubName);
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
};

const extractCSS = (cssOutputDir) => {
  const tokensJson = JSON.parse(fs.readFileSync(`${cssOutputDir}/tokens.json`, 'utf8'));

  Object.entries(tokensJson.token).map((variableName) => {
    const fileName = `${cssOutputDir}/${variableName[0]}.css`;
    fs.openSync(fileName, 'w');
    fs.unlinkSync(fileName);
    var stream = fs.createWriteStream(fileName);
    stream.once('open', function (fd) {
      stream.write(':root {' + '\n');
      const variableFileCSS = parser(variableName);
      variableFileCSS.map((p) => {
        p.map((m) => {
          stream.write(m);
        });
      });
      stream.write('}');
    });
  });
};

module.exports = extractCSS;
