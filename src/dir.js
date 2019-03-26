const fs = require("fs");
const path = require("path");
const type = require("./type");


function _mkDir(paths, prevPath){
  fs.existsSync(prevPath) || fs.mkdirSync(prevPath);
  paths.length &&  _mkDir(paths, `${prevPath}/${paths.shift()}`);
}

function mkDir(dirName) {
  if (!type.isString(dirName)) return;
  const paths = dirName.split(/[\\\/]+/);
  _mkDir(paths, paths.shift());
}

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

module.exports = {
  mk: mkDir,
  readFileInType: readDir,
};
