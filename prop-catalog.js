// Sprite geometry uses the approved 512 x 256 ground scale. Runtime files are half-size.
export const PROP_FAMILIES = {
  "vehicle": {
    "label": "Vehicle traffic light",
    "radius": 0.175,
    "states": [
      "off",
      "red",
      "amber",
      "green"
    ],
    "heightM": 3
  },
  "pedestrian": {
    "label": "Pedestrian traffic light",
    "radius": 0.225,
    "states": [
      "off",
      "red",
      "green"
    ],
    "heightM": 2.4
  },
  "overhead": {
    "label": "Overhead traffic light",
    "radius": 0.3,
    "states": [
      "off",
      "red",
      "amber",
      "green"
    ],
    "heightM": 6
  },
  "streetlight": {
    "label": "Streetlight",
    "radius": 0.3,
    "states": [
      "lit"
    ],
    "heightM": 6
  },
  "stop": {
    "label": "Stop sign",
    "radius": 0.25,
    "states": [
      "static"
    ],
    "heightM": 2.5
  },
  "one_way": {
    "label": "One-way sign",
    "radius": 0.25,
    "states": [
      "static"
    ],
    "heightM": 2.5
  }
};
export const PROP_VARIANTS = {
  "vehicle_se": {
    "file": "props/source_2x/traffic_light_pole_facing_se_off.png",
    "runtimeFile": "props/runtime/traffic_light_pole_facing_se_off.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      24.2,
      128
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_pole_facing_se_red_overlay.png",
      "amber": "props/source_2x/traffic_light_pole_facing_se_amber_overlay.png",
      "green": "props/source_2x/traffic_light_pole_facing_se_green_overlay.png"
    },
    "family": "vehicle",
    "facing": "se",
    "rear": false
  },
  "vehicle_sw": {
    "file": "props/source_2x/traffic_light_pole_facing_sw_off.png",
    "runtimeFile": "props/runtime/traffic_light_pole_facing_sw_off.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      24.2,
      128
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_pole_facing_sw_red_overlay.png",
      "amber": "props/source_2x/traffic_light_pole_facing_sw_amber_overlay.png",
      "green": "props/source_2x/traffic_light_pole_facing_sw_green_overlay.png"
    },
    "family": "vehicle",
    "facing": "sw",
    "rear": false
  },
  "pedestrian_se": {
    "file": "props/source_2x/traffic_light_pedestrian_pole_facing_se_off.png",
    "runtimeFile": "props/runtime/traffic_light_pedestrian_pole_facing_se_off.png",
    "canvas": [
      64,
      120
    ],
    "anchor": [
      32,
      104
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_pedestrian_pole_facing_se_red_overlay.png",
      "green": "props/source_2x/traffic_light_pedestrian_pole_facing_se_green_overlay.png"
    },
    "family": "pedestrian",
    "facing": "se",
    "rear": false
  },
  "pedestrian_sw": {
    "file": "props/source_2x/traffic_light_pedestrian_pole_facing_sw_off.png",
    "runtimeFile": "props/runtime/traffic_light_pedestrian_pole_facing_sw_off.png",
    "canvas": [
      64,
      120
    ],
    "anchor": [
      32,
      104
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_pedestrian_pole_facing_sw_red_overlay.png",
      "green": "props/source_2x/traffic_light_pedestrian_pole_facing_sw_green_overlay.png"
    },
    "family": "pedestrian",
    "facing": "sw",
    "rear": false
  },
  "overhead_se": {
    "file": "props/source_2x/traffic_light_overhead_facing_se_off.png",
    "runtimeFile": "props/runtime/traffic_light_overhead_facing_se_off.png",
    "canvas": [
      272,
      400
    ],
    "anchor": [
      240,
      372
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_overhead_facing_se_red_overlay.png",
      "amber": "props/source_2x/traffic_light_overhead_facing_se_amber_overlay.png",
      "green": "props/source_2x/traffic_light_overhead_facing_se_green_overlay.png"
    },
    "family": "overhead",
    "facing": "se",
    "rear": false
  },
  "overhead_sw": {
    "file": "props/source_2x/traffic_light_overhead_facing_sw_off.png",
    "runtimeFile": "props/runtime/traffic_light_overhead_facing_sw_off.png",
    "canvas": [
      272,
      400
    ],
    "anchor": [
      240,
      372
    ],
    "overlays": {
      "red": "props/source_2x/traffic_light_overhead_facing_sw_red_overlay.png",
      "amber": "props/source_2x/traffic_light_overhead_facing_sw_amber_overlay.png",
      "green": "props/source_2x/traffic_light_overhead_facing_sw_green_overlay.png"
    },
    "family": "overhead",
    "facing": "sw",
    "rear": false,
    "armExtension": "nw",
    "availableStates": [
      "off",
      "red",
      "amber",
      "green"
    ]
  },
  "overhead_ne": {
    "file": "props/source_2x/traffic_light_overhead_facing_ne_off.png",
    "runtimeFile": "props/runtime/traffic_light_overhead_facing_ne_off.png",
    "canvas": [
      272,
      400
    ],
    "anchor": [
      32,
      372
    ],
    "overlays": {},
    "family": "overhead",
    "facing": "ne",
    "rear": true,
    "armExtension": "se"
  },
  "overhead_nw": {
    "file": "props/source_2x/traffic_light_overhead_facing_nw_off.png",
    "runtimeFile": "props/runtime/traffic_light_overhead_facing_nw_off.png",
    "canvas": [
      272,
      400
    ],
    "anchor": [
      24,
      372
    ],
    "overlays": {},
    "family": "overhead",
    "facing": "nw",
    "rear": true
  },
  "streetlight_se": {
    "file": "props/source_2x/streetlight_facing_se.png",
    "runtimeFile": "props/runtime/streetlight_facing_se.png",
    "canvas": [
      128,
      336
    ],
    "anchor": [
      32,
      304
    ],
    "overlays": {},
    "family": "streetlight",
    "facing": "se",
    "rear": false
  },
  "streetlight_sw": {
    "file": "props/source_2x/streetlight_facing_sw.png",
    "runtimeFile": "props/runtime/streetlight_facing_sw.png",
    "canvas": [
      128,
      336
    ],
    "anchor": [
      96,
      304
    ],
    "overlays": {},
    "family": "streetlight",
    "facing": "sw",
    "rear": false
  },
  "streetlight_ne": {
    "file": "props/source_2x/streetlight_facing_ne.png",
    "runtimeFile": "props/runtime/streetlight_facing_ne.png",
    "canvas": [
      128,
      336
    ],
    "anchor": [
      32,
      304
    ],
    "overlays": {},
    "family": "streetlight",
    "facing": "ne",
    "rear": false
  },
  "streetlight_nw": {
    "file": "props/source_2x/streetlight_facing_nw.png",
    "runtimeFile": "props/runtime/streetlight_facing_nw.png",
    "canvas": [
      128,
      336
    ],
    "anchor": [
      96,
      304
    ],
    "overlays": {},
    "family": "streetlight",
    "facing": "nw",
    "rear": false
  },
  "stop_se": {
    "file": "props/source_2x/stop_sign_facing_se.png",
    "runtimeFile": "props/runtime/stop_sign_facing_se.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "family": "stop",
    "facing": "se",
    "rear": false
  },
  "stop_sw": {
    "file": "props/source_2x/stop_sign_facing_sw.png",
    "runtimeFile": "props/runtime/stop_sign_facing_sw.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "family": "stop",
    "facing": "sw",
    "rear": false
  },
  "stop_ne": {
    "file": "props/source_2x/stop_sign_facing_ne.png",
    "runtimeFile": "props/runtime/stop_sign_facing_ne.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "family": "stop",
    "facing": "ne",
    "rear": true
  },
  "stop_nw": {
    "file": "props/source_2x/stop_sign_facing_nw.png",
    "runtimeFile": "props/runtime/stop_sign_facing_nw.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "family": "stop",
    "facing": "nw",
    "rear": true
  },
  "one_way_se": {
    "file": "props/source_2x/one_way_sign_facing_se_arrow_ne.png",
    "runtimeFile": "props/runtime/one_way_sign_facing_se_arrow_ne.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "visibleArrow": "ne",
    "family": "one_way",
    "facing": "se",
    "rear": false
  },
  "one_way_sw": {
    "file": "props/source_2x/one_way_sign_facing_sw_arrow_se.png",
    "runtimeFile": "props/runtime/one_way_sign_facing_sw_arrow_se.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "visibleArrow": "se",
    "family": "one_way",
    "facing": "sw",
    "rear": false
  },
  "one_way_ne": {
    "file": "props/source_2x/one_way_sign_facing_ne_rear.png",
    "runtimeFile": "props/runtime/one_way_sign_facing_ne_rear.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "visibleArrow": null,
    "family": "one_way",
    "facing": "ne",
    "rear": true
  },
  "one_way_nw": {
    "file": "props/source_2x/one_way_sign_facing_nw_rear.png",
    "runtimeFile": "props/runtime/one_way_sign_facing_nw_rear.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      32,
      128
    ],
    "overlays": {},
    "visibleArrow": null,
    "family": "one_way",
    "facing": "nw",
    "rear": true
  },
  "vehicle_ne": {
    "file": "props/source_2x/traffic_light_pole_facing_ne_rear.png",
    "runtimeFile": "props/runtime/traffic_light_pole_facing_ne_rear.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      24.2,
      128
    ],
    "overlays": {},
    "rear": true,
    "family": "vehicle",
    "facing": "ne"
  },
  "vehicle_nw": {
    "file": "props/source_2x/traffic_light_pole_facing_nw_rear.png",
    "runtimeFile": "props/runtime/traffic_light_pole_facing_nw_rear.png",
    "canvas": [
      64,
      144
    ],
    "anchor": [
      24.2,
      128
    ],
    "overlays": {},
    "rear": true,
    "family": "vehicle",
    "facing": "nw"
  },
  "pedestrian_ne": {
    "file": "props/source_2x/traffic_light_pedestrian_pole_facing_ne_rear.png",
    "runtimeFile": "props/runtime/traffic_light_pedestrian_pole_facing_ne_rear.png",
    "canvas": [
      64,
      120
    ],
    "anchor": [
      32,
      104
    ],
    "overlays": {},
    "rear": true,
    "family": "pedestrian",
    "facing": "ne"
  },
  "pedestrian_nw": {
    "file": "props/source_2x/traffic_light_pedestrian_pole_facing_nw_rear.png",
    "runtimeFile": "props/runtime/traffic_light_pedestrian_pole_facing_nw_rear.png",
    "canvas": [
      64,
      120
    ],
    "anchor": [
      32,
      104
    ],
    "overlays": {},
    "rear": true,
    "family": "pedestrian",
    "facing": "nw"
  }
};
