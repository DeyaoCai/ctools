# ctools

> A js command tool

## How to use

``` bash
# install ctools
npm install ctools -g

# ctools push
 ## dev push
 push // 发布 npm 包 // 需先登陆
 push --push // 将dev 分支推送到远程同名分支 ，并发布npm包
 push --not-publish // 将dev 分支推送到远程同名分支 ，不发布npm包

 ## issues branch push
 push // 将代码推送到远程同名分支
 push --todev // 将代码推送到远程同名分支， 然后检出dev 将 issues 分支合并到dev
 push --publish // 将代码推送到远程同名分支， 然后检出dev 将 issues 分支合并到dev 并发布npm 包

```
