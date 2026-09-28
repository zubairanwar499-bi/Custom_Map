/**
 * Power BI 3D Dynamic Multi-Mode Map Engine
 * Modes:
 *   1. 3D Globe (Realistic Earth, Arcs, Atmosphere & Pins)
 *   2. 3D Extruded Choropleth (Provinces/Regions extruded by KPI value)
 *   3. 3D Cyber City (KLCC / Petronas campus & site building level)
 *   4. Arc & Network Flow
 * 
 * Supports: Live Power BI Data Binding via PostMessage, DAX JSON, & Standalone GUI.
 */

// --- Global State ---
const State = {
  mode: 'globe', // 'globe' | 'choropleth' | 'city' | 'flow'
  theme: 'cyber', // 'cyber' | 'satellite' | 'executive'
  autoRotate: true,
  currentSite: null,
  provinces: [],
  sites: [],
  arcs: [],
  extrudedMeshes: new Map(),
  sitePins: [],
  arcLines: [],
  cityGroup: null,
  globeGroup: null,
  choroplethGroup: null,
  animatingParticles: []
};

// --- Embedded Default Geo Data (Pakistan & Global Hubs) ---
const DEFAULT_GEO_DATA = {
  "provinces": [
    {
      "id": "KSA",
      "name": "Saudi Arabia",
      "capital": "Riyadh",
      "val": 1356,
      "color": "#10b981",
      "center": [
        45.0,
        24.0
      ],
      "coords": [
        [
          36.5,
          29.5
        ],
        [
          42.0,
          31.5
        ],
        [
          48.0,
          30.0
        ],
        [
          50.0,
          26.5
        ],
        [
          55.0,
          22.5
        ],
        [
          52.0,
          19.0
        ],
        [
          44.0,
          17.5
        ],
        [
          42.5,
          16.5
        ],
        [
          39.0,
          21.0
        ],
        [
          35.5,
          28.0
        ],
        [
          36.5,
          29.5
        ]
      ]
    },
    {
      "id": "UAE",
      "name": "United Arab Emirates",
      "capital": "Abu Dhabi",
      "val": 298,
      "color": "#00f0ff",
      "center": [
        54.5,
        24.0
      ],
      "coords": [
        [
          51.5,
          24.0
        ],
        [
          54.0,
          24.5
        ],
        [
          56.0,
          26.0
        ],
        [
          56.3,
          24.8
        ],
        [
          55.5,
          23.0
        ],
        [
          52.5,
          23.0
        ],
        [
          51.5,
          24.0
        ]
      ]
    },
    {
      "id": "EGY",
      "name": "Egypt",
      "capital": "Cairo",
      "val": 113,
      "color": "#f59e0b",
      "center": [
        30.0,
        26.5
      ],
      "coords": [
        [
          25.0,
          31.5
        ],
        [
          31.5,
          31.5
        ],
        [
          34.0,
          31.2
        ],
        [
          34.0,
          27.5
        ],
        [
          35.5,
          22.0
        ],
        [
          25.0,
          22.0
        ],
        [
          25.0,
          31.5
        ]
      ]
    },
    {
      "id": "OMN",
      "name": "Oman",
      "capital": "Muscat",
      "val": 98,
      "color": "#8b5cf6",
      "center": [
        57.0,
        21.5
      ],
      "coords": [
        [
          56.0,
          26.0
        ],
        [
          59.8,
          22.5
        ],
        [
          59.0,
          20.5
        ],
        [
          54.0,
          16.5
        ],
        [
          52.0,
          19.0
        ],
        [
          55.5,
          23.0
        ],
        [
          56.0,
          26.0
        ]
      ]
    },
    {
      "id": "MAR",
      "name": "Morocco",
      "capital": "Rabat",
      "val": 46,
      "color": "#ec4899",
      "center": [
        -7.0,
        31.0
      ],
      "coords": [
        [
          -2.0,
          35.0
        ],
        [
          -1.0,
          32.0
        ],
        [
          -4.0,
          29.0
        ],
        [
          -12.0,
          27.5
        ],
        [
          -10.0,
          32.0
        ],
        [
          -6.0,
          35.8
        ],
        [
          -2.0,
          35.0
        ]
      ]
    },
    {
      "id": "JOR",
      "name": "Jordan",
      "capital": "Amman",
      "val": 44,
      "color": "#38bdf8",
      "center": [
        36.5,
        31.0
      ],
      "coords": [
        [
          35.0,
          32.5
        ],
        [
          38.5,
          32.5
        ],
        [
          39.0,
          32.0
        ],
        [
          37.0,
          29.5
        ],
        [
          35.0,
          29.5
        ],
        [
          35.0,
          32.5
        ]
      ]
    },
    {
      "id": "UZB",
      "name": "Uzbekistan",
      "capital": "Tashkent",
      "val": 28,
      "color": "#f97316",
      "center": [
        64.0,
        41.5
      ],
      "coords": [
        [
          56.0,
          45.0
        ],
        [
          60.0,
          45.5
        ],
        [
          66.0,
          43.0
        ],
        [
          71.0,
          41.0
        ],
        [
          67.0,
          37.5
        ],
        [
          62.0,
          39.5
        ],
        [
          56.0,
          41.5
        ],
        [
          56.0,
          45.0
        ]
      ]
    },
    {
      "id": "CHN",
      "name": "China",
      "capital": "Beijing",
      "val": 58,
      "color": "#ef4444",
      "center": [
        105.0,
        35.0
      ],
      "coords": [
        [
          80.0,
          48.0
        ],
        [
          120.0,
          50.0
        ],
        [
          122.0,
          30.0
        ],
        [
          110.0,
          20.0
        ],
        [
          100.0,
          22.0
        ],
        [
          85.0,
          28.0
        ],
        [
          75.0,
          38.0
        ],
        [
          80.0,
          48.0
        ]
      ]
    }
  ],
  "sites": [
    {
      "id": "Sudair",
      "name": "Sudair Solar Plant",
      "country": "KSA",
      "region": "Riyadh",
      "lat": 24.761863,
      "lon": 45.565428,
      "val": 282,
      "status": "Operational",
      "type": "Solar PV Plant",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "282 Tested"
    },
    {
      "id": "ASB2",
      "name": "ASB2 Substation",
      "country": "KSA",
      "region": "Makkah",
      "lat": 20.767205,
      "lon": 39.598452,
      "val": 301,
      "status": "Operational",
      "type": "Substation",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "301 Tested"
    },
    {
      "id": "Ar Ras 2",
      "name": "Ar Ras 2 PV",
      "country": "KSA",
      "region": "Al Qassim",
      "lat": 25.616703,
      "lon": 43.617783,
      "val": 294,
      "status": "Operational",
      "type": "Solar PV Plant",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "294 Tested"
    },
    {
      "id": "Shuaa 3",
      "name": "Shuaa 3 PV",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.724347,
      "lon": 55.412206,
      "val": 218,
      "status": "Operational",
      "type": "Solar Park",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "218 Tested"
    },
    {
      "id": "Saad-2",
      "name": "Saad-2 PV",
      "country": "KSA",
      "region": "Riyadh",
      "lat": 25.062915,
      "lon": 47.561847,
      "val": 157,
      "status": "Operational",
      "type": "Solar PV Plant",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "157 Tested"
    },
    {
      "id": "Ar Ras 1",
      "name": "Ar Ras 1",
      "country": "KSA",
      "region": "Al Qassim",
      "lat": 25.591473,
      "lon": 43.624552,
      "val": 133,
      "status": "Operational",
      "type": "Solar PV",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "133 Tested"
    },
    {
      "id": "IBRI - II",
      "name": "IBRI - II Solar",
      "country": "Oman",
      "region": "Dhahirah",
      "lat": 23.36988,
      "lon": 56.246772,
      "val": 98,
      "status": "Operational",
      "type": "Solar PV",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "98 Tested"
    },
    {
      "id": "ASB1",
      "name": "ASB1 Substation",
      "country": "KSA",
      "region": "Makkah",
      "lat": 20.779612,
      "lon": 39.562565,
      "val": 92,
      "status": "Operational",
      "type": "Substation",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "92 Tested"
    },
    {
      "id": "SAKAKA",
      "name": "Sakaka Solar",
      "country": "KSA",
      "region": "Al Jawf",
      "lat": 29.737867,
      "lon": 40.100346,
      "val": 67,
      "status": "Operational",
      "type": "Solar PV",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "67 Tested"
    },
    {
      "id": "NE PVFD-1",
      "name": "NE PVFD-1",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.749,
      "lon": 55.436758,
      "val": 49,
      "status": "Operational",
      "type": "PV Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "49 Tested"
    },
    {
      "id": "Yuanbu 105",
      "name": "Yuanbu 105 Plant",
      "country": "China",
      "region": "Guangdong",
      "lat": 24.595861,
      "lon": 112.452111,
      "val": 38,
      "status": "Operational",
      "type": "Renewable",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "38 Tested"
    },
    {
      "id": "Ben Ben 2 - ALCOM",
      "name": "Ben Ben 2 - ALCOM",
      "country": "Egypt",
      "region": "Aswan",
      "lat": 24.434103,
      "lon": 32.703136,
      "val": 34,
      "status": "Operational",
      "type": "Solar Park",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "34 Tested"
    },
    {
      "id": "Ben Ben 1 - ACWA",
      "name": "Ben Ben 1 - ACWA",
      "country": "Egypt",
      "region": "Aswan",
      "lat": 24.434103,
      "lon": 32.703136,
      "val": 32,
      "status": "Operational",
      "type": "Solar Park",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "32 Tested"
    },
    {
      "id": "KOM OMBO",
      "name": "KOM OMBO Solar",
      "country": "Egypt",
      "region": "Aswan",
      "lat": 24.470596,
      "lon": 32.944659,
      "val": 32,
      "status": "Operational",
      "type": "Solar Park",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "32 Tested"
    },
    {
      "id": "Riverside",
      "name": "Riverside Plant",
      "country": "Uzbekistan",
      "region": "Tashkent",
      "lat": 41.348725,
      "lon": 69.50193,
      "val": 28,
      "status": "Operational",
      "type": "Renewable Energy",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "28 Tested"
    },
    {
      "id": "Laayoune",
      "name": "Laayoune PV",
      "country": "Morocco",
      "region": "Laayoune",
      "lat": 27.12428,
      "lon": -13.206678,
      "val": 22,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "22 Tested"
    },
    {
      "id": "Mafraq",
      "name": "Mafraq PV",
      "country": "Jordan",
      "region": "Mafraq",
      "lat": 32.346988,
      "lon": 36.288437,
      "val": 22,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "22 Tested"
    },
    {
      "id": "Risha",
      "name": "Risha PV",
      "country": "Jordan",
      "region": "Mafraq",
      "lat": 32.568948,
      "lon": 39.006428,
      "val": 22,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "22 Tested"
    },
    {
      "id": "Layla",
      "name": "Layla Solar",
      "country": "KSA",
      "region": "Riyadh",
      "lat": 22.309039,
      "lon": 46.663809,
      "val": 20,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "20 Tested"
    },
    {
      "id": "Yanghui 50",
      "name": "Yanghui 50",
      "country": "China",
      "region": "Guangdong",
      "lat": 24.325627,
      "lon": 112.628062,
      "val": 20,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "20 Tested"
    },
    {
      "id": "Ouarzazate",
      "name": "Ouarzazate Solar Complex",
      "country": "Morocco",
      "region": "Dr\u00e2a-Tafilalet",
      "lat": 31.008721,
      "lon": -6.856381,
      "val": 18,
      "status": "Operational",
      "type": "CSP & PV Complex",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "18 Tested"
    },
    {
      "id": "NE PT",
      "name": "NE PT",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.749,
      "lon": 55.436758,
      "val": 18,
      "status": "Operational",
      "type": "Substation",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "18 Tested"
    },
    {
      "id": "Ben Ben 3 - TK",
      "name": "Ben Ben 3 - TK",
      "country": "Egypt",
      "region": "Aswan",
      "lat": 24.434103,
      "lon": 32.703136,
      "val": 15,
      "status": "Operational",
      "type": "Solar PV",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "15 Tested"
    },
    {
      "id": "S3IWP",
      "name": "S3IWP Desalination Plant",
      "country": "KSA",
      "region": "Makkah",
      "lat": 20.677962,
      "lon": 39.528296,
      "val": 12,
      "status": "Operational",
      "type": "Desalination & Power",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "12 Tested"
    },
    {
      "id": "NE PVFD-2",
      "name": "NE PVFD-2",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.749,
      "lon": 55.436758,
      "val": 10,
      "status": "Operational",
      "type": "PV Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "10 Tested"
    },
    {
      "id": "AL Kafha",
      "name": "AL Kafha",
      "country": "KSA",
      "region": "Al Qassim",
      "lat": 26.98731,
      "lon": 42.991463,
      "val": 10,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "10 Tested"
    },
    {
      "id": "Shuaa 1",
      "name": "Shuaa 1",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.761863,
      "lon": 55.368542,
      "val": 10,
      "status": "Operational",
      "type": "Solar PV",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "10 Tested"
    },
    {
      "id": "Boujdour",
      "name": "Boujdour PV",
      "country": "Morocco",
      "region": "Laayoune",
      "lat": 26.125651,
      "lon": -14.482797,
      "val": 6,
      "status": "Operational",
      "type": "Solar Facility",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "6 Tested"
    },
    {
      "id": "NE CT",
      "name": "NE CT",
      "country": "UAE",
      "region": "Dubai",
      "lat": 24.749,
      "lon": 55.436758,
      "val": 3,
      "status": "Operational",
      "type": "Substation",
      "kpi_label": "Tested Transformers",
      "kpi_formatted": "3 Tested"
    }
  ],
  "arcs": [
    {
      "from": "Sudair Solar Plant",
      "to": "ASB2 Substation",
      "val": 300,
      "color": "#10b981"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Ar Ras 2 PV",
      "val": 294,
      "color": "#10b981"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Shuaa 3 PV",
      "val": 218,
      "color": "#00f0ff"
    },
    {
      "from": "Shuaa 3 PV",
      "to": "IBRI - II Solar",
      "val": 98,
      "color": "#8b5cf6"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Ben Ben 1 - ACWA",
      "val": 32,
      "color": "#f59e0b"
    },
    {
      "from": "Ben Ben 1 - ACWA",
      "to": "Ouarzazate Solar Complex",
      "val": 18,
      "color": "#ec4899"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Mafraq PV",
      "val": 22,
      "color": "#38bdf8"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Riverside Plant",
      "val": 28,
      "color": "#f97316"
    },
    {
      "from": "Sudair Solar Plant",
      "to": "Yuanbu 105 Plant",
      "val": 38,
      "color": "#ef4444"
    }
  ]
};

