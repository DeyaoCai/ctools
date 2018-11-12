const toolConf = {
  inputPath: ["./src",],
  outputPath: "./tools.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: ".",
  succMsg: "write tools success!",
  exportMode: "es6",
}
module.exports = [
  toolConf,
];
