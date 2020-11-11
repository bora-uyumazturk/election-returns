const map_dest = 'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson'
const offset_x = 50;
const offset_y = 50;
const width = 500;
const height = 500;

function create_map(geojson) {

  // reverse geojson to remedy winding issue
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

  d3.select('body')
    .append('svg')
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
}

d3.json(map_dest).then(geojson => create_map(geojson));
