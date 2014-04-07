var d3  = require('d3')
, utils = require('../../utils');

function Correctness(selector, properties) {

  // Force object creation
  if (!(this instanceof Correctness)) {
    return new Correctness(properties);
  }

  this.selector   = selector;
  this.margin     = properties.margin;
  this.width      = properties.width;
  this.height     = properties.height;
  this.showTowers = properties.showTowers || false;
  this.isDrawn    = false;
  
  this.x          = null;
  this.xAxis      = null;
  this.y          = null;
  this.yAxis      = null;
  this.maxVal     = { right : null, wrong : null };
  this.categories = null;
  return this;
}

Correctness.color = {
      right : ['#E5E5FF', '#B3B3FF', '#7F7FFF', '#4D4DFF', '#1A1AFF'],
      wrong : ['#FFE5E5', '#FFB3B3', '#FF7F7F', '#FF4D4D', '#FF1A1A'] 
};

Correctness.labelValues = { right : 'correct', wrong : 'incorrect' };

// Update the data (does not redraw anything)
Correctness.prototype.update = function update(data) {

  // Map data for d3
  var mapped = d3.layout.stack()(
    ['5star', '4star', '3star', '2star', '1star'].map(
      function outerMapFn(confidence) {
        return data.map(
          function innerMapFn(d) {
            return { x: d.key, y: d[confidence] };
        });
  }));
  this.categories = mapped[0].map(function(d) { return d.x; });

  var stacked = d3.layout.stack()(mapped).map(
    function stackFN(d, i) {
      d[0].confidence = 5-i;
      d[1].confidence = 5-i;
      return d;
  });

  this.data = stacked;

  // Update maxValue
  this.maxVal.right = mapped[mapped.length-1][0].y0
    + mapped[mapped.length-1][0].y;
  this.maxVal.wrong = mapped[mapped.length-1][1].y0
    + mapped[mapped.length-1][1].y;

  if (! this.isDrawn) {
    return this;
  }

  var that = this;

  // Update x-axis
  this.x.domain([0, d3.max([this.maxVal.right, this.maxVal.wrong])])
    .range([0, this.width]);
  this.xAxis.scale(this.x)
    .ticks(Math.floor(d3.max([this.maxVal.right, this.maxVal.wrong])/10));

  // Update y-axis
  this.y.domain(this.categories)
    .rangeRoundBands([0, this.height], .3);
  this.yAxis.scale(this.y);

  // Set data
  var bars = d3.select(this.selector).selectAll('g.av-cor-bar').data(this.data);

  // Update appearance of bars
  bars.selectAll('rect').data(function(d) { return d; })
    .transition()
    .attr('x', function(d) { return that.x(d.y0); })
    .attr('width', function(d) { return that.x(d.y); })
};

/*
 * Update rendering of chart (to be called after update)
 * This take care of drawing the entire chart if it is not done yet.
 */
Correctness.prototype.render = function render() {
  if (!this.isDrawn) {
    return this.draw();
  }
  var that = this;
  var chart = d3.select(this.selector).select('.av-cor-chart');

  chart.selectAll('g.av-cor-xAxis').transition()
    .call(this.xAxis);
  chart.selectAll('g.av-cor-yAxis').transition()
    .call(this.yAxis)
    .selectAll('.tick text')
      .call(utils.wrapLabel, this.y.rangeBand());

  chart.selectAll('g.av-cor-bar').selectAll('rect')
    .data(function(d) { return d; })
    .transition()
    .attr('x', function(d) { return that.x(d.y0); })
    .attr('width', function(d) { return that.x(d.y); });

  return this;
};

