'use strict';
var logger = require('winston');
var api = require('./api');
var membership = require('./membership');
var util = require('util');

var genderType = ['Male', 'Female'];
var classType = ['Titan', 'Hunter', 'Warlock'];

module.exports.name = 'summarya';
module.exports.desc = 'Display Destiny character summary';
module.exports.alias = [ "suma" ];
module.exports.exec = exec;
async function exec(cmd) {

    var members = await membership.search(cmd.args[0]);
    var r;
    var msg = cmd.message();
    if(!members.length) {
        return await cmd.reply("Sorry, bungie did not know about " + cmd.args[0]);
    }

    // loop around each member
    for(var m = 0; m < members.length; m++) {
        await memberSummary(msg, members[m]);
    }
    await cmd.reply(msg);

}

async function memberSummary(msg, member) {
    var r = await api.summary(member);

    var a;
    //
    for(var c = 0; c < r.data.characters.length; c++) {
        var guardian = r.data.characters[c];
        logger.debug("summary for character ",util.inspect(guardian, {depth: 1}));

        a = msg.attachment();
        var firstLine =  
            "━━ "+ membership.name(member.membershipType) +
            " / " + member.displayName+" / "+ (c + 1) + " ";
        firstLine += "━".repeat(30 - firstLine.length);
        a.setAuthorName(firstLine);
        //characterSummary(guardian, c);
        a.setText("```"+characterSummary(guardian)+"```");
        //a.setThumbUrl('https://www.bungie.net'+guardian.emblemPath);
        a.setAuthorIcon('https://www.bungie.net'+guardian.emblemPath);
        msg.addAttachment(a);
    }
}

function characterSummary(guardian) {

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