// Initialize State
State.provinces = JSON.parse(JSON.stringify(DEFAULT_GEO_DATA.provinces));
State.sites = JSON.parse(JSON.stringify(DEFAULT_GEO_DATA.sites));
State.arcs = JSON.parse(JSON.stringify(DEFAULT_GEO_DATA.arcs));

// --- Three.js Environment Setup ---
const container = document.getElementById('canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(50, 45, 110);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 500;
controls.minDistance = 15;
controls.autoRotate = State.autoRotate;
controls.autoRotateSpeed = 0.6;

// Raycaster for Hover & Selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);
const tooltip = document.getElementById('tooltip3d');

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
sunLight.position.set(100, 150, 100);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.75);
rimLight.position.set(-120, -50, -100);
scene.add(rimLight);

// --- Starfield Background ---
function createStarfield() {
  const starsGeo = new THREE.BufferGeometry();
  const count = 1800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1600;
    positions[i + 1] = (Math.random() - 0.5) * 1600;
    positions[i + 2] = (Math.random() - 0.5) * 1600;

    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.8, 0.8 + Math.random() * 0.2);
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starsMat = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });
  return new THREE.Points(starsGeo, starsMat);
}
const starfield = createStarfield();
scene.add(starfield);

// --- Coordinate Projection Helpers ---
const GLOBE_RADIUS = 36;

