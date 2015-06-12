var inquirer = require('inquirer')
    wrench = require('wrench'),
    path = require('path'),
    fs = require('fs'),
    required = function (input) {
      if(input)
        return true;
    },
    confirms = [
      {
        name: 'name',
        message: '请输入项目名称',
        validate: required
      },
      {
        name: 'key',
        message: '请输入项目关键名称，用于命名Git仓库、主js模块等',
        validate: required
      },
      {
        name: 'livereload',
        message: '请输入实时刷新（livereload）监听端口号',
        default: 35730
      },
      {
        type: 'confirm',
        name: 'server',
        message: '是否需要前端服务器？'
      },
      {
        type: 'list',
        name: 'type',
        message: '请选择项目类型',
        choices: [
          {
            name: 'AngularJS项目',
            value: 'angular'
          },
          {
            name: 'ionic移动端项目',
            value: 'ionic'
          }
        ]
      }
    ];

// 应用模板
function applyTemplate (dir, config) {
  // 根据livereload端口号初始化服务器端口号
  config.server = 3000 + (config.livereload - 35730);

  var paths = {
        generate: path.join(process.cwd(), dir),
        template: path.join(__dirname, '../template', config.type)
      };

  // 拷贝项目模板至指定目录
  wrench.copyDirSyncRecursive(paths.template, paths.generate, {
    forceDelete: true
  });

  // 更新项目命名到各个文件之中
  updateKeyName(paths.generate, config);

  // 保存到配置文件
  saveConfig(paths.generate, config);

  console.log('项目 ' + config.name + ' 已创建成功！');
}

function updateKeyName (generatePath, config) {
  // 获取该目录下所有目录和文件
  var files = wrench.readdirSyncRecursive(generatePath);

  // 更新文件内部的命名
  for(var i = 0;i<files.length;i++){
    // 匹配文件，过滤掉目录
    var filename = files[i].match(/[\w]*\.+[\w]*$/);

    // 过滤掉unix的hidden文件，以.打头
    if(filename && filename[0][0] !== '.'){
      var content = '',
          filePath = path.join(generatePath, files[i]);

      filename = filename[0];

      // 读取文件
      content = fs.readFileSync(filePath, {encode: 'utf8'}).toString();

      // 判断是否需要更新命名
      if(content.indexOf('${ appName }') > -1){
        // 正则替换掉所有的命名
        content = content.replace(/\$\{\ appName\ ?\}/g, config.key);

        // 写回文件
        fs.writeFileSync(filePath, content);
      }
    }
  }

  // 更新主less文件名
  fs.rename(path.join(generatePath, 'app/styles/less/main.less')
    , path.join(generatePath, 'app/styles/less/' + config.key + '.less'));
}

function saveConfig (generatePath, config) {
  var content = '';

  // 读取文件并转换为json
  content = fs.readFileSync(path.join(generatePath, 'fife.json'), {encode: 'utf8'}).toString();
  content = JSON.parse(content);

  // 保存设置并写回文件
  content.server.port = config.server;
  content.livereload.port = config.livereload;

  fs.writeFileSync(path.join(generatePath, 'fife.json'), JSON.stringify(content, null, 4));
}

module.exports = function (dir) {
  inquirer.prompt(confirms, function (answer) {
    applyTemplate(dir, answer);
  })
}
