# ctools

> A js command tool

## How to use

``` bash
# install ctools
npm install ctools -g

# ctools push // git自动提交代码
 ## dev push 当前分支为dev分支
 push // 发布 npm 包 // 需先登陆
 push --push // 将dev 分支推送到远程同名分支 ，并发布npm包
 push --not-publish // 将dev 分支推送到远程同名分支 ，不发布npm包

 ## issues branch push 当前分支为其他分支 // 同时会拉取 test分支的代码
 push // 将代码推送到远程同名分支
 push --todev // 将代码推送到远程同名分支， 然后检出dev 将 issues 分支合并到dev
 push --publish // 将代码推送到远程同名分支， 然后检出dev 将 issues 分支合并到dev 并发布npm 包

# ctools read 将单文件拆分成多个文件， 使用场景 用单文件形式开发多文件的项目（小程序，4 个文件）（react 4 个文件）
    to split a file into several file. you can use in you react project; (
        you can edit a html file which includes script and css codes
        than use ctools to split it into css and js
    )
    you should put a ctools.config.js in you root directory;

    const weConf = {
      readType: "single file", // you'd better not change this, otherwise it will work unexpectedly
      // file type you wanna output ,  if you wanna css codes tobe a .css file than a .wxss file, just set fileType.css as css;
      fileType: {
        html: "wxml",
        css: "wxss",
        js: "js",
        json: "json"
      },
      // the directory where includes you own codes
      inputPath: ["./src/tools",],
      // the directory where you expect to place the output files
      outputPath: "./src/dist",
      // file should be go through when it's' name matches the RegExp,
      fileReg: /\.(cwx)$/,
      succMsg: "write sss success!",
    }
    module.exports = [
      // jsToolConf,
      // nodeToolConf
      weConf,
    ];

    eg. index.cwx
        <!-- you'd better use the same tag with attributes as i do -->
        <!-- because it matches tags by only a few strings below -->
        <!--
          eg. if you wanna match a .json file
          it will work when you use '<script role="json"> something </script>'
          but '<script role="json" ref="sss"> something </script>'  , '<script  role="json"> something </script>'
        -->
        <script role="json">
          /* this will output something as .json file */
          /* json.stringify( eval(the content 'export default' exports) ) */
          export default {
            aaa: "5646",
          }
        </script>
        <template>
          <!-- this will output something as .html file -->
          <div>45646</div>
        </template>
        <script>
            /* this will output something as .js file */
          Component({
            a: "43246"
          })
        </script>
        <style>
          /* this will output something as .css file */
          div{
            background-color: red;
          }
        </style>

    output:
     index.wxml
        <div>45646</div>
     index.wxss
         div{
             background-color: red;
           }
      index.js
        Component({
            a: "43246"
          })
      index.json
        {"aaa": "5646"}




    another way to use ctools read;

    i suppose there is a project like this;
    -src
      -component
        -header.vue
        -content.vue
        -footer.vue
      -views
        -index.vue

     if you wanna use all components in index.vue;
     you shall add these code in it:
        export header from "../component/header.vue"
        export content from "../component/content.vue"
        export footer from "../component/footer.vue"

     const componentConf = {
       inputPath: ["./src/component",],
       outputPath: "./src/component.js",
       fileReg: /\.(vue)$/,
       importReg: /\/src/,
       exportReg: ".",
       succMsg: "write es6 success!",
       exportMode: "es6",
     }
     how to set these params?;
     if fileReg match noting;
     export ./src/component/footer.vue;
     but it should be ../component/footer.vue;
     "./src/component/footer.vue".replace(/\/src/, ".") is "../component/footer.vue";

     then
        your codes changes to this
        export component from "../component.js";

      if you wanna those codes like this
        const header = require("../xxx/xxxx")
      just change exportMode "es6" to "node";

```
