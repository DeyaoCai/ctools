#! node
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
const read = require("../src/read.js");
const readWx = require("../src/readWx.js");
const path = require("path");

// const aaa = require()
const cwd = process.cwd();
const arv = process.argv;
console.log(
  path.join(__dirname, "")
)

let ctoolsUsrConf;
try {
  const ctoolsConfPath = `${cwd}/ctools.config.js`;
  ctoolsUsrConf = require(ctoolsConfPath);
} catch (e) {
  console.log("读取配置失败， 将使用默认配置！");
  ctoolsUsrConf = {};
}
const ctoolsConf = Object.assign({
  push: {},
  read: {},
  watch: {},
}, ctoolsUsrConf);

if (arv.includes("read")) {
  const conf = ctoolsConf.read;
  Object.keys(conf).forEach(item => {
    conf && conf[item].forEach(item => {
      if (item.readType === "single file") readWx.writeExportFile(item);
      else read.writeExportFile(item);
    });
  });
}
const readConfReg = /^read--/;
const readConf = arv.filter(item => readConfReg.test(item));

if (readConf.length) {
  const conf = ctoolsConf.read;
  readConf.forEach(item => {
    const arr = item.replace(readConfReg, "").split(/-/);
    arr.forEach(item => {
      conf && conf[item] && conf[item].forEach(item => {
        if (item.readType === "single file") readWx.writeExportFile(item);
        else read.writeExportFile(item);
      });
    })
  });
}

if (arv.includes("proxy")) {
  exec({exec: "node ./src/node/app.js"});
}
if (arv.includes("watch")) {
  console.log("watch");
  // exec({exec: "node ./src/node/app.js"});
}
