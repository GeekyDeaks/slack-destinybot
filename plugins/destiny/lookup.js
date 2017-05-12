'use strict';
var logger = require('winston');
var membership = require('./membership');

module.exports.name = 'lookup';
module.exports.desc = 'Display Bungie membership details';
module.exports.exec = exec;

async function exec(cmd) {

    var lookup = resolve(cmd.args, cmd.user);

    if(lookup.length === 0) {
        return await cmd.reply("Don't know what to do!");
    }

};

function resolve(args, user) {
    var lookup;
    // check if we have any args
    if(args.length > 0) {
        
        lookup = args.slice();
    } else {
        // figure out our GT or PSN
        lookup = [];
        logger.debug("Parsing [%s] for GT or PSN info", user.profile.title);

    }

    return lookup;
}