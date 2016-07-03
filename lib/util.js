/**
 * @file 工具函数
 * @author chris<wfsr@foxmail.com>
 */

var fs   = require('fs');
var path = require('path');
var log  = require('./log');
var util = require('util');


/**
 * 格式化字符串
 *
 * @param {string} pattern 字符串模式
 * @param {...*} args 要替换的数据
 * @return {string} 数据格式化后的字符串
 */
exports.format = function (pattern, args) {
    return util.format.apply(null, arguments);
};

/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object} 返回目标对象
 */
exports.extend = function extend(target) {

    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];

        if (src == null) {
            continue;
        }

        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    }

    return target;
};

/**
 * 混合对象
 *
 * @param {...Object} source 要混合的对象
 * @return {Object} 混合后的对象
 */
exports.mix = function () {
    var o = {};
    var src = Array.prototype.slice.call(arguments);
    return exports.extend.apply(this, [o].concat(src));
};

/**
 * 获取本机IP
 * 默认取 127.0.0.1 之外的第一个IP地址
 *
 * @return {string}
 */
exports.getIP = function () {
    var ifaces = require('os').networkInterfaces();
    var defultAddress = '127.0.0.1';
    var ip = defultAddress;

    var find = function (details) {
        if (ip === defultAddress && details.family === 'IPv4') {
            ip = details.address;
        }
    };

    Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(find);
    });

    return ip;
};


/**
 * 获取可用端口
 *
 * @param {module:lib/config} config 配置模块
 * @param {Function} callback 回调函数
 */
exports.getPort = function (config, callback) {

    var server = require('http').createServer();
    server.on('error', function (e) {
        if (~'EADDRINUSE,EACCES'.indexOf(e.code)) {
            log.warn('Port %d not available, test next: %d', config.port, ++config.port);
            server.listen(config.port);
        }
        else {
            callback(e);
        }
    });

    server.on('listening', function (e) {
        log.info('Port %d available', config.port);
        server.close();
        callback(null, config);
    });

    log.trace('Test port %d...', config.port);
    server.listen(config.port);
};


/**
 * 创建目录
 *
 * @param {string} directory 目录路径
 * @param {Function} callback 创建成功后的回调函数
 */
exports.mkdir = function (directory, callback) {
    fs.stat(directory, function (err, stat) {
        if (stat && stat.isDirectory()) {
            callback();
        }
        else {
            exports.mkdir(path.dirname(directory), function () {
                fs.mkdir(directory, callback);
            });
        }
    });
};


