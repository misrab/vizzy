
/*
	d3
*/


var d3Chart = {};

d3Chart.create = function(el, props, data) {
	var margin = 30;
	var svg = d3.select(el).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width)
		.attr('height', props.height);

	var height = svg.node().getBoundingClientRect().height - margin * 2;
	var width = svg.node().getBoundingClientRect().width - margin * 2;


	// notice fake data concat to make scales nicer
	var ymin = d3.min(data.concat([ { value: 0 }]), function(d) { return d.value; });
	var ymax = d3.max(data, function(d) { return d.value; });
	var yScale = d3.scale.linear()
					.domain([ ymin, ymax ])
					.range([ 0 , height ]);
	var yInvertedScale = d3.scale.linear()
					.domain([ ymin, ymax])
					.range([height , 0]);

	var color = d3.scale.category20();

	// gaps == rect width, hence 2
	var rectWidth = width / (2 * data.length);


	// add groups
	var groups = svg.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		// extra margin/2 for scale
		.attr("transform", function(d, i) {
			return "translate(" + (margin + rectWidth/2 + i * rectWidth * 2) + "," + (height + margin - yScale(d.value)) + ")";
		})
		.on('mouseover', function(d) {
			d3.select(this).style("opacity", 0.7);
		})
		.on('mouseout', function(d) {
			d3.select(this).style("opacity", 1);
		});

	// add rects
	groups.append("rect")
		.attr("width", rectWidth)
		.attr("height", function(d) {
			return yScale(d.value);
		})
		.style("fill", function(d, i) {
			return color(i);
		});

	// add label text
	groups.append("text")
		// .attr("dominant-baseline", "hanging")
		.attr("x", rectWidth/2)
		.attr("y", function(d) { 
			return yScale(d.value) - margin/2; // margin arbitrary here
		})
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.label;
		})


	// draw y axis
	var yAxis = svg.append("g")
		.attr("class", "y-axis")
		.attr("fill", "none")
	    .attr("stroke", "grey")
	    .attr("stroke-width", 1)
	    //.style("shape-rendering", "crispEdges")
	    //.style("font-size", 10)
		.attr("transform", function(d) {
			return "translate(" + margin + "," + margin + ")";
		})
		.call(d3.svg.axis()
	    	.scale(yInvertedScale)
	    	.orient("right")
	    	.ticks(5)
	    	.tickSize(5, 0)
	    );

	// simple x axis line
	var xAxis = svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", function(d) {
			// ! don't forget to flip y coordinate
			return "translate(" + margin + "," + (height + margin) + ")";
		});
		
	xAxis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width-margin/2)
		.attr("y2", 0)
		.attr("stroke", "lightgrey")
		.attr("stroke-width", 1);
};


d3Chart.destroy = function(el) {
	el.remove();
};

/*
	React
*/

var BarChart = React.createClass({

	getInitialState: function() {
		return { data: [
			{ label: 'Group A', value: 30 },
			{ label: 'Group B', value: 5 },
			{ label: 'Group C', value: 20 },
			{ label: 'Group D', value: 10 }
		] };
	},

	componentDidMount: function() {
		var el = this.getDOMNode();
	    d3Chart.create(el, {
	      width: '100%',
	      height: '300px'
	    }, this.state.data);
	},

	componentDidUpdate: function() {

	},

	componentWillUnmount: function() {
		var el = this.getDOMNode();
    	d3Chart.destroy(el);
	},

	render: function() {
		return (
			<div data={ this.state.data } className="barChart"></div>
		);
	}
});


React.render(
	<BarChart />,
	document.getElementById('charts')
);






// d3Chart.update = function(el, state) {
//   // Re-compute the scales, and render the data points
//   var scales = this._scales(el, state.domain);
//   this._drawPoints(el, scales, state.data);
// };

// d3Chart.destroy = function(el) {
//   // Any clean-up would go here
//   // in this example there is nothing to do
// };

// d3Chart._drawPoints = function(el, scales, data) {
//   var g = d3.select(el).selectAll('.d3-points');

//   var point = g.selectAll('.d3-point')
//     .data(data, function(d) { return d.id; });

//   // ENTER
//   point.enter().append('circle')
//       .attr('class', 'd3-point');

//   // ENTER & UPDATE
//   point.attr('cx', function(d) { return scales.x(d.x); })
//       .attr('cy', function(d) { return scales.y(d.y); })
//       .attr('r', function(d) { return scales.z(d.z); });

//   // EXIT
//   point.exit()
//       .remove();
// };
