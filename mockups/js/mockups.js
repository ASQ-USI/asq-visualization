Manager = require('../../manager');
graphs = require('../../graphs');
d3 = require('d3');
var manager = new Manager()
,  margin   = { top: 60, right: 40, bottom: 60, left: 120 }
, width     = 960 - margin.left - margin.right
, height    = 500 - margin.top - margin.bottom
graphProp   = {
    height : height,
    width  : width,
    margin : margin };

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomData() {
  var size = 100;
  var c = randomInt(size/4, 3*size/4);
  var i = size -c;
  var c5s = randomInt(0, c);
  var c4s = randomInt(0, d3.max([c-c5s, 0]));
  var c3s = randomInt(0, d3.max([c-c5s-c4s, 0]));
  var c2s = randomInt(0, d3.max([c-c5s-c4s-c3s, 0]));
  var c1s = randomInt(0, d3.max([c-c5s-c4s-c3s-c2s, 0]));
  var i5s = randomInt(0, i);
  var i4s = randomInt(0, d3.max([i-i5s, 0]));
  var i3s = randomInt(0, d3.max([i-i5s-i4s, 0]));
  var i2s = randomInt(0, d3.max([i-i5s-i4s-i3s, 0]));
  var i1s = randomInt(0, d3.max([i-i5s-i4s-i3s-i2s, 0]));
  // return [
  //   { "key" : "right", "5star": c5s, "4star": c4s, "3star": c3s, "2star": c2s,
  //     "1star": c1s },
  //   { "key" : "wrong", "5star": i1s, "4star": i2s, "3star": i3s, "2star": i4s,
  //     "1star": i5s }
  // ];
  return [
    { "key" : "right", "5star": 0, "4star": 0, "3star": 0, "2star": 0,
      "1star": 0 },
    { "key" : "wrong", "5star": 0, "4star": 0, "3star": 0, "2star": 0,
      "1star": 0 }
  ];
}

loadMockup = function() {
  manager//.register('#slide04 [data-target-assessment-id="5344771eabd22c0000dbf940"] .viz', 'correctness', graphProp)
    .update('#slide04 [data-target-assessment-id="5344771eabd22c0000dbf940"] .viz', 'correctness', randomData())
  manager.render('#slide04 [data-target-assessment-id="5344771eabd22c0000dbf940"] .viz', 'correctness'); // Must be called the first time.

  var btn = document.getElementById('updateBtn');
  btn.onclick = function() {
    manager.update('#slide04 [data-target-assessment-id="5344771eabd22c0000dbf940"] .viz', 'correctness', randomData())
  }

}