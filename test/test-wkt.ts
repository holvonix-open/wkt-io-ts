import { assert } from 'chai';
import * as lib from '../src/';
import * as fuzz from 'io-ts-fuzzer';
import * as t from 'io-ts';
import * as geojson from '@holvonix-open/geojson-io-ts';
import {
  createCoreRegistry,
  loadIoTsTypesFuzzers,
  fuzzContext,
  ConcreteFuzzer,
  ImmediateConcreteFuzzer,
  concreteFuzzerByName,
  Fuzzer,
} from 'io-ts-fuzzer';
import { isRight, isLeft } from 'fp-ts/lib/Either';
import { nonEmptyArray, NonEmptyArrayC } from 'io-ts-types/lib/nonEmptyArray';
import { NonEmptyArray, cons } from 'fp-ts/lib/NonEmptyArray';

const fuzzNonEmptyArray = <T>(
  c: t.Type<T, unknown>
): Fuzzer<NonEmptyArray<T>, unknown> => ({
  id: `NonEmptyArray<${c.name}>`,
  idType: 'name',
  impl: {
    type: 'fuzzer',
    children: [c, t.array(c)],
    func: (ctx, n0, hc, ha) => {
      return cons(hc.encode([n0, ctx]) as T, ha.encode([n0, ctx]) as T[]);
    },
  },
});

const coordFuzzers = [
  fuzzNonEmptyArray(geojson.PositionIO),
  fuzzNonEmptyArray(nonEmptyArray(geojson.PositionIO)),
];

