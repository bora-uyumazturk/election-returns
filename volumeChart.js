function volumeChart(data, width, height, offset_x, offset_y) {
  var results = _.filter(data, {'state':'Georgia (EV: 16)'});
  console.log(results);
  var time_votes = results.map( x => {
    return {
      'time': new Date(x.timestamp),
      'votes': x.new_votes
    };
  });

  console.log(time_votes);

  time_votes = _.chain(time_votes)
    .filter((x) => {return x.votes > 0;})
    .sortBy((x) => {return x.time})
    .value();

  var cum_votes = 0;
  for (const elem of time_votes) {
    cum_votes += parseInt(elem.votes);
    elem.cum_votes = cum_votes;
  }

  var timeScale = d3.scaleTime()
    .domain(d3.extent(time_votes.map(x => {return x.time})))
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain(d3.extent(time_votes.map(x => {return x.cum_votes})))
    .range([height, 0]);

  console.log(time_votes);

  var g = d3.select("svg")
    .append("g")
    .attr("transform", `translate(${offset_x}, ${offset_y})`);

  var lineGenerator = d3.line()
    .x((d, i) => {return timeScale(d.time);})
    .y((d, i) => {return yScale(d.cum_votes);})
    .curve(d3.curveStepAfter);

  g.append("path")
    .attr('d', lineGenerator(time_votes))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5);

  var axis = d3.axisBottom(timeScale);

  g.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(axis);
}
