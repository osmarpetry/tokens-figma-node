const fs = require('fs');
const jsonToCssVariables = require('json-to-css-variables');

var obj = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

const teste = (obj) => {
  console.log('=>', obj);
  Object.entries(obj[1]).map((b) => {
    setTimeout(function () {
      teste(b);
    }, 0);
  });
};

const ka = Object.entries(obj.token).map((a) => {
  let pa = [];

  Object.entries(a[1]).map((b) => {
    let variable = `--${a[0]}`;
    Object.entries(a[1]).map((b) => {
      variable = variable + `-${b[0]}`;
      Object.entries(b[1]).map((c) => {
        c.map((d, k) => {
          if (typeof d == 'string') {
            if (k % 2 === 0) {
              pa.push(variable + `-${d}`);
            }
          } else {
            if (k % 2 === 1) {
              pa[pa.length - 1] = pa[pa.length - 1] + `: ${d.value};`;
            }
          }
        });
      });
    });
  });

  return pa;
});

fs.unlinkSync('tokens.css')

var stream = fs.createWriteStream('tokens.css', { flags: 'a' });
ka.map((ppak) => {
  stream.once('open', function (fd) {
    stream.write('body {' + '\n');
  });
  ppak.map((papak) => {
    stream.once('open', function (fd) {
      stream.write('   ' + papak + '\n');
    });
  });
  stream.once('open', function (fd) {
    stream.write('}' + '\n');
  });
});
