start
---------

### Usage

    kab start
    kab start markdown/*.md
    kab start [--node]
    kab start [--singleRun]
    kab start [--singleRun true]
    kab start [--singleRun false]
    kab start [--watch]
    kab start [--watch true]
    kab start [--watch false]

### Options

+ --node - 指定测试是否在 Node.js 下运行。
+ --singleRun - 指定是否运行完成后退出。
+ --watch - 是否监测文件改变后重新测试，仅当 singleRun 最终值为 false 时生效。


### Description

运行当前项目的测试服务。