function latLonToVector3(lat, lon, radius = GLOBE_RADIUS, alt = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const r = radius + alt;
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// Convert Geo coordinates to 2D flat plane for Choropleth Mode
function geoToPlane(lon, lat, centerLon = 70.0, centerLat = 31.0, scale = 4.2) {
  const x = (lon - centerLon) * scale;
  const y = (lat - centerLat) * scale;
  return { x, y };
}

// --- Procedural Earth Texture Generator ---
function createProceduralEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep Ocean Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#04162e');
  oceanGrad.addColorStop(0.5, '#072044');
  oceanGrad.addColorStop(1, '#020d1c');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continental Landmasses & Shading
  ctx.fillStyle = '#1e3a24';
  ctx.strokeStyle = '#2e5a38';
  ctx.lineWidth = 1;

  // Approximate continents
  const landmasses = [
    // Asia / Europe
    [[450, 150], [900, 160], [1200, 190], [1400, 320], [1250, 480], [1050, 520], [900, 420], [700, 460], [550, 380]],
    // Africa
    [[550, 400], [720, 410], [730, 650], [650, 780], [580, 720], [520, 500]],
    // Americas
    [[150, 180], [380, 200], [300, 450], [220, 420], [180, 300]],
    [[280, 460], [390, 500], [360, 800], [290, 780], [260, 550]],
    // Australia
    [[1200, 620], [1350, 630], [1380, 760], [1240, 780]]
  ];

  landmasses.forEach(poly => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Mountain & Desert highlights
  ctx.fillStyle = 'rgba(180, 140, 90, 0.45)';
  ctx.fillRect(800, 300, 280, 120); // Central Asia / Himalayas

  // Latitude / Longitude subtle grid lines
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ==========================================
// 1. MODE: 3D GLOBE ENGINE (Reference Image 1)
// ==========================================
function buildGlobeMode() {
  State.globeGroup = new THREE.Group();

  const earthTex = createProceduralEarthTexture();
  const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const globeMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.65,
    metalness: 0.25,
    bumpScale: 0.8
  });

  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeMesh.receiveShadow = true;
  State.globeGroup.add(globeMesh);

  // Atmospheric Glow Shell (Fresnel effect)
  const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 64, 64);
  const atmosMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
        gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 1.5;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
  State.globeGroup.add(atmosMesh);

  // Site 3D Beacons / Pins on Globe
  State.sitePins = [];
  State.sites.forEach(site => {
    const pos = latLonToVector3(site.lat, site.lon, GLOBE_RADIUS, 0.4);
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(pos);
    pinGroup.lookAt(new THREE.Vector3(0, 0, 0));

    // Outer Radar Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.6, 0.9, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: site.val > 90 ? 0x00f0ff : (site.val > 75 ? 0x10b981 : 0xf59e0b),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    pinGroup.add(ringMesh);

    // Vertical Core Pin Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.15, (site.val / 100) * 8 + 2, 16);
    pillarGeo.translate(0, ((site.val / 100) * 8 + 2) / 2, 0);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: site.val > 90 ? 0x00f0ff : (site.val > 75 ? 0x10b981 : 0xf59e0b),
      emissive: site.val > 90 ? 0x00a0cc : 0x065f46,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
    pillarMesh.rotateX(Math.PI / 2);
    pillarMesh.castShadow = true;
    pinGroup.add(pillarMesh);

    // Glowing Sphere Cap
    const capGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 0, -((site.val / 100) * 8 + 2));
    pinGroup.add(capMesh);

    // Store reference for Raycasting
    pillarMesh.userData = { site: site, type: 'site' };
    pinGroup.userData = { site: site, ring: ringMesh, initialScale: 1 };

    State.sitePins.push(pinGroup);
    State.globeGroup.add(pinGroup);
  });

  // Dynamic Arcs between sites on Globe
  buildArcsOnGlobe();

  scene.add(State.globeGroup);
}

