'use strict';
var logger = require('winston');
var co = require('co');

var init = co.wrap(function *init(app) {

    var api = require('./api');
    yield api.init(app);

    app.addCommand(require('./stats'));
    app.addCommand(require('./summary'));
    app.addCommand(require('./summarya'));
    app.addCommand(require('./summaryf'));
    app.addCommand(require('./lookup'));

});

module.exports.init = init;