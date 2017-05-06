'use strict';
var logger = require('winston');
var co = require('co');

var init = co.wrap(function *init(app) {

    var api = require('./api');
    yield api.init(app);

    var stats = require('./stats');
    app.addCommand(stats);

});

module.exports.init = init;