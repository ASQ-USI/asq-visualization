var graphs = require('graphs');

module.exports = function VizController() {

  // Force object creation
  if (!(this instanceof VizController)) {
    return new VizController();
  }

  // Current graph
  this.current = {};

  this.graphProp = {};

  this.register = function register(selector, graph, graphProp) {
    if (! this.graphProp[selector]) {
      this.graphProp[selector] = {};
    }
    this.graphProp[selector][graph] = graphProp;
    return this;
    
  }

  //Update  current graph with new data
  this.update = function update(selector, graph, data) {
    if (! this.graphProp[selector] || ! this.graphProp[selector][graph]) {
      return this;
    }
    var graph = graphs[graph];
    var prop = this.graphProp[selector][graph]
    graph.update(prop, data);
    if (this.currents[selector] === graph) { //update on current requires render
      graph.render(prop, data);
    }
    return this;
  }

  this.render = function render(selector, graph) {
    if (! this.graphProp[selector] || ! this.graphProp[selector][graph]) {
      return this;
    }
    graphs[graph].render(this.graphProp[selector][graph]);
    return this;
  }
}