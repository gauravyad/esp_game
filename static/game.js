var socket = io();
var score=0;
socket.on('startMatch', function() {
  console.log("Match Started");
});
socket.on('ansMatch', function() {
  console.log("Ans Matched");
  score++;
  document.getElementById('score').value=score;
});
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
var cur=Math.floor(Math.random()*15)+1;
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
  socket.emit('answers',answers,cur)
  
}
function option_a_selected(){
  answers[cur]='A';
  console.log(answers[cur])
  alert('A selected')
  socket.emit('answers',answers,cur)
  
}
