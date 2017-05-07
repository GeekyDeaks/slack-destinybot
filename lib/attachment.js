'use strict';

function Attachment(opts){
    if(!(this instanceof Attachment)) return new Attachment(opts);
    if(!opts || typeof opts != 'object') opts = {};
    this.attachment = {
        fallback: "woops! You do not appear to be able to view attachments",
        color: "#36a64f",
        text: "",
        fields: [],
        "mrkdwn_in": [ "text", "pretext" ]
    }
    for(var p in opts){
        if(opts.hasOwnProperty(p)) this.attachment[p]= opts[p];
    }
}

Attachment.prototype.addField = function addField(title, value, short = true) {

    var field;
    if(typeof title === 'object') {
        field = title;
    } else {
        field = {
            title: title,
            value: value,
            short: short
        }
    }
    this.attachment.fields.push(field);

};

Attachment.prototype.setText = function setText(text) {
    this.attachment.text = text;
}

Attachment.prototype.setColor = function setColor(color) {
    this.attachment.color = color;
}

Attachment.prototype.setFallback = function setFallback(fallback) {
    this.attachment.fallback = fallback;
}

Attachment.prototype.setTitle = function setTitle(title) {
    this.attachment.title = title;
}

Attachment.prototype.setThumbUrl = function setThumbUrl(url) {
    this.attachment.thumb_url = url;
}

Attachment.prototype.setAuthorIcon = function setThumbUrl(url) {
    this.attachment.author_icon = url;
}

Attachment.prototype.setAuthorName = function setThumbUrl(name) {
    this.attachment.author_name = name;
}

module.exports = Attachment;