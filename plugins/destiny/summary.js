'use strict';
var logger = require('winston');
var co = require('co');
var api = require('./api');
var membership = require('./membership');
var util = require('util');

var genderType = ['Male', 'Female'];
var classType = ['Titan', 'Hunter', 'Warlock'];

module.exports.name = 'summary';
module.exports.desc = 'Display Destiny character summary';
module.exports.alias = [ "sum" ];
module.exports.exec = co.wrap(function *exec(cmd) {

    var members = yield membership.search(cmd.args[0]);
    var r;
    var response = [];

    // loop around each member
    for(var m = 0; m < members.length; m++) {
        response.push(yield memberSummary(members[m]));
    }
    if(response.length) {
        yield cmd.reply(response.join("\n"));
    } else {
        yield cmd.reply("Sorry, bungie did not know about " + cmd.args[0]);
    }


});

var memberSummary = co.wrap(function *memberSummary(member) {
    var r = yield api.summary(member);
    var response = [];
    //
    for(var c = 0; c < r.data.characters.length; c++) {
        var guardian = r.data.characters[c];
        logger.debug("summary for character ",util.inspect(guardian, {depth: 1}));

        var firstLine =  
            "━━ "+ membership.name(member.membershipType) +
            " / " + member.displayName+" / "+ (c + 1) + " ";
        firstLine += "━".repeat(40 - firstLine.length);
        response.push("```");
        response.push(firstLine);
        response.push(characterSummary(guardian));
        response.push("```");

    }
    return(response.join("\n"));
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

