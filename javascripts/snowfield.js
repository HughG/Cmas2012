// Seedable pseudo-random number generator, from http://stackoverflow.com/a/424445
function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x100000000; // 2**32;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m-1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

var makeSnowflake = function () {

// Set up the canvas for paper.js.
var canvas = document.getElementById('snowCanvas');
paper.setup(canvas);

// Seed the RNG.
var rng = new RNG(20);

// Draw the snowflake.
var SPOKE_LENGTH = 100;
var origin = new paper.Point(380, 210);

var spoke = new paper.Point();
spoke.length = 100;
spoke.angle = 0;

var spokePath;
var spokeCount = 2 * Math.floor(rng.nextRange(3, 7));
var i;
for (i = 0; i < spokeCount; i++) {
  spokePath = new paper.Path();
  spokePath.strokeColor = '#d0e8ff';
  spokePath.strokeWidth = 3;
  spokePath.add(origin);
  spokePath.add(origin.add(spoke));
  spoke.angle += (360 / spokeCount);
}

// Draw the paper to the canvas.
paper.view.draw();

};

$(document).ready(makeSnowflake);