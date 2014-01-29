var canvas, ctx;
var height, width;

// degrees, x, y, length
var data = [[15,0,0,1]];
var pattern = [
	[-90  ,0  ,0  ,.5          ],
	[45 ,0  ,-.5 ,Math.sqrt(2)/2],
	[0   ,.5 ,0  ,.5          ]
];
var s = 100;

window.onload = function () {
	canvas = document.getElementsByTagName('canvas')[0];
	ctx = canvas.getContext('2d');

	updateDimensions();
	iterate();
	render();
}
window.onresize = updateDimensions;

function updateDimensions () {
	height = window.innerHeight;
	width = window.innerWidth;
	canvas.height = height;
	canvas.width = width;
}

function x (v) {
	return v[1]+Math.cos(v[0]*Math.PI/180)*v[3];
}
function y (v) {
	return v[2]+Math.sin(v[0]*Math.PI/180)*v[3];
}

function render () {
	ctx.strokeStyle = 'rgba(255,0,0,0.2)';
	for (var i = 0; i < data.length; i++) {
		var v = data[i];
		drawVector(v);
	}
}

function drawVector (v) {
	ctx.beginPath();
	ctx.moveTo(width/2+s*v[1],height/2+s*v[2]);
	ctx.lineTo(width/2+s*x(v),height/2+s*y(v));
	ctx.stroke();
}

function iterate () {
	for (var i = 0; i < data.length; i++) {
		var o = data[i];
		
		for (var j = 0 ; j < pattern.length; j++) {
			var p = pattern[j];

			var scaled = [
				p[0]+o[0],
				0,
				0,
				p[3]*o[3]
			]

			var moved = [
				scaled[0],
				o[3]*p[1]*Math.sin((scaled[0])*Math.PI/180),
				o[3]*p[2]*Math.sin((90-scaled[0])*Math.PI/180),
				scaled[3]
			]

			console.log(moved);

			ctx.strokeStyle = 'rgba(0,255,0,0.2)';
			//drawVector(p);
			ctx.strokeStyle = 'rgba(0,0,255,0.2)';
			drawVector(scaled);// blue
			ctx.strokeStyle = 'rgba(0,255,0,0.2)';
			drawVector(moved);// green
		}
	}
}