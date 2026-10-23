# Prop overlay data and placement

`props.js` is the tile-prop placement component. It resolves predefined tile-local slots against ground and crossing context, selects the facing variant, validates the base footprint, and supplies ground anchors and depth ordering to the canvas renderer. Placement is individual; arrangements can later produce the same instance records.

## Coordinates and scale

Tile-local `u` runs NW → SE; `v` runs NE → SW. Both run from 0 to 1 across an 8 m logical tile. With tile center `(cx, cy)`:

```js
x = cx + (u - v) * tileWidth / 2;
y = cy + (u + v - 1) * tileHeight / 2;
```

Reference props use the approved **512 × 256** logical ground scale and **40 vertical pixels per metre**. Runtime files and anchors are half-size. At another logical scale, all sprite dimensions and anchor offsets are multiplied by `tileWidth / 512`. The ground diamond's canvas width is not a prop's physical height calibration.

`prop-catalog.js` records the body canvas and ground anchor for each facing. Draw the body and chosen light overlay in the same rectangle; do not center either sprite on the footprint. Render prop groups back to front by the ground-contact `y`, then `x`, then stable ID. Guides and warnings are excluded from PNG export. Buildings and actors are outside this version's render stack.

## Instance example

```json
{
  "id": "prop-1",
  "family": "vehicle",
  "row": 1,
  "col": 3,
  "slotId": "ne-45-500",
  "u": 0.5,
  "v": 0.045,
  "side": "ne",
  "facing": "se",
  "state": "green"
}
```

The slot ID and its exact recorded coordinates are validated together. A one-way sign also records `travel`, independent of the plate's `facing`. Rear traffic views preserve `state`. The body and its overlay do not create separate instances or independent history entries.

## Pavement profiles and footprints

`tile-profiles.js` contains 128 × 128 occupancy profiles derived from the supplied ground artwork. Rows are `v`, columns are `u`, encoded four most-significant-first bits per hex digit. The extraction closes paving seams and removes thin road paint; it is a curated compatibility aid for this shipped artwork, not a general pavement detector for arbitrary uploads.

`SLOTS` defines fixed candidate positions along tile edges. The resolver filters them by pavement occupancy, a conservative square base footprint, 0.08 m curb clearance, crossing compatibility and nearby prop footprints. It removes crowded duplicate candidates. Base-radius presets are editable in `PROP_FAMILIES`; these are conservative editor settings, rather than measurements from a 3D model. Larger pole heads and overhead arms may project over asphalt; their ground bases must fit on pavement.

Streetlight facing follows the nearest road surface. Overhead facing also ensures the arm reaches toward the road. Compact signals and signs default to the corresponding road approach and can use an explicit approach. Pedestrian signals only use the designated positions beside correctly matched crossings. Four-lane crossings validate the neighboring half as well.

Ground and marking changes do not rewrite existing instance coordinates or facings. Compatibility warnings are computed from current context. An unknown/custom ground tile has no approved profile until one is added, so prop placement is disabled there.

## Extend the catalog

1. Add body artwork for each available facing under both scale folders. Keep stable descriptive filenames. Record canvas size and ground anchor in `PROP_VARIANTS`.
2. Add any transparent state overlays on the same canvas, aligned with the body. Keep state names in `PROP_FAMILIES`. Rear views need no visible overlay.
3. For a new family, define its footprint radius and placement/facing rules in `props.js`.
4. For a new ground shape, add and visually review a pavement profile. The rebuild script under `tools/` regenerates profiles for the registered ground images and needs Python, Pillow, NumPy and SciPy. Rebuilding profiles should be reviewed against the artwork before use.
5. Add meaningful compatibility and import/export tests. The existing image-geometry validation for ground diamonds does not apply to tall prop canvases.

One-way front variants must declare `visibleArrow`; missing front arrows must remain unavailable. Rear artwork has no visible arrow and supports both hidden directions along the sign's axis. Do not mirror text or infer a front opposite-arrow image from a rear sprite.

## Current limits

There are no automatic traffic cycles, arrangement presets, lane routing, building occlusion or ground light pools in this version. Streetlight emission is already painted in the supplied sprite. Footprint validation covers bases and curb clearance, not every possible overlap between tall poles or overhead arms.
