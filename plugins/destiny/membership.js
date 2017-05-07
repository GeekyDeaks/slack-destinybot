'use strict';
var logger = require('winston');
var co = require('co');
var api = require('./api');

var XBL = 1;
var PSN = 2;

var search = co.wrap(function *search(name, type) {
    
    var mtype = [];
    if(!type) {
        // lookup both PSN and XBL
        mtype.push(XBL);
        mtype.push(PSN);
    } else {
        mtype.push(type);
    }

    logger.debug("looking up [%s] at bungie", name);
    var m;
    var res = [];
    var t;
    while(t = mtype.shift()) {
        m = yield api.search(t, name);
        if(!m.length) continue;
        logger.debug("found: ", m);
        m.forEach( m => { res.push(m); });
    }

    return res;
});

function name(type) {
    switch(type) {
        case 1: return 'XBL';
        case 2: return 'PSN';
    }
}

module.exports.XBL = XBL;
module.exports.PSN = PSN;
module.exports.name = name;
module.exports.search = search;