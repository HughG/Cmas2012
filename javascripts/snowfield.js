(function () {

// Seedable pseudo-random number generator, after http://stackoverflow.com/a/424445
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
RNG.prototype.nextFloatRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + (randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

var SPOKE_LENGTH = 100;

function drawScene () {
  // Set up the canvas for paper.js.
  var canvas = document.getElementById('snowCanvas');
  paper.setup(canvas);

  // Seed the RNG.
  //var rng = new RNG(20);
  var rng = new RNG(Math.random() * 100);

  // BEGIN Helper functions ----------------------------------------
  function drawSpoke (origin, spokeEnd, crossParams) {
    var spokePath = new paper.Path();
    spokePath.strokeColor = '#d0e8ff';
    spokePath.strokeWidth = 3;
    spokePath.add(origin);
    spokePath.add(origin.add(spokeEnd));

    var crossStartDist = rng.nextFloatRange(0.8, 1);
    var crossEndDist = rng.nextFloatRange(0.05, 0.2);
    var crossSpacingFactor = rng.nextFloatRange(0.6, 0.9);
    var crossSpikinessFactor = rng.nextFloatRange(0.6, 1.3);
    var crossAngle = rng.nextRange(10, 45);

    var c;
    for (
        c = crossParams.startDist;
        c > crossParams.endDist;
        c *= crossParams.spacingFactor
    ) {
      var crossPoint = spokeEnd.clone();
      crossPoint.length *= c;
      var crossWiddershins = crossPoint.clone();
      crossWiddershins.angle -= crossParams.spreadAngle;
      crossWiddershins.length *= crossParams.spikinessFactor;
      var crossTurnwise = crossPoint.clone();
      crossTurnwise.angle += crossParams.spreadAngle;
      crossTurnwise.length *= crossParams.spikinessFactor;

      var crossPath = new paper.Path();
      crossPath.strokeColor = '#d0e8ff';
      crossPath.strokeWidth = 2;
      crossPath.add(origin.add(crossWiddershins));
      crossPath.add(origin.add(crossPoint));
      crossPath.add(origin.add(crossTurnwise));
    }
  }

  function drawSnowflake (origin) {
    var spokeEnd = new paper.Point();
    spokeEnd.length = SPOKE_LENGTH;
    spokeEnd.angle = 0;

    var spokeCount = 2 * Math.floor(rng.nextRange(3, 7));
    var crossParams = {
      startDist: rng.nextFloatRange(0.8, 1),
      endDist: rng.nextFloatRange(0.05, 0.2),
      spacingFactor: rng.nextFloatRange(0.6, 0.9),
      spikinessFactor: rng.nextFloatRange(0.6, 1.3),
      spreadAngle: rng.nextRange(10, 35)
    };

    var i;
    for (i = 0; i < spokeCount; i++) {
      drawSpoke(origin, spokeEnd, crossParams);
      spokeEnd.angle += (360 / spokeCount);
    }
  }
  // END Helper functions ----------------------------------------

  // Draw the snowflake.
  var origin = new paper.Point(250, 120);
  drawSnowflake(origin);

  // Draw the paper to the canvas.
  paper.view.draw();
};

$(document).ready(drawScene);

})();

