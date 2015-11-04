var Agenda = require('agenda');
var glob = require("glob");
var config = require('../config');
var defaultAssets = require('../assets/default');

var agenda = new Agenda({db: { address: config.db.agendaUri, collection: 'agendaJobs' }});

glob(defaultAssets.server.jobs, function (er, files) {
    'use strict';
    agenda.purge(function(){
        console.log('done purging');
        var arrLen = files.length;
        for(var i = 0; i < arrLen; i++){
            var cleanFiles = '../../'+ files[i];
            console.log(cleanFiles);
            require(cleanFiles)(agenda);
        }
        agenda.start();
    });

});


module.exports = agenda;
