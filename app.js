var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// var server = app.listen(3000);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('A user connected');
  
  socket.on('subscribe', function(room) {
      console.log('joining room', room);
      socket.join(room);
  });  

  socket.on('chat message', function(data){
      console.log('chat message');
      var apiai = require('apiai');

      var appAI = apiai("1aec78ac1070408ba8372dad604f6d96");

      var request = appAI.textRequest(data.msg, {
          sessionId: '1234567890'
      });

      request.on('response', function(response) {
        // console.log(data.room);
          io.to(data.room).emit('chat message',response);       
      });

      // request.on('error', function(error) {
      //     console.log(error);
      // });

      request.end();
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});