VizController = require('../../../controller');
d3 = require('d3');
var v             = new VizController();
var margin        = {top: 60, right: 40, bottom: 60, left: 120}
, width           = 960 - margin.left - margin.right
, height          = 500 - margin.top - margin.bottom
graphProp         = {
    height   : height,
    width    : width,
    margin   : margin,
    selector : '#viz' };

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

loadMockup = function() {
    v.register('Correctness', graphProp);
    dataset = [
      { "key" : "right", "5star": randomInt(0, 20),
        "4star": randomInt(0, 20), "3star": randomInt(0, 20),
        "2star": randomInt(0, 20), "1star": randomInt(0, 20) },
      { "key" : "wrong", "5star": randomInt(0, 20),
        "4star": randomInt(0, 20), "3star": randomInt(0, 20),
        "2star": randomInt(0, 20), "1star": randomInt(0, 20) }
    ];
    v.update('#viz', 'Correctness', dataset);
    v.render('#viz', 'Correctness');

    var btn = document.getElementById('updateBtn');
    btn.onclick = function() {
        dataset = [
          { "key" : "right", "5star": randomInt(0, 20),
            "4star": randomInt(0, 20), "3star": randomInt(0, 20),
            "2star": randomInt(0, 20), "1star": randomInt(0, 20) },
          { "key" : "wrong", "5star": randomInt(0, 20),
            "4star": randomInt(0, 20), "3star": randomInt(0, 20),
            "2star": randomInt(0, 20), "1star": randomInt(0, 20) }
        ];
        v.update('#viz', 'Correctness', dataset)
    }

}