'use strict';
var co = require('co');
var Message = require('./message');
var Attachment = require('./attachment');

function Command(opts) {
    if(!(this instanceof Command)) return new Command(opts);
    if(!opts || typeof opts != 'object') opts = {};
    for(var p in opts){
        if(opts.hasOwnProperty(p)) this[p]= opts[p];
    }
}

Command.prototype.reply = co.wrap(function *reply(msg) {
    var m;
    if(msg instanceof Message) {
        m = msg.getMessage();
    } else {
        m = { text: msg};
    }
    return yield this.web.chat.postMessage(
        this.channel, 
        m.text,
        {
            username: "343 Guilty Spark",
            attachments: m.attachments
        }
    );
});

Command.prototype.message = function message(opts) {
    return new Message(opts);
}

Command.prototype.attachment = function attachment(opts) {
    return new Attachment(opts);
}

module.exports = Command;