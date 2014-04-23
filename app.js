var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'MsrAEqq42Bom767QusO4318PL',
    consumer_secret: 'C3odEyJEEF4UrLFnoj44wtR8f0kWOjpyUS9Ytmp4wxF0RLs3Qw',
    access_token_key: '124289477-qNZe9IBb23YNOoL7r5bERIBkM0nV4d4jSr84dDzI',
    access_token_secret: '7JnyD1Y1skRmdFJuH24LzywM2GJhjwsxsjp5TtZK1Hwd1'
});

/*
twit.stream('statuses/sample', { language: 'en' }, function(stream) {
    stream.on('data', function(data) {
        if (data.entities.hashtags) {
            for (key in data.entities.hashtags) {
                console.log(data.entities.hashtags[key].text);
            }
        }
    });
    setTimeout(stream.destroy, 15000);
});
*/

twit.stream('statuses/filter', { language: 'en', track:'#android'}, function(stream) {
    stream.on('data', function(data) {
        //console.log(util.inspect(data));
        console.log(data.text);
    });
    setTimeout(stream.destroy, 15000);
});