describe('wkt', () => {
  const fuzzCtx = fuzzContext({ maxRecursionHint: 10 });
  describe('DirectGeometryFromWKTString', () => {
    it('rejects GeometryCollections', () => {
      const wkts = [
        `GEOMETRYCOLLECTION (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
      ];
      for (const x of wkts) {
        const d = lib.DirectGeometryFromWKTString.decode(x);
        assert.ok(isLeft(d));
      }
    });
    it('rejects malformed', () => {
      const wkts = [
        `/ (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
        `(POINT (90 -10)`,
        `POINT (90 -10`,
        `POINT. (90 -10)`,
        `POINT [90 -10]`,
        `POINT (90)`,
        `PONT (90 -10)`,
      ];
      for (const x of wkts) {
        const d = lib.DirectGeometryFromWKTString.decode(x);
        if (isRight(d)) {
          assert.deepStrictEqual(d.right, {}, x);
        }
      }
    });
    describe('fuzzing', async () => {
      const fuzzCount = 333;
      const r = createCoreRegistry();
      r.register(...(coordFuzzers as Fuzzer[]));
      it('GeoJSONs gives convertible WKTs', () => {
        const gen = r.exampleGenerator(geojson.DirectGeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]);
          const gjd = geojson.DirectGeometryObjectIO.decode(gju);
          if (!isRight(gjd)) {
            throw new Error();
          }
          lib.DirectGeometryFromWKTString.encode(gjd.right);
        }
      });

      it('GeoJSONs gives convertible WKTs that can be decoded back into GeoJSON', () => {
        const gen = r.exampleGenerator(geojson.DirectGeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]);
          const gjd = geojson.DirectGeometryObjectIO.decode(gju);
          if (!isRight(gjd)) {
            throw new Error();
          }
          const x = lib.DirectGeometryFromWKTString.encode(gjd.right);
          const expected = { ...gjd.right };

          // tslint:disable-next-line:no-any
          delete (expected as any)['___0000_extra_'];
          delete expected.bbox;

          const d = lib.DirectGeometryFromWKTString.decode(x);
          if (!isRight(d)) {
            assert.deepStrictEqual(
              {},
              gjd.right,
              'could not decode the WKT: ' + x
            );
            throw new Error();
          }
          assert.deepStrictEqual(d.right, expected);
        }
      });
    });
  });

  describe('GeometryFromWKTString', () => {
    it('accepts GeometryCollections', () => {
      const wkts = [
        `GEOMETRYCOLLECTION (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
      ];
      for (const x of wkts) {
        const d = lib.GeometryFromWKTString.decode(x);
        assert.ok(isRight(d));
      }
    });
    it('rejects malformed', () => {
      const wkts = [
        `/ (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
        `(POINT (90 -10)`,
        `POINT (90 -10`,
        `POINT. (90 -10)`,
        `POINT [90 -10]`,
        `POINT (90)`,
        `PONT (90 -10)`,
      ];
      for (const x of wkts) {
        const d = lib.GeometryFromWKTString.decode(x);
        if (isRight(d)) {
          assert.deepStrictEqual(d.right, {}, x);
        }
      }
    });
    describe('fuzzing', async () => {
      const fuzzCount = 333;
      const r = createCoreRegistry();
      r.register(...(coordFuzzers as Fuzzer[]));
      it('GeoJSONs gives convertible WKTs', () => {
        const gen = r.exampleGenerator(geojson.GeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]);
          const gjd = geojson.GeometryObjectIO.decode(gju);
          if (!isRight(gjd)) {
            throw new Error();
          }
          lib.GeometryFromWKTString.encode(gjd.right);
        }
      });

      it('GeoJSONs gives convertible WKTs that can be decoded back into GeoJSON', () => {
        const gen = r.exampleGenerator(geojson.GeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]);
          const gjd = geojson.GeometryObjectIO.decode(gju);
          if (!isRight(gjd)) {
            throw new Error();
          }
          const x = lib.GeometryFromWKTString.encode(gjd.right);
          const expected = { ...gjd.right };

          // tslint:disable-next-line:no-any
          delete (expected as any)['___0000_extra_'];
          delete expected.bbox;
          if (expected.type === 'GeometryCollection') {
            expected.geometries.forEach(x => {
              // tslint:disable-next-line:no-any
              delete (x as any)['___0000_extra_'];
              delete x.bbox;
            });
          }

          const d = lib.GeometryFromWKTString.decode(x);
          if (!isRight(d)) {
            assert.deepStrictEqual(
              {},
              gjd.right,
              'could not decode the WKT: ' + x
            );
            throw new Error();
          }
          assert.deepStrictEqual(d.right, expected);
        }
      });
    });
  });

  describe('WKTStringFromGeometry', () => {
    it('rejects malformed', () => {
      const wkts = [
        `/ (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
        `(POINT (90 -10)`,
        `POINT (90 -10`,
        `POINT. (90 -10)`,
        `POINT [90 -10]`,
        `POINT (90)`,
        `PONT (90 -10)`,
      ];
      for (const x of wkts) {
        const d = lib.WKTStringFromGeometry.decode(x);
        if (isRight(d)) {
          assert.deepStrictEqual(d.right, {}, x);
        }
      }
    });
    describe('fuzzing', async () => {
      const fuzzCount = 333;
      const r = createCoreRegistry();
      r.register(...(coordFuzzers as Fuzzer[]));

      it('GeoJSONs gives decodable WKTs', () => {
        const gen = r.exampleGenerator(geojson.GeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]);
          const d = lib.WKTStringFromGeometry.decode(gju);
          if (!isRight(d)) {
            assert.deepStrictEqual({}, gju, 'could not decode the WKT');
            throw new Error();
          }
        }
      });

      it('GeoJSONs gives decodable WKTs that can be encoded back to the same', () => {
        const gen = r.exampleGenerator(geojson.GeometryObjectIO);
        for (const i of new Array(fuzzCount).keys()) {
          const gju = gen.encode([i, fuzzCtx]) as geojson.GeometryObject;
          const d = lib.WKTStringFromGeometry.decode(gju);
          if (!isRight(d)) {
            throw new Error();
          }
          // tslint:disable-next-line:no-any
          delete (gju as any)['___0000_extra_'];
          delete gju.bbox;
          if (gju.type === 'GeometryCollection') {
            gju.geometries.forEach(x => {
              // tslint:disable-next-line:no-any
              delete (x as any)['___0000_extra_'];
              delete x.bbox;
            });
          }
          assert.deepStrictEqual(
            lib.WKTStringFromGeometry.encode(d.right),
            gju
          );
        }
      });
    });
  });

  describe('WKT', () => {
    it('accepts GeometryCollections', () => {
      const wkts = [
        `GEOMETRYCOLLECTION (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
      ];
      for (const x of wkts) {
        const d = lib.WKT.decode(x);
        assert.ok(isRight(d));
      }
    });
    it('rejects malformed', () => {
      const wkts = [
        `/ (POINT (90 -10), LINESTRING (60 10, 20 20, 10 40.23), POLYGON ((4 140, 24.2 45, 65 -30, 4 140)))`,
        `(POINT (90 -10)`,
        `POINT (90 -10`,
        `POINT. (90 -10)`,
        `POINT [90 -10]`,
        `POINT (90)`,
        `PONT (90 -10)`,
      ];
      for (const x of wkts) {
        const d = lib.WKT.decode(x);
        if (isRight(d)) {
          assert.deepStrictEqual(d.right, {}, x);
        }
      }
    });
  });
});
