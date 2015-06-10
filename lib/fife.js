var commander = require('commander'),
    generate = require('./generate'),
    livereload = require('./livereload'),
    runserver = require('./runserver');

commander.version('0.1.0');
commander.command('generate <dir>', '生成项目模板').action(generate);
commander.command('livereload', '监控文件并实时刷新').action(livereload);
commander.command('runserver', '启动服务器及实时刷新').action(runserver);
commander.parse(process.argv);
