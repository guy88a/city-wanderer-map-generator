# Optional development checks

The editor itself has no dependencies. Its normal checks run from the project root with `npm run check` and `npm test`.

For the DOM/native-canvas integration harness, install the optional test dependencies in this directory:

```sh
cd tools
npm install
node test-editor.mjs
```

This runs the shipped app against JSDOM with a native canvas, exercises placement, selection, state changes, erase/delete, undo/redo, ground incompatibility warnings, full/half scale, JSON imports and PNG exports, and writes temporary render output under `test-output/`. It does not simulate browser layout, accessibility or pointer capture behavior.

`build-pavement-profiles.py` rebuilds occupancy data for registered ground artwork. It needs Python 3 with Pillow, NumPy and SciPy, plus Node.js to read the ground catalog. Review changed profiles and slots visually before shipping them.
