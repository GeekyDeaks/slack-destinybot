'use strict';

var promisify = require('promisify-node');
var request = promisify('request');

var util = require('util');
var logger = require('winston');

// API details here:
// https://www.bungie.net/platform/destiny/help/
// and here:
// http://destinydevs.github.io/BungieNetPlatform/

var config;

async function init(app) {
    if(!app.config.destiny) {
        throw new Error("no bungie config defined");
    }
    config = app.config.destiny;
}

async function destinyAPI(op) {

    var args = {
        url: config.url + op,
        headers: {
            'X-API-Key': config.apikey
        }
    };
    logger.debug("issuing destiny API cmd: %s", args.url);

    var res = await request.get(args);

    logger.debug("response code", res.statusCode);

    if (res.statusCode !== 200) {
        logger.error("destiny API error: %s\n", res.statusCode, res.body);
        throw new Error("Destiny API Failure: "+res.statusMessage);
    } else {
        var r = JSON.parse(res.body);
        logger.debug("ErrorCode: %s, ThrottleSeconds: %s, ErrorStatus: %s, Message: %s",
            r.ErrorCode, r.ThrottleSeconds, r.ErrorStatus, r.Message);

        if(r.ErrorStatus !== 'Success') {
            throw new Error("destiny API Failure: "+r.ErrorStatus);
        }
        if(!r.Response) {
            throw new Error("destiny API failure: no Response");
        }
        return (r.Response);
    }
}

function stats(member) {
    // /Stats/Account/{membershipType}/{destinyMembershipId}/
    var op = util.format('/Stats/Account/%d/%s/', member.membershipType, member.membershipId);
    return destinyAPI(op);

}

function search(type, name) {
    // /SearchDestinyPlayer/{membershipType}/{displayName}/

    var op = util.format('/SearchDestinyPlayer/%d/%s/', type, name);
    return destinyAPI(op);
}

function membership(type, name) {
    // /{membershipType}/Stats/GetMembershipIdByDisplayName/{displayName}/

    var op = util.format('/%d/Stats/GetMembershipIdByDisplayName/%s/', type, name);
    return destinyAPI(op);
}

function summary(member) {
    // /{membershipType}/Account/{destinyMembershipId}/Summary/	

    var op = util.format('/%d/Account/%s/Summary/', member.membershipType, member.membershipId);
    return destinyAPI(op);
}

function manifest() {
    // /Manifest/
    var op = util.format('/Manifest/');
    return destinyAPI(op);
}

function advisor() {
    // /Advisors/V2/

    var op = util.format('/Advisors/V2?definitions=true');
    return destinyAPI(op);
}


/**
 * To-Do (not yet implemented)
 * 
 * @var type membershipType
 * @var id destinyMemberShipId
 * @var charId characterId
 *
 * syntax of cmd would be:
 * /d advisor xbl unisys12 titan
 *
 * Will have to search for user first,
 * using search cmd above to find
 * the characterId. Possible this 
 * will not work on account with 
 * two of the same class. Could be 
 * possible to provide feedback to 
 * user in the form of looking up
 * the user account and return a list
 * of players characters. Followed
 * by asking which one they would Like
 * to search for and providing a 
 * cmd they can copy and past back
 * into chat. 
 */
function playerAdvisor(type, id) {
    // {membershipType}/Account/{destinyMembershipId}/Character/{characterId}/Advisors/V2/

    var op = util.format('{type}/Account/{id}/Character/{characterId}/Advisors/V2/');
    return destinyAPI(op);
}

module.exports.stats = stats;
module.exports.search = search;
module.exports.summary = summary;
module.exports.manifest = manifest;
module.exports.advisor = advisor;
module.exports.init = init;