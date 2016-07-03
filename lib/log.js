/**
 * @file 日志输出
 * @author chris<wfsr@foxmail.com>
 */

var chalk = require('chalk');
var util  = require('util');


var fns = [
    {name: 'trace', color: chalk.grey, level: 0},
    {name: 'debug', color: chalk.grey, level: 1},
    {name: 'info', color: chalk.green, level: 2},
    {name: 'warn', color: chalk.yellow, level: 3},
    {name: 'error', color: chalk.red, level: 4},
    {name: 'fatal', color: chalk.red, level: 5}
];


/**
 * 为字符固定宽度（位数）
 *
 * @param {string} src 输入字符串
 * @param {number=} width 需要固定的位数，默认为 3
 * @param {string=} chr 不够时补齐的字符，默认为 1 个空格
 * @return {string} 补齐后的字符串
 */
function fixWidth(src, width, chr) {
    src = src + '';
    chr = (chr || ' ')[0];
    width = +width || 3;
    var len = src.length;

    if (len >= width) {
        return src;
    }

    return new Array(width - len + 1).join(chr) + src;
}

/**
 * 日志模块
 *
 * @param {boolean} color 是否使用颜色高亮输出
 * @return {Object} 包含 trace/debug/info/warn/error/fatal 等方法的 log 对象
 */
function logs(color) {
    var log = {};
    var name = require('../package').name;

    fns.forEach(function (item) {

        /**
         * 不同类型的 log 方法
         *
         * @param {string} format 要输出的内容.
         * @param {...*} args 变长参数.
         */
        log[item.name] = color
            ? function (format, args) {

                var msg = util.format.apply(null, arguments);
                if (msg) {
                    console.log(name + ' ' + item.color(fixWidth(item.name.toUpperCase(), 5)) + ' ' + msg);
                }
                else {
                    console.log();
                }
            }
            : function (format, args) {

                var msg = util.format.apply(null, arguments);
                if (msg) {
                    console.log(name + ' [' + fixWidth(item.name.toUpperCase(), 5) + '] ' + msg);
                }
                else {
                    console.log();
                }
            };
    });

    Object.keys(chalk.styles).forEach(function (color) {
        log[color] = chalk[color];
    });

    return log;
}

module.exports = logs(process.env.COLOR);
