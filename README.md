KAB
==========

KAB 是源于 edp-test 的前端测试工具。

[![Build Status](https://img.shields.io/travis/ecomfe/kab.svg?style=flat)](http://travis-ci.org/ecomfe/kab)
[![Build Status](https://img.shields.io/appveyor/ci/chriswong/kab.svg?style=flat)](https://ci.appveyor.com/project/chriswong/kab)
[![NPM version](https://img.shields.io/npm/v/kab.svg?style=flat)](https://www.npmjs.com/package/kab)
[![Coverage Status](https://img.shields.io/coveralls/ecomfe/kab.svg?style=flat)](https://coveralls.io/r/ecomfe/kab)
[![Dependencies](https://img.shields.io/david/ecomfe/kab.svg?style=flat)](https://david-dm.org/ecomfe/kab)
[![DevDependencies](https://img.shields.io/david/dev/ecomfe/kab.svg?style=flat)](https://david-dm.org/ecomfe/kab)


### 安装

```shell
    $ [sudo] npm install kab -g
```

### 使用

```shell
    $ kab
    $ kab -v
    $ kab init --help
    $ kab start --help
```

### API

#### kab.leadName

设置或获取控制台输出信息前的名称，默认值为 `kab`。

```javascript
var kab = require('kab');
kab.leadName = 'edp';
...
```

#### kab.getOptions([Array argv])

获取经 `minimist` 解释后的命令行参数对象，可用于 `kab.init` 和 `kab.start` 方法。

```javascript
var options = kab.getOptions(process.argv.slice(2));

console.log(options.command); // 'start'
...
```

#### kab.init(Object options)

初始化配置文件。


#### kab.start(Object options)

开始测试。
