import fs from 'fs';
import {feature} from 'topojson-client';
import {geoNaturalEarth1, geoPath, geoInterpolate} from 'd3-geo';
const topo=JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json'));
const land=feature(topo,topo.objects.land);
// drop Antarctica
land.features=land.features.map(f=>{ if(f.geometry.type==='MultiPolygon'){f.geometry.coordinates=f.geometry.coordinates.filter(poly=>poly[0].every(([x,y])=>y>-58));} return f;});
const W=1000,H=470;
const proj=geoNaturalEarth1().rotate([-150,0]).fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'});
// crop vertically: shift to remove south
const path=geoPath(proj);
const d=path(land);
const cities=[['London',-0.13,51.5],['Edinburgh',-3.19,55.95],['Paris',2.35,48.86],['Frankfurt',8.68,50.11],['Amsterdam',4.9,52.37],['Geneva',6.14,46.2],['Zurich',8.54,47.37],['Stockholm',18.07,59.33],['Liechtenstein',9.52,47.14],['New York',-74,40.71],['Boston',-71.06,42.36],['Chicago',-87.63,41.88],['San Francisco',-122.42,37.77],['Salt Lake City',-111.89,40.76],['Toronto',-79.38,43.65],['Hong Kong',114.17,22.32],['Singapore',103.82,1.35],['Sydney',151.21,-33.87],['Melbourne',144.96,-37.81]];
const tokyo=[139.69,35.69];
const pts=cities.map(([n,lo,la])=>{const [x,y]=proj([lo,la]);return {n,x:+x.toFixed(1),y:+y.toFixed(1)}});
const [tx,ty]=proj(tokyo);
// arcs from Tokyo to region hubs, drawn as quadratic curves in screen space
const hubs={NA:[-90,42],EU:[4,50],AS:[110,12],AU:[148,-35]};
function arc(to){const [x2,y2]=proj(to);const mx=(tx+x2)/2,my=(ty+y2)/2-Math.min(120,Math.hypot(x2-tx,y2-ty)*0.28);return `M${tx.toFixed(1)},${ty.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;}
// NA is east across pacific from Tokyo in this rotation? compute
const out={d,W,H,pts,tokyo:[+tx.toFixed(1),+ty.toFixed(1)],arcs:Object.fromEntries(Object.entries(hubs).map(([k,v])=>[k,arc(v)])),hubpos:Object.fromEntries(Object.entries(hubs).map(([k,v])=>[k,proj(v).map(n=>+n.toFixed(1))]))};
fs.writeFileSync('map.json',JSON.stringify(out));
console.log(out.tokyo,out.hubpos, d.length);
