/**
 * @file Benchmark test for Node.js
 * @author chris<wfsr@foxmail.com>
 */

var fs = require('fs');
var path = require('path');
var marked = require('marked');
var Benchmark = require('benchmark');
var platform = require('platform');
var AsciiTable = require('ascii-table');

var log = require('./log');

function test(name, opts) {
    var markdown = fs.readFileSync(path.join(process.cwd(), name)).toString('utf-8');

    var info = {
        title: '',
        code: [],
        cases: []
    };
    var current;
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw) {
        if (info.title) {
            current = {
                name: text
            };
            info.cases.push(current);
        }
        else {
            info.title = text;
        }
    };

    renderer.code = function (code, lang) {
        if (current) {
            current.fn = code;
        }
        else {
            info.code.push(code);
        }
    };

    marked(markdown, {
        renderer: renderer,
        gfm: true
    });

    var table = new AsciiTable(info.title + ' - ' + String(platform));
    table.setHeading('NAME', 'TIMES', 'RESULT');
    table.setAlignRight(0);
    table.setAlignRight(1);

    var suite = new Benchmark.Suite(info.title);

    if (info.code[0]) {
        Benchmark.prototype.setup = info.code[0];
    }

    if (info.code[1]) {
        Benchmark.prototype.teardown = info.code[1];
    }

    info.cases.forEach(function (item) {
        suite.add(item.name, item.fn, {initCount: (opts.count | 0) || 10});
    });

    var caseCount = 0;
    var caseTotal = info.cases.length;
    suite.on('cycle', function (e) {
        var benchmark = e.target;
        table.addRow(formatRow(benchmark));

        caseCount++;
        var summary = String(platform)
            + 'Executed ' + parseInt((caseCount * 100) / caseTotal, 10)
            + '% (' + caseCount + ' / ' + caseTotal + ')\n\t';
        console.log(summary + String(benchmark));
    });

    suite.on('complete', function () {
        console.log();
        console.log(table.toString());
        log.info('The winner is ' + log.green(this.filter('fastest').map('name')));
        console.log();
    }).run({
        async: !opts.sync
    });
}

function formatNumber(number) {
    number = String(number).split('.');
    return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (number[1] ? '.' + number[1] : '');
}

function formatRow(bench) {
    var error = bench.error;
    var hz = bench.hz;
    var id = bench.id;
    var stats = bench.stats;
    var size = stats.sample.length;
    var pm = '\xb1';

    var row = [bench.name || (isNaN(id) ? id : '<Test #' + id + '>')];

    if (error) {
        row.push('ERROR', 'N/A');
    }
    else {
        row.push(' x ' + formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec');
        row.push(pm + stats.rme.toFixed(2) + '% (' + size + ' run' + (size === 1 ? '' : 's') + ' sampled)');
    }

    return row;
}

exports.run = function (args, opts) {
    args.forEach(function (arg) {
        test(arg, opts);
    });
};
