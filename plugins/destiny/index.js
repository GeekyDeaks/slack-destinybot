'use strict';
var logger = require('winston');

async function init(app) {

    var api = require('./api');
    await api.init(app);

    app.addCommand(require('./stats'));
    app.addCommand(require('./summary'));
    app.addCommand(require('./summarya'));
    app.addCommand(require('./summaryf'));
    app.addCommand(require('./lookup'));

}

module.exports.init = init;