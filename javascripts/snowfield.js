(function scope() (

var origin = new Point(100, 100);

var spoke = new Point();
spoke.length = 100;
spoke.angle = 0;

var spokePath;
var spokeCount = 6;
var i;
for (i = 0; i < spokeCount; i++) {
  spokePath = new Path();
  spokePath.strokeColor = 'black';
  spokePath.strokeWidth = 3;
  spokePath.add(origin);
  spokePath.add(origin + spoke);
  spoke.angle += (360 / spokeCount);
  alert(spoke);
  alert(spokePath);
}

))();
