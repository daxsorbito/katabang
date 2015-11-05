/**
 * Created by dax on 22/10/15.
 */
var mongoose = require('mongoose'),
    Pricing = mongoose.model('Pricing');

module.exports = function (agenda) {
    agenda.define('seedPricing', function(job, done) {
        console.log('[seedPricing] executed at --> ' + (new Date));
        var data = [
            {startDate: '1/1/2015', locale: 'en', price: 145, serviceType: 1},
            {startDate: '1/1/2015', locale: 'ko', price: 45, serviceType: 1},
            {startDate: '1/1/2015', locale: 'jp', price: 545, serviceType: 1}
        ];

        Pricing.find({startDate: '1/1/2015'}, function(err, foundPrices){
            console.log('foundPrices --> ' + foundPrices.length);
            if (!foundPrices.length) {
                Pricing.create(data, function (err, prices) {
                    if (err) {
                        console.log(err);
                        return err;
                    }
                    else {
                        console.log("price saved");
                    }
                });
            }
            console.log('[seedPricing] finished at --> ' + (new Date));
            done();
        });
    });
    agenda.now('seedPricing');
};