// Build 3D Quadratic Bezier Arcs on the Globe
function buildArcsOnGlobe() {
  State.arcLines.forEach(arc => State.globeGroup.remove(arc));
  State.arcLines = [];

  State.arcs.forEach(arcData => {
    const siteA = State.sites.find(s => s.name === arcData.from);
    const siteB = State.sites.find(s => s.name === arcData.to);
    if (!siteA || !siteB) return;

    const pA = latLonToVector3(siteA.lat, siteA.lon, GLOBE_RADIUS, 0.5);
    const pB = latLonToVector3(siteB.lat, siteB.lon, GLOBE_RADIUS, 0.5);

    // Midpoint elevated above surface
    const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    const dist = pA.distanceTo(pB);
    const altitude = GLOBE_RADIUS + dist * 0.35;
    mid.normalize().multiplyScalar(altitude);

    const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);
    const points = curve.getPoints(50);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    const curveMat = new THREE.LineBasicMaterial({
      color: arcData.color || 0x00f0ff,
      transparent: true,
      opacity: 0.65,
      linewidth: 2
    });
    const arcMesh = new THREE.Line(curveGeo, curveMat);
    State.arcLines.push(arcMesh);
    State.globeGroup.add(arcMesh);

    // Flying Pulse Particle on Arc
    const particleGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const particleMesh = new THREE.Mesh(particleGeo, particleMat);
    State.animatingParticles.push({ mesh: particleMesh, curve: curve, progress: Math.random() });
    State.globeGroup.add(particleMesh);
  });
}

