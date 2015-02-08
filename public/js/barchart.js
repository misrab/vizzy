
/*
	d3
*/


var d3Chart = {};

d3Chart.create = function(el, props, data) {
	var svg = d3.select(el).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width)
		.attr('height', props.height);

	var height = d3.select(el).node().getBoundingClientRect().height;
	var width = d3.select(el).node().getBoundingClientRect().width;

	var ymin = d3.min(data.concat([ { value: 0 }]), function(d) { return d.value; });
	var ymax = d3.max(data, function(d) { return d.value; });
	var yScale = d3.scale.linear()
					.domain([ ymin, ymax ])
					.range([ 0, height  ]);

	var color = d3.scale.category20();

	// gaps == rect width, hence 2
	var rectWidth = width / (2 * data.length);


	// add rects
	var groups = svg.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function(d, i) {
			return "translate(" + (rectWidth/2 + i * rectWidth * 2) + "," + (height - yScale(d.value)) + ")";
		});


	groups.append("rect")
		// .attr("x", function(d, i) {
		// 	return 0;
		// 	//return rectWidth/2 + i * rectWidth * 2;
		// })
		// .attr("y", function(d) {
		// 	return 0
		// 	//return height - yScale(d.value);
		// })
		.attr("width", rectWidth)
		.attr("height", function(d) {
			return yScale(d.value);
		})
		.style("fill", function(d, i) {
			return color(i);
		});
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
			{ label: 'a', value: 10 },
			{ label: 'b', value: 20 },
			{ label: 'c', value: 30 }
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
