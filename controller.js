var graphs = require('./graphs');

module.exports = function VizController() {

  // Force object creation
  if (!(this instanceof VizController)) {
    return new VizController();
  }

  // Current graphs
  this.currents = {};

  this.graphProp = {};

  this.register = function register(graph, graphProp) {
    var selector = graphProp.selector;
    if (! this.graphProp[selector]) {
      this.graphProp[selector] = {};
    }
    this.graphProp[selector][graph] = graphProp;
    return this;
    
  }

  //Update graph with new data
  this.update = function update(selector, graphName, data) {
    if (! this.graphProp[selector] || ! this.graphProp[selector][graphName]) {
      return this;
    }
    var graph = graphs[graphName];
    var prop = this.graphProp[selector][graphName];
    graph.update(prop, data);
    if (this.currents[selector] === graphName) { //update on current requires render
      graph.render(prop, data);
    }
    return this;
  }

  this.render = function render(selector, graphName) {
    if (! this.graphProp[selector] || ! this.graphProp[selector][graphName]) {
      return this;
    }
    graphs[graphName].render(this.graphProp[selector][graphName]);
    this.currents[selector] = graphName
    return this;
  }
}