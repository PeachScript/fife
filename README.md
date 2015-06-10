# fife
基于NodeJS用于前端项目开发的命令行工具

# 简介
此命令行工具提供以下功能：

  1. 生成前端种子项目及常用组件（目前仅能生成AngularJS项目）；
  2. 快速运行一个前端服务器
  3. 在开发过程中对项目文件做变更监听，实时刷新浏览器（livereload）
  4. 拭目以待……
    

# 安装

安装到全局

```
$ npm install -g fife
```

安装到项目中

```
$ npm install fife
```

# 使用方法

生成项目

```
$ fife generate <dir_name>
```

启动服务器，与此同时会启动文件变更实时监听（livereload）

```
$ fife runserver
```

启动实时监听

```
$ fife livereload
```

*注：此命令仅仅会启动一个实时监听的服务器，无法自动向 html 文件中注入 livereload.js ，所以要保证 livereload 的正常执行，必须手动在html文件中 body 标签的尾部加上如下代码*

```html
<script>document.write('<script src="http://'
    + (location.host || 'localhost').split(':')[0]
    + ':35729/livereload.js?snipver=1"></'
    + 'script>')</script>
```

# MIT license

The MIT License (MIT)

Copyright (c) 2014 XiaoShengtao <scdzwyxst@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.