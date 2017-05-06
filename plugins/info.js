'use strict';
var logger = require('winston');
var co = require('co');
var app;


var init = co.wrap(function *init(a) {

    app = a;
    app.addCommand({
        name: "info",
        desc: "Display information about the bot",
        exec: info
    });
    app.addCommand({
        name: "infoa",
        desc: "Display information about the bot",
        exec: infoa
    });
});

var info = co.wrap(function *info(cmd) {

    var ds = app.rtm.dataStore;
    var response = [];
    response.push("```");
    response.push("        Name: " + app.config.pkg.name);
    response.push("     Version: " + app.config.pkg.version);
    response.push("ActiveUserId: " + app.rtm.activeUserId);
    response.push("ActiveTeamId: " + app.rtm.activeTeamId);
    response.push("   AuthCount: " + app.authCount);
    response.push("```");

    yield cmd.reply(response.join("\n"));

});

var infoa = co.wrap(function *info(cmd) {

    var ds = app.rtm.dataStore;
    var response = [];

    var msg = cmd.message();
    var a = cmd.attachment();
    a.addField("Name", app.config.pkg.name, true);
    a.addField("Version", app.config.pkg.version, true)
    a.addField("ActiveUserId", app.rtm.activeUserId, true);
    a.addField("ActiveTeamId", app.rtm.activeTeamId, true);
    a.addField("AuthCount", app.authCount, true);
    msg.addAttachment(a);
    //msg.setText("info");

    yield cmd.reply(msg);

});

module.exports.init = init;