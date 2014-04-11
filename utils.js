var d3 = require('d3');

function applyLineBreak(text, width) { // Inspired by: http://bl.ocks.org/mbostock/7555321
  text.each(function() {
    var text   = d3.select(this),
    words      = text.text().split(/\n+/).reverse(),
    word,
    line       = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems
    x          = text.attr("x"),
    y          = text.attr("y"),
    dy         = parseFloat(text.attr("dy")),
    tspan      = text.text(null).append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em")
      .text(words.pop());

    while (word = words.pop()) {
      tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
    }
  });
}

module.exports = {
  applyLineBreak : applyLineBreak
};