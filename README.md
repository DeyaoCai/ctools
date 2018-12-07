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

```
