var utils = require('./utils'),
    configs = utils.configs,
    src = configs.src,
    tinylr = require('tiny-lr'),
    watch = require('glob-watcher'),
    path = require('path'),
    less = require('less'),
    fs = require('fs');

// 监听信息输出函数
function startedLog (port) {
  utils.console.log('实时刷新已启动，监听端口为：' + utils.console.red(port));
}

// 监听目录文件变更
function watchDir (dir, callback) {
  var root = configs.server.root;
  // 如果是字符串，则直接进行监听
  if(typeof(dir) == 'string'){
    var watcher = watch(path.join(root, dir));
    watcher.on('change', callback);
  }
  // 如果是数组，则遍历每个元素作为目录或文件进行监听
  else if(dir.length){
    for(var i = 0;i<dir.length;i++){
      var watcher = watch(path.join(root, dir[i]));
      watcher.on('change', callback);
    }
  }
}

// 文件变更输出函数
function changedLog (filename, txt) {
  utils.console.log(utils.console.blue(filename) + txt);
}

// 处理文件的变更
function changedCallback (ev) {
  switch(ev.type){
    case 'changed':
      var filename = ev.path.match(/(\/|\\)[\w\.]*\.(html|js|less|css)$/)[0].replace(/[\/\\]/g, '');

      // 如果是less文件被修改，则先进行编译再通知浏览器刷新
      if(/[\w\.]*\.less$/.test(filename)){
        var lessPath = path.join(process.cwd(), configs.server.root, src.less.main),
            lessInput = '';

        // 读取主less文件
        try{
          lessInput = fs.readFileSync(lessPath, {encode: 'utf8'}).toString();
        }catch(e){
          throw e;
        }

        changedLog(filename, ' 被修改，正在编译');
        // 编译less
        less.render(lessInput, {filename: lessPath}).then(function (output) {
          var cssPath = path.join(process.cwd(), configs.server.root, src.less.output);
          // 将编译后的内容写入css
          fs.writeFileSync(cssPath, output.css);

          // 通知浏览器刷新
          tinylr.changed(ev.path);
          changedLog(filename, ' 编译完成，已被重新加载');
        }, function (error) {
          console.log(error);
        });
      }else{
        tinylr.changed(ev.path);
        changedLog(filename, ' 已被重新加载');
      }
      break;
  }
}

module.exports = function (app) {
  var conf = configs.livereload;

  // 如果已经实例化了服务器，则作为中间件
  if(app && app.use){
    app.use(tinylr.middleware({ app: app }))
      .listen(conf.port, function () {
        startedLog(conf.port);
      });
  }else{
    tinylr().listen(conf.port, function () {
      startedLog(conf.port);
    });
  }

  // 监听HTML文件的变更
  watchDir(src.html.paths, changedCallback);

  // 监听Less文件的变更
  watchDir(src.less.paths, changedCallback);

  // 监听css文件的变更
  watchDir(src.css.paths, changedCallback);

  // 监听js文件的变更
  watchDir(src.js.paths, changedCallback);
}
