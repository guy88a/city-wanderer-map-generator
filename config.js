// Edit this file, add images to assets/, then refresh the browser.
// Map keys can be any nonempty strings. null means an empty cell.
export const TILE_SIZE = { width: 512, height: 256 }; // LOGICAL grid, excludes bleed

export const ASSETS = {
  P: 'pavement.png',
  G: 'grass.png',
  R: 'road.png',
  RL: 'road_left.png',
  RR: 'road_right.png',
  RB: 'road_b.png',
  RLB: 'road_left_b.png',
  RRB: 'road_right_b.png',
  RCA: 'road_corner_a.png',
  RCB: 'road_corner_b.png',
  RCC: 'road_corner_c.png',
  RCD: 'road_corner_d.png',
  // Explicit metadata is optional for our symmetric ground tiles:
  // X: { file: 'custom.png', label: 'Custom', logicalWidth: 512,
  //      logicalHeight: 256, bleed: 1 },
  // Runtime 258x130 images can also be mixed with 514x258 source images.
  // Their logical size and bleed are detected; both occupy one grid cell.
};

// Columns run down-right; rows run down-left.
export const MAP = [
  ['P', 'P', 'P', 'P', 'P'],
  ['P', 'P', 'P', 'P', 'P'],
  ['R', 'R', 'R', 'R', 'R'],
  ['G', 'G', 'G', 'G', 'G'],
  ['G', 'G', 'G', 'G', 'G'],
];
