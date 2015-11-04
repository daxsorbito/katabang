/**
 * Created by dax on 22/10/15.
 */

module.exports = function (agenda) {
    agenda.define('processBooking', function(job, done) {
        console.log('[processBooking] executed at --> ' + (new Date));
        done();
    });
    agenda.every('30 seconds', 'processBooking');
};
