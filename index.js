/**
 * @file command line interface
 * @author chris<wfsr@foxmail.com>
 */

var leadName = require('./package').name;

Object.defineProperties(exports, {
    getOptions: {
        get: function () {
            return require('./lib/cli').getOptions;
        }
    },

    leadName: {
        set: function (value) {
            leadName = value;
        },

        get: function () {
            return leadName;
        }
    },

    init: {
        get: function () {
            return require('./cli/init').run;
        }
    },

    start: {
        get: function () {
            return require('./cli/start').run;
        }
    }
});
