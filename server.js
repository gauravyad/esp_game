// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var mysql=require('mysql');
var fs = require('fs');
var users={};
var activeusers={};
var active=0;
app.set('port', 0);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/index.html', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/signup.html', function(request, response) {
  response.sendFile(path.join(__dirname, 'signup.html'));
});
app.get('/login.html', function(request, response) {
  response.sendFile(path.join(__dirname, 'login.html'));
});
var content;
// First I want to read the file
fs.readFile('data.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data+'';
    processfile();
});
function processfile(){
  users=content.split("^^");
  console.log(users);
}

// Starts the server.
server.listen(8080, function() {
  console.log('Starting server on port 8080');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});
var players = {};
var player_num=0;
var last_wait=0;
var last_ans=0;
io.on('connection', function(socket) {
  socket.on('login',function(data){
    data=data+'';
    for(var i=0;i<users.length;i++){
      if(users[i].startsWith(data)==true){
        var j;
        for(j=0;j<activeusers.length;j++){
          if(activeusers[i].startsWith(data)==true){
            socket.emit('login unsucessful!')
            break;
          }
        }
        if(j==active){
          socket.emit('login_sucessful',users[i].substring(users[i].length-15,users[i].length));
          console.log('login_sucessful!');
          //activeusers.push(users[i]);
          break;
        }
      }
    }
    if(i==users.length){
      socket.emit('login unsucessful!');
      console.log('login unsucessful!');
    }
  })
  socket.on('signup',function(data){
    for(var i=0;i<users.length;i++){
      if(users[i].indexOf(data)!=-1){
        socket.emit('signup unsucessful!');
        console.log('signup unsucessful!');
        break;
        }
      }
    data=data+'::---------------';
    users.push(data);
    data=data+'^^';
    data=data+content;
    fs.writeFile('data.txt',data);
    socket.emit('signup_sucessful');
    console.log('signup sucessful!');
  })
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
  socket.on('exit',function(){
    content=users[0]+'';
    for(var i=1;i<users.length;i++){
      content=content+"^^"+users[i];
    }
    console.log(content)
    fs.writeFile('data.txt',content)
    if(player_num>1){
    players[socket.id].isPlaying=false;
    player_num-2;
    players[socket.id].partner.emit('restart');
    players[players[socket.id].partner.id].isPlaying=false;
  }
  })
  socket.on('answers', function(data,arr,email) {
      players[players[socket.id].partner.id].partner_answer=data;
      if(players[players[socket.id].partner.id].isPlaying==false){
        var score=0;
        for(var i=0;i<5;i++){
          console.log(players[socket.id].partner_answer[arr[i]],data[arr[i]])
          if(players[socket.id].partner_answer[arr[i]]==data[arr[i]]){
            score++;
          }
        }
        socket.emit('score',score);
        players[socket.id].partner.emit('score',score);
      }
      var pas='';
      console.log(data);
      for(var i=1;i<=15;i++){
        pas=pas.concat(data[i]);
      }
      console.log(pas);
      email=email+'';
      for(var i=0;i<users.length;i++){
        if(users[i].startsWith(email)==true){
          users[i]=users[i].substring(0,users[i].length-15)+pas;
          console.log(users[i]);
          break;
        }
      }
      players[socket.id].isPlaying=false;
      player_num--;
  });
});
