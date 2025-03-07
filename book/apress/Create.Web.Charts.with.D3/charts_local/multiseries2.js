function draw_multiseries(s,w,h,series,colors){
	
var margin = {top: 70, right: 20, bottom: 30, left: 50},
    w = w - margin.left - margin.right,
    h = h - margin.top - margin.bottom;
var parseDate = d3.time.format("%d-%b-%y").parse;
var x = d3.time.scale().range([0, w]);
var y = d3.scale.linear().range([h, 0]);

//var color = d3.scale.category10();

  if( typeof series === 'number'){
	  if (series < 3) {
	      //continents = [ continents[series]];
      }
  }
  else if( typeof series === 'object'){
  	  var tmp = [];
  	  if(series[2])
  	     tmp.push(continents[2]);
  	  if(series[1])
  	     tmp.push(continents[1]);
  	  if(series[0])
  	     tmp.push(continents[0]);
  	  continents = tmp;
  }
      

var color = d3.scale.ordinal()
    .range(colors);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);
    	
var xGrid = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5)
    .tickSize(-h, 0, 0)
    .tickFormat("");
    
var yGrid = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-w, 0, 0)
    .tickFormat("");

var svg = d3.select(s).append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.attendee); });    

d3.tsv("data_02.tsv", function(error, data) {

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  color.domain(d3.keys(data[0]).filter(function(key) { 
    return key !== "date"; 
  }));

  var continents = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
          return {date: d.date, attendee: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([
    d3.min(continents, function(c) { 
	   return d3.min(c.values, function(v) { return v.attendee; }); 
	}),
    d3.max(continents, function(c) { 
	   return d3.max(c.values, function(v) { return v.attendee; }); 
	})
  ]);



  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  
  svg.append("g")         
      .attr("class", "grid")
      .attr("transform", "translate(0," + h + ")")
      .call(xGrid);
        
  svg.append("g")         
      .attr("class", "grid")
      .call(yGrid);

  var continent = svg.selectAll(".continent")
      .data(continents)
      .enter().append("g")
      .attr("class", "continent");
 
   continent.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", w - 18)
      .attr("y", 4)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color);

  legend.append("text")
      .attr("x", w - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


});

var labels = svg.append("g")
       .attr("class","labels");
     
  labels.append("text")
      .attr("transform", "translate(0," + h + ")")
      .attr("x", (w-margin.right))
      .attr("dx", "-1.0em")  
      .attr("dy", "2.0em")
      .text("[Months]");
  labels.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Attendees");
   
  var title = svg.append("g")
         .attr("class","title");

  title.append("text")
      .attr("x", (w / 2))             
      .attr("y", -30 )
      .attr("text-anchor", "middle")  
      .style("font-size", "22px") 
      .text("A multiseries line chart"); 
  }