// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});
var players = {};
var player_num=0;
var last_wait=0;
var last_ans=0;
io.on('connection', function(socket) {
  socket.on('new player', function(answers) {
    player_num++;
    if(player_num%2==1){
      last_wait=socket;
      last_ans=answers;
    
      players[socket.id] = {
        partner:0,
        partner_answer:answers,
        isPlaying:true
      };
      console.log("No Match");
    }
    else{
      players[socket.id] = {
        partner:last_wait,
        partner_answer:last_ans,
        isPlaying:true
      };
      players[last_wait.id]={
        partner:socket,
        partner_answer:answers,
        isPlaying:true
      };
      var imgs={};
      for(var i=0;i<5;i++){
        var cur=Math.floor(Math.random()*15)+1;
        for(var j=0;j<i;j++){
          if(cur==imgs[j]){
            i--;
            cur=-1;
            break;
          }
        }
        if(cur!=-1){
          imgs[i]=cur;
        }
      }

      last_wait.emit('startMatch',imgs);
      socket.emit('startMatch',imgs)
      last_wait=0;
      last_ans=0;
      console.log("Match Found");
      }
    
  });
  socket.on('answers', function(data,arr) {
      players[players[socket.id].partner.id].partner_answer=data;
      if(players[players[socket.id].partner.id].isPlaying==false){
        var score=0;
        for(var i=0;i<5;i++){
          if(players[socket.id].partner_answer[arr[i]]==data[arr[i]]){
            score++;
          }
        }
        socket.emit('score',score);
        players[socket.id].partner.emit('score',score);
      }
      players[socket.id].isPlaying=false;
  });
});
