/**
 * Created by dax on 22/10/15.
 */
var Agenda = require('agenda');

module.exports = function (agenda) {
    // execute agendas
    //uri = config.db.agendaUri;
    ////uri = 'localhost:27017/agenda-dev';
    //var agenda = new Agenda({db: { address: uri, collection: 'agendaJobs' }});
    ////agenda.database('localhost:27017/agenda-test', 'agendaJobs');
    //
    console.log('tendtedddd');
    agenda.define('processBooking', function(job, done) {
        console.log('executed at' + (new Date));
        done();
    });
    agenda.every('10 seconds', 'processBooking');
    //agenda.on('ready', function() {
    //    agenda.every('2 minutes', 'processBooking');
    //    console.log('on ready')
    //    agenda.start();
    //});
    //agenda.on('error', function(e) {
    //    console.log(e);
    //});
    //
    //agenda.on('start', function(job) {
    //    console.log("Job %s starting", job.attrs.name);
    //});


};

