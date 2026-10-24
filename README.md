# City Wonderer — Map Studio v4.0.3

The original ground/markings tester, extended with individual street-prop placement. The default remains your unchanged 10 × 10 city. Ground artwork is preserved byte for byte.

## Start

Extract the ZIP, open the `map-studio` folder in a terminal, and run:

```sh
npm start
```

Open **http://localhost:5173**. Node.js 18+ is sufficient; the editor needs no installation or build step. VS Code Live Server or `python -m http.server 5173` also work. Use HTTP rather than double-clicking `index.html`.

## Place a prop

1. Open **Props** in the bottom tray. Choose a traffic light, pedestrian signal, overhead signal, streetlight, stop sign or one-way sign.
2. Click a tile. Available pavement slots appear in green. Move over a slot to preview the object and its footprint, then click to place it.
3. Keep placing individual props, or use **Select** to edit an existing instance. The right-hand inspector also lists every prop on the chosen tile.
4. For traffic signals, choose **off / red / amber / green**, or **off / red / green** for pedestrian signals. Body and state overlay remain one object.
5. Use **Delete selected prop**, the Delete key, or **Erase** to remove a whole instance. Props have their own Undo/Redo history.

The inspector is scrollable. Hide Map settings when you want more canvas space. On narrow screens the inspector appears beneath the asset palette.

Slots determine position, physical scale and facing. Streetlight arms face toward the road; pedestrian signals face across a matching crossing; traffic signals and signs face along the road. Signs and compact traffic signals also offer an explicit approach direction. One-way signs have a separate travel direction. A red slot explains a collision or missing arrow artwork and cannot be used. Text is never mirrored.

Several props can occupy one tile if their footprints do not overlap. Footprint checks use the supplied tile's pavement, the base size, curb clearance and adjacent prop positions. Some tiny corner islands cannot fit larger poles: use a road approach tile with adequate pavement.

Pedestrian signals require the matching crosswalk. For a four-lane crossing, both compatible ground and marking halves must be present before placement.

## Edit the map

**Ground** and **Markings** retain their original tile brushes, drag painting, erasing, search and folder palette. Space + drag or middle-drag pans; wheel zooms; **Fit** includes tall props. Grid, cell labels, markings, props and footprint guides can be toggled independently. Keys 1–9 choose visible palette entries, 0 selects Erase. Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z operate on the active layer.

Ground edits retain existing props. Incompatible objects receive orange footprint warnings; they are not deleted, moved or silently reoriented. Restore the compatible tile, delete the object, or replace it in a valid slot. Ground Undo does not undo a prop edit, and vice versa.

Map settings offers **Full · 512 × 256** and **Half · 256 × 128** logical tile scales. Ground, anchors, prop dimensions and light overlays change together. The half view uses the supplied half-size runtime sprites. Scale selection is a scene setting, separate from layer histories.

Resize preserves in-bounds cells and props. Shrinking asks before cropping occupied cells or props. Resize and scene replacement reset all three layer histories. Ground and Markings use 2D arrays; Props use an instance list. Applying invalid JSON leaves the scene unchanged.

## Samples

- **Your city**: unchanged original 10 × 10 map, initially without props.
- **Crossings**: original separate crossing demonstration.
- **Props · placement test**: separate scene with all 24 family/facing combinations, including pedestrian signals at crossings and state overlays. Also supplied as `examples/props-placement.json`.

The props scene is a rendering/placement test, not a coordinated traffic-control layout. States are edited manually; there is no automatic traffic cycle in this version.

## Save and load

| Target | JSON | PNG |
| --- | --- | --- |
| Full scene | Version 4, tile size, ground, markings, prop instances and ground catalog | All three layers, without guides |
| Ground | Original 2D array | Ground only |
| Markings | Original 2D array | Markings over transparency |
| Props | Instance list, including facing and light state | Props and selected light states over transparency |

PNG exports use the selected target regardless of workspace visibility checkboxes. Scene and props PNGs share map registration and bounds that include full prop canvases. The 8192 px / 32 MP safety limits remain; any downscaling is reported. Only Full scene JSON marks the scene saved. Keep the `assets` folder with exported scenes: JSON contains references, not embedded images.

Import accepts old bare maps and earlier ground/marking scenes, adding an empty prop layer. Props-only imports must fit the current map and use the shipped families and predefined slots. Valid imported props with incompatible ground remain visible and flagged. Malformed references, duplicate identities, unsupported states or out-of-bounds instances are rejected before replacement.

Use **Export ground / markings catalog** for the existing tile registry, and **Export prop catalog** for sprite geometry, anchors, available states, full-size paths and runtime paths. Add Asset still registers ground or marking images. Extending a prop family also requires placement geometry; see `PROPS.md`.

## Included assets

All six prop families have SE, SW, NE and NW artwork: **24 body sprites**. The six front-facing traffic-light bodies have **16 transparent state overlays**. Both `assets/props/source_2x` and `assets/props/runtime` contain the same 40 filenames at their respective scales.

Bodies use the approved original source exports and anchors. Your large painted overlays were reduced with their bodies' original crop/affine/canvas transforms, preserving overlay alpha. `assets/props/export-transforms.json` records those transforms. Large production masters remain in your original asset packages; this tester ships the two rendering scales.

NE/NW rear traffic views retain their logical state but show no illuminated front lens. Streetlights use the already illuminated diffuser artwork; a separate streetlight off-state is not present in the supplied set. One-way front views currently support SE-face/NE-arrow and SW-face/SE-arrow. Their opposite-arrow front art is flagged as missing. Rear views can represent either hidden arrow along the plate axis.

## Validation

```sh
npm run check
npm test
```

The 31 regression tests cover original artwork hashes and map migration, layer histories, slot footprints, crossings, state persistence, missing-art blocking, import validation, collision handling, scale and tall-sprite bounds. A DOM/native-canvas integration harness is included under `tools/`; see `tools/README.md`. It executes the actual editor handlers and renderer. It is not a browser layout or accessibility audit.

## v4.0.1 facing fixes

The anchor-adjacent lamp slots on NW+NE and NW+SW two-lane corners now follow their pavement borders. The right-hand sibling slot for stop and one-way signs keeps the road-facing direction. Two-lane crossroad vehicle signals use N→SE, S→NW, W→NE and E→SW. Slot positions, footprints, artwork and all other automatic facings are unchanged.

Existing scene instances retain their recorded facing, including manual choices. Re-place any affected old props to use the corrected automatic facing.

## v4.0.2 — right-hand traffic on NW/SE pavement borders

Automatic vehicle-light, overhead-light, stop-sign and one-way-sign facing now uses NW border → NE and SE border → SW where these approaches were reversed. NE/SW-border directions, streetlights, pedestrian signals, the explicit four-corner crossroad mapping, slot positions and manual overrides retain their previous behavior. Existing instances keep their saved facing: re-place affected props to use the corrected automatic direction.

## v4.0.3 — straight-road pavement ownership

Straight-road facing now resolves the physical pavement strip from the road profile and slot coordinates. A corner candidate tagged NE can sit on the SE pavement; its candidate-edge tag no longer overrides the sidewalk's traffic direction. This fixes the east-end slot on the two-lane NE–SW straight and four-lane SE-sidewalk half for all four road-prop families. Slot coordinates and saved slot identities are unchanged. Corners, intersections, streetlights, pedestrian signals, explicit approach choices and artwork are preserved.

Re-place affected existing props to use the corrected automatic facing. Overhead-arm artwork still needs separate correction so the arm projects over the road with the desired signal facing; that artwork task is deliberately deferred from this release.
