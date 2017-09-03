var socket = io();
var cur;

function login(){
	var email=document.getElementById('email').value;
	var password=document.getElementById('password').value;
	cur=email+'::'+password;
	socket.emit('login',cur);
}

function signup(){
	var email=document.getElementById('email').value+'';
	var password=document.getElementById('password').value+'';
	var name=document.getElementById('name').value+'';
	cur=email+'::'+password+'::'+name;
	socket.emit('signup',cur);
}