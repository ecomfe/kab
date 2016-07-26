/**
 * @file command line interface
 * @author chris<wfsr@foxmail.com>
 */

var fs       = require('fs');
var path     = require('path');
var util     = require('util');
var msee     = require('msee');
var minimist = require('minimist');

var edp = require('edp-core');

/**
 * 显示指定命令的帮助
 *
 * @param {string} cmd 命令名
 */
function displayHelp(cmd) {
    var file = path.join(__dirname, '../doc', cmd + '.md');
    var doc;

    if (fs.existsSync(file)) {
        doc = msee.parseFile(file);
    }
    else {
        doc = msee.parse(
            util.format('Have no help for command named `%s`, check your input please.', cmd)
        );
    }

    console.log(doc);
}

/**
 * 显示 package.json 中的版本号
 *
 * @param {string[]=} modules 指定的模块名称集
 */
function displayVersion(modules) {
    var pkg = require('../package');
    console.log('%s %s', pkg.name, pkg.version);

    var versions = require('./version')(modules);
    Object.keys(versions).forEach(function (name) {
        console.log('    %s@%s', name, versions[name]);
    });
}


/**
 * 检查配置文件是否存在
 *
 * @return {boolean}
 */
function check() {
    process.chdir(edp.path.getRootDirectory());

    var testDir = path.resolve(process.cwd(), 'test/');
    var testConfig = path.resolve(testDir, 'config.js');

    // 保证有 test 目录
    if (!fs.existsSync(testDir)) {
        fs.mkdir(testDir);
    }

    return fs.existsSync(testConfig);
}

/**
 * 获取命令行选项对象
 *
 * @param {Array=} argv 传入的命令行参数
 * @return {Object} minimist 对命令行参数解释后的对象
 */
exports.getOptions = function (argv) {
    var options = minimist(
        argv || [],
        {
            'boolean': [
                'debug', 'force', 'help', 'node', 'singleRun', 'sync', 'version', 'watch'
            ],
            'string': ['_', 'port', 'jasmine'],
            'default': {
                singleRun: true,
                sync: true
            },
            'alias': {
                b: 'browsers',
                c: 'count',
                h: 'help',
                f: 'force',
                v: 'version'
            }
        }
    );


    var cmd = options._[0];

    if (cmd && fs.existsSync(path.join(__dirname, '../cli', cmd + '.js'))) {
        cmd = options._.shift();
    }
    else if (!options.help) {
        cmd = 'start';
    }

    options.command = cmd;

    if (options.browsers) {
        options.browsers = options.browsers.split(/\s*,\s*/);
    }

    process.env.DEBUG = options.debug;
    process.env.COLOR = options.color;

    return options;
};

/**
 * 命令行参数处理
 *
 * @return {void} 无返回
 */
exports.parse = function () {
    var options = exports.getOptions(process.argv.slice(2));
    var cmd = options.command;

    if (options.version) {
        return displayVersion(options._);
    }

    if (options.help) {
        return displayHelp(cmd || 'kab');
    }

    options.hasConfig = check();

    require('../cli/' + cmd).run(options);
};
