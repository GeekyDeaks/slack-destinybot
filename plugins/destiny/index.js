'use strict';
var logger = require('winston');
var co = require('co');

var init = co.wrap(function *init(app) {

    var api = require('./api');
    yield api.init(app);

    var stats = require('./stats');
    app.addCommand(stats);

    var summary = require('./summary');
    app.addCommand(summary);

    var summary = require('./summarya');
    app.addCommand(summary);

});

module.exports.init = init;