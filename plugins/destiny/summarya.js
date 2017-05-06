'use strict';
var logger = require('winston');
var co = require('co');
var api = require('./api');
var membership = require('./membership');
var util = require('util');

var genderType = ['Male', 'Female'];
var classType = ['Titan', 'Hunter', 'Warlock'];

module.exports.name = 'summarya';
module.exports.desc = 'Display Destiny character summary';
module.exports.alias = [ "suma" ];
module.exports.exec = co.wrap(function *exec(cmd) {

    var members = yield membership.search(cmd.args[0]);
    var r;
    var msg = cmd.message();
    if(!members.length) {
        return yield cmd.reply("Sorry, bungie did not know about " + cmd.args[0]);
    }

    // loop around each member
    for(var m = 0; m < members.length; m++) {
        yield memberSummary(msg, members[m]);
    }
    yield cmd.reply(msg);

});

var memberSummary = co.wrap(function *memberSummary(msg, member) {
    var r = yield api.summary(member);

    var a;
    //
    for(var c = 0; c < r.data.characters.length; c++) {
        var guardian = r.data.characters[c];
        logger.debug("summary for character ",util.inspect(guardian, {depth: 1}));

        a = msg.attachment();

        var firstLine =  
            "━━ "+ membership.name(member.membershipType) +
            " / " + member.displayName+" / "+ (c + 1) + " ";
        firstLine += "━".repeat(40 - firstLine.length);
        a.setTitle(firstLine);
        a.setText("```"+characterSummary(guardian)+"```");
        msg.addAttachment(a);
    }
});

function characterSummary(guardian, index) {

    var response = [];

    logger.debug("summary for character ",util.inspect(guardian, {depth: 1}));

    //var currentActivity = yield manifest.getDestinyActivityDefinition(guardian.characterBase.currentActivityHash);
    response.push("    Guardian: "+ genderType[guardian.characterBase.genderType] + " " +
            classType[guardian.characterBase.classType]);

    response.push("       Level: " + guardian.characterLevel);
    response.push("       Light: " + guardian.characterBase.powerLevel);
    response.push("Hours Played: " + Math.round( guardian.characterBase.minutesPlayedTotal / 6) / 10);

    //if(currentActivity)
    //    line.push("    Activity: " + currentActivity.activityName);

    return response.join("\n");

}

