# City Wonderer — Map Studio v3

Your uploaded tester, reorganized and upgraded. The default is your original 10×10 city, migrated to descriptive keys. All 53 supplied PNGs are preserved byte-for-byte under new paths. The palette contains 41 ground items and six crossing overlays; logical and padded crossing copies share one palette item.

## Start

Extract the ZIP, open the project folder in a terminal and run:

```sh
npm start
```

Open http://localhost:5173. Node.js 18+ is sufficient; **no npm install or build step is needed**. VS Code Live Server or `python -m http.server 5173` also work. Open through HTTP, rather than double-clicking index.html.

## Layout and painting

- **Bottom asset tray:** choose Ground or Overlay, browse the folder tree, then select a thumbnail. Hide the tray to give the canvas more height. It starts collapsed on short landscape screens and respects your explicit show/hide choice.
- **Ground tiles:** Ground, Roads → 2 lanes / 4 lanes, and Road markings → 2 lanes / 4 lanes. Road markings appear on the Overlay layer.
- **Props / Buildings:** reserved catalog folders. Object placement, tall sprites and free-position props are future work; no speculative building subdivisions are added.
- **Search:** matches the active layer's labels, new keys, filenames and old IDs such as RCA or MCTFA1. It searches all folders on that layer. Clear search to restore folder expansion.
- **Thumbnail details:** hover or keyboard focus shows a tooltip. Selecting a thumbnail also shows its name, key, filename, category and geometry on the right of the tray. On narrow phones the selected details appear beneath the grid; no labels are permanently attached to thumbnails.
- **Map settings:** opens the array, dimensions, saving and loading controls. It is an optional side panel rather than a permanent sidebar.

Drag to paint. Space+drag or middle-drag pans; wheel zooms. Fit frames the map. Keys 1–9 select from the displayed thumbnail grid; 0 selects Erase. Erase only affects the active layer. Ground and Overlay retain independent brushes and independent undo/redo histories. Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z operate on the active layer. A drag stroke is one history item.

Both layers remain string-or-null 2D arrays. Ground renders completely before Overlay. Each cell supports one ground asset and one overlay in this update.

## Map arrays, dimensions and samples

`config.js` holds the default MAP, OVERLAYS and TILE_SIZE. The default is your migrated 10×10 map; **Samples → Crossings** is a separate 11×11 demonstration containing all six crossing overlays. A dirty-scene prompt protects unsaved changes when replacing the scene. Your configured city remains available as an immutable sample.

Map settings displays the active layer's array. Copy copies just that array. Apply validates names, layer assignment and dimensions before changing anything. Ground array dimensions may change the shared grid; Overlay dimensions must match it.

Resize preserves cells still in bounds. New ground cells use the ground brush; new overlay cells are empty. Shrinking asks before cropping occupied cells. Resize and full-scene replacement start fresh histories for both layers because their array shapes may have changed. The result message explains the history reset. Same-size array application remains undoable on its layer.

## Separate exports and imports

Choose an **Export target**: Full scene, Ground only, or Overlay only.

| Export | JSON | PNG |
| --- | --- | --- |
| Full scene | Version, logical tile size, both arrays and complete catalog | Both layers, no guides |
| Ground only | Ground 2D array | Ground only, no guides |
| Overlay only | Overlay 2D array | Paint over transparency, no ground or guides |

PNG targets are explicit: a full-scene PNG includes overlays even if the workspace Overlays checkbox is off. Large PNGs retain the 8192 px / 32 MP export limits. Full scene JSON marks the current scene saved; PNGs and individual-layer arrays do not replace a complete scene backup.

Import target chooses a scene/legacy map, a Ground array or an Overlay array. Known old keys and filenames migrate automatically. A bare legacy 2D map defaults to Ground for scene import. Full scenes preserve their valid logical tile size. Invalid keys, layer mismatches, bad dimensions or failed new image loads are reported before the scene is replaced. Unknown references are not guessed or dropped.

Image data is not embedded in JSON: keep the corresponding files in assets/. Imported custom registrations remain available for the session and future scene/asset-list exports. Export asset list downloads the complete catalog separately. The editor does not silently write config.js or catalog.js back to disk. Ready-to-import full-scene examples are in examples/.

## Asset registration

Put image files in assets/, then click **+ Asset**. Provide relative filename, key, display name, layer and category. A key is suggested from the filename. Duplicate or legacy-reserved keys are rejected. Optional logical width/height/bleed overrides are available in the form. The image must successfully load and pass geometry validation before it is registered.

For permanent configuration, edit `catalog.js`. Strings still work for simple ground registration; descriptors supply labels, layer and category:

```js
export const ASSETS = {
  // ...existing entries...
  my_road: {
    file: 'ground/roads/2lane/my_road.png',
    label: 'My road',
    category: 'ground/roads/2lane',
    layer: 'ground',
  },
};
```

Nested relative paths are supported. Filenames must remain under assets/. The folder is not scanned automatically. For this update, supported ground and overlay images remain 2:1 logical diamonds with symmetric bleed; tall buildings and free-position object anchors are deliberately not implemented yet.

## Directions, names and crossings

Directions are **screen-relative tile edges**, not the game's north: NW is top-left, NE top-right, SE bottom-right and SW bottom-left. Straight axes describe vehicle travel. Crossing axes describe the underlying road, not pedestrian travel. T names identify the branch; dead ends identify their open entrance. Four-lane halves name their outside sidewalk edge.

`grass.png` and `road.png` keep their filenames. The road key `road` is the intentional naming exception and travels NW–SE. `ASSET_NAMES.md` is the readable old-to-new filename table. `asset-rename-map.json` records every old key, old path, new path, display label and original hash. Shared four-lane junction entry pieces are named by sidewalk corner; far pieces by sidewalk side and divider-stub end. This preserves their reuse across different junction assemblies.

| Crossing key | Ground key underneath |
| --- | --- |
| crosswalk_2lane_nw_se | road |
| crosswalk_2lane_ne_sw | road_2lane_straight_ne_sw |
| crosswalk_4lane_nw_se_half_ne | road_4lane_straight_nw_se_sidewalk_ne |
| crosswalk_4lane_nw_se_half_sw | road_4lane_straight_nw_se_sidewalk_sw |
| crosswalk_4lane_ne_sw_half_nw | road_4lane_straight_ne_sw_sidewalk_nw |
| crosswalk_4lane_ne_sw_half_se | road_4lane_straight_ne_sw_sidewalk_se |

NW–SE main-road pairs use the NE-sidewalk half on the preceding row and the SW-sidewalk half on the following row. Alternate pairs use the NW-sidewalk half in the preceding column and the SE-sidewalk half in the following column. The six padded crossing files are the defaults; `_logical.png` copies remain optional variants.

## Bleed and scale

Logical spacing is 512×256 by default. Source 514×258 and runtime 258×130 files are normalized to that logical grid. Symmetric padding shares the ground tile's center; **centered anchors need no additional offset**. Never use padded dimensions as grid spacing. No image pixels, road widths, camera angle or one-tile footprints were changed during the rename.

## Verification

Run `npm run check` for JavaScript syntax and `npm test` for the included Node model/migration tests. These require no installed dependencies. `validation.json` records the completed image, browser and layout checks. Internal browser tooling is not bundled with this local app.
