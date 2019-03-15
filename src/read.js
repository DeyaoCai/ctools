const fs = require("fs");
const getType = require("./type.js");

function _readDir(path, reg, result) { // path 读取的目录， reg 文件匹配的正则， result 为结果集
  const pathes = fs.readdirSync(path);
  const fileReg = /\./;
  pathes.forEach(item => {
    if (fileReg.test(item)) { // 判断是否为文件
      if (reg.test(item)) {
        result.push({ // 判断是否为指定文件
          path: path + "/" + item, // 路径
          name: item.replace(reg, ""), // 文件名
        });
      }
    } else _readDir(path + "/" + item, reg, result); // 文件夹的话 就往下读取
  })
}

function readDir(path, reg) { // path 读取的目录， reg 文件匹配的正则 返回一个 读取完的数组
  const result = [];
  _readDir(path, reg, result);
  return result;
}

function writeExportFile(conf) {
  let inputPath = [];
  if (getType.isString(conf.inputPath)) inputPath = [conf.inputPath];
  else if (getType.isArray(conf.inputPath)) inputPath = conf.inputPath;
  else return;

  const result = Array.prototype.concat.apply([], inputPath.map(item => readDir(item, conf.fileReg)));
  let importList = ``;
  let midList = ``;
  let exportList = ``;
  if (conf.exportMode === "node") {
    importList = result.map(item => `const ${item.name} = require("${item.path.replace(conf.importReg, conf.exportReg)}");`).join("\n");
    exportList = `\n\nmodule.exports = {${result.map(item => "\n  " + item.name + "").join(",")}\n};`;
  } else if (conf.exportMode === "es6") {
    importList = result.map(item => `import ${item.name} from "${item.path.replace(conf.importReg, conf.exportReg)}";`).join("\n");
    midList = `\n\nexport {\n  ${result.map(item => conf.exportFn ? conf.exportFn(item) : item.name).join(",\n  ")}\n}`;
    exportList = `\n\nexport default {\n  ${result.map(item => conf.exportFn ? conf.exportFn(item) : item.name).join(",\n  ")}\n}`
  } else if (conf.exportMode === "vueView") {
    importList = `export default [\n  ` + result.map(item => `{path: '${conf.bizType ? ("/" + conf.bizType) : ""}/${item.name}',name: '${item.name.toLowerCase()}',component(resolve) {require(['${item.path.replace(conf.importReg, conf.exportReg)}'], resolve)}}`).join(",\n\t");
    exportList = "\n]";
  }
  fs.writeFileSync(conf.outputPath, `${importList}${midList}${exportList}`);
  console.log(conf.succMsg);
}

module.exports = {
  readDir,
  writeExportFile,
  getType,
}
