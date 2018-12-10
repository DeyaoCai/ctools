const jsToolConf = {
  inputPath: ["./src/js",],
  outputPath: "./index.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: "/src",
  succMsg: "write es6 success!",
  exportMode: "es6",
}
const nodeToolConf = {
  inputPath: ["./src/node", "./src/js",],
  outputPath: "./node.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: "/src",
  succMsg: "write es6 success!",
  exportMode: "node",
}
const weConf = {
  readType: "single file",
  fileType: {
    html: "wxml",
    css: "wxss",
    js: "js",
    json: "json"
  },
  inputPath: ["./src/tools",],
  outputPath: "./src/dist",
  fileReg: /\.(cwx)$/,
  succMsg: "write sss success!",
}
module.exports = [
  // jsToolConf,
  // nodeToolConf
  weConf,
];
