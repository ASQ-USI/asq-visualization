var graphLib = require('./graphs');

function Manager() {

  // Force object creation
  if (!(this instanceof Manager)) {
    return new Manager();
  }

  // Current graphs
  this.currents = {};

  this.graphs = {};
}

/**
 *  @method register - Register a new graph to manage.
 *  @param {string} selector - A string to uniquely select the graph
 *  @param {string} graphName - The name of the graph
 *  @param {Object} prop - The properties of the graph. Must include a
 *   "selector" attribute as a string to uniquely select the graph.
 *   (Usually an id such as: '#graphId')
 **/
Manager.prototype.register = function register(selector, graphName, graphProp) {
  if (! this.graphs[selector]) {
    this.graphs[selector] = {};
  }
  //TODO: get width, height and margin from data attr. instead of prop obj.
  this.graphs[selector][graphName] = new graphLib[graphName](selector, graphProp);
  return this;
}

/**
 *  @method udpate - Update a graph with new data and re-render it if needed.
 *  @param {string} selector - A string to uniquely select the graph. Must be
 *    the same as given during registration.
 *  @param {string} graphName - The name of the graph
 *  @param {string} data - The data to pas to the graph.
 **/
Manager.prototype.update = function update(selector, graphName, data) {
  if (! this.graphs[selector] || ! this.graphs[selector][graphName]) {
    return this;
  }
  var graph = this.graphs[selector][graphName];
  graph.update(data);
  if (this.currents[selector] === graphName) { //update on current requires render
    graph.render();
  }
  return this;
}

/**
 *  @method render - Render a graph.
 *  @param {string} selector - A string to uniquely select the graph. Must be
 *    the same as given in the prop. during registration.
 *  @param {string} graphName - The name of the graph
 **/
Manager.prototype.render = function render(selector, graphName) {
  if (! this.graphs[selector] || ! this.graphs[selector][graphName]) {
    return this;
  }
  this.graphs[selector][graphName].render();
  this.currents[selector] = graphName
  return this;
}

module.exports = Manager;