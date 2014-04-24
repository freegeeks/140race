var settings = {
  app_port: 8888,
  scoring: {
    characters: 1,
    retweet: 10,
    favorite: 20,
    hashtag: 4,
    symbols: 2,
    urls: 3,
    coordinates: 4,
    user_mentions: 5,
    media: 8
  }
};

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

var twit2 = new twitter({
  consumer_key :          'BaetqxrxhANvKaYf07LPFXgAi',
  consumer_secret :       'OScCYvlkD1HZms4BLDYvdlLYlI7c2ebdIQpsSLOT6gkPd3nMb0',
  access_token_key :      '20145613-Ak7hiWaraUvm8YZFBF5Lo3YsZuFOzxQ4PTDPq1D8n',
  access_token_secret :   '7uMJxJvE7nJ7jxSzj0fl0rpCKmgU1oZDA4CT2fpAePUyG'
});

server.listen(settings.app_port);

// Index
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Static files
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/snd', express.static(__dirname + '/snd'));

// Hash needs to be after files
// for precedence reasons
app.get('/:hashtag', function (req, res) {
  res.sendfile(__dirname + '/hashtag.html');
});

// new connection
var clients = [];
io.sockets.on('connection', function (socket) {

    clients.push(socket);
    if (clients.length == 2) {
        io.sockets.emit('go');
    }
    
    // client ask for hashtags
    socket.on('gimmehashtags', function () {
        twit.stream('statuses/sample', { language : 'en' }, function(stream) {
          stream.on('data', function(data) {
            if (data.text !== undefined) {
              if (data.entities.hashtags) {
                for (key in data.entities.hashtags) {
                  io.sockets.emit('hashtag', { text: data.entities.hashtags[key].text});
                }
              }
            }
          });
        });
    });

    // When new hashtag joins
    socket.on('gimmetweets', function(data) {
        socket.set('hashtag', data.hashtag);
        socket.set('points', 0);
        twit2.stream('statuses/filter', { language: 'en', track: data.hashtag}, function(stream) { 
          stream.on('data', function(data) {
              socket.get('points', function (err, points) {
                  points += data.text.length * settings.scoring.characters;
                  //retweets
                  points += data.retweet_count * settings.scoring.retweet;
                  //favorites
                  points += data.favorite_count * settings.scoring.favorite;
                  //hashtags
                  points += data.entities.hashtags.length * settings.scoring.hashtag;
                  //symbols
                  points += data.entities.symbols.length * settings.scoring.symbols;
                  //urls
                  points += data.entities.urls.length * settings.scoring.urls;
                  //user_mentions
                  points += data.entities.user_mentions.length * settings.scoring.user_mentions;
                  //media
                  if (data.entities.media !== undefined) {
                    points += data.entities.media.length * settings.scoring.media;
                  }
                  socket.set('points', points);
                  socket.emit('score', { score: points });
                  socket.emit('tweet',  { text: data.text });
              });
          });
        });
    });

});
