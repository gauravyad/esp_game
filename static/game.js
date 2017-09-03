var socket = io();
var score='Waitng for opponent';
var i=0;
var arr={};
var cur;
var curstr;
var email='';
var password;
var answers = {
  one: '-'
}
function login(){
  email=document.getElementById('email').value+'';
  password=document.getElementById('password').value+'';
  curstr=email+'::'+password;
  socket.emit('login',curstr);
}
function logout(){
  window.location.href="/";
}
function disp_signup(){
  document.getElementById('signup').style='visiblity:show';
  document.getElementById('email_l').value='';
  document.getElementById('password_l').value='';
  document.getElementById('name').value='';
  document.getElementById('login').style='display:none';
}
function signup(){
  var email=document.getElementById('email_l').value+'';
  var password=document.getElementById('password_l').value+'';
  var name=document.getElementById('name').value+'';
  curstr=email+'::'+password+'::'+name;
  socket.emit('signup',curstr);
}
socket.on('startMatch', function(data) {
    console.log("Match Started");
    document.getElementById('wait').style='display:none';
    document.getElementById('canvas').style='visiblity:show';
    arr=data;
    cur=arr[i];
    console.log(cur);
    console.log(data);
    score='Waiting for opponent!';
    var image=document.getElementById('primary');
    image.src='static/images/'+cur.toString()+'.jpeg';
    var secon_1=document.getElementById('sec_1');
    var secon_2=document.getElementById('sec_2');
    secon_1.src='static/images/'+cur.toString()+'_1.jpeg';
    secon_2.src='static/images/'+cur.toString()+'_2.jpeg';
});
socket.on('signup_sucessful',function(){
  document.getElementById('login').style='visiblity:show';
  document.getElementById('signup').style='display:none';
})
socket.on('login_sucessful',function(data){
  data=data+'';
  for(var i=1;i<=15;i++){
    answers[i]=data.charAt(i-1);
  }
  start();
  document.getElementById('logged').style='margin-left: 70%;margin-top: 3%;visiblity:show';
  document.getElementById('user').value=email;
  document.getElementById('login').style='display:none';
})
socket.on('score', function(data) {
  document.getElementById('score').value=data;
  document.getElementById('canvas').style='display:none';

});
socket.on('login_unsucessful',function(){
  alert('Wrong Email or Password!!');
})
socket.on('signup_unsucessful',function(){
  alert('Email Exists!!');
})
socket.on('restart',function(){
  document.getElementById('restart').style='visiblity:show';
  document.getElementById('score').value="Your opponent has quit!";
  document.getElementById('canvas').style='display:none';
})

function start(){
  i=0;
  score='Waiting for opponent';
  socket.emit('new player',answers,email);
  document.getElementById('wait').style='margin-top:20%;margin-left:40%;visiblity:show';
  document.getElementById('restart').style='display:none';
}
function option_b_selected(){
  answers[cur]='B';
  document.getElementById('option').value='B';
  
}
function option_a_selected(){
  answers[cur]='A';
  document.getElementById('option').value='A';
}
window.onbeforeunload = function (e) {
  var e = e || window.event;
  if (email!='') {
  socket.emit('exit')
}
};
function on_submit(){
  i++;
  if(i<5){
    cur=arr[i];
    var image=document.getElementById('primary');
    image.src='static/images/'+cur.toString()+'.jpeg';
    var secon_1=document.getElementById('sec_1');
    var secon_2=document.getElementById('sec_2');
    secon_1.src='static/images/'+cur.toString()+'_1.jpeg';
    secon_2.src='static/images/'+cur.toString()+'_2.jpeg';
    document.getElementById('option').value='';
  }
  else{
    document.getElementById('restart').style='visiblity:show';
    document.getElementById('canvas').style='display:none';
    document.getElementById('score').value='Waiting for Opponent';
    socket.emit('answers',answers,arr,email)
  }
}
