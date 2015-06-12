var commander = require('commander'),
    generate = require('./generate'),
    livereload = require('./livereload'),
    runserver = require('./runserver');

commander.version('0.1.1');

commander.usage('[command] <args ...>');

commander
  .command('generate <dir>')
  .description('生成项目模板')
  .action(generate);

commander
  .command('livereload')
  .description('监控文件并实时刷新')
  .action(livereload);

commander
  .command('runserver')
  .description('启动服务器及实时刷新')
  .action(runserver);

commander.parse(process.argv);

if(!process.argv.slice(2).length){
  commander.outputHelp();
}
