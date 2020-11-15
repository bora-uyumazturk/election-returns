const map_dest = 'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson';
const csv_dest = 'https://raw.githubusercontent.com/alex/nyt-2020-election-scraper/master/battleground-state-changes.csv';
// const results_json = 'https://raw.githubusercontent.com/alex/nyt-2020-election-scraper/master/results.json';
const offset_x = 50;
const offset_y = 50;
const width = 500;
const height = 500;
const axis_height = 350;
const axis_width = 750;

// initialize tooltip
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function handleMouseover(event, d) {
  d3.select(this)
    .attr('fill', 'orange');

  tooltip.style("opacity", 0.9);

  tooltip.text(d.properties.Name)
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY - 28) + "px");
}

function handleMouseout(d, i) {
  d3.select(this).attr('fill', 'lightblue');

  tooltip.style("opacity", 0);
}

function createMap(geojson) {

  // reverse geojson to remedy winding issue
  // https://stackoverflow.com/questions/49311001/d3-js-osm-geojson-black-rectangle
  var fixed = geojson.features.map(
    feature => {
      return turf.rewind(feature, {reverse:true})
    }
  );

  // scale and translate to fit container
  var projection = d3.geoEquirectangular()
    .fitExtent([[offset_x, offset_y], [width - offset_x, height - offset_y]],
      {"type": "FeatureCollection",
       "features": fixed}
    );

  var geoGenerator = d3.geoPath()
    .projection(projection);

  d3.select('svg')
    .attr('height', height + 2*axis_height)
    .attr('width', axis_width)
    .append('g')
    .attr('transform', `translate(${offset_x}, ${offset_y})`);

  d3.select('g')
    .selectAll('path')
    .data(fixed)
    .enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('fill', 'lightblue')
    .on('mouseover', handleMouseover)
    .on('mouseout', handleMouseout);
}

function addData(data) {
  volumeChart(data, axis_width, axis_height, offset_x, height + offset_y);
}

d3.json(map_dest)
  .then(geojson => createMap(geojson))
  .then(() => d3.csv(csv_dest))
  .then((data) => addData(data));
