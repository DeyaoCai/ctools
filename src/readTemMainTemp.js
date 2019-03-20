const fs = require("fs");
const cwd = process.cwd();

function _smallHump(str ="") {
  const reg = /[-_ ]+([^-_ ])/;
  const nextStr = str.replace(reg, function () {
    const ret = arguments[1];
    return ret ? ret.toUpperCase() : "";
  });
  return reg.test(nextStr) ? _smallHump(nextStr) : nextStr;
}
function smallHump(str = ""){
  return str ? _smallHump(str).replace(/./, function () {
    const ret = arguments[0];
    return ret ? ret.toLowerCase() : ret;
  }) : "";
}
/**
  const conf = {
    outPutPath: `/src/main.js`,
    names: [],
  };
 */
function writeExportFile(conf) {
  const outPutPath = `${cwd}${conf.outPutPath}`;

  const baseContent = fs.readFileSync(`${cwd}/ctools.conf/mainJsTemp.js`);
  const midContent = conf.names.map(item =>
    `import ${smallHump(item)} from "${item}";`
  ).join("\n  ");
  const tailContent = `init([${ conf.names.map(item => smallHump(item)).join(",") }]);`;

  fs.writeFileSync(outPutPath, `${baseContent}${midContent}\n\n${tailContent}`);
  console.log(`write '${outPutPath}' success!`);
}

module.exports = {
  writeExportFile, smallHump
}
