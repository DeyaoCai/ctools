const jsToolConf = {
  inputPath: ["./src/js",],
  outputPath: "./js.js",
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
module.exports = [
  jsToolConf,nodeToolConf
];