// Draw the the complete chart
Correctness.prototype.draw = function draw() {
  // Clean the container
  d3.select(this.selector).html('');

  var that = this; // Accees the object in d3 data functions

  // SVG Container
  var chart = d3.select(this.selector).append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr('class', 'av-cor')
    .append('svg:g')
    .attr('class', 'av-cor-chart')
    .attr('transform', 'translate(' + this.margin.left + ',' 
      + this.margin.top + ')');

  // Graph bounding box
  var graphBBox = d3.select(this.selector).select('svg')
    .node().getBoundingClientRect();

  // Title
  d3.select(this.selector).append('text')
    .attr('class', 'av-cor-title')
    .style('left', function() { return graphBBox.left + 'px'; })
    .style('width', function() { return graphBBox.width + 'px'; })
    .style('top', function(d) { return graphBBox.top + 5 + 'px'; })
    .text('Correctness');

  // Tooltip
  var toolTip = d3.select(this.selector).append('div')
    .attr('class', 'av-cor-tooltip')
    .style('opacity', 0);

  // X-axis
  this.x = d3.scale.linear()
    .domain([0, d3.max([this.maxVal.right, this.maxVal.wrong])])
    .range([0, this.width]);

  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .tickPadding(11)
    .ticks(Math.floor(d3.max([this.maxVal.right, this.maxVal.wrong])/10))
    .tickSize(-this.height, 0 ,0)
    .orient('bottom');

  chart.append('g')
            .attr('class', 'av-cor-xAxis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);

  // Y-axis
  this.y = d3.scale.ordinal()
    .domain(this.categories)
    .rangeRoundBands([0, this.height], .3);

  this.yAxis = d3.svg.axis()
    .scale(this.y)
    .tickPadding(6)
    .outerTickSize(2)
    .tickFormat(function (d) {
        return Correctness.labelValues[d] + ' (' + that.maxVal[d] + ')' ;
    })
    .orient('left');
   
  chart.append('g')
    .attr('class', 'av-cor-yAxis')
    .call(this.yAxis)
    .selectAll('.tick text')
      .call(utils.wrapLabel, this.y.rangeBand());

  // CHART DATA
  var bars = chart.selectAll('g.av-cor-bar').data(this.data)
    .enter()
    .append('chart:g')
    .attr('class', 'av-cor-bar')

  var rects = bars.selectAll('rect').data(function(d) { return d; })
    .enter()
    .append('svg:rect')
    .attr('x', function(d) { return that.x(d.y0); })
    .attr('y', function(d) { 
      if (that.showTowers) {
        return that.y(d.x) + that.y.rangeBand() * (0.5 - d.confidence / 10);
      }
      return that.y(d.x);
    })
    .attr('width', function(d) { return that.x(d.y); })
    //.attr('class', function(d) { return d.x; })
    .attr('height', function(d) {
      if (that.showTowers) {
        return that.y.rangeBand() * d.confidence / 5;
      }
      return that.y.rangeBand();
    })
    .style('fill', function(d) {
      return Correctness.color[d.x][d.confidence - 1]; })
    .style('stroke', function(d) {
      return d3.rgb(Correctness.color[d.x][d.confidence - 1]).darker();
    })
    .on('mouseover', function displayTooltip(d) {  
      var bbox = this.getBoundingClientRect();
      var left = bbox.left + bbox.width * 0.5 - 50;
      var top = bbox.top + bbox.height * 0.5 - 32;

      toolTip.transition()        
        .duration(200)      
        .style('opacity', .9);      
      
      toolTip.html([
        Array(d.confidence + 1).join('&#x2605;'),
        Array(5 - d.confidence + 1).join('&#x2606;'),
        '<br/>Confidence<br/>', d.y, ' (',
        Math.round(100 * d.y / that.maxVal[d.x]), '%)'
      ].join(''))  
      .style('left', left + 'px')     
      .style('top', top + 'px');    
    })                  
    .on('mouseout', function hideTooltip(d) {       
        toolTip.transition()        
          .duration(500)      
          .style('opacity', 0);   
    });

  // Towers / Bars toggle button
  d3.select(this.selector)
    .append('input')
    .attr('type','button')
    .attr('class','av-cor-button')
    .attr('value', 'Bars')
    .style('left', function(d) {
      return ( graphBBox.left + graphBBox.width 
        - this.getBoundingClientRect().width - that.margin.right ) + 'px';
    })
    .style('top', function(d) { 
      return ( graphBBox.top + 0.5 * that.margin.top ) + 'px';
    })
    .on('click', function toggle() {
      that.showTowers = !that.showTowers;
      rects.data(function(d) { return d; })
      .transition()
      .attr('y', function(d) { 
        if (that.showTowers) {
          return that.y(d.x) + that.y.rangeBand() * (0.5 - d.confidence / 10);
        }
        return that.y(d.x);
      })
      .attr('height', function(d) { 
        if (that.showTowers) {
          return that.y.rangeBand() * d.confidence / 5;
        }
        return that.y.rangeBand();
      });

      this.value = !that.showTowers ? 'Show towers' : 'Show bars';
    });
  this.isDrawn = true;

  return this;
};

module.exports = Correctness;