
/*
	d3
*/


var d3Chart = {};

d3Chart.create = function(el, props, data) {
	// margin for top, bottom, left, right
	// i.e. empty space, in case something like text goes outside a bit
	var margin = 15;
	var svg = d3.select(el).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width)
		.attr('height', props.height);

	// height and width of workable space i.e. without margins
	var height = svg.node().getBoundingClientRect().height - margin * 2;
	var width = svg.node().getBoundingClientRect().width - margin * 2;

	// the y-scale puts 0 in the right position i.e. the whole range is mapped to 0->height
	var ymin = d3.min(data, function(d) { return d.value; });
	var ymax = d3.max(data, function(d) { return d.value; });
	var yScale = d3.scale.linear()
		.domain([ ymin, ymax ])
		.range([ 0 , height ]);
	// inverted scale for y-axis
	var yInvertedScale = d3.scale.linear()
		.domain([ ymin, ymax])
		.range([height , 0]);


	// the scale for bars is based on absolute heights
	var barmin = d3.min(data.concat([ { value: 0 }]), function(d) { return Math.abs(d.value); });
	var barmax = d3.max(data, function(d) { return d.value; });
	var barScale = d3.scale.linear()
		.domain([ barmin, barmax ])
		.range([ 0 , height - yScale(0) ]);



	var color = d3.scale.category20();
	// gaps == rect width, hence 2
	var rectWidth = width / (2 * data.length);




	// add groups. y location 0 - barheight or + barheight if negative value
	var groups = svg.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		// extra margin/2 for scale
		.attr("transform", function(d, i) {
			var barheight = d.value < 0 ? 0 : barScale(Math.abs(d.value)); //margin + height - barheight - yScale(0)
			return "translate(" + (margin + rectWidth/2 + i * rectWidth * 2) + "," + (margin + height - yScale(0) - barheight) + ")";
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
			return barScale(Math.abs(d.value));
		})
		.style("fill", function(d, i) {
			return color(i);
		});


	// draw the axes
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
			return "translate(" + margin + "," + (height - yScale(0) + margin) + ")";
		});	
	xAxis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", width-margin/2)
		.attr("y2", 0)
		.attr("stroke", "lightgrey")
		.attr("stroke-width", 1);


	// // notice fake data concat to make scales nicer
	// var ymin = d3.min(data.concat([ { value: 0 }]), function(d) { return Math.abs(d.value); });
	// var ymax = d3.max(data, function(d) { return d.value; });
	// var yScale = d3.scale.linear()
	// 				.domain([ ymin, ymax ])
	// 				.range([ 0 , height ]);
	// // not taking absolute values
	// var trueymin = d3.min(data.concat([ { value: 0 }]), function(d) { return d.value; });
	// var yInvertedScale = d3.scale.linear()
	// 				.domain([ trueymin, ymax])
	// 				.range([height , 0]);

	// var color = d3.scale.category20();

	// // gaps == rect width, hence 2
	// var rectWidth = width / (2 * data.length);


	// // add groups
	// var groups = svg.selectAll("g")
	// 	.data(data)
	// 	.enter()
	// 	.append("g")
	// 	// extra margin/2 for scale
	// 	.attr("transform", function(d, i) {
	// 		return "translate(" + (margin + rectWidth/2 + i * rectWidth * 2) + "," + (margin + height - yScale(d.value) - yScale(0)) + ")";
	// 	})
	// 	.on('mouseover', function(d) {
	// 		d3.select(this).style("opacity", 0.7);
	// 	})
	// 	.on('mouseout', function(d) {
	// 		d3.select(this).style("opacity", 1);
	// 	});

	// // add rects
	// groups.append("rect")
	// 	.attr("width", rectWidth)
	// 	.attr("height", function(d) {
	// 		return yScale(d.value);
	// 	})
	// 	.style("fill", function(d, i) {
	// 		return color(i);
	// 	});

	// // add label text
	// groups.append("text")
	// 	// .attr("dominant-baseline", "hanging")
	// 	.attr("x", rectWidth/2)
	// 	.attr("y", function(d) { 
	// 		return yScale(d.value) - margin/2; // margin arbitrary here
	// 	})
	// 	.style("text-anchor", "middle")
	// 	.text(function(d) {
	// 		return d.label;
	// 	})


	// // draw y axis
	// var yAxis = svg.append("g")
	// 	.attr("class", "y-axis")
	// 	.attr("fill", "none")
	//     .attr("stroke", "grey")
	//     .attr("stroke-width", 1)
	//     //.style("shape-rendering", "crispEdges")
	//     //.style("font-size", 10)
	// 	.attr("transform", function(d) {
	// 		return "translate(" + margin + "," + (margin + yScale(ymin)) + ")";
	// 	})
	// 	.call(d3.svg.axis()
	//     	.scale(yInvertedScale)
	//     	.orient("right")
	//     	.ticks(5)
	//     	.tickSize(5, 0)
	//     );

	// // simple x axis line
	// var xAxis = svg.append("g")
	// 	.attr("class", "x-axis")
	// 	.attr("transform", function(d) {
	// 		// ! don't forget to flip y coordinate
	// 		return "translate(" + margin + "," + (height - yScale(0) + margin) + ")";
	// 	});
		
	// xAxis.append("line")
	// 	.attr("x1", 0)
	// 	.attr("y1", 0)
	// 	.attr("x2", width-margin/2)
	// 	.attr("y2", 0)
	// 	.attr("stroke", "lightgrey")
	// 	.attr("stroke-width", 1);
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
			{ label: 'Group B', value: 20 },
			{ label: 'Group C', value: 10 },
			{ label: 'Group D', value: -10 }
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