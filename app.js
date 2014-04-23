var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'MsrAEqq42Bom767QusO4318PL',
    consumer_secret: 'C3odEyJEEF4UrLFnoj44wtR8f0kWOjpyUS9Ytmp4wxF0RLs3Qw',
    access_token_key: '124289477-qNZe9IBb23YNOoL7r5bERIBkM0nV4d4jSr84dDzI',
    access_token_secret: '7JnyD1Y1skRmdFJuH24LzywM2GJhjwsxsjp5TtZK1Hwd1'
});

/*
app.get('/', twit.gatekeeper('/login'), routes.index);
app.get('/login', routes.login);
app.get('/twauth', twit.login());
*/

twit.get('/statuses/show/27593302936.json', {include_entities:true}, function(data) {
    console.log(util.inspect(data));
});

twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
        console.log(util.inspect(data));
    });
});
