var app = require('connect')(),
    connectLivereload = require('connect-livereload'),
    serveIndex = require('serve-index'),
    serveStatic = require('serve-static'),
    utils = require('./utils'),
    configs = utils.configs,
    livereload = require('./livereload');

module.exports = function () {
  var port = configs.server.port,
      livereloadPort = configs.livereload?configs.livereload.port: false,
      root = configs.server.root;

  // 启动服务器
  app.listen(port);

  // 需要livereload则添加livereload中间件
  if(livereloadPort){
    app.use(connectLivereload({
      port: livereloadPort
    }));
  }

  // 添加静态资源中间件
  app.use(serveStatic(root, {'index': 'index.html'}));

  // 添加目录索引中间件
  app.use(serveIndex(root));

  // 需要livereload则进行初始化
  livereloadPort && livereload(app);

  utils.console.log('服务器已启动，运行在：' + utils.console.link('http://localhost:' + port));
}
