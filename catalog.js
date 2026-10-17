// Catalog paths are relative to assets/. Ground strings also remain supported.
export const ASSETS = {
  "grass": {
    "label": "Grass",
    "category": "ground/terrain",
    "layer": "ground",
    "file": "ground/terrain/grass.png",
    "legacy_keys": [
      "G"
    ]
  },
  "ground_pavement": {
    "label": "Concrete pavement",
    "category": "ground/terrain",
    "layer": "ground",
    "file": "ground/terrain/ground_pavement.png",
    "legacy_keys": [
      "P"
    ]
  },
  "road": {
    "label": "2-lane straight · NW–SE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road.png",
    "axis": "nw_se",
    "open_edges": [
      "nw",
      "se"
    ],
    "legacy_keys": [
      "R"
    ]
  },
  "road_2lane_straight_ne_sw": {
    "label": "2-lane straight · NE–SW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_straight_ne_sw.png",
    "axis": "ne_sw",
    "open_edges": [
      "ne",
      "sw"
    ],
    "legacy_keys": [
      "RB"
    ]
  },
  "road_2lane_corner_nw_ne": {
    "label": "2-lane corner · NW + NE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_corner_nw_ne.png",
    "open_edges": [
      "nw",
      "ne"
    ],
    "legacy_keys": [
      "RCA"
    ]
  },
  "road_2lane_corner_ne_se": {
    "label": "2-lane corner · NE + SE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_corner_ne_se.png",
    "open_edges": [
      "ne",
      "se"
    ],
    "legacy_keys": [
      "RCB"
    ]
  },
  "road_2lane_corner_se_sw": {
    "label": "2-lane corner · SE + SW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_corner_se_sw.png",
    "open_edges": [
      "se",
      "sw"
    ],
    "legacy_keys": [
      "RCC"
    ]
  },
  "road_2lane_corner_nw_sw": {
    "label": "2-lane corner · NW + SW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_corner_nw_sw.png",
    "open_edges": [
      "nw",
      "sw"
    ],
    "legacy_keys": [
      "RCD"
    ]
  },
  "road_2lane_cross": {
    "label": "2-lane four-way intersection",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_cross.png",
    "open_edges": [
      "nw",
      "ne",
      "se",
      "sw"
    ],
    "legacy_keys": [
      "RC"
    ]
  },
  "road_2lane_dead_end_open_nw": {
    "label": "2-lane dead end · entrance NW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_dead_end_open_nw.png",
    "open_edges": [
      "nw"
    ],
    "legacy_keys": [
      "RDEA"
    ]
  },
  "road_2lane_dead_end_open_ne": {
    "label": "2-lane dead end · entrance NE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_dead_end_open_ne.png",
    "open_edges": [
      "ne"
    ],
    "legacy_keys": [
      "RDEB"
    ]
  },
  "road_2lane_dead_end_open_se": {
    "label": "2-lane dead end · entrance SE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_dead_end_open_se.png",
    "open_edges": [
      "se"
    ],
    "legacy_keys": [
      "RDEC"
    ]
  },
  "road_2lane_dead_end_open_sw": {
    "label": "2-lane dead end · entrance SW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_dead_end_open_sw.png",
    "open_edges": [
      "sw"
    ],
    "legacy_keys": [
      "RDED"
    ]
  },
  "road_2lane_t_branch_ne": {
    "label": "2-lane T · branch NE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_t_branch_ne.png",
    "branch": "ne",
    "open_edges": [
      "nw",
      "ne",
      "se"
    ],
    "legacy_keys": [
      "RTA"
    ]
  },
  "road_2lane_t_branch_se": {
    "label": "2-lane T · branch SE",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_t_branch_se.png",
    "branch": "se",
    "open_edges": [
      "ne",
      "se",
      "sw"
    ],
    "legacy_keys": [
      "RTB"
    ]
  },
  "road_2lane_t_branch_sw": {
    "label": "2-lane T · branch SW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_t_branch_sw.png",
    "branch": "sw",
    "open_edges": [
      "nw",
      "se",
      "sw"
    ],
    "legacy_keys": [
      "RTC"
    ]
  },
  "road_2lane_t_branch_nw": {
    "label": "2-lane T · branch NW",
    "category": "ground/roads/2lane",
    "layer": "ground",
    "file": "ground/roads/2lane/road_2lane_t_branch_nw.png",
    "branch": "nw",
    "open_edges": [
      "nw",
      "ne",
      "sw"
    ],
    "legacy_keys": [
      "RTD"
    ]
  },
  "road_4lane_straight_nw_se_sidewalk_sw": {
    "label": "4-lane straight half · NW–SE · sidewalk SW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_straight_nw_se_sidewalk_sw.png",
    "axis": "nw_se",
    "sidewalk": "sw",
    "legacy_keys": [
      "RL"
    ]
  },
  "road_4lane_straight_nw_se_sidewalk_ne": {
    "label": "4-lane straight half · NW–SE · sidewalk NE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_straight_nw_se_sidewalk_ne.png",
    "axis": "nw_se",
    "sidewalk": "ne",
    "legacy_keys": [
      "RR"
    ]
  },
  "road_4lane_straight_ne_sw_sidewalk_nw": {
    "label": "4-lane straight half · NE–SW · sidewalk NW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_straight_ne_sw_sidewalk_nw.png",
    "axis": "ne_sw",
    "sidewalk": "nw",
    "legacy_keys": [
      "RLB"
    ]
  },
  "road_4lane_straight_ne_sw_sidewalk_se": {
    "label": "4-lane straight half · NE–SW · sidewalk SE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_straight_ne_sw_sidewalk_se.png",
    "axis": "ne_sw",
    "sidewalk": "se",
    "legacy_keys": [
      "RRB"
    ]
  },
  "road_4lane_to_2lane_t_branch_ne_entry": {
    "label": "4↔2-lane T · branch NE · entry half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_ne_entry.png",
    "branch": "ne",
    "part": "entry",
    "legacy_keys": [
      "MTEA"
    ]
  },
  "road_4lane_to_2lane_t_branch_ne_far": {
    "label": "4↔2-lane T · branch NE · far half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_ne_far.png",
    "branch": "ne",
    "part": "far",
    "sidewalk": "sw",
    "legacy_keys": [
      "MTFA"
    ]
  },
  "road_4lane_to_2lane_t_branch_nw_entry": {
    "label": "4↔2-lane T · branch NW · entry half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_nw_entry.png",
    "branch": "nw",
    "part": "entry",
    "legacy_keys": [
      "MTEB"
    ]
  },
  "road_4lane_to_2lane_t_branch_nw_far": {
    "label": "4↔2-lane T · branch NW · far half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_nw_far.png",
    "branch": "nw",
    "part": "far",
    "sidewalk": "se",
    "legacy_keys": [
      "MTFB"
    ]
  },
  "road_4lane_to_2lane_t_branch_se_entry": {
    "label": "4↔2-lane T · branch SE · entry half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_se_entry.png",
    "branch": "se",
    "part": "entry",
    "legacy_keys": [
      "MTEC"
    ]
  },
  "road_4lane_to_2lane_t_branch_se_far": {
    "label": "4↔2-lane T · branch SE · far half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_se_far.png",
    "branch": "se",
    "part": "far",
    "sidewalk": "nw",
    "legacy_keys": [
      "MTFC"
    ]
  },
  "road_4lane_to_2lane_t_branch_sw_entry": {
    "label": "4↔2-lane T · branch SW · entry half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_sw_entry.png",
    "branch": "sw",
    "part": "entry",
    "legacy_keys": [
      "MTED"
    ]
  },
  "road_4lane_to_2lane_t_branch_sw_far": {
    "label": "4↔2-lane T · branch SW · far half",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_to_2lane_t_branch_sw_far.png",
    "branch": "sw",
    "part": "far",
    "sidewalk": "ne",
    "legacy_keys": [
      "MTFD"
    ]
  },
  "road_4lane_junction_entry_corner_ne_se": {
    "label": "4-lane junction · entry · corner NE/SE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_entry_corner_ne_se.png",
    "part": "entry_corner",
    "corner_edges": [
      "ne",
      "se"
    ],
    "reused_by": [
      "4lane_t",
      "4lane_cross"
    ],
    "legacy_keys": [
      "MCTEA"
    ]
  },
  "road_4lane_junction_entry_corner_nw_ne": {
    "label": "4-lane junction · entry · corner NW/NE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_entry_corner_nw_ne.png",
    "part": "entry_corner",
    "corner_edges": [
      "nw",
      "ne"
    ],
    "reused_by": [
      "4lane_t",
      "4lane_cross"
    ],
    "legacy_keys": [
      "MCTEB"
    ]
  },
  "road_4lane_junction_entry_corner_se_sw": {
    "label": "4-lane junction · entry · corner SE/SW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_entry_corner_se_sw.png",
    "part": "entry_corner",
    "corner_edges": [
      "se",
      "sw"
    ],
    "reused_by": [
      "4lane_t",
      "4lane_cross"
    ],
    "legacy_keys": [
      "MCTEC"
    ]
  },
  "road_4lane_junction_entry_corner_nw_sw": {
    "label": "4-lane junction · entry · corner NW/SW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_entry_corner_nw_sw.png",
    "part": "entry_corner",
    "corner_edges": [
      "nw",
      "sw"
    ],
    "reused_by": [
      "4lane_t",
      "4lane_cross"
    ],
    "legacy_keys": [
      "MCTED"
    ]
  },
  "road_4lane_junction_far_sidewalk_sw_divider_se": {
    "label": "4-lane junction · far · sidewalk SW · divider SE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_sw_divider_se.png",
    "part": "far",
    "sidewalk": "sw",
    "divider_stub": "se",
    "legacy_keys": [
      "MCTFA1"
    ]
  },
  "road_4lane_junction_far_sidewalk_sw_divider_nw": {
    "label": "4-lane junction · far · sidewalk SW · divider NW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_sw_divider_nw.png",
    "part": "far",
    "sidewalk": "sw",
    "divider_stub": "nw",
    "legacy_keys": [
      "MCTFA2"
    ]
  },
  "road_4lane_junction_far_sidewalk_se_divider_ne": {
    "label": "4-lane junction · far · sidewalk SE · divider NE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_se_divider_ne.png",
    "part": "far",
    "sidewalk": "se",
    "divider_stub": "ne",
    "legacy_keys": [
      "MCTFB1"
    ]
  },
  "road_4lane_junction_far_sidewalk_se_divider_sw": {
    "label": "4-lane junction · far · sidewalk SE · divider SW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_se_divider_sw.png",
    "part": "far",
    "sidewalk": "se",
    "divider_stub": "sw",
    "legacy_keys": [
      "MCTFB2"
    ]
  },
  "road_4lane_junction_far_sidewalk_nw_divider_ne": {
    "label": "4-lane junction · far · sidewalk NW · divider NE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_nw_divider_ne.png",
    "part": "far",
    "sidewalk": "nw",
    "divider_stub": "ne",
    "legacy_keys": [
      "MCTFC1"
    ]
  },
  "road_4lane_junction_far_sidewalk_nw_divider_sw": {
    "label": "4-lane junction · far · sidewalk NW · divider SW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_nw_divider_sw.png",
    "part": "far",
    "sidewalk": "nw",
    "divider_stub": "sw",
    "legacy_keys": [
      "MCTFC2"
    ]
  },
  "road_4lane_junction_far_sidewalk_ne_divider_se": {
    "label": "4-lane junction · far · sidewalk NE · divider SE",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_ne_divider_se.png",
    "part": "far",
    "sidewalk": "ne",
    "divider_stub": "se",
    "legacy_keys": [
      "MCTFD1"
    ]
  },
  "road_4lane_junction_far_sidewalk_ne_divider_nw": {
    "label": "4-lane junction · far · sidewalk NE · divider NW",
    "category": "ground/roads/4lane",
    "layer": "ground",
    "file": "ground/roads/4lane/road_4lane_junction_far_sidewalk_ne_divider_nw.png",
    "part": "far",
    "sidewalk": "ne",
    "divider_stub": "nw",
    "legacy_keys": [
      "MCTFD2"
    ]
  },
  "crosswalk_2lane_nw_se": {
    "label": "2-lane crossing · traffic NW–SE",
    "category": "ground/markings/2lane",
    "layer": "overlay",
    "file": "ground/markings/2lane/crosswalk_2lane_nw_se.png",
    "recommended_ground": "road",
    "variants": {
      "default_bleed": "ground/markings/2lane/crosswalk_2lane_nw_se.png",
      "logical": "ground/markings/2lane/crosswalk_2lane_nw_se_logical.png"
    }
  },
  "crosswalk_2lane_ne_sw": {
    "label": "2-lane crossing · traffic NE–SW",
    "category": "ground/markings/2lane",
    "layer": "overlay",
    "file": "ground/markings/2lane/crosswalk_2lane_ne_sw.png",
    "recommended_ground": "road_2lane_straight_ne_sw",
    "variants": {
      "default_bleed": "ground/markings/2lane/crosswalk_2lane_ne_sw.png",
      "logical": "ground/markings/2lane/crosswalk_2lane_ne_sw_logical.png"
    }
  },
  "crosswalk_4lane_nw_se_half_ne": {
    "label": "4-lane crossing half · traffic NW–SE · NE half",
    "category": "ground/markings/4lane",
    "layer": "overlay",
    "file": "ground/markings/4lane/crosswalk_4lane_nw_se_half_ne.png",
    "recommended_ground": "road_4lane_straight_nw_se_sidewalk_ne",
    "variants": {
      "default_bleed": "ground/markings/4lane/crosswalk_4lane_nw_se_half_ne.png",
      "logical": "ground/markings/4lane/crosswalk_4lane_nw_se_half_ne_logical.png"
    }
  },
  "crosswalk_4lane_nw_se_half_sw": {
    "label": "4-lane crossing half · traffic NW–SE · SW half",
    "category": "ground/markings/4lane",
    "layer": "overlay",
    "file": "ground/markings/4lane/crosswalk_4lane_nw_se_half_sw.png",
    "recommended_ground": "road_4lane_straight_nw_se_sidewalk_sw",
    "variants": {
      "default_bleed": "ground/markings/4lane/crosswalk_4lane_nw_se_half_sw.png",
      "logical": "ground/markings/4lane/crosswalk_4lane_nw_se_half_sw_logical.png"
    }
  },
  "crosswalk_4lane_ne_sw_half_nw": {
    "label": "4-lane crossing half · traffic NE–SW · NW half",
    "category": "ground/markings/4lane",
    "layer": "overlay",
    "file": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_nw.png",
    "recommended_ground": "road_4lane_straight_ne_sw_sidewalk_nw",
    "variants": {
      "default_bleed": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_nw.png",
      "logical": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_nw_logical.png"
    }
  },
  "crosswalk_4lane_ne_sw_half_se": {
    "label": "4-lane crossing half · traffic NE–SW · SE half",
    "category": "ground/markings/4lane",
    "layer": "overlay",
    "file": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_se.png",
    "recommended_ground": "road_4lane_straight_ne_sw_sidewalk_se",
    "variants": {
      "default_bleed": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_se.png",
      "logical": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_se_logical.png"
    }
  }
};
export const LEGACY_KEYS = {
  "G": "grass",
  "P": "ground_pavement",
  "R": "road",
  "RB": "road_2lane_straight_ne_sw",
  "RCA": "road_2lane_corner_nw_ne",
  "RCB": "road_2lane_corner_ne_se",
  "RCC": "road_2lane_corner_se_sw",
  "RCD": "road_2lane_corner_nw_sw",
  "RC": "road_2lane_cross",
  "RDEA": "road_2lane_dead_end_open_nw",
  "RDEB": "road_2lane_dead_end_open_ne",
  "RDEC": "road_2lane_dead_end_open_se",
  "RDED": "road_2lane_dead_end_open_sw",
  "RTA": "road_2lane_t_branch_ne",
  "RTB": "road_2lane_t_branch_se",
  "RTC": "road_2lane_t_branch_sw",
  "RTD": "road_2lane_t_branch_nw",
  "RL": "road_4lane_straight_nw_se_sidewalk_sw",
  "RR": "road_4lane_straight_nw_se_sidewalk_ne",
  "RLB": "road_4lane_straight_ne_sw_sidewalk_nw",
  "RRB": "road_4lane_straight_ne_sw_sidewalk_se",
  "MTEA": "road_4lane_to_2lane_t_branch_ne_entry",
  "MTFA": "road_4lane_to_2lane_t_branch_ne_far",
  "MTEB": "road_4lane_to_2lane_t_branch_nw_entry",
  "MTFB": "road_4lane_to_2lane_t_branch_nw_far",
  "MTEC": "road_4lane_to_2lane_t_branch_se_entry",
  "MTFC": "road_4lane_to_2lane_t_branch_se_far",
  "MTED": "road_4lane_to_2lane_t_branch_sw_entry",
  "MTFD": "road_4lane_to_2lane_t_branch_sw_far",
  "MCTEA": "road_4lane_junction_entry_corner_ne_se",
  "MCTEB": "road_4lane_junction_entry_corner_nw_ne",
  "MCTEC": "road_4lane_junction_entry_corner_se_sw",
  "MCTED": "road_4lane_junction_entry_corner_nw_sw",
  "MCTFA1": "road_4lane_junction_far_sidewalk_sw_divider_se",
  "MCTFA2": "road_4lane_junction_far_sidewalk_sw_divider_nw",
  "MCTFB1": "road_4lane_junction_far_sidewalk_se_divider_ne",
  "MCTFB2": "road_4lane_junction_far_sidewalk_se_divider_sw",
  "MCTFC1": "road_4lane_junction_far_sidewalk_nw_divider_ne",
  "MCTFC2": "road_4lane_junction_far_sidewalk_nw_divider_sw",
  "MCTFD1": "road_4lane_junction_far_sidewalk_ne_divider_se",
  "MCTFD2": "road_4lane_junction_far_sidewalk_ne_divider_nw"
};
export const LEGACY_FILES = {
  "grass.png": "ground/terrain/grass.png",
  "pavement.png": "ground/terrain/ground_pavement.png",
  "road.png": "ground/roads/2lane/road.png",
  "road_b.png": "ground/roads/2lane/road_2lane_straight_ne_sw.png",
  "road_corner_a.png": "ground/roads/2lane/road_2lane_corner_nw_ne.png",
  "road_corner_b.png": "ground/roads/2lane/road_2lane_corner_ne_se.png",
  "road_corner_c.png": "ground/roads/2lane/road_2lane_corner_se_sw.png",
  "road_corner_d.png": "ground/roads/2lane/road_2lane_corner_nw_sw.png",
  "road_cross.png": "ground/roads/2lane/road_2lane_cross.png",
  "road_dead_end_a.png": "ground/roads/2lane/road_2lane_dead_end_open_nw.png",
  "road_dead_end_b.png": "ground/roads/2lane/road_2lane_dead_end_open_ne.png",
  "road_dead_end_c.png": "ground/roads/2lane/road_2lane_dead_end_open_se.png",
  "road_dead_end_d.png": "ground/roads/2lane/road_2lane_dead_end_open_sw.png",
  "road_t_a.png": "ground/roads/2lane/road_2lane_t_branch_ne.png",
  "road_t_b.png": "ground/roads/2lane/road_2lane_t_branch_se.png",
  "road_t_c.png": "ground/roads/2lane/road_2lane_t_branch_sw.png",
  "road_t_d.png": "ground/roads/2lane/road_2lane_t_branch_nw.png",
  "road_left.png": "ground/roads/4lane/road_4lane_straight_nw_se_sidewalk_sw.png",
  "road_right.png": "ground/roads/4lane/road_4lane_straight_nw_se_sidewalk_ne.png",
  "road_left_b.png": "ground/roads/4lane/road_4lane_straight_ne_sw_sidewalk_nw.png",
  "road_right_b.png": "ground/roads/4lane/road_4lane_straight_ne_sw_sidewalk_se.png",
  "main_side_t_entry_a.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_ne_entry.png",
  "main_side_t_far_a.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_ne_far.png",
  "main_side_t_entry_b.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_nw_entry.png",
  "main_side_t_far_b.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_nw_far.png",
  "main_side_t_entry_c.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_se_entry.png",
  "main_side_t_far_c.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_se_far.png",
  "main_side_t_entry_d.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_sw_entry.png",
  "main_side_t_far_d.png": "ground/roads/4lane/road_4lane_to_2lane_t_branch_sw_far.png",
  "main_corner_t_entry_a.png": "ground/roads/4lane/road_4lane_junction_entry_corner_ne_se.png",
  "main_corner_t_entry_b.png": "ground/roads/4lane/road_4lane_junction_entry_corner_nw_ne.png",
  "main_corner_t_entry_c.png": "ground/roads/4lane/road_4lane_junction_entry_corner_se_sw.png",
  "main_corner_t_entry_d.png": "ground/roads/4lane/road_4lane_junction_entry_corner_nw_sw.png",
  "main_corner_t_far_a1.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_sw_divider_se.png",
  "main_corner_t_far_a2.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_sw_divider_nw.png",
  "main_corner_t_far_b1.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_se_divider_ne.png",
  "main_corner_t_far_b2.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_se_divider_sw.png",
  "main_corner_t_far_c1.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_nw_divider_ne.png",
  "main_corner_t_far_c2.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_nw_divider_sw.png",
  "main_corner_t_far_d1.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_ne_divider_se.png",
  "main_corner_t_far_d2.png": "ground/roads/4lane/road_4lane_junction_far_sidewalk_ne_divider_nw.png",
  "crosswalk_2lane_bleed.png": "ground/markings/2lane/crosswalk_2lane_nw_se.png",
  "crosswalk_2lane.png": "ground/markings/2lane/crosswalk_2lane_nw_se_logical.png",
  "crosswalk_2lane_alt_bleed.png": "ground/markings/2lane/crosswalk_2lane_ne_sw.png",
  "crosswalk_2lane_alt.png": "ground/markings/2lane/crosswalk_2lane_ne_sw_logical.png",
  "crosswalk_4lane_a_bleed.png": "ground/markings/4lane/crosswalk_4lane_nw_se_half_ne.png",
  "crosswalk_4lane_a.png": "ground/markings/4lane/crosswalk_4lane_nw_se_half_ne_logical.png",
  "crosswalk_4lane_b_bleed.png": "ground/markings/4lane/crosswalk_4lane_nw_se_half_sw.png",
  "crosswalk_4lane_b.png": "ground/markings/4lane/crosswalk_4lane_nw_se_half_sw_logical.png",
  "crosswalk_4lane_a_alt_bleed.png": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_nw.png",
  "crosswalk_4lane_a_alt.png": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_nw_logical.png",
  "crosswalk_4lane_b_alt_bleed.png": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_se.png",
  "crosswalk_4lane_b_alt.png": "ground/markings/4lane/crosswalk_4lane_ne_sw_half_se_logical.png"
};
