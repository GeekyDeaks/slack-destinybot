'use strict';
var logger = require('winston');
var app;

async function init(a) {

    app = a;
    app.addCommand({
        name: "help",
        desc: "Display help information",
        exec: help
    });

}


async function help(cmd) {

    var text = [];

    for(var c in app.commands) {
       if (app.commands.hasOwnProperty(c) && app.commands[c].name === c) {
           text.push(commandHelp(app.commands[c]));
        }
    }
    await cmd.reply(text.join("\n"));

}



function commandHelp(cmd) {

    var toSend = [];
   
    toSend.push("*" + cmd.name + "* - " + cmd.desc);
    if (cmd.alias && cmd.alias.length > 0) {
        toSend.push("\n\t*aliases*: _" + cmd.alias.join(" | ") + "_");
    }
    if (cmd.usage) {
        toSend.push("\n\tusage: " +
            // if we have an array, then just join everything with \n
            (Array.isArray(cmd.usage) ? cmd.usage.join("\n") : cmd.usage)
        );
    }
    return toSend;
}

module.exports.init = init;