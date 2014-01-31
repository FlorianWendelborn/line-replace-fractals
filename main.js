var canvas, ctx;
var height, width;
var data = [];
var rendering, cancel;

var s = 400;
var animate = 200;
var iterations, pattern;

var patterns = [{
	name: '',
	f: [[]]
},{
	name: 'dragon',
	f: [[-45,0,0,Math.sqrt(.5)],[-135,1,0,Math.sqrt(.5)]],
	i: 14
},{
	name: 'work-in-progress',
	f: [[-90,0,0,.5],[0,0,-.5,.5],[90,.5,-.5,0.5],[0,.5,0,.5]],
	i: 8
},{
	name: 'koch-curve',
	f: [[0,0,0,1/3],[-60,1/3,0,1/3],[60,1/2,-Math.sqrt(1/12),1/3],[0,2/3,0,1/3]],
	i: 7
},{
	name: 'sierpinski-triangle',
	f: [[0,0,0,.5],[0,.25,Math.sqrt(2)/4,.5],[0,.5,0,.5]],
	i: 10
},{
	name: 'self-avoiding-dragon',
	f: [[-90,0,0,.5],[45,0,-.5,Math.sqrt(2)/2],[180,1,0,.5]],
	i: 10
},{
	name: '2fractal',
	f: [[0,0,0,.5],[0,.5,0,.5],[90,0,-.5,.5],[90,.5,-.25,.25]],
	i: 6
},{
	name: 'buggy-koch',
	f: [[0,0,0,1/3],[-60,0,0,Math.sqrt(2/9)],[60,0,1/3,Math.sqrt(2/9)],[0,2/3,0,1/3]],
	i: 7
},{
	name: 'weird lines',
	f: [[-45,0,0,Math.sqrt(.5)],[135,1,1,Math.sqrt(.5)]],
	i: 16
},{
	name: 'ice',
	f: [[90,0,0.5,0.7],[0,0,0,0.5]],
	i: 14
},{
	name: 'fern',
	f: [[45,0,0,0.7],[0,1,0,0.5]],
	i: 15
},{
	name: 'fern2',
	f: [[0,0,0,0.5],[45,.5,0,Math.sqrt(.5)]],
	i: 13
},{
	name: 'tree',
	f: [[-45,0,0,Math.sqrt(.5)],[45,.5,-.5,Math.sqrt(.5)]],
	i: 13
},{
	name: 'brain',
	f: [[90,0,0,.5],[0,0,.5,.5],[90,.5,.5,.5],[-45,0.5,1,Math.sqrt(.5)]],
	i: 9
},{
	name: 'wtf',
	f: [[0,0,0,Math.sqrt(.5)],[90,0,.5,.5],[135,0.5,0,Math.sqrt(2)/2]],
	i: 9
},{
	name: 'woot-ever',
	f: [[-90,0,0,.5],[0,0,-.5,.5],[90,.5,-.5,0.5]],
	i: 10
},{
	name: 'split',
	f: [[0,0,0,1],[0,0,1/2,1/3],[0,2/3,1/2,1/3]],
	i: 10
},{
	name: 'holes',
	f: [[30,0,0,Math.sqrt(.5)],[30,0,0.5,Math.sqrt(.5)],[30,0,0,Math.sqrt(2)/2]],
	i: 10
},{
	name: 'twist',
	f: [[45,0,0,Math.sqrt(.5)],[-90,.5,.5,.5],[-45,0.5,0,Math.sqrt(2)/2]],
	i: 10
},{
	name: 'multidragons',
	f: [[45,0,0,0.7],[45,1,0,0.5]],
	i: 15
},{
	name: 'like-a-dragon',
	f: [[45,0,0,Math.sqrt(.5)],[-90,.5,.5,.5],[45,0.5,0,Math.sqrt(2)/2]],
	i: 11
},{
	name: 'blob',
	f: [[45,0,0,Math.sqrt(.5)],[-90,.5,.5,.5],[135,0.5,0,Math.sqrt(2)/2]],
	i: 10
}];

window.onload = function () {
	canvas = document.getElementsByTagName('canvas')[0];
	ctx = canvas.getContext('2d');

	var select = document.getElementById('choose');

	for (var i = 0; i < patterns.length; i++) {
		var e = document.createElement('option');
		e.appendChild(document.createTextNode(patterns[i].name));
		e.value = i;
		select.appendChild(e);
	}

	updateDimensions();
}
window.onresize = updateDimensions;

function updateS () {
	s = document.getElementById('s').value;
}
function updateT () {
	animate = document.getElementById('t').value;
}

function chosen () {
	var select = document.getElementById('choose');

	pattern = patterns[select.value].f;
	data = [[0,-.5,0,1]];
	iterations = patterns[select.value].i;

	if (animate) {
		if (rendering) {
			cancel = true;
			setTimeout(function () {
				chosen();
			},20);
		} else {
			cancel = false;
			ranim(0);
		}
	} else if(!animate) {
		for (var n = 0; n < iterations; n++) {
			iterate();
		}
		render();
	} else {
		render();
	}
}

function updateDimensions () {
	height = window.innerHeight-40;
	width = window.innerWidth;
	canvas.height = height;
	canvas.width = width;
	render();
}

function x (v) {
	return v[1]+Math.cos(v[0]*Math.PI/180)*v[3];
}
function y (v) {
	return v[2]+Math.sin(v[0]*Math.PI/180)*v[3];
}

function ranim (n) {
	rendering = true;
	iterate();
	render();
	if (n < iterations && !cancel) {
		setTimeout(function () {
			ranim(++n);
		},animate);
	} else {
		rendering = false;
		console.log('finish');
	}
}

function render () {
	ctx.strokeStyle = 'rgba(255,0,0,1)';
	ctx.beginPath();
	for (var i = 0; i < data.length; i++) {
		var v = data[i];
		drawVector(v);
	}
	ctx.clearRect(0,0,width,height);
	ctx.stroke();
}

function drawVector (v) {
	ctx.moveTo(width/2+s*v[1],height/2+s*v[2]);
	ctx.lineTo(width/2+s*x(v),height/2+s*y(v));
}

function iterate () {
	var newVectors = [];
	for (var i = 0; i < data.length; i++) {
		var o = data[i];
		for (var j = 0 ; j < pattern.length; j++) {
			var p = pattern[j];

			// scale and rotate [x]
			var scaled = [
				p[0]+o[0],
				0,
				0,
				p[3]*o[3]
			]

			var mX1 = Math.cos((o[0])*Math.PI/180)*p[1]*o[3];
			var mY1 = Math.sin((o[0])*Math.PI/180)*p[1]*o[3];
			var mX2 = Math.cos((o[0]-90)*Math.PI/180)*p[2]*o[3];
			var mY2 = Math.sin((o[0]-90)*Math.PI/180)*p[2]*o[3];

			// move [ ]
			var moved = [
				scaled[0],
				o[1]+mX1-mX2,
				o[2]+mY1-mY2,
				scaled[3]
			]

			newVectors.push(moved);

			//ctx.strokeStyle = 'rgba(0,0,255,0.5)';
			//drawVector(scaled);// blue
			//ctx.strokeStyle = 'rgba(0,255,0,0.5)';
			//drawVector(moved);// green
		}
	}
	data = newVectors;
}