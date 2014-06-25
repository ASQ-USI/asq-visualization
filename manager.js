var d3     = require('d3')
, graphLib = require('./graphs');

var Manager = (function() {
  function Manager() {

    // Force object creation
    if (!(this instanceof Manager)) {
      return new Manager();
    }

    // Current graphs
    this.currents = new Object(null);
    this.graphs = new Object(null);
  }

  var autoRegister = function autoRegister(selector, graphName) {
    var d3target = d3.select(selector);
    var prop = {
      width: parseInt(d3target.attr('data-width')),
      height: parseInt(d3target.attr('data-height')),
      margin: JSON.parse(d3target.attr('data-margin')),
    };
    this.register(selector,graphName, prop);
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
    this.graphs[selector][graphName] = new graphLib[graphName](selector, graphProp);
    return this;
  }

  /**
   *  @method update - Update a graph with new data and re-render it if needed.
   *  @param {string} selector - A string to uniquely select the graph. Must be
   *    the same as given during registration.
   *  @param {string} graphName - The name of the graph
   *  @param {string} data - The data to pas to the graph.
   **/
  Manager.prototype.update = function update(selector, graphName, data) {
    if (! this.graphs[selector] || ! this.graphs[selector][graphName]) {
      autoRegister.call(this, selector, graphName);
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
      consoel.log('somthing wnet wrong')
      return this;
    }

    var noGraphSet = ! this.currents[selector];
    var differentGraph = this.currents[selector] &&
      this.currents[selector] !== graphName;
    if (noGraphSet) {
      this.currents[selector] = graphName; // Set new chart
    } else if (differentGraph) {
      // "Undraw" the previous chart
      this.graphs[selector][this.currents[selector]].isDrawn = false;
      this.currents[selector] = graphName; // Set new chart
    }
    this.graphs[selector][graphName].render(); // Render  new chart
    return this;
  }

  return Manager;
})();

module.exports = Manager;