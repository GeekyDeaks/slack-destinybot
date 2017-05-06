//
// Slack Destiny Bot
//

'use strict';

var logger = require('winston');
logger.level = 'debug';
// fudge - by default winston disables timestamps on the console
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { prettyPrint: true, 'timestamp':true });
var co = require('co');

var config = require('./config');
config.pkg = require("./package.json");

var Command = require('./lib/command');

var app = {
    config: config,
    authCount: 0
};
var commands = app.commands = {};

function addCommand(cmd) {
    logger.info("adding command %s", cmd.name);
    commands[cmd.name] = cmd;

    // add the aliases
    if(cmd.alias) {
        cmd.alias.forEach(function(alias) {
            logger.info("adding alias %s for command %s", alias, cmd.name);
            commands[alias] = cmd;
        });
    }


}

app.addCommand = addCommand;

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;


logger.info("bot started, v" + config.pkg.version);

var channel = 'C57UQUW1J';

//var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = app.rtm = new RtmClient(config.slack.token);
var WebClient = require('@slack/client').WebClient;
var web = app.web = new WebClient(config.slack.token);

/*
var oldEmit = rtm.emit;

rtm.emit = function() {
      var emitArgs = arguments;
    console.log(emitArgs);
      oldEmit.apply(rtm, arguments);
}
*/

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  logger.info(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
  app.authCount++;
});

rtm.on('message', co.wrap(function* (msg) {

    //logger.debug(msg);
    if(msg.bot_id) return; // ignore bot messages
    try {

        var result = yield web.users.info(msg.user);
        if(!result.ok) return;
        var user = result.user;
        //logger.debug(user);

        if(user.is_bot) return; // just in case it was a restart message

        var content;
        
        if(msg.text.toLowerCase().startsWith(config.commandPrefix)) {
            // strip off the prefix
            content = msg.text.substring(config.commandPrefix.length);
        } else if (msg.channel[0] === "D") {
            // direct message we can still check for a command
            content = msg.text;
        } else {
            // these are not the droids you are looking for...
            return;
        }

        logger.debug("got message from [%s] in channel [%s]: ", 
                user.name, msg.channel, content);

        var cmd = new Command({
            rtm: rtm,
            web: web,
            user: user,
            channel: msg.channel
        });

        // split into command and args
        cmd.args = content.trim().match(/[^"\s]+|"(?:\\"|[^"])+"/g);
        cmd.name = cmd.args.shift().toLowerCase();

        // yep, ok then see if we have that command loaded
        if(commands[cmd.name] && commands[cmd.name].exec) {
            try {
                yield commands[cmd.name].exec(cmd);
            } catch(err) {
                logger.error(err);
            }
        }


      /// rtm.sendMessage(msg.text, msg.channel);
    } catch(err) {
        logger.error(err);
    }
}));




// start the bot
co(function *init() {

    // init all the commands
    var plugins = require('./plugins');
    yield plugins.init(app);

    rtm.start();

});  // don't catch - let it crash
