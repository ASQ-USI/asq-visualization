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
  return [
    { "key" : "right", "5star": randomInt(0, 20),
      "4star": randomInt(0, 20), "3star": randomInt(0, 20),
      "2star": randomInt(0, 20), "1star": randomInt(0, 20) },
    { "key" : "wrong", "5star": randomInt(0, 20),
      "4star": randomInt(0, 20), "3star": randomInt(0, 20),
      "2star": randomInt(0, 20), "1star": randomInt(0, 20) }
  ];
}

loadMockup = function() {
  manager.register('#viz', 'Correctness', graphProp)
    .update('#viz', 'Correctness', randomData())
    .render('#viz', 'Correctness'); // Must be called the first time.

  var btn = document.getElementById('updateBtn');
  btn.onclick = function() {
    manager.update('#viz', 'Correctness', randomData())
  }

}