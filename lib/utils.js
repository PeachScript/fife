var utils = {},
    colors = require('colors/safe'),
    path = require('path'),
    configs;

module.exports = utils;

/**
 * 控制台输出工具，基于colors
 * @date        2015-6-9
 * @author      Peach<scdzwyxsy@gmail.com>
 */

// 配置colors
colors.setTheme({
  link: ['underline', 'green']
});

// 创建获取当前时间并格式化的函数
function getTime () {
  function fixZero (num) {
    num += '';

    if(num.length == 1)
      return '0' + num;
    else
      return num;
  }
  var time = new Date();
  return colors.magenta('[' + fixZero(time.getHours())
    + ':' + fixZero(time.getMinutes()) + ':' + fixZero(time.getSeconds()) + '] ');
}

// 扩展API
colors.log = function (str) {
  console.log(getTime() + str);
}

utils.console = colors;

/**
 * 控制台输出工具 - end
 */


/**
 * 读取配置文件
 * @date        2015-6-9
 * @author      Peach<scdzwyxsy@gmail.com>
 */

try{
  configs = fs.readFileSync(path.join(process.cwd(), 'fife.json'), {encode: 'utf8'});
}catch(e){
  if(['livereload', 'runserver'].indexOf(process.argv[2]) > -1){
    utils.console.log(utils.console.red('当前目录找不到配置文件 fife.json 或文件格式错误, 请先执行 fife init!'));
    throw e;
  }
  configs = {};
}

utils.configs = configs;

/**
 * 读取配置文件 - end
 */
