const map_dest = 'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson'
const offset_x = 50;
const offset_y = 50;
const width = 500;
const height = 500;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function handleMouseover(event, d) {
  d3.select(this)
    .attr('fill', 'orange');

  tooltip.transition()
    .duration(200)
    .style("opacity", 0.9);

  tooltip.text(d.properties.Name)
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY - 28) + "px");
}

function handleMouseout(d, i) {
  d3.select(this).attr('fill', 'lightblue');

  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}

function create_map(geojson) {

  // reverse geojson to remedy winding issue
  var fixed = geojson.features.map(
    feature => {
      return turf.rewind(feature, {reverse:true})
    }
  );

  console.log(fixed);

  // scale and translate to fit container
  var projection = d3.geoEquirectangular()
    .fitExtent([[offset_x, offset_y], [width - offset_x, height - offset_y]],
      {"type": "FeatureCollection",
       "features": fixed}
    );

  var geoGenerator = d3.geoPath()
    .projection(projection);

  d3.select('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g')
    .attr('transform', `translate(${offset_x}, ${offset_y})`);

  d3.select('g')
    .selectAll('path')
    .data(fixed)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('fill', 'lightblue');

  d3.selectAll('path')
    .on('mouseover', handleMouseover)
    .on('mouseout', handleMouseout);
}

d3.json(map_dest)
  .then(geojson => create_map(geojson));
