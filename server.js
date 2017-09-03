// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var fs = require('fs');
var users={};
var activeusers={};
var active=0;
var players = {};
var player_num=0;
var last_wait=0;
var last_ans=0;
var last_email;
app.set('port', 0);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/index.html', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
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

io.on('connection', function(socket) {
  socket.on('login',function(data){
    data=data+'';
    for(var i=0;i<users.length;i++){
      if(users[i].startsWith(data)==true){
        var j;
        for(j=0;j<activeusers.length;j++){
          if(activeusers[i].startsWith(data)==true){
            socket.emit('login_unsucessful')
            break;
          }
        }
        if(j==active){
          socket.emit('login_sucessful',users[i].substring(users[i].length-15,users[i].length));
          //console.log('login_sucessful!');
          //activeusers[active]=users[i];
          //console.log(activeusers);
          //active++;
          break;
        }
      }
    }
    if(i==users.length){
      socket.emit('login_unsucessful');
      //console.log('login unsucessful!');
    }
  })
  socket.on('signup',function(data){
    data=data+'';
    var f=0;
    var sup=data.split('::');
    for(var i=0;i<users.length;i++){
      if(users[i].indexOf(sup[0])!=-1){
        socket.emit('signup_unsucessful');
        //console.log('signup unsucessful!');
        f=1;
        break;
        }
      }
    if(f==0){
    data=data+'::---------------';
    users.push(data);
    data=data+'^^';
    data=data+content;
    fs.writeFile('data.txt',data);
    socket.emit('signup_sucessful');
    //console.log('signup sucessful!');
  }
  })
  socket.on('new player', function(answers,email) {
    player_num++;
    //console.log(player_num);
    if(player_num%2==1){
      last_wait=socket;
      last_ans=answers;
      last_email=email;
      players[socket.id] = {
        partner:0,
        partner_answer:answers,
        isPlaying:true
      };
      //console.log("No Match");
    }
    else{
      players[socket.id] = {
        partner:last_wait,
        partner_answer:last_ans,
        partner_email:last_email,
        isPlaying:true
      };
      players[last_wait.id]={
        partner:socket,
        partner_answer:answers,
        partner_email:email,
        isPlaying:true
      };
      var imgs={};
      var count=2,k=0;
      for(var i=1;i<=15&&k<count;i++){
        if(answers[i]=='-'||last_ans[i]=='-')continue;
        if(answers[i]==last_ans[i]){
          imgs[k]=i;
          count--;
          k++;
        }
      }
      count=count+3;
      for(var i=0;count>0;i++){
        var cur=Math.floor(Math.random()*15)+1;
        if(cur==16)cur=15;
        for(var j=0;j<k;j++){
          if(cur==imgs[j]){
            i--;
            cur=-1;
            break;
          }
        }
        if(cur!=-1){
          imgs[k]=cur;
          count--;
          k++;
        }
      }

      last_wait.emit('startMatch',imgs);
      socket.emit('startMatch',imgs)
      last_wait=0;
      last_ans=0;
      //console.log("Match Found");
      }
    
  });
  socket.on('exit',function(){
    content=users[0]+'';
    for(var i=1;i<users.length;i++){
      content=content+"^^"+users[i];
    }
    if(player_num>0)player_num--;
    //console.log(player_num);
    //console.log(content)
    fs.writeFile('data.txt',content)
    if(player_num>0){
    players[socket.id].isPlaying=false;
    player_num--;
    //console.log(player_num);
    players[socket.id].partner.emit('restart');
    players[players[socket.id].partner.id].isPlaying=false;
  }
  })
  socket.on('answers', function(data,arr,email) {
      players[players[socket.id].partner.id].partner_answer=data;
      if(players[players[socket.id].partner.id].isPlaying==false){
        var score=0;
        for(var i=0;i<5;i++){
          //console.log(players[socket.id].partner_answer[arr[i]],data[arr[i]])
          if(players[socket.id].partner_answer[arr[i]]==data[arr[i]]){
            score++;
          }
        }
        if(score==5){
          var count=0;
          for(var i=1;i<=15;i++){
            count++;
          }
          if(count==15){
            console.log(email+' and '+players[socket.id].partner_email+' have reached consens.')
          }
        }
        socket.emit('score',score);
        players[socket.id].partner.emit('score',score);
      }
      var pas='';
      //console.log(data);
      for(var i=1;i<=15;i++){
        pas=pas+data[i];
      }
      //console.log(pas);
      email=email+'';
      for(var i=0;i<users.length;i++){
        if(users[i].startsWith(email)==true){
          users[i]=users[i].substring(0,users[i].length-15)+pas;
          //console.log(users[i]);
          break;
        }
      }
      players[socket.id].isPlaying=false;
      player_num--;
  });
});
