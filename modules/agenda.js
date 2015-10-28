var Agenda = require('agenda');
var glob = require("glob");
var config = require('../config/config');
var defaultAssets = require('../config/assets/default');

//var agenda = new Agenda({db: { address: config.db.agendaUri, collection: 'agendaJobs' }});
var agenda = new Agenda({db: {address: 'localhost:27017/agenda-example', collection: 'agendaJobs' }});
console.log(config.db.uri);

glob(defaultAssets.server.jobs, function (er, files) {
    console.log(files);
    var arrLen = files.length;
    for(var i = 0; i < arrLen; i++){
        var cleanFiles = files[i].replace('modules/','./');
        console.log(cleanFiles);
        require(cleanFiles)(agenda);
    }
    ////agenda.start();
    //agenda.on('ready', function() {
    //    //agenda.every('2 minutes', 'processBooking');
    //    console.log('agenda on ready');

    //});

    //agenda.on('ready', function() {
    //    console.log('reaaddy');
    //    agenda.every('3 minutes', 'processBooking');
    //
    //    agenda.start();
    //});
    //agenda.every('2 minutes', 'processBooking');
    agenda.start();
});


module.exports = agenda;
