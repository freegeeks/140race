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

var twit2 = new twitter({
  consumer_key :          'BaetqxrxhANvKaYf07LPFXgAi',
  consumer_secret :       'OScCYvlkD1HZms4BLDYvdlLYlI7c2ebdIQpsSLOT6gkPd3nMb0',
  access_token_key :      '20145613-Ak7hiWaraUvm8YZFBF5Lo3YsZuFOzxQ4PTDPq1D8n',
  access_token_secret :   '7uMJxJvE7nJ7jxSzj0fl0rpCKmgU1oZDA4CT2fpAePUyG'
});

var settings = {
  app_port: 7777,
  websocket_port: 80,
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

var clients = [];

app.listen(settings.app_port);

io.sockets.on('connection', function (socket) {
  console.log("clients: "+clients.length);
  if(clients.length < 2){

    socket.set('points', 0);
    clients.push(socket);

    console.log("connected: "+socket.id);
    console.log("clients: "+clients.length);

    socket.on('changeHash', function(data){
      console.log("changeHash");
      console.log(data);
      socket.set('hash', data.newHash);

      clients[0].get('hash', function (err, p1Hash) {
        if(p1Hash!=null){
          clients[1].get('hash', function (err, p2Hash) {
            if(p2Hash!=null){
              //io.sockets.emit('racing');
              console.log('racing: #'+p1Hash+' vs #'+p2Hash);

              twit2.stream('statuses/filter', { language: 'en', track: p1Hash+','+p2Hash}, function(stream) {            
                stream.on('data', function(data) {
                  if((data.text !== undefined)&&(data.entities.hashtags.length > 0)) {
                    c = null;
                    for (key in data.entities.hashtags) {
                      if(data.entities.hashtags[key].text.toLowerCase() == p1Hash.toLowerCase()){
                        clients[0].get('points', function (err, p) {
                          points = p + (data.text.length * settings.scoring.characters);
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
                          if(data.entities.media !== undefined)
                            points += data.entities.media.length * settings.scoring.media;
                          clients[0].set('points', points);
                          clients[0].emit('tweet', {data: data});
                          console.log(p1Hash+': '+points);
                        });
                      }
                      else if(data.entities.hashtags[key].text.toLowerCase() == p2Hash.toLowerCase()){
                        clients[1].get('points', function (err, p) {
                          points = p + (data.text.length * settings.scoring.characters);
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
                          if(data.entities.media !== undefined)
                            points += data.entities.media.length * settings.scoring.media;
                          clients[1].set('points', points);
                          clients[1].emit('tweet', {data: data});
                          console.log(p2Hash+': '+points);
                        });
                      }
                    }
                  }
                });
                //setTimeout(stream.destroy, 15000);
              });
              
            }
          });
        }
      });

    });

    if(clients.length < 2){
      socket.emit('waiting');
    }
    else{
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
        //setTimeout(stream.destroy, 10000);
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

  }
});

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
