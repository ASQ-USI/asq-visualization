var d3  = require('d3')
, utils = require('../utils');

module.exports = function Correctness() {

  // Force object creation
  if (!(this instanceof Correctness)) {
    return new Correctness();
  }

  // Indicate whether to completely draw the chart again or not.
  this.isDrawn = false;

  // Colors for the bars from confidence 5 to 0.
  this.color = {
      right : ['#E5E5FF', '#B3B3FF', '#7F7FFF', '#4D4DFF', '#1A1AFF'],
      wrong : ['#FFE5E5', '#FFB3B3', '#FF7F7F', '#FF4D4D', '#FF1A1A'] 
  };

  // Actual labels (nicer than right and wrong)
  this.labelValues = { right : 'correct', wrong : 'incorrect' };


  
  // Update the data (does not redraw anything)
  this.update = function update(prop, data) {

    // Map data for d3
    var mapped = d3.layout.stack()(
      ['5star', '4star', '3star', '2star', '1star'].map(
        function outerMapFn(confidence) {
          return data.map(
            function innerMapFn(d) {
              return { x: d.key, y: d[confidence] };
          });
    }));
    prop.categories = mapped[0].map(function(d) { return d.x; });

    var stacked = d3.layout.stack()(mapped).map(
      function stackFN(d, i) {
        d[0].confidence = 5-i;
        d[1].confidence = 5-i;
        return d;
    });

    prop.data = stacked;

    // Update maxValue
    if (!prop.maxVal) {
      prop.maxVal = {};
    }
    prop.maxVal.right = mapped[mapped.length-1][0].y0
      + mapped[mapped.length-1][0].y;
    prop.maxVal.wrong = mapped[mapped.length-1][1].y0
      + mapped[mapped.length-1][1].y;

    if (! prop.isDrawn) {
      return this;
    }

    // Update x-axis
    prop.x.domain([0, d3.max([prop.maxVal.right, prop.maxVal.wrong])])
      .range([0, prop.width]);
    prop.xAxis.scale(prop.x)
      .ticks(Math.floor(d3.max([prop.maxVal.right, prop.maxVal.wrong])/10));

    // Update y-axis
    prop.y.domain(prop.categories)
      .rangeRoundBands([0, prop.height], .3);
    prop.yAxis.scale(prop.y);

    // Set data
    var bars = d3.select(prop.selector).selectAll('g.bar').data(prop.data);

    // Update appearance of bars
    bars.selectAll('rect').data(function(d) { return d; })
      .transition()
      .attr('x', function(d) { return prop.x(d.y0); })
      .attr('width', function(d) { return prop.x(d.y); })
  };

  /*
   * Update rendering of chart (to be called after update)
   * This take care of drawing the entire chart if it is not done yet.
   */
  this.render = function render(prop) {
    if (!prop.isDrawn) {
      return this.draw(prop);
    }
    var chart = d3.select(prop.selector).select('.chart');

    chart.selectAll('g.xAxis').transition()
      .call(prop.xAxis);
    chart.selectAll('g.yAxis').transition()
      .call(prop.yAxis)
      .selectAll('.tick text')
        .call(utils.wrapLabel, prop.y.rangeBand());

    chart.selectAll('g.bar').selectAll('rect').data(function(d) { return d; })
      .transition()
      .attr('x', function(d) { return prop.x(d.y0); })
      .attr('width', function(d) { return prop.x(d.y); });

    return this;
  };

  // Draw the the complete chart
  this.draw = function draw(prop) {
    // Clean the container
    d3.select(prop.selector).html('');

    var that = this; // Accees the object in d3 data functions

    // SVG Container
    var chart = d3.select(prop.selector).append('svg')
      .attr('width', prop.width + prop.margin.left + prop.margin.right)
      .attr('height', prop.height + prop.margin.top + prop.margin.bottom)
      .append('svg:g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + prop.margin.left + ',' 
        + prop.margin.top + ')');

    // Graph bounding box
    var graphBBox = d3.select(prop.selector).select('svg')
      .node().getBoundingClientRect();

    // Title
    d3.select(prop.selector).append('text')
      .attr('class', 'title')
      .style('left', function() { return graphBBox.left + 'px'; })
      .style('width', function() { return graphBBox.width + 'px'; })
      .style('top', function(d) { return graphBBox.top + 5 + 'px'; })
      .text('Correctness');

    // Tooltip
    var toolTip = d3.select(prop.selector).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // X-axis
    prop.x = d3.scale.linear()
      .domain([0, d3.max([prop.maxVal.right, prop.maxVal.wrong])])
      .range([0, prop.width]);

    prop.xAxis = d3.svg.axis()
      .scale(prop.x)
      .tickPadding(11)
      .ticks(Math.floor(d3.max([prop.maxVal.right, prop.maxVal.wrong])/10))
      .tickSize(-prop.height, 0 ,0)
      .orient('bottom');

    chart.append('g')
              .attr('class', 'xAxis')
              .attr('transform', 'translate(0,' + prop.height + ')')
              .call(prop.xAxis);

    // Y-axis
    prop.y = d3.scale.ordinal()
      .domain(prop.categories)
      .rangeRoundBands([0, prop.height], .3);

    prop.yAxis = d3.svg.axis()
      .scale(prop.y)
      .tickPadding(6)
      .outerTickSize(2)
      .tickFormat(function (d) {
          return that.labelValues[d] + ' (' + prop.maxVal[d] + ')' ;
      })
      .orient('left');
     
    chart.append('g')
      .attr('class', 'yAxis')
      .call(prop.yAxis)
      .selectAll('.tick text')
        .call(utils.wrapLabel, prop.y.rangeBand());

    // CHART DATA
    var bars = chart.selectAll('g.bar').data(prop.data)
      .enter()
      .append('chart:g')
      .attr('class', 'bar')

    var rects = bars.selectAll('rect').data(function(d) { return d; })
      .enter()
      .append('svg:rect')
      .attr('x', function(d) { return prop.x(d.y0); })
      .attr('y', function(d) { 
        if (prop.isTowers) {
          return prop.y(d.x) + prop.y.rangeBand() * (0.5 - d.confidence / 10);
        }
        return prop.y(d.x);
      })
      .attr('width', function(d) { return prop.x(d.y); })
      .attr('class', function(d) { return d.x; })
      .attr('height', function(d) {
        if (prop.isTowers) {
          return prop.y.rangeBand() * d.confidence / 5;
        }
        return prop.y.rangeBand();
      })
      .style('fill', function(d) { return that.color[d.x][d.confidence - 1]; })
      .style('stroke', function(d) {
        return d3.rgb(that.color[d.x][d.confidence - 1]).darker();
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
          Math.round(100 * d.y / prop.maxVal[d.x]), '%)'
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
    d3.select(prop.selector)
      .append('input')
      .attr('type','button')
      .attr('class','button')
      .attr('value', 'Bars')
      .style('left', function(d) {
        return ( graphBBox.left + graphBBox.width 
          - this.getBoundingClientRect().width - prop.margin.right ) + 'px';
      })
      .style('top', function(d) { 
        return ( graphBBox.top + 0.5 * prop.margin.top ) + 'px';
      })
      .on('click', function toggle() {
        prop.isTowers = !prop.isTowers;
        rects.data(function(d) { return d; })
        .transition()
        .attr('y', function(d) { 
          if (prop.isTowers) {
            return prop.y(d.x) + prop.y.rangeBand() * (0.5 - d.confidence / 10);
          }
          return prop.y(d.x);
        })
        .attr('height', function(d) { 
          if (prop.isTowers) {
            return prop.y.rangeBand() * d.confidence / 5;
          }
          return prop.y.rangeBand();
        });

        this.value = !prop.isTowers ? 'Show towers' : 'Show bars';
      });
    prop.isDrawn = true;

    return this;
  };

  return this;
}