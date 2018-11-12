const toolConf = {
  inputPath: ["./src/js",],
  outputPath: "./index.js",
  fileReg: /\.(js)$/,
  importReg: /\/src/,
  exportReg: "/src",
  succMsg: "write es6 success!",
  exportMode: "node",
}
module.exports = [
  toolConf,
];
