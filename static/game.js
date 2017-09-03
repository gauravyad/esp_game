var socket = io();
var score=0;
var i=0;
var arr={};
var cur;
var curstr;
var email;
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

function disp_signup(){
  document.getElementById('signup').style='visiblity:show';
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
    cur=data[i];
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
  for(var i=0;i<15;i++){
    answers[i]=data.charAt(i);
  }
  start();
  document.getElementById('login').style='display:none';
})
socket.on('score', function(data) {
  document.getElementById('score').value=data;
  document.getElementById('canvas').style='display:none';

});
socket.on('restart',function(){
  document.getElementById('restart').style='visiblity:show';
  document.getElementById('score').value="Your opponent has quit!";
  document.getElementById('canvas').style='display:none';
})

function start(){
  socket.emit('new player',answers);
  document.getElementById('wait').style='visiblity:show';
  document.getElementById('restart').style='display:none';
}
function option_b_selected(){
  answers[cur]='B';
  console.log(answers[cur])
  alert('B selected')
  
}
function option_a_selected(){
  answers[cur]='A';
  console.log(answers[cur]);
  alert('A selected');
}
window.onbeforeunload = function (e) {
  var e = e || window.event;

  socket.emit('exit')
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
  }
  else{
    document.getElementById('restart').style='visiblity:show';
    document.getElementById('canvas').style='display:none';
    socket.emit('answers',answers,arr,email)
  }
}
