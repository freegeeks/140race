var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var twitter = require('twitter');
var twit = new twitter({
    consumer_key: 'MsrAEqq42Bom767QusO4318PL',
    consumer_secret: 'C3odEyJEEF4UrLFnoj44wtR8f0kWOjpyUS9Ytmp4wxF0RLs3Qw',
    access_token_key: '124289477-qNZe9IBb23YNOoL7r5bERIBkM0nV4d4jSr84dDzI',
    access_token_secret: '7JnyD1Y1skRmdFJuH24LzywM2GJhjwsxsjp5TtZK1Hwd1'
});

server.listen(8888);

// Index
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Static files
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/snd', express.static(__dirname + '/snd'));

// Hash needs to be after files
// for precedence reasons
app.get('/:hashtag', function (req, res) {
  res.sendfile(__dirname + '/hashtag.html');
});

// new connection
io.sockets.on('connection', function (socket) {

    // client ask for hashtags
    socket.on('gimmehashtags', function () {
        twit.stream('statuses/sample', { language : 'en' }, function(stream) {
          stream.on('data', function(data) {
            if (data.text !== undefined) {
              if (data.entities.hashtags) {
                for (key in data.entities.hashtags) {
                  io.sockets.emit('hashtag', {text: data.entities.hashtags[key].text});
                }
              }
            }
          });
        });



    });

    // When new hashtag joins
    socket.on('hashtag', function(data) {
        socket.set('hashtag', data.hashtag, function () {});
    });

});
