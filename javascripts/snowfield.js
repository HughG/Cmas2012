function letItSnow() {

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

// String hash, after
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

var SPOKE_LENGTH = 100;
var rng;

function drawScene () {
  // Set up the canvas for paper.js.
  var canvas = document.getElementById('snowCanvas');
  paper.setup(canvas);

  // BEGIN Helper functions ----------------------------------------
  function drawSpoke (origin, spokeEnd, crossParams) {
    var spokePath = new paper.Path();
    spokePath.strokeColor = '#d0e8ff';
    spokePath.strokeWidth = 2;
    spokePath.add(origin);
    spokePath.add(origin.add(spokeEnd));

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
      var crossBase = crossPoint.clone();
      crossBase.length *= crossParams.spikeBreadthFactor;

      var crossPath = new paper.Path();
      crossPath.strokeColor = '#d0e8ff';
      crossPath.strokeWidth = 1;
      crossPath.fillColor = '#c0e0ff';
      crossPath.fillColor.alpha = 0.5;
      crossPath.closed = true;
      crossPath.add(origin.add(crossPoint));
      crossPath.add(origin.add(crossWiddershins));
      crossPath.add(origin.add(crossBase));
      crossPath.add(origin.add(crossTurnwise));
    }
  }

  // Bell curve
  function bell(start, end) {
    return (rng.nextFloatRange(start, end) + rng.nextFloatRange(start, end)) / 2;
  }

  // Reverse bell curve
  function reverseBell(start, end) {
    var halfWay = (start + end) / 2;
    var raw = halfWay - bell(start, end);
    var result = (raw > 0) ? (start + raw) : (end + raw);
    return result;
  }

  function drawSnowflake (origin) {
    var spokeEnd = new paper.Point();
    spokeEnd.length = SPOKE_LENGTH;
    spokeEnd.angle = 0;

    var spokeCount = 2 * Math.floor(rng.nextRange(3, 8));
    var crossParams = {
      startDist: 1 - Math.pow(rng.nextFloatRange(0, 0.2), 2),
      endDist: rng.nextFloatRange(0.05, 0.2),
      spacingFactor: rng.nextFloatRange(0.6, 0.9),
      spikeBreadthFactor: rng.nextFloatRange(0.8, 1.0),
      spikinessFactor: reverseBell(0.6, 1.3),
      spreadAngle: bell(10, 45)
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

// Seed the RNG.
var name = document.forms.nameForm.name.value;
// Add 1 to the hash, because 0 will cause the RNG to seed from Math.random(...).
var nameHash = name.hashCode() + 1;
rng = new RNG(Math.abs(nameHash));

drawScene();

};
