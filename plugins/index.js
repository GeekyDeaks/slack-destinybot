'use strict';
var logger = require('winston');
var promisify = require('promisify-node');
var fs = promisify('fs');
var path = require('path');

async function init(app) {

    var files = await fs.readdir(__dirname);

    var plugins = files.filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    });
    var file;
    var filePath;
    var plugin;
    while(file = plugins.shift()) {
        filePath = path.join(__dirname, file);
        logger.debug('loading plugin from: %s', filePath);
        try {
            plugin = require(filePath);
            await plugin.init(app);
        } catch (err) {
            logger.error('failed to load plugin: ', err);
        }
        
    }

}

module.exports.init = init;