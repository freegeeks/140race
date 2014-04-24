var util = require('util'),
  twitter = require('twitter'),
  app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');

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
  },
  p1Hash: null,
  p2Hash: null
};

var clients = [];

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

app.listen(settings.app_port);

io.sockets.on('connection', function (socket) {
  console.log("clients: "+clients.length);
  if(clients.length < 2){
    clients.push(socket);

    console.log("connected: "+socket.id);
    console.log("clients: "+clients.length);

    //clients[socket.id] = socket;

    socket.on('changeHash', function(data){
      console.log("changeHash");
      console.log(data);
      socket.set('hash', data.newHash);
      changeHashes();
    });

    if(clients.length < 2){
      socket.emit('waiting');
    }
    else if(clients.length == 2){
      io.sockets.emit('go');

      twit.stream('statuses/sample', {
        language : 'en'
      }, function(stream) {
        stream.on('data', function(data) {
          if (data.text !== undefined) {
            if (data.entities.hashtags) {
              for (key in data.entities.hashtags) {
                io.sockets.emit('hashtag', {text: data.entities.hashtags[key].text});
              }
            }
          }
        });
        setTimeout(stream.destroy, 15000);
      });

    }

    socket.on('disconnect', function(){
      console.log(socket.id+' disconnected');
      for(i=0; i<clients.length; ++i) {
        console.log(clients[i].id);
        if(clients[i].id == socket.id){
          clients.splice(i, 1);
        }
      }
      console.log("clients: "+clients.length);
      io.sockets.emit('waiting');
    });

  }else{
    console.log("2 players only demo");
  }
});

function changeHashes(){
  clients[0].get('hash', function (err, p1Hash) {
    if(p1Hash!=null){
      clients[1].get('hash', function (err, p2Hash) {
        if(p2Hash!=null){
          io.sockets.emit('racing');

          console.log(p1Hash+','+p2Hash);

          twit.stream('statuses/filter', { language: 'en', track: p1Hash+','+p2Hash}, function(stream) {
              stream.on('data', function(data) {
                io.sockets.emit('tweet', {data: data});
              });
              setTimeout(stream.destroy, 15000);
          });

        }
      });
    }
  });
}
