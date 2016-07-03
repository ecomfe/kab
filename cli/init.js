/**
 * @file 初始化测试配置
 * @author chris<wfsr@foxmail.com>
 */

var fs   = require('fs');
var path = require('path');
var log  = require('../lib/log');

/**
 * 字符串转驼峰
 *
 * @param {string} key 输入字符
 * @return {string} 转换后的字符
 */
function camel(key) {
    return key.toLowerCase().replace(/_[a-z]/g, function (a) {
        return a.slice(1).toUpperCase();
    });
}

/**
 * 序列化时增加引号
 *
 * @param {*} value 输入
 * @return {string} 序列化后的字符串
 */
function quote(value) {
    return typeof value !== 'string' ? JSON.stringify(value) : '\'' + value + '\'';
}

/**
 * 从模板生成配置文件
 *
 * @param {string} from 模板文件
 * @param {string} to 目标文件路径
 * @param {Object} config 渲染模板使用的数据
 * @return {string} 目标文件最终路径
 */
function buildFromTemplate(from, to, config) {
    var cwd = process.cwd();
    var configFile = 'test/' + to;
    var configFilePath = path.resolve(cwd, configFile);

    var tplFile = path.resolve(
        __dirname,
        '../' + from
    );

    config = config || {};
    config.date = config.date || new Date();

    var content = fs.readFileSync(tplFile, 'utf-8').replace(
        /%(.*)%/g,
        function (a, key) {
            var value = config[camel(key)];
            if (value instanceof Array) {
                value = value.map(quote).join(', ');
            }
            return value;
        }
    );

    fs.writeFileSync(configFilePath, content);

    return configFilePath;

}


/**
 * 初始化配置
 *
 * @param {boolean=} override 是否覆盖现有文件
 */
function init(override) {

    if (override !== false) {

        log.trace('正在生成配置文件 `test/config.js` ...');
        buildFromTemplate('conf.tpl.js', 'config.js');
        log.trace('配置文件生成。');
    }

}

/**
 * 运行初始化
 *
 * @param {Array} args 命令运行参数
 * @param {Object} opts 命令选项
 */
exports.run = function (args, opts) {

    if (!opts.hasConfig || opts.force) {
        init();
        return;
    }

    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.write('已经存在测试配置文件，确定要覆盖? (yes or No)\n');
    rl.prompt();
    rl.write('no');
    var isYes = false;
    process.stdin.on('keypress', function (s, key) {
        if (~'up,down,tab'.indexOf(key.name)) {
            rl._deleteLineLeft();
            rl._deleteLineRight();
            rl.write(isYes ? 'no' : 'yes');
            rl.prompt();
            isYes = !isYes;
        }
    });

    rl.on('line', function (line) {
        init(line.toLowerCase() === 'yes');
        rl.close();
    });
};
