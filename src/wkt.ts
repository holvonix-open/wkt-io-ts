import * as wkx from 'wkx';
import * as geojson from '@holvonix-open/geojson-io-ts';
import * as t from 'io-ts';
import { either, right, isRight } from 'fp-ts/lib/Either';
import { getRight, isSome } from 'fp-ts/lib/Option';
import { inspect } from 'util';

export interface WKTBrand {
  readonly WKT: unique symbol;
}

function isWKT(s: string) {
  try {
    wkx.Geometry.parse(s);
    return true;
  } catch {
    return false;
  }
}

export const WKT = t.brand(
  t.string,
  (n): n is t.Branded<string, WKTBrand> => isWKT(n),
  'WKT'
);

export type WKT = t.Branded<string, WKTBrand>;

export interface GeometryFromWKTStringC
  extends t.Type<geojson.GeometryObject, WKT, unknown> {}

export interface DirectGeometryFromWKTStringC
  extends t.Type<geojson.DirectGeometryObject, WKT, unknown> {}

export interface WKTStringFromGeometryC
  extends t.Type<WKT, geojson.GeometryObject, unknown> {}

function decodeOrThrow<T, U, V>(c: t.Type<T, U, V>, v: V): T {
  const r = c.decode(v);
  /* istanbul ignore if */
  if (!isRight(r)) {
    console.log(inspect(v));
    console.log(inspect(r));
    throw new Error('unexpected');
  }
  return r.right;
}

// tslint:disable-next-line:variable-name
export const GeometryFromWKTString: GeometryFromWKTStringC = new t.Type<
  geojson.GeometryObject,
  WKT,
  unknown
>(
  'wkt-io-ts:GeometryFromWKTString',
  geojson.GeometryObjectIO.is,
  (inp, ctx) =>
    either.chain(t.string.validate(inp, ctx), str => {
      try {
        const ret = wkx.Geometry.parse(str);
        const json = ret.toGeoJSON();
        return geojson.GeometryObjectIO.validate(json, ctx);
      } catch (err) {
        return t.failure(inp, ctx);
      }
    }),
  geom => decodeOrThrow(WKT, wkx.Geometry.parseGeoJSON(geom).toWkt())
);

// tslint:disable-next-line:variable-name
export const DirectGeometryFromWKTString: DirectGeometryFromWKTStringC = new t.Type<
  geojson.DirectGeometryObject,
  WKT,
  unknown
>(
  'wkt-io-ts:DirectGeometryFromWKTString',
  geojson.DirectGeometryObjectIO.is,
  (inp, ctx) =>
    either.chain(GeometryFromWKTString.validate(inp, ctx), g =>
      geojson.DirectGeometryObjectIO.validate(g, ctx)
    ),
  GeometryFromWKTString.encode
);

// tslint:disable-next-line:variable-name
export const WKTStringFromGeometry: WKTStringFromGeometryC = new t.Type<
  WKT,
  geojson.GeometryObject,
  unknown
>(
  'wkt-io-ts:WKTStringFromGeometry',
  WKT.is,
  (inp, ctx) =>
    either.chain(geojson.GeometryObjectIO.validate(inp, ctx), gj => {
      try {
        const ret = wkx.Geometry.parseGeoJSON(gj).toWkt();
        return WKT.decode(ret);
      } catch (err) {
        /* istanbul ignore next */
        return t.failure(inp, ctx);
      }
    }),
  str =>
    decodeOrThrow(geojson.GeometryObjectIO, wkx.Geometry.parse(str).toGeoJSON())
);