// ========================================================
// 2. MODE: 3D EXTRUDED CHOROPLETH ENGINE (Reference Image 2)
// ========================================================
function buildChoroplethMode() {
  State.choroplethGroup = new THREE.Group();
  State.extrudedMeshes.clear();

  // Ground Grid / Reflection Floor
  const gridHelper = new THREE.GridHelper(160, 32, 0x00f0ff, 0x1e293b);
  gridHelper.position.y = -0.1;
  State.choroplethGroup.add(gridHelper);

  State.provinces.forEach(prov => {
    const shape = new THREE.Shape();
    const pts = prov.coords.map(c => geoToPlane(c[0], c[1]));

    shape.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      shape.lineTo(pts[i].x, pts[i].y);
    }
    shape.closePath();

    // Height proportional to KPI value (e.g. 52 -> 5.2, 96 -> 9.6)
    const extrudeHeight = Math.max((prov.val / 100) * 16, 2.5);

    const extrudeSettings = {
      steps: 2,
      depth: extrudeHeight,
      bevelEnabled: true,
      bevelThickness: 0.6,
      bevelSize: 0.4,
      bevelOffset: 0,
      bevelSegments: 4
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2); // Lay flat on X-Z plane with Y as height

    // Realistic clay/glossy material as in reference image 2
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(prov.color),
      roughness: 0.35,
      metalness: 0.15,
      emissive: new THREE.Color(prov.color).multiplyScalar(0.2)
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { province: prov, type: 'province', baseHeight: extrudeHeight };

    // Floating 3D Text Badge / Centroid Marker
    const center2D = geoToPlane(prov.center[0], prov.center[1]);
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(center2D.x, extrudeHeight + 2.5, -center2D.y);

    const beaconGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    badgeGroup.add(beacon);

    // Floating Label Sprite
    const labelSprite = makeTextSprite(`${prov.name}\n${prov.val}%`);
    labelSprite.position.set(0, 2.5, 0);
    badgeGroup.add(labelSprite);

    mesh.add(badgeGroup);
    State.extrudedMeshes.set(prov.id, mesh);
    State.choroplethGroup.add(mesh);
  });

  State.choroplethGroup.position.set(0, 0, 0);
  State.choroplethGroup.visible = false;
  scene.add(State.choroplethGroup);
}

// Generate Canvas Text Sprite for Floating 3D Labels
function makeTextSprite(message) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(10, 20, 40, 0.85)';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 112, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  const lines = message.split('\n');
  ctx.fillText(lines[0], 128, 48);
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText(lines[1], 128, 92);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(7, 3.5, 1);
  return sprite;
}

