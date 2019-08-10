import { GeometryFromWKTString, WKTStringFromGeometry } from 'wkt-io-ts';
import { isRight } from 'fp-ts/lib/Either';

const maybeWkt = 'LINESTRING (29.3 -5, 13 30, 50 32)';
const maybeGJ = GeometryFromWKTString.decode(maybeWkt);
if (!isRight(maybeGJ)) {
  // did not validate as WKT
  throw new Error();
}
// geojson
console.log(maybeGJ.right);

const outWkt = WKTStringFromGeometry.decode(maybeGJ.right);
if (!isRight(outWkt)) {
  // did not validate as GeoJSON
  throw new Error();
}
// wkt
console.log(outWkt.right);
