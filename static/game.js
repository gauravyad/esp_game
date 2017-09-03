var socket = io();
var score=0;
var i=0;
var arr={};
var cur;
socket.on('startMatch', function(data) {
    console.log("Match Started");
    document.getElementById('wait').style='display:none';
    document.getElementById('canvas').style='visiblity:show';
    arr=data;
    var cur=data[i];
    var image=document.getElementById('primary');
    image.src='static/images/'+cur.toString()+'.jpeg';
    var secon_1=document.getElementById('sec_1');
    var secon_2=document.getElementById('sec_2');
    secon_1.src='static/images/'+cur.toString()+'_1.jpeg';
    secon_2.src='static/images/'+cur.toString()+'_2.jpeg';
});
socket.on('score', function(data) {
  document.getElementById('score').value=data;
  document.getElementById('canvas').style='display:none';

});
socket.on('restart',function(){
  document.getElementById('restart').style='visiblity:show';
  document.getElementById('score').value="Your opponent has quit!";
  document.getElementById('canvas').style='display:none';
})
var answers = {
  one: '-',
  two: '-',
  three: '-',
  four: '-',
  five: '-',
  six: '-',
  seven: '-',
  eight: '-',
  nine: '-',
  ten: '-',
  eleven: '-',
  twelve: '-',
  thirteen: '-',
  fourteen: '-',
  fifteen: '-'
}
cur=Math.floor(Math.random()*15)+1;
socket.emit('new player',answers);
var image=document.getElementById('primary');
image.src='static/images/'+cur.toString()+'.jpeg';
var secon_1=document.getElementById('sec_1');
var secon_2=document.getElementById('sec_2');
secon_1.src='static/images/'+cur.toString()+'_1.jpeg';
secon_2.src='static/images/'+cur.toString()+'_2.jpeg';
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
    socket.emit('answers',answers,arr)
  }
}