// ========================================================
// 3. MODE: 3D CYBER CITY & CAMPUS ENGINE (Reference Image 3)
// ========================================================
function buildCityMode() {
  State.cityGroup = new THREE.Group();

  // High-Tech Cyber Base Plate
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x090f1e,
    roughness: 0.8,
    metalness: 0.5
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotateX(-Math.PI / 2);
  ground.receiveShadow = true;
  State.cityGroup.add(ground);

  // Animated Circular Radar Scanner Ground Ring
  const radarGeo = new THREE.RingGeometry(10, 75, 64);
  const radarMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const radar = new THREE.Mesh(radarGeo, radarMat);
  radar.rotateX(-Math.PI / 2);
  radar.position.y = 0.05;
  State.cityGroup.add(radar);
  State.cityRadar = radar;

  // Window Texture for Skyscrapers
  const winCanvas = document.createElement('canvas');
  winCanvas.width = 128;
  winCanvas.height = 256;
  const winCtx = winCanvas.getContext('2d');
  winCtx.fillStyle = '#0e182e';
  winCtx.fillRect(0, 0, 128, 256);
  winCtx.fillStyle = '#38bdf8';
  for (let y = 8; y < 250; y += 16) {
    for (let x = 6; x < 122; x += 14) {
      if (Math.random() > 0.3) {
        winCtx.fillStyle = Math.random() > 0.85 ? '#00f0ff' : '#60a5fa';
        winCtx.fillRect(x, y, 8, 10);
      }
    }
  }
  const winTex = new THREE.CanvasTexture(winCanvas);
  winTex.wrapS = THREE.RepeatWrapping;
  winTex.wrapT = THREE.RepeatWrapping;
  winTex.repeat.set(2, 4);

  // Petronas KLCC Style Twin Towers
  function buildTwinTower(xOffset) {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(xOffset, 0, 0);

    // Multi-tier tapering tower
    const tiers = [
      { h: 22, rBottom: 5.2, rTop: 4.6 },
      { h: 18, rBottom: 4.6, rTop: 3.8 },
      { h: 16, rBottom: 3.8, rTop: 2.8 },
      { h: 14, rBottom: 2.8, rTop: 1.8 }
    ];

    let currentY = 0;
    tiers.forEach(tier => {
      const geo = new THREE.CylinderGeometry(tier.rTop, tier.rBottom, tier.h, 16);
      geo.translate(0, tier.h / 2, 0);
      const mat = new THREE.MeshStandardMaterial({
        map: winTex,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0x051525
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = currentY;
      mesh.castShadow = true;
      towerGroup.add(mesh);
      currentY += tier.h;
    });

    // Pinnacle Spire
    const spireGeo = new THREE.ConeGeometry(0.8, 16, 16);
    spireGeo.translate(0, 8, 0);
    const spireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.y = currentY;
    towerGroup.add(spire);

    // Spire Beacon Light
    const beacon = new THREE.PointLight(0x00f0ff, 2, 40);
    beacon.position.y = currentY + 16;
    towerGroup.add(beacon);

    return towerGroup;
  }

  const tower1 = buildTwinTower(-8);
  const tower2 = buildTwinTower(8);
  State.cityGroup.add(tower1);
  State.cityGroup.add(tower2);

  // Connecting Skybridge between Twin Towers
  const bridgeGeo = new THREE.BoxGeometry(16, 3, 4);
  const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge.position.set(0, 36, 0);
  bridge.castShadow = true;
  State.cityGroup.add(bridge);

  // Surrounding Procedural Urban High-Rise Blocks
  const buildingMat = new THREE.MeshStandardMaterial({
    map: winTex,
    roughness: 0.4,
    metalness: 0.6
  });

  const citySpread = 65;
  for (let x = -citySpread; x <= citySpread; x += 15) {
    for (let z = -citySpread; z <= citySpread; z += 15) {
      if (Math.abs(x) < 18 && Math.abs(z) < 18) continue; // Keep center clear for Twin Towers

      const h = 10 + Math.random() * 38;
      const w = 8 + Math.random() * 4;
      const d = 8 + Math.random() * 4;

      const bGeo = new THREE.BoxGeometry(w, h, d);
      bGeo.translate(0, h / 2, 0);
      const bMesh = new THREE.Mesh(bGeo, buildingMat);
      bMesh.position.set(x + (Math.random() - 0.5) * 4, 0, z + (Math.random() - 0.5) * 4);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;

      // Rooftop Helipad / Glowing Border
      if (Math.random() > 0.6) {
        const roofGeo = new THREE.RingGeometry(1, 2.5, 16);
        const roofMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.rotateX(-Math.PI / 2);
        roof.position.set(bMesh.position.x, h + 0.1, bMesh.position.z);
        State.cityGroup.add(roof);
      }

      State.cityGroup.add(bMesh);
    }
  }

  // 3D Site KPI Pillars around the City Campus
  State.sites.slice(0, 6).forEach((site, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const rad = 42;
    const px = Math.cos(angle) * rad;
    const pz = Math.sin(angle) * rad;
    const py = (site.val / 100) * 18;

    const pillarGeo = new THREE.CylinderGeometry(1.2, 1.2, py, 16);
    pillarGeo.translate(0, py / 2, 0);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: site.val > 90 ? 0x00f0ff : 0x10b981,
      emissive: site.val > 90 ? 0x005577 : 0x044422,
      roughness: 0.2,
      metalness: 0.8
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(px, 0, pz);
    pillar.castShadow = true;
    pillar.userData = { site: site, type: 'site' };
    State.cityGroup.add(pillar);

    // Floating 3D Badge on Pillar
    const label = makeTextSprite(`${site.name.split(' ')[0]}\n${site.val}%`);
    label.position.set(px, py + 4, pz);
    State.cityGroup.add(label);
  });

  State.cityGroup.position.set(0, 0, 0);
  State.cityGroup.visible = false;
  scene.add(State.cityGroup);
}

// ==========================================
// Mode Switching Logic
// ==========================================
function switchMode(newMode) {
  State.mode = newMode;

  // Update UI Pills
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === newMode);
  });

  // Toggle Visibility with Smooth Transitions
  if (State.globeGroup) State.globeGroup.visible = (newMode === 'globe' || newMode === 'flow');
  if (State.choroplethGroup) State.choroplethGroup.visible = (newMode === 'choropleth');
  if (State.cityGroup) State.cityGroup.visible = (newMode === 'city');

  // Adjust Camera Framing
  if (newMode === 'globe') {
    flyToCamera({ x: 0, y: 35, z: 140 }, { x: 0, y: 0, z: 0 });
  } else if (newMode === 'choropleth') {
    flyToCamera({ x: 0, y: 80, z: 65 }, { x: 0, y: 6, z: 0 });
  } else if (newMode === 'city') {
    flyToCamera({ x: -45, y: 65, z: 85 }, { x: 0, y: 25, z: 0 });
  } else if (newMode === 'flow') {
    flyToCamera({ x: 40, y: 40, z: 120 }, { x: 0, y: 0, z: 0 });
  }
}

// Camera Fly-To Animation using Tween or Lerp
function flyToCamera(targetPos, targetLookAt, duration = 1200) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function animateFlight(currentTime) {
    const elapsed = currentTime - startTime;
    const t = Math.min(elapsed / duration, 1);
    // Smooth easeInOutCubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, targetLookAt, ease);
    controls.update();

    if (t < 1) {
      requestAnimationFrame(animateFlight);
    }
  }
  requestAnimationFrame(animateFlight);
}

// ==========================================
// Dynamic Data Binding (Power BI Reactivity)
// ==========================================
function updateData(newData) {
  if (newData.provinces) {
    State.provinces = newData.provinces;
    // Update Choropleth Extrusions
    State.provinces.forEach(p => {
      const mesh = State.extrudedMeshes.get(p.id);
      if (mesh) {
        const newH = Math.max((p.val / 100) * 16, 2.5);
        mesh.scale.set(1, newH / mesh.userData.baseHeight, 1);
        mesh.material.color.set(p.color || '#00f0ff');
      }
    });
  }

  if (newData.sites) {
    State.sites = newData.sites;
    // Refresh Globe Pins
    State.sitePins.forEach(pin => {
      const site = State.sites.find(s => s.id === pin.userData.site.id);
      if (site) {
        pin.userData.site.val = site.val;
        const color = site.val > 90 ? 0x00f0ff : (site.val > 75 ? 0x10b981 : 0xf59e0b);
        pin.userData.ring.material.color.setHex(color);
      }
    });
  }

  if (newData.arcs) {
    State.arcs = newData.arcs;
    buildArcsOnGlobe();
  }

  updateKpiDeck();
}

