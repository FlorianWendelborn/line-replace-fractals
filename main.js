var canvas, ctx;
var height, width;

// degrees, x, y, length
var data = [[0,-.5,0,1]];
//var pattern = [[-90,0,0,.5],[45,0,-.5,Math.sqrt(2)/2],[180,1,0,.5]];
//var pattern = [[-45,0,0,Math.sqrt(.5)],[45,.5,-.5,Math.sqrt(.5)]];
//var pattern = [[-45,0,0,Math.sqrt(.5)],[135,1,1,Math.sqrt(.5)]];
//var pattern = [[-45,0,0,Math.sqrt(.5)],[-135,1,0,Math.sqrt(.5)]];
//var pattern = [[0,0,0,0.25],[45,0.25,0,Math.sqrt(0.125)],[-45,0.5,0.25,Math.sqrt(0.125)],[180,1,0,0.25]];
//var pattern = [[45,0,0,0.7],[0,1,0,0.5]];
//var pattern = [[45,0,0,0.7],[45,1,0,0.5]];
var pattern = [[0,0,0,1/3],[0,2/3,0,1/3]];
var iterations = 10;
var s = 450;

window.onload = function () {
	canvas = document.getElementsByTagName('canvas')[0];
	ctx = canvas.getContext('2d');

	for (var n = 0; n < iterations; n++) {
		iterate();
	}

	updateDimensions();
}
window.onresize = updateDimensions;

function updateDimensions () {
	height = window.innerHeight;
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

function render () {
	ctx.strokeStyle = 'rgba(255,0,0,1)';
	ctx.beginPath();
	for (var i = 0; i < data.length; i++) {
		var v = data[i];
		drawVector(v);
	}
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