# City Wonderer — local map tester

A small dependency-free HTML/JavaScript ground-tile tester. Includes the current pavement, grass v02 and road draft. No build step, account or hosting required.

## Run

Extract the ZIP, open this folder in a terminal and run:

```sh
npm start
```

Open **http://localhost:5173**. No `npm install` is needed. Requires Node.js 18 or newer.

Alternatively, use VS Code Live Server, or run `python -m http.server 5173` from this folder. Use an HTTP server: double-clicking `index.html` will not reliably load JavaScript modules.

## The two things to edit

**1. Put images in `assets/` and register a key in `config.js`:**

```js
export const ASSETS = {
  P: 'pavement.png',
  G: 'grass.png',
  R: 'road.png',
  X: 'another-tile.png',
};
```

Every registry entry loads automatically and appears in the palette. No changes to rendering code are needed. The folder is not automatically scanned; add one registry entry per asset. Nested filenames such as `roads/straight.png` also work. Refresh after editing files.

**2. Use those keys in the rectangular 2D map array:**

```js
export const MAP = [
  ['P', 'P', 'P'],
  ['R', 'R', 'R'],
  ['G', 'G', null],
];
```

`null` means an empty cell. Columns run down-right on screen; rows run down-left. The road's travel axis follows columns. Missing assets are reported and marked on the map.

## Bleed and placement

Grid spacing uses the **logical diamond size**, never padded image dimensions. `TILE_SIZE` defaults to 512×256. Set it to 256×128 if you want runtime-sized placement. The zoom percentage is relative to this chosen logical size.

The loader detects a 2:1 diamond with symmetric padding:

| Image size | Logical footprint | Bleed on each side |
|---|---|---|
| 512×256 | 512×256 | 0 px |
| 514×258 | 512×256 | 1 px |
| 256×128 | 256×128 | 0 px |
| 258×130 | 256×128 | 1 px |

Source and runtime images can be mixed: each is scaled to the chosen logical grid size. Source 1px bleed and runtime 1px bleed scale differently, as expected.

All supplied sprites have centered anchors. A padded 514×258 tile on a 512×256 grid is drawn 1px beyond the logical box on each side. Neighbor centers remain displaced by (±256, ±128). A 5×5 map exports to 2562×1282 with the included 1px source bleed.

For a custom ground asset, specify metadata if needed:

```js
X: {
  file: 'another-tile.png',
  label: 'Alternate pavement',
  logicalWidth: 512,
  logicalHeight: 256,
  bleed: 1,
},
```

The image must then be 514×258. Metadata and dimensions are validated; incorrect files display a useful error. Automatic inference permits 0–4px symmetric bleed. This version handles flat ground diamonds, not tall building sprites or asymmetric padding.

The tester uses Canvas 2D, not Phaser/WebGL. It helps evaluate composition, source/runtime appearance, texture joins and alpha overlaps. Final Phaser sampling and camera behavior still need testing in the game.

## Controls

- Select an asset and drag to paint. Choose Erase for empty cells.
- Space + drag or middle mouse button: pan. Mouse wheel: zoom around cursor.
- Fit: frame the complete map. `1`–`9`: select assets; `0`: erase.
- Ctrl/Cmd+Z: undo; Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y: redo.
- Grid and cell-label guides are optional. Toggle smoothing to compare filtering; checker mode reveals transparent gaps.
- Resize preserves existing cells, including empty cells, and fills new cells with the selected brush.
- Edit the JSON array in the sidebar, then Apply. JSON requires double quotes.
- Copy/Export JSON preserves the current map array. Paste it back into the editor, or into `MAP` in `config.js`.
- Export PNG creates a transparent composition without the grid, labels, hover marker or interface. Bleed is preserved around outer edges. Very large maps are scaled down to a maximum 8192px edge / 32 megapixels, with the result reported.

Edits are held in browser memory. Export or copy the map before refreshing. The tester does not modify files on disk.

## Files

- `config.js`: asset registry, logical tile size and starting map.
- `app.js`: loading, painting, drawing, navigation and export.
- `geometry.js`: centered isometric geometry, padding metadata and map validation.
- `index.html`, `style.css`: interface.
- `server.mjs`: small localhost static server.
- `assets/`: the three source-bleed PNGs.

## Verification

JavaScript syntax, included PNG dimensions, registry paths, map keys, center coordinates, inverse cell picking, mixed source/runtime bleed metadata and invalid-map handling were checked.
Interactive browser QA was unavailable in the build environment. The app has not been verified in a live browser here.