// Update Top KPI Floating Cards
function updateKpiDeck() {
  const totalSites = State.sites.length;
  const avgVal = (State.sites.reduce((acc, s) => acc + (s.val || 0), 0) / (totalSites || 1)).toFixed(1);
  const totalArcs = State.arcs.length;

  const kpiVal1 = document.getElementById('kpiTotalSites');
  const kpiVal2 = document.getElementById('kpiAvgHealth');
  const kpiVal3 = document.getElementById('kpiNetworkArcs');

  if (kpiVal1) kpiVal1.textContent = totalSites;
  if (kpiVal2) kpiVal2.textContent = `${avgVal}%`;
  if (kpiVal3) kpiVal3.textContent = totalArcs;
}

// Listen for Power BI postMessage or iframe bridge
window.addEventListener('message', event => {
  if (!event.data) return;
  try {
    let payload = event.data;
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }
    if (payload.type === 'PBI_DATA_UPDATE' || payload.sites || payload.provinces) {
      updateData(payload);
    }
  } catch (err) {
    console.warn("Message parse notice:", err);
  }
});

// Check URL Params for Data or Theme Injection
function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get('theme');
  const modeParam = params.get('mode');
  const countryParam = params.get('country') || params.get('c');
  const siteParam = params.get('site') || params.get('s');
  const valuesParam = params.get('v');
  const dataParam = params.get('data');

  if (themeParam) switchTheme(themeParam);
  if (modeParam) switchMode(modeParam);

  // Compact Value Updates: e.g. v=Sudair:282,ASB2:301
  if (valuesParam) {
    try {
      const pairs = decodeURIComponent(valuesParam).split(',');
      pairs.forEach(p => {
        const parts = p.split(':');
        const name = parts[0];
        const valStr = parts[1];
        const site = State.sites.find(s => s.id.toLowerCase() === name.toLowerCase() || s.name.toLowerCase().includes(name.toLowerCase()));
        if (site && valStr) {
          site.val = parseFloat(valStr);
          site.kpi_formatted = `${site.val} Tested`;
        }
      });
      updateData({ sites: State.sites });
    } catch (e) {
      console.warn("Could not parse compact values:", e);
    }
  }

  // Country Filter: e.g. country=KSA
  if (countryParam) {
    const cUpper = countryParam.toUpperCase();
    const matchedSites = State.sites.filter(s => s.country.toUpperCase() === cUpper);
    if (matchedSites.length > 0) {
      const avgLat = matchedSites.reduce((a, b) => a + b.lat, 0) / matchedSites.length;
      const avgLon = matchedSites.reduce((a, b) => a + b.lon, 0) / matchedSites.length;
      const pos = latLonToVector3(avgLat, avgLon, GLOBE_RADIUS, 18);
      setTimeout(() => flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1200), 500);
    }
  }

  // Single Site Focus: e.g. site=Sudair
  if (siteParam) {
    const sLower = siteParam.toLowerCase();
    const found = State.sites.find(s => s.id.toLowerCase().includes(sLower) || s.name.toLowerCase().includes(sLower));
    if (found) {
      const pos = latLonToVector3(found.lat, found.lon, GLOBE_RADIUS, 15);
      setTimeout(() => flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1200), 500);
    }
  }

  // Legacy dataParam (if provided)
  if (dataParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(dataParam));
      updateData(parsed);
    } catch (e) {
      console.warn("Could not parse data query param:", e);
    }
  }
}

// Theme Switcher
function switchTheme(newTheme) {
  State.theme = newTheme;
  document.body.className = `theme-${newTheme}`;
  const isDark = newTheme !== 'executive';
  starfield.visible = isDark;
}

// ==========================================
// Raycasting & Tooltip Interactions
// ==========================================
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  let targetObjects = [];
  if (State.mode === 'globe' || State.mode === 'flow') {
    targetObjects = State.sitePins.map(p => p.children[1]).filter(Boolean);
  } else if (State.mode === 'choropleth') {
    targetObjects = Array.from(State.extrudedMeshes.values());
  } else if (State.mode === 'city') {
    targetObjects = State.cityGroup.children.filter(c => c.userData && c.userData.site);
  }

  const intersects = raycaster.intersectObjects(targetObjects, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const uData = hit.userData || hit.parent?.userData;

    if (uData && (uData.site || uData.province)) {
      showTooltip(event.clientX, event.clientY, uData.site || uData.province, uData.type);
      document.body.style.cursor = 'pointer';
      return;
    }
  }

  hideTooltip();
  document.body.style.cursor = 'default';
}

