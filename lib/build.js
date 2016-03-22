var rjs = require('requirejs').optimize,
    less = require('less'),
    utils = require('./utils'),
    configs = utils.configs,
    path = require('path'),
    fs = require('fs'),
    hashFile = require('hash-file'),
    CleanCss = require('clean-css');

function compressJs (callback) {
  // r.js的配置文件
  var jsConf = {
    baseUrl: path.join(process.cwd(), configs.server.root),
    name: configs.src.js.main.replace(/\.js$/, ''),
    mainConfigFile: path.join(configs.server.root, configs.src.js.main),
    out: path.join(configs.server.root, configs.src.js.output)
  }

  utils.console.log('正在合并、压缩 ' + utils.console.blue('javascript') + ' 代码……');
  rjs(jsConf, function () {
    // 获取文件内容的哈希值
    var hash = hashFile.sync(jsConf.out);

    // 重命名文件
    fs.rename(jsConf.out, jsConf.out.replace(/\.js$/, '_' + hash + '.js'));

    utils.console.log(utils.console.blue('javascript') + ' 代码合并、压缩完成！');

    callback && callback(hash);
  });
}

function compileLess (callback) {
  utils.console.log('正在编译、压缩 ' + utils.console.blue('less') + ' 代码……');

  var lessInput = '',
      lessPath = path.join(process.cwd(), configs.server.root, configs.src.less.main);

  // 读取less文件
  try{
    lessInput = fs.readFileSync(lessPath, {encode: 'utf8'}).toString();
  }catch(e){
    throw e;
  }

  // 编译Less
  less.render(lessInput, { filename: lessPath }).then(function (output) {
    var cssPath = path.join(process.cwd(), configs.server.root, configs.src.less.output);

    // 将css进行压缩（不处理 @import 语句）
    output.css = new CleanCss({processImport: false}).minify(output.css).styles;

    // 将编译后的内容写入css
    fs.writeFileSync(cssPath, output.css);

    // 获取文件内容的哈希值
    var hash = hashFile.sync(cssPath);

    // 重命名文件
    fs.rename(cssPath, cssPath.replace(/\.css$/, '_' + hash + '.css'));

    utils.console.log(utils.console.blue('less') + ' 代码合并、压缩完成！');

    callback && callback(hash);
  });
}

function updateReferences (hashs, callback) {

  utils.console.log('正在更新 ' + utils.console.blue('javascript css') + ' 文件的引用地址……');
  var indexFile = '',
      indexPath = path.join(configs.server.root, configs.src.html.main);

  // 读取index.html
  try{
    indexFile = fs.readFileSync(indexPath, {encode: 'utf8'}).toString();
  }catch(e){
    throw e;
  }

  // 匹配css文件的正则
  var cssPat = new RegExp(configs.src.less.output.replace(/\.css$/, '\_?[\\w]*\.css'), 'g');

  // 进行正则替换
  indexFile = indexFile.replace(cssPat, configs.src.less.output.replace(/\.css/, '_' + hashs.css + '.css'));

  // 匹配js文件的正则
  var jsPat = new RegExp('data-main="[\\w\/\.\_]*"', 'g')

  // 进行正则替换
  indexFile = indexFile.replace(jsPat, 'data-main="' + configs.src.js.output.replace(/\.js/, '_' + hashs.js + '"'));

  // 写回文件
  fs.writeFileSync(indexPath, indexFile);

  utils.console.log(utils.console.blue('javascript css') + ' 文件的引用地址更新完成！');

  callback && callback();
}

module.exports = function () {
  compressJs(function (data) {
    var hash = {
      js: data
    }
    compileLess(function (data) {
      hash.css = data;

      updateReferences(hash);
    });
  });
}
