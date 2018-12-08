const fs = require("fs");
const getType= require("./type.js");

function _readDir(path, reg, result) { // path 读取的目录， reg 文件匹配的正则， result 为结果集
  const pathes = fs.readdirSync(path);
  const fileReg = /\./;
  pathes.forEach(item => {
    if (fileReg.test(item)) { // 判断是否为文件
      if (reg.test(item)) {result.push({ // 判断是否为指定文件
        path: path + "/" + item, // 路径
        name: item.replace(reg, ""), // 文件名
      });}
    } else _readDir(path + "/" + item, reg, result); // 文件夹的话 就往下读取
  })
}

function readDir(path, reg) { // path 读取的目录， reg 文件匹配的正则 返回一个 读取完的数组
  const result = [];
  _readDir(path, reg, result);
  return result;
}
function  _makeDir(curdir, list){
  if(!curdir) return;
  try{fs.mkdirSync(curdir);}catch(e){};
  let now = list.shift();
  if (!now) return;
  _makeDir(curdir + "/" + now, list)

};
function makeDir(dir) {
  if(!dir) return;
  const list = dir.split("/");
  const now = list.shift();
  _makeDir(now, list)
}


function _getType(conf, type){
  return conf[type] || type;
}
function makeGetType(conf) {
    return type => _getType(conf, type);
}


function writeExportFile(conf){
  let inputPath = [];
  if (getType.isString(conf.inputPath)) inputPath = [conf.inputPath];
  else if (getType.isArray(conf.inputPath)) inputPath = conf.inputPath;
  else return;
  const result = Array.prototype.concat.apply([],inputPath.map(item => readDir(item, conf.fileReg)));
  result.forEach(item=>{
    const text = fs.readFileSync(item.path, "utf-8");
    const filePath = item.path.replace(conf.inputPath, conf.outputPath).replace(conf.fileReg, "");
    const fileName = filePath + "/" + item.name;
    try{makeDir(filePath);}catch(e){};
    const json = text.match(/(<script role="json">)([\t\n\r]|.)*?(<\/script>)/g);
    const js = text.match(/(<script>)([\t\n\r]|.)*?(<\/script>)/g);
    const style = text.match(/(<style>)([\t\n\r]|.)*?(<\/style>)/g);
    const template = text.match(/(<template>)([\t\n\r]|.)*?(<\/template>)/g);
    json && fs.writeFileSync(
      fileName + ".json",
      JSON.stringify(eval("("+json[0].replace(/<script role="json">/g,"").replace(/<\/script>/g,"").replace(/export default/g,"") + ")"))
    );
    js && fs.writeFileSync(`fileName + .${conf.fileType && conf.fileType.js || "js"}`, js[0].replace(/<script>/g,"").replace(/<\/script>/g,""));
    style && fs.writeFileSync(fileName + ".wxss", style[0].replace(/<style>/g,"").replace(/<\/style>/g,""));
    template && fs.writeFileSync(fileName + ".wxml", template[0].replace(/<template>/g,"").replace(/<\/template>/g,""));
  })

  // fs.writeFileSync(conf.outputPath, importList + exportList);
  console.log(conf.succMsg);
}


module.exports = {
  readDir,
  writeExportFile,
  getType,
}