function showTooltip(x, y, data, type) {
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add('visible');

  const titleEl = document.getElementById('ttTitle');
  const badgeEl = document.getElementById('ttBadge');
  const metaEl = document.getElementById('ttMeta');
  const valLabelEl = document.getElementById('ttValLabel');
  const valNumEl = document.getElementById('ttValNum');

  if (type === 'province') {
    titleEl.textContent = data.name;
    badgeEl.textContent = 'Province / Region';
    badgeEl.className = 'tooltip-badge';
    metaEl.textContent = `Capital: ${data.capital} | Lat: ${data.center[1]}, Lon: ${data.center[0]}`;
    valLabelEl.textContent = 'Regional Index';
    valNumEl.textContent = `${data.val}%`;
  } else {
    titleEl.textContent = data.name;
    badgeEl.textContent = data.status || 'Active';
    badgeEl.className = `tooltip-badge ${data.status === 'Active Project' ? 'warning' : ''}`;
    metaEl.textContent = `${data.region || ''}, ${data.country || ''} | ${data.type || 'Facility'}`;
    valLabelEl.textContent = data.kpi_label || 'Performance KPI';
    valNumEl.textContent = data.kpi_formatted || `${data.val}%`;
  }
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

// Click to focus and fly camera
function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  let targetObjects = [];
  if (State.mode === 'globe') targetObjects = State.sitePins.map(p => p.children[1]).filter(Boolean);
  else if (State.mode === 'choropleth') targetObjects = Array.from(State.extrudedMeshes.values());

  const intersects = raycaster.intersectObjects(targetObjects, true);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const uData = hit.userData || hit.parent?.userData;
    if (uData && uData.site) {
      const pos = latLonToVector3(uData.site.lat, uData.site.lon, GLOBE_RADIUS, 18);
      flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
    } else if (uData && uData.province) {
      const c = geoToPlane(uData.province.center[0], uData.province.center[1]);
      flyToCamera({ x: c.x, y: 35, z: -c.y + 25 }, { x: c.x, y: 0, z: -c.y }, 1000);
    }
  }
}

// ==========================================
// Animation Loop
// ==========================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  // Pulse Site Beacon Rings
  State.sitePins.forEach((pin, i) => {
    const ring = pin.userData.ring;
    if (ring) {
      const scale = 1 + Math.sin(elapsedTime * 3 + i) * 0.35;
      ring.scale.set(scale, scale, 1);
      ring.material.opacity = 0.5 + Math.cos(elapsedTime * 3 + i) * 0.4;
    }
  });

  // Animated Particles on 3D Arcs
  State.animatingParticles.forEach(p => {
    p.progress += delta * 0.45;
    if (p.progress > 1) p.progress = 0;
    const pt = p.curve.getPoint(p.progress);
    p.mesh.position.copy(pt);
  });

  // Rotate City Radar Scanner
  if (State.cityRadar) {
    State.cityRadar.rotation.z += delta * 0.8;
  }

  renderer.render(scene, camera);
}

// Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Setup DOM UI Event Listeners
function setupUI() {
  // Mode Buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // Rotate Toggle
  const rotBtn = document.getElementById('btnToggleRotate');
  if (rotBtn) {
    rotBtn.addEventListener('click', () => {
      State.autoRotate = !State.autoRotate;
      controls.autoRotate = State.autoRotate;
      rotBtn.style.color = State.autoRotate ? 'var(--accent-cyan)' : 'inherit';
    });
  }

  // Theme Toggle
  const themeBtn = document.getElementById('btnToggleTheme');
  if (themeBtn) {
    const themes = ['cyber', 'satellite', 'executive'];
    themeBtn.addEventListener('click', () => {
      const nextIdx = (themes.indexOf(State.theme) + 1) % themes.length;
      switchTheme(themes[nextIdx]);
    });
  }

  // Fullscreen Toggle
  const fsBtn = document.getElementById('btnFullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Search Box
  const searchInput = document.getElementById('siteSearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      const foundSite = State.sites.find(s => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q));
      if (foundSite && State.mode === 'globe') {
        const pos = latLonToVector3(foundSite.lat, foundSite.lon, GLOBE_RADIUS, 18);
        flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
        return;
      }

      const foundProv = State.provinces.find(p => p.name.toLowerCase().includes(q));
      if (foundProv && State.mode === 'choropleth') {
        const c = geoToPlane(foundProv.center[0], foundProv.center[1]);
        flyToCamera({ x: c.x, y: 35, z: -c.y + 25 }, { x: c.x, y: 0, z: -c.y }, 1000);
      }
    });
  }

  // Dynamic Live Controller Drawer
  const ctrlHeader = document.querySelector('.controller-header');
  const ctrlDrawer = document.querySelector('.data-controller');
  if (ctrlHeader && ctrlDrawer) {
    ctrlHeader.addEventListener('click', () => {
      ctrlDrawer.classList.toggle('collapsed');
    });
  }

  // Live Slider Inputs in Drawer
  const sliders = [
    { id: 'sliderPunjab', provId: 'PK-PB' },
    { id: 'sliderSindh', provId: 'PK-SD' },
    { id: 'sliderKPK', provId: 'PK-KP' },
    { id: 'sliderBalochistan', provId: 'PK-BA' }
  ];

  sliders.forEach(s => {
    const el = document.getElementById(s.id);
    const valDisplay = document.getElementById(`${s.id}Val`);
    if (el) {
      el.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        if (valDisplay) valDisplay.textContent = `${val}%`;
        const prov = State.provinces.find(p => p.id === s.provId);
        if (prov) {
          prov.val = val;
          updateData({ provinces: State.provinces });
        }
      });
    }
  });

  // Mouse Listeners
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
}

// --- Bootstrap ---
function init() {
  buildGlobeMode();
  buildChoroplethMode();
  buildCityMode();
  setupUI();
  updateKpiDeck();
  checkUrlParams();
  animate();
  console.log("Power BI 3D Dynamic Multi-Mode Map Engine loaded successfully.");
}

window.addEventListener('DOMContentLoaded', init);
