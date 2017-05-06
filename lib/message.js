'use strict';

var Attachment = require('./attachment');

function Message(opts){
    if(!(this instanceof Message)) return new Message(opts);
    if(!opts || typeof opts != 'object') opts = {};
    this.msg = {
        text: undefined,
        attachments: []
    }
    for(var p in opts){
        if(opts.hasOwnProperty(p)) this.msg[p]= opts[p];
    }
}

Message.prototype.addAttachment = function(attachment) {
    this.msg.attachments.push(
        (attachment instanceof Attachment) ? attachment.attachment : attachment
    );
};

Message.prototype.setText = function setText(text) {
    this.msg.text = text;
};

Message.prototype.getMessage = function() {
    return this.msg;
}

Message.prototype.attachment = function attachment(opts) {
    return new Attachment(opts);
}

module.exports = Message;