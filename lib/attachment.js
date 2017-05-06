'use strict';

function Attachment(opts){
    if(!(this instanceof Attachment)) return new Attachment(opts);
    if(!opts || typeof opts != 'object') opts = {};
    this.attachment = {
        fallback: "woops! You do not appear to be able to view attachments",
        color: "#36a64f",
        text: "",
        fields: []
    }
    for(var p in opts){
        if(opts.hasOwnProperty(p)) this.attachment[p]= opts[p];
    }
}

Attachment.prototype.addField = function addField(title, value, short) {

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

module.exports = Attachment;