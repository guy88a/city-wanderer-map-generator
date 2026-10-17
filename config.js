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
  RTA: 'road_t_a.png',
  RTB: 'road_t_b.png',
  RTC: 'road_t_c.png',
  RTD: 'road_t_d.png',
  RC: 'road_cross.png',
  RDEA: 'road_dead_end_a.png',
  RDEB: 'road_dead_end_b.png',
  RDEC: 'road_dead_end_c.png',
  RDED: 'road_dead_end_d.png',
  MTEA: 'main_side_t_entry_a.png',
  MTFA: 'main_side_t_far_a.png',
  MTEB: 'main_side_t_entry_b.png',
  MTFB: 'main_side_t_far_b.png',
  MTEC: 'main_side_t_entry_c.png',
  MTFC: 'main_side_t_far_c.png',
  MTED: 'main_side_t_entry_d.png',
  MTFD: 'main_side_t_far_d.png',
  // Explicit metadata is optional for our symmetric ground tiles:
  // X: { file: 'custom.png', label: 'Custom', logicalWidth: 512,
  //      logicalHeight: 256, bleed: 1 },
  // Runtime 258x130 images can also be mixed with 514x258 source images.
  // Their logical size and bleed are detected; both occupy one grid cell.
};

// Columns run down-right; rows run down-left.
export const MAP = [
  [
    "P",
    "RB",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P",
    "P"
  ],
  [
    "P",
    "RTB",
    "R",
    "RTC",
    "R",
    "R",
    "R",
    "R",
    "RTC",
    "R"
  ],
  [
    "P",
    "RB",
    "G",
    "RB",
    "P",
    "P",
    "P",
    "P",
    "RB",
    "P"
  ],
  [
    "RDEC",
    "RTA",
    "R",
    "RC",
    "R",
    "RTC",
    "RCD",
    "RCC",
    "RTA",
    "RCD"
  ],
  [
    "P",
    "P",
    "P",
    "RB",
    "P",
    "RCB",
    "RCA",
    "RCB",
    "R",
    "RCA"
  ],
  [
    "RR",
    "RR",
    "RR",
    "MTEA",
    "MTFD",
    "RR",
    "RR",
    "RR",
    "RR",
    "RR"
  ],
  [
    "RL",
    "RL",
    "RL",
    "MTED",
    "RL",
    "RL",
    "RL",
    "RL",
    "RL",
    "RL"
  ],
  [
    "G",
    "G",
    "G",
    "RB",
    "G",
    "G",
    "G",
    "G",
    "G",
    "G"
  ],
  [
    "G",
    "G",
    "RDEC",
    "RC",
    "RDEA",
    "G",
    "G",
    "G",
    "G",
    "G"
  ],
  [
    "G",
    "G",
    "G",
    "RDEB",
    "G",
    "G",
    "G",
    "G",
    "G",
    "G"
  ]
];
