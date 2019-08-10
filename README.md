# wkt-io-ts - validates, encodes, and decodes between GeoJSON and WKT strings

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/wkt-io-ts.svg)](https://www.npmjs.com/package/wkt-io-ts)
[![Build Status](https://travis-ci.com/holvonix-open/wkt-io-ts.svg?branch=master)](https://travis-ci.com/holvonix-open/wkt-io-ts)
[![GitHub last commit](https://img.shields.io/github/last-commit/holvonix-open/wkt-io-ts.svg)](https://github.com/holvonix-open/wkt-io-ts/commits)
[![codecov](https://codecov.io/gh/holvonix-open/wkt-io-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/holvonix-open/wkt-io-ts)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=holvonix-open/wkt-io-ts)](https://dependabot.com)
[![DeepScan grade](https://deepscan.io/api/teams/4465/projects/6796/branches/58678/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=4465&pid=6796&bid=58678)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Quick Start

After `yarn add wkt-io-ts fp-ts`:

```typescript
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
```

## License

Read the [LICENSE](LICENSE) for details.  
The entire [NOTICE](NOTICE) file serves as the NOTICE that must be included
under Section 4d of the License.

```

# wkt-io-ts

This product contains software originally developed by Holvonix LLC.
Original Repository: https://github.com/holvonix-open/wkt-io-ts

Copyright (c) 2019 Holvonix LLC. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Dependencies may have their own licenses.

```
