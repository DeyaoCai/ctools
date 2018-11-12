const toolConf = {
  inputPath: ["./src",],
  outputPath: "./tools.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: ".",
  succMsg: "write comp success!",
  exportMode: "es6",
}
module.exports = [
  toolConf,
];
