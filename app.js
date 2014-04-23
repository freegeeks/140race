var util = require('util'),
  twitter = require('twitter'),
  fs = require('fs');
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var twit = new twitter({
  consumer_key :          'MsrAEqq42Bom767QusO4318PL',
  consumer_secret :       'C3odEyJEEF4UrLFnoj44wtR8f0kWOjpyUS9Ytmp4wxF0RLs3Qw',
  access_token_key :      '124289477-qNZe9IBb23YNOoL7r5bERIBkM0nV4d4jSr84dDzI',
  access_token_secret :   '7JnyD1Y1skRmdFJuH24LzywM2GJhjwsxsjp5TtZK1Hwd1'
});

var settings = {
  app_port: 8888,
  websocket_port: 8080,
  scoring: {
    characters: 1,
    retweet: 10,
    favorite: 20,
    hashtag: 4,
    symbols: 2,
    urls: 3,
    user_mentions: 5,
    media: 8
  }
};

var clients = {};

var player1 = {
  hash: null,
  points: 0
};

var player2 = {
  hash: null,
  points: 0
};

// Index
app.get('/', function (req, res) {
      res.sendfile(__dirname + '/public/index.html');
});

/*
function handler(req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
*/

server.listen(settings.app_port);

io.sockets.on('connection', function (socket) {
  console.log("asdf");
  //clients[socket.id] = socket;
  /*
  if(clients.length < 2){
    socket.emit('waiting');
  }
  else if(clients.length == 2){
    socket.emit('get-ready');
  }else{
    socket.disconnect();
  }
  */
});

/*
twit.stream('statuses/sample', {
  language : 'en'
}, function(stream) {
  stream.on('data', function(data) {
    if (data.text !== undefined) {
      if (data.entities.hashtags) {
        for (key in data.entities.hashtags) {
          //io.sockets.emit('hello 123');
          //io.sockets.emit('something', {asdf: data.entities.hashtags[key].text});
          //console.log("hash> " + data.entities.hashtags[key].text);
        }
      }
    }
  });
  //setTimeout(stream.destroy, 15000);
});
*/


/*
twit.stream('statuses/filter', {
  language : 'en',
  track : '#android'
}, function(stream) {
  stream.on('data', function(data) {
    if (data.text !== undefined) {
      //console.log(util.inspect(data));
      console.log("tweet> " + data.text);
    }
  });
  setTimeout(stream.destroy, 15000);
});
*/
