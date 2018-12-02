const toolConf = {
  inputPath: ["./src",],
  outputPath: "./tools.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: ".",
  succMsg: "write sss success!",
  exportMode: "es6",
}
const weConf = {
  readType: "we",
  inputPath: ["./src/tools",],
  outputPath: "./src/dist",
  fileReg: /\.(cwx)$/,
  succMsg: "write sss success!",
}
module.exports = [
  // toolConf,
  weConf,
];
