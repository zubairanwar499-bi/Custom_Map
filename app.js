/**
 * ACWA Power DGA 3D Geospatial Digital Twin Engine
 * Visual Modes:
 *   1. 'globe'     - 3D Global Earth Orbit with Hexagonal Site Pillars, Arcs & Status Rings
 *   2. 'choropleth'- 3D Regional Country Pedestals with Stacked DGA Health Layers
 *   3. 'twin'      - 3D High-Voltage Transformer Substation Digital Twin with Gas Telemetry
 *   4. 'heatmap'   - Thermal & DGA Gas Risk Density Visualization
 * 
 * Supports: Power BI Dynamic Slicer Filtering, Hash Bridge, and In-App DGA Triage.
 */

// --- DGA Fleet Database ---
const DGA_FLEET_DATA = {
  plants: [
    { id: "ASB2", name: "ASB2 Substation", country: "KSA", region: "KSA", cluster: "Shuaibah", lat: 20.767205, lon: 39.598452, total: 301, val: 301, normal: 56, warning: 212, danger: 33, status: "Danger", type: "500kV Substation & Inverter Farm" },
    { id: "Al Kahfa", name: "Al Kahfa Solar PV", country: "KSA", region: "KSA", cluster: "Central", lat: 26.98731, lon: 42.991463, total: 239, val: 231, normal: 96, warning: 132, danger: 3, status: "Danger", type: "Solar PV Plant" },
    { id: "Ar Ras 1", name: "Ar Ras 1 Solar", country: "KSA", region: "KSA", cluster: "Central", lat: 25.591473, lon: 43.624552, total: 133, val: 133, normal: 15, warning: 118, danger: 0, status: "Warning", type: "Solar PV Plant" },
    { id: "Ar Ras 2", name: "Ar Ras 2 Solar PV", country: "KSA", region: "KSA", cluster: "Central", lat: 25.616703, lon: 43.617783, total: 294, val: 294, normal: 26, warning: 227, danger: 41, status: "Danger", type: "Solar PV Complex" },
    { id: "Sakaka", name: "Sakaka Solar PV", country: "KSA", region: "KSA", cluster: "Sakaka", lat: 29.737867, lon: 40.100346, total: 67, val: 66, normal: 17, warning: 19, danger: 30, status: "Danger", type: "Solar PV Plant" },
    { id: "Saad-2", name: "Saad-2 Solar", country: "KSA", region: "KSA", cluster: "Eastern", lat: 25.062915, lon: 47.561847, total: 157, val: 157, normal: 0, warning: 128, danger: 29, status: "Danger", type: "Solar PV Plant" },
    { id: "Sudair", name: "Sudair Mega Solar Park", country: "KSA", region: "KSA", cluster: "Eastern", lat: 25.787311, lon: 45.565428, total: 282, val: 279, normal: 203, warning: 33, danger: 43, status: "Danger", type: "1500MW Solar Park" },
    { id: "Layla", name: "Layla Solar Plant", country: "KSA", region: "KSA", cluster: "Eastern", lat: 22.309039, lon: 46.663809, total: 20, val: 20, normal: 14, warning: 5, danger: 1, status: "Danger", type: "Solar PV Plant" },
    { id: "ASB1", name: "ASB1 Substation", country: "KSA", region: "KSA", cluster: "Shuaibah", lat: 20.779612, lon: 39.562565, total: 92, val: 92, normal: 14, warning: 71, danger: 7, status: "Danger", type: "380kV Substation" },
    { id: "Red Sea", name: "Red Sea Renewable Hub", country: "KSA", region: "KSA", cluster: "Red Sea", lat: 25.500000, lon: 37.050000, total: 153, val: 147, normal: 90, warning: 35, danger: 22, status: "Danger", type: "Battery & Solar Microgrid" },
    { id: "Neom-PTR", name: "Neom Green Energy PTR", country: "KSA", region: "KSA", cluster: "North & West", lat: 27.488026, lon: 35.578474, total: 11, val: 7, normal: 7, warning: 0, danger: 0, status: "Normal", type: "Hydrogen & Wind Power" },
    { id: "S3IWP", name: "S3IWP Desalination", country: "KSA", region: "KSA", cluster: "Shuaibah", lat: 20.677962, lon: 39.528296, total: 12, val: 12, normal: 2, warning: 2, danger: 8, status: "Danger", type: "Desalination Plant" },
    { id: "Shuaa 3", name: "Shuaa 3 PV Park", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.724347, lon: 55.412206, total: 218, val: 209, normal: 67, warning: 125, danger: 17, status: "Danger", type: "800MW Solar Park" },
    { id: "Shuaa  1", name: "Shuaa 1 Solar PV", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.761863, lon: 55.368542, total: 88, val: 88, normal: 15, warning: 71, danger: 2, status: "Danger", type: "Solar PV Facility" },
    { id: "NE PVFD-1", name: "NE PVFD-1 Plant", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.749, lon: 55.436758, total: 49, val: 49, normal: 1, warning: 9, danger: 39, status: "Danger", type: "PV Substation" },
    { id: "NE PVFD-2", name: "NE PVFD-2 Plant", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.749, lon: 55.436758, total: 10, val: 10, normal: 2, warning: 7, danger: 1, status: "Danger", type: "PV Substation" },
    { id: "NE PT", name: "NE PT Substation", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.749, lon: 55.436758, total: 18, val: 18, normal: 0, warning: 11, danger: 7, status: "Danger", type: "Grid Substation" },
    { id: "NE CT", name: "NE CT Facility", country: "UAE", region: "MEASEA", cluster: "UAE", lat: 24.749, lon: 55.436758, total: 3, val: 3, normal: 0, warning: 1, danger: 2, status: "Danger", type: "Substation" },
    { id: "Ibri - II", name: "Ibri - II Solar PV", country: "Oman", region: "MEASEA", cluster: "Oman", lat: 23.36988, lon: 56.246772, total: 98, val: 98, normal: 10, warning: 5, danger: 83, status: "Danger", type: "500MW Solar PV" },
    { id: "Kom Ombo", name: "Kom Ombo Solar", country: "Egypt", region: "MEASEA", cluster: "Egypt", lat: 24.470596, lon: 32.944659, total: 32, val: 32, normal: 6, warning: 26, danger: 0, status: "Warning", type: "200MW Solar PV" },
    { id: "Ben Ben 1 - ACWA", name: "Ben Ben 1 - ACWA", country: "Egypt", region: "MEASEA", cluster: "Egypt", lat: 24.434103, lon: 32.703136, total: 32, val: 32, normal: 27, warning: 5, danger: 0, status: "Normal", type: "Solar PV Park" },
    { id: "Ben Ben 2 - ALCOM", name: "Ben Ben 2 - ALCOM", country: "Egypt", region: "MEASEA", cluster: "Egypt", lat: 24.434103, lon: 32.703136, total: 34, val: 34, normal: 27, warning: 5, danger: 2, status: "Danger", type: "Solar PV Park" },
    { id: "Ben Ben 3 - TK", name: "Ben Ben 3 - TK", country: "Egypt", region: "MEASEA", cluster: "Egypt", lat: 24.434103, lon: 32.703136, total: 15, val: 15, normal: 14, warning: 0, danger: 1, status: "Danger", type: "Solar PV Park" },
    { id: "Ouarzazate", name: "NOOR Ouarzazate Complex", country: "Morocco", region: "MEASEA", cluster: "Morocco", lat: 31.008721, lon: -6.856381, total: 18, val: 18, normal: 13, warning: 4, danger: 1, status: "Danger", type: "580MW CSP & PV Complex" },
    { id: "Laayoune", name: "NOOR Laayoune PV", country: "Morocco", region: "MEASEA", cluster: "Morocco", lat: 27.12428, lon: -13.206678, total: 22, val: 22, normal: 2, warning: 18, danger: 2, status: "Danger", type: "85MW Solar PV" },
    { id: "Boujdour", name: "NOOR Boujdour PV", country: "Morocco", region: "MEASEA", cluster: "Morocco", lat: 26.125651, lon: -14.482797, total: 6, val: 6, normal: 6, warning: 0, danger: 0, status: "Normal", type: "Solar PV Facility" },
    { id: "Risha", name: "Risha Solar PV", country: "Jordan", region: "MEASEA", cluster: "Jordan", lat: 32.568948, lon: 39.006428, total: 22, val: 22, normal: 16, warning: 4, danger: 2, status: "Danger", type: "50MW Solar Plant" },
    { id: "Mafraq", name: "Mafraq Solar PV", country: "Jordan", region: "MEASEA", cluster: "Jordan", lat: 32.346988, lon: 36.288437, total: 22, val: 9, normal: 7, warning: 1, danger: 1, status: "Danger", type: "50MW Solar Plant" },
    { id: "Riverside", name: "Riverside 1GW Solar", country: "Uzbekistan", region: "Central Asia", cluster: "Uzbekistan", lat: 41.348725, lon: 69.50193, total: 28, val: 12, normal: 5, warning: 6, danger: 1, status: "Danger", type: "1000MW Solar PV & BESS" },
    { id: "Yuanbu 105", name: "Yuanbu 105 Solar", country: "China", region: "China", cluster: "China", lat: 24.595861, lon: 112.452111, total: 38, val: 38, normal: 22, warning: 12, danger: 4, status: "Danger", type: "Renewable Complex" },
    { id: "Yanghui 50", name: "Yanghui 50 Plant", country: "China", region: "China", cluster: "China", lat: 24.325627, lon: 112.628062, total: 20, val: 20, normal: 8, warning: 9, danger: 3, status: "Danger", type: "Renewable Complex" }
  ],
  countries: [
    { id: "KSA", name: "SAUDI ARABIA", lat: 24.5, lon: 45.0, total: 1729, tested: 1699, normal: 443, warning: 951, danger: 225, color: "#10b981" },
    { id: "UAE", name: "UNITED ARAB EMIRATES", lat: 24.2, lon: 54.5, total: 386, tested: 367, normal: 85, warning: 219, danger: 66, color: "#00f0ff" },
    { id: "OMN", name: "OMAN", lat: 23.3, lon: 56.5, total: 98, tested: 98, normal: 10, warning: 5, danger: 83, color: "#8b5cf6" },
    { id: "EGY", name: "EGYPT", lat: 26.5, lon: 30.5, total: 113, tested: 113, normal: 74, warning: 36, danger: 3, color: "#f59e0b" },
    { id: "MAR", name: "MOROCCO", lat: 31.5, lon: -7.5, total: 46, tested: 46, normal: 21, warning: 22, danger: 3, color: "#ec4899" },
    { id: "JOR", name: "JORDAN", lat: 31.2, lon: 36.5, total: 44, tested: 31, normal: 23, warning: 5, danger: 3, color: "#38bdf8" },
    { id: "UZB", name: "UZBEKISTAN", lat: 41.5, lon: 64.0, total: 28, tested: 12, normal: 5, warning: 6, danger: 1, color: "#f97316" },
    { id: "CHN", name: "CHINA", lat: 34.0, lon: 105.0, total: 58, tested: 58, normal: 30, warning: 21, danger: 7, color: "#ef4444" }
  ],
  arcs: [
    { from: "Sudair Mega Solar Park", to: "ASB2 Substation", color: "#10b981" },
    { from: "Sudair Mega Solar Park", to: "Ar Ras 2 Solar PV", color: "#10b981" },
    { from: "Sudair Mega Solar Park", to: "Shuaa 3 PV Park", color: "#00f0ff" },
    { from: "Shuaa 3 PV Park", to: "Ibri - II Solar PV", color: "#8b5cf6" },
    { from: "Sudair Mega Solar Park", to: "Kom Ombo Solar", color: "#f59e0b" },
    { from: "Kom Ombo Solar", to: "NOOR Ouarzazate Complex", color: "#ec4899" },
    { from: "Sudair Mega Solar Park", to: "Risha Solar PV", color: "#38bdf8" },
    { from: "Sudair Mega Solar Park", to: "Riverside 1GW Solar", color: "#f97316" },
    { from: "Sudair Mega Solar Park", to: "Yuanbu 105 Solar", color: "#ef4444" }
  ]
};

// --- Global Engine State ---
const State = {
  mode: 'globe', // 'globe' | 'choropleth' | 'twin' | 'heatmap'
  autoRotate: false,
  statusFilter: 'all', // 'all' | 'danger' | 'warning' | 'normal'
  activePlant: DGA_FLEET_DATA.plants[6], // Default: Sudair
  plants: JSON.parse(JSON.stringify(DGA_FLEET_DATA.plants)),
  countries: JSON.parse(JSON.stringify(DGA_FLEET_DATA.countries)),
  arcs: JSON.parse(JSON.stringify(DGA_FLEET_DATA.arcs)),
  sitePins: [],
  arcLines: [],
  globeGroup: null,
  pedestalGroup: null,
  digitalTwinGroup: null,
  heatmapGroup: null,
  animatingParticles: []
};

// --- Three.js Setup ---
const container = document.getElementById('canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
// Focus on Saudi Arabia / Gulf at startup
camera.position.set(45, 38, 95);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 450;
controls.minDistance = 14;
controls.autoRotate = State.autoRotate;
controls.autoRotateSpeed = 0.5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);
const tooltip = document.getElementById('tooltip3d');

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
sunLight.position.set(120, 160, 100);
sunLight.castShadow = true;
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
rimLight.position.set(-100, -40, -100);
scene.add(rimLight);

// --- Starfield Background ---
function createStarfield() {
  const count = 1500;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 1500;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: 1.5, color: 0x94a3b8, transparent: true, opacity: 0.6 });
  return new THREE.Points(geo, mat);
}
scene.add(createStarfield());

// --- Coordinate Projection Helper ---
const GLOBE_RADIUS = 35;

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

// Procedural Dark Geospatial Earth Texture
function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep Navy Ocean
  ctx.fillStyle = '#060f23';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Landmass Silhouettes
  ctx.fillStyle = '#0f1f3d';
  ctx.strokeStyle = '#1e3860';
  ctx.lineWidth = 1.5;

  const continents = [
    [[500, 150], [900, 170], [1200, 200], [1400, 320], [1250, 480], [1050, 520], [900, 420], [700, 460], [550, 380]],
    [[550, 400], [720, 410], [730, 650], [650, 780], [580, 720], [520, 500]],
    [[150, 180], [380, 200], [300, 450], [220, 420], [180, 300]],
    [[280, 460], [390, 500], [360, 800], [290, 780], [260, 550]],
    [[1200, 620], [1350, 630], [1380, 760], [1240, 780]]
  ];

  continents.forEach(poly => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Highlight Saudi Arabia & Gulf Area
  ctx.fillStyle = '#183654';
  ctx.fillRect(720, 340, 200, 160);

  // High-Tech Latitude / Longitude Matrix Grid
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ========================================================
// 1. MODE: 3D GLOBAL ASSET FLEET (Main Mode)
// ========================================================
function buildGlobeMode() {
  State.globeGroup = new THREE.Group();

  const earthTex = createEarthTexture();
  const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const globeMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.7,
    metalness: 0.3
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeMesh.receiveShadow = true;
  State.globeGroup.add(globeMesh);

  // Atmospheric Fresnel Glow
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
        gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 1.4;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  State.globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

  // Build 3D Site Pillars
  State.sitePins = [];
  State.plants.forEach(plant => {
    const pos = latLonToVector3(plant.lat, plant.lon, GLOBE_RADIUS, 0.4);
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(pos);
    pinGroup.lookAt(new THREE.Vector3(0, 0, 0));

    // Color by DGA status
    let hexColor = 0x5a9f6c; // Normal
    if (plant.danger > 0) hexColor = 0xd96355; // Danger
    else if (plant.warning > 0) hexColor = 0xc18729; // Warning

    // Radar Pulse Ring
    const ringGeo = new THREE.RingGeometry(0.7, 1.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: hexColor, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    pinGroup.add(ringMesh);

    // Hexagonal Extruded Pillar (Height proportional to Tested Fleet)
    const pillarHeight = Math.min(Math.max((plant.val / 300) * 12 + 3.5, 3.5), 16);
    const pillarGeo = new THREE.CylinderGeometry(0.42, 0.25, pillarHeight, 6);
    pillarGeo.translate(0, pillarHeight / 2, 0);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: new THREE.Color(hexColor).multiplyScalar(0.35),
      emissiveIntensity: 0.7,
      roughness: 0.25,
      metalness: 0.8
    });
    const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
    pillarMesh.rotateX(Math.PI / 2);
    pillarMesh.castShadow = true;
    pinGroup.add(pillarMesh);

    // Glowing Cap
    const capGeo = new THREE.SphereGeometry(0.65, 16, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 0, -pillarHeight);
    pinGroup.add(capMesh);

    // Floating Site Label Tag
    const siteTag = makeMiniSiteLabel(plant.name, plant.val, hexColor);
    siteTag.position.set(0, 1.8, -pillarHeight - 1.2);
    pinGroup.add(siteTag);

    pillarMesh.userData = { site: plant, type: 'site' };
    pinGroup.userData = { site: plant, ring: ringMesh, tag: siteTag, initialScale: 1 };

    State.sitePins.push(pinGroup);
    State.globeGroup.add(pinGroup);
  });

  // Country Labels
  buildCountryLabels();

  // Transmission Grid Arcs
  buildArcs();

  scene.add(State.globeGroup);
}

// Mini Floating Site Label Sprite
function makeMiniSiteLabel(name, val, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(7, 15, 35, 0.88)';
  ctx.strokeStyle = '#' + new THREE.Color(colorHex).getHexString();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(4, 4, 172, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  const short = name.length > 12 ? name.substring(0, 10) + '..' : name;
  ctx.fillText(short, 90, 26);

  ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
  ctx.font = 'bold 15px JetBrains Mono, monospace';
  ctx.fillText(`${val} Tested`, 90, 44);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4.2, 1.35, 1);
  return sprite;
}

// Country Billboard Labels
function buildCountryLabels() {
  State.countries.forEach(c => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(6, 6, 244, 52, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 21px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(c.name, 128, 38);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(7.2, 1.9, 1);

    const pos = latLonToVector3(c.lat, c.lon, GLOBE_RADIUS, 1.6);
    sprite.position.copy(pos);
    State.globeGroup.add(sprite);
  });
}

// Transmission Grid Arcs
function buildArcs() {
  State.arcLines = [];
  State.arcs.forEach(arc => {
    const pA = State.plants.find(p => p.name === arc.from);
    const pB = State.plants.find(p => p.name === arc.to);
    if (!pA || !pB) return;

    const vA = latLonToVector3(pA.lat, pA.lon, GLOBE_RADIUS, 0.5);
    const vB = latLonToVector3(pB.lat, pB.lon, GLOBE_RADIUS, 0.5);

    const mid = new THREE.Vector3().addVectors(vA, vB).multiplyScalar(0.5);
    const dist = vA.distanceTo(vB);
    mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.35);

    const curve = new THREE.QuadraticBezierCurve3(vA, mid, vB);
    const points = curve.getPoints(45);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
    const curveMat = new THREE.LineBasicMaterial({ color: arc.color || 0x00f0ff, transparent: true, opacity: 0.6, linewidth: 2 });
    const line = new THREE.Line(curveGeo, curveMat);
    State.globeGroup.add(line);
    State.arcLines.push(line);

    // Particle
    const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    State.animatingParticles.push({ mesh: pMesh, curve: curve, progress: Math.random() });
    State.globeGroup.add(pMesh);
  });
}

// ========================================================
// 2. MODE: 3D REGIONAL PEDESTALS (Stacked DGA Health Blocks)
// ========================================================
function buildPedestalMode() {
  State.pedestalGroup = new THREE.Group();

  const grid = new THREE.GridHelper(160, 24, 0x00f0ff, 0x1e293b);
  grid.position.y = -0.1;
  State.pedestalGroup.add(grid);

  State.countries.forEach((country, idx) => {
    const angle = (idx / State.countries.length) * Math.PI * 2;
    const rad = 46;
    const px = Math.cos(angle) * rad;
    const pz = Math.sin(angle) * rad;

    const baseGroup = new THREE.Group();
    baseGroup.position.set(px, 0, pz);

    // Stacked Layers: Green (Normal), Yellow (Warning), Red (Danger)
    const normH = Math.max((country.normal / country.total) * 14, 1.2);
    const warnH = Math.max((country.warning / country.total) * 14, 1.2);
    const dangH = Math.max((country.danger / country.total) * 14, 0.8);

    // Normal Layer (Bottom)
    const gGeo = new THREE.CylinderGeometry(4.2, 4.2, normH, 16);
    gGeo.translate(0, normH / 2, 0);
    const gMesh = new THREE.Mesh(gGeo, new THREE.MeshStandardMaterial({ color: 0x5a9f6c, roughness: 0.3 }));
    gMesh.position.y = 0;
    baseGroup.add(gMesh);

    // Warning Layer (Middle)
    const yGeo = new THREE.CylinderGeometry(4.0, 4.0, warnH, 16);
    yGeo.translate(0, warnH / 2, 0);
    const yMesh = new THREE.Mesh(yGeo, new THREE.MeshStandardMaterial({ color: 0xc18729, roughness: 0.3 }));
    yMesh.position.y = normH;
    baseGroup.add(yMesh);

    // Danger Layer (Top)
    const rGeo = new THREE.CylinderGeometry(3.8, 3.8, dangH, 16);
    rGeo.translate(0, dangH / 2, 0);
    const rMesh = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ color: 0xd96355, roughness: 0.3 }));
    rMesh.position.y = normH + warnH;
    baseGroup.add(rMesh);

    // Country Billboard Label
    const totalH = normH + warnH + dangH;
    const sprite = makeCountryPedestalLabel(country.name, country.total, country.danger);
    sprite.position.set(0, totalH + 3.5, 0);
    baseGroup.add(sprite);

    baseGroup.userData = { country: country, type: 'country_pedestal' };
    State.pedestalGroup.add(baseGroup);
  });

  State.pedestalGroup.visible = false;
  scene.add(State.pedestalGroup);
}

function makeCountryPedestalLabel(name, total, danger) {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(7, 15, 35, 0.9)';
  ctx.strokeStyle = danger > 20 ? '#d96355' : '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(4, 4, 232, 82, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(name, 120, 32);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px JetBrains Mono, monospace';
  ctx.fillText(`Fleet: ${total} | Danger: ${danger}`, 120, 64);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(7.5, 2.8, 1);
  return sprite;
}

// ========================================================
// 3. MODE: 3D TRANSFORMER SUBSTATION DIGITAL TWIN
// ========================================================
function buildDigitalTwinMode() {
  State.digitalTwinGroup = new THREE.Group();

  // Substation Concrete Pad
  const padGeo = new THREE.BoxGeometry(60, 2, 50);
  padGeo.translate(0, 1, 0);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.receiveShadow = true;
  State.digitalTwinGroup.add(pad);

  // Main Transformer Tank (Steel body)
  const tankGeo = new THREE.BoxGeometry(22, 18, 14);
  tankGeo.translate(0, 9, 0);
  const tankMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0x0f172a
  });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.set(0, 2, 0);
  tank.castShadow = true;
  State.digitalTwinGroup.add(tank);
  State.twinTank = tank;

  // Radiator Cooling Fin Banks (Left & Right)
  function createRadiatorBank(xOffset) {
    const radGroup = new THREE.Group();
    radGroup.position.set(xOffset, 2, 0);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
    for (let z = -6; z <= 6; z += 1.2) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(4.5, 14, 0.4), finMat);
      fin.position.set(0, 9, z);
      fin.castShadow = true;
      radGroup.add(fin);
    }
    return radGroup;
  }
  State.digitalTwinGroup.add(createRadiatorBank(-14));
  State.digitalTwinGroup.add(createRadiatorBank(14));

  // Overhead Conservator Oil Tank (Cylinder)
  const conservGeo = new THREE.CylinderGeometry(3.2, 3.2, 16, 24);
  conservGeo.rotateZ(Math.PI / 2);
  const conservMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
  const conserv = new THREE.Mesh(conservGeo, conservMat);
  conserv.position.set(0, 26, 4);
  conserv.castShadow = true;
  State.digitalTwinGroup.add(conserv);

  // 3 High-Voltage Bushings (Porcelain Insulators with Corona Rings)
  [-6, 0, 6].forEach((bx, i) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(bx, 20, -3);

    // Insulator Cone
    const bGeo = new THREE.ConeGeometry(1.2, 11, 16);
    bGeo.translate(0, 5.5, 0);
    const bMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.5 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bGroup.add(bMesh);

    // Corona Ring
    const cRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.25, 16, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    cRing.position.y = 10;
    cRing.rotateX(Math.PI / 2);
    bGroup.add(cRing);

    // Glowing Terminal Spark
    const spark = new THREE.PointLight(0x00f0ff, 1.5, 15);
    spark.position.y = 12;
    bGroup.add(spark);

    State.digitalTwinGroup.add(bGroup);
  });

  // Digital Twin Telemetry Billboard (Live DGA Gas Concentrations)
  const dgaBoard = makeDgaTelemetryBoard();
  dgaBoard.position.set(0, 36, 0);
  State.digitalTwinGroup.add(dgaBoard);
  State.twinBoard = dgaBoard;

  State.digitalTwinGroup.visible = false;
  scene.add(State.digitalTwinGroup);
}

function makeDgaTelemetryBoard() {
  const canvas = document.createElement('canvas');
  canvas.width = 380;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(7, 15, 35, 0.92)';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(6, 6, 368, 128, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("500kV ASSET DIGITAL TWIN", 190, 36);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '16px JetBrains Mono, monospace';
  ctx.fillText("H2: 120 ppm | CH4: 45 ppm | C2H2: 0 ppm", 190, 72);
  ctx.fillText("CO: 410 ppm | CO2: 3200 ppm | Oil: 64°C", 190, 104);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(16, 6, 1);
  return sprite;
}

// ========================================================
// 4. MODE: RISK HEATMAP
// ========================================================
function buildHeatmapMode() {
  State.heatmapGroup = new THREE.Group();
  // Renders volumetric glowing danger rings around high-risk plants
  State.plants.forEach(p => {
    if (p.danger > 0) {
      const pos = latLonToVector3(p.lat, p.lon, GLOBE_RADIUS, 0.8);
      const hGeo = new THREE.RingGeometry(0.8, (p.danger / 80) * 4 + 1.5, 32);
      const hMat = new THREE.MeshBasicMaterial({ color: 0xd96355, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.copy(pos);
      hMesh.lookAt(new THREE.Vector3(0, 0, 0));
      State.heatmapGroup.add(hMesh);
    }
  });
  State.heatmapGroup.visible = false;
  scene.add(State.heatmapGroup);
}

// ========================================================
// Mode Switcher
// ========================================================
function switchMode(newMode) {
  State.mode = newMode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === newMode));

  if (State.globeGroup) State.globeGroup.visible = (newMode === 'globe');
  if (State.pedestalGroup) State.pedestalGroup.visible = (newMode === 'choropleth');
  if (State.digitalTwinGroup) State.digitalTwinGroup.visible = (newMode === 'twin');
  if (State.heatmapGroup) State.heatmapGroup.visible = (newMode === 'heatmap');

  if (newMode === 'globe' || newMode === 'heatmap') {
    flyToCamera({ x: 45, y: 38, z: 95 }, { x: 0, y: 0, z: 0 });
  } else if (newMode === 'choropleth') {
    flyToCamera({ x: 0, y: 85, z: 70 }, { x: 0, y: 8, z: 0 });
  } else if (newMode === 'twin') {
    flyToCamera({ x: -35, y: 40, z: 50 }, { x: 0, y: 15, z: 0 });
  }
}

// Camera Fly-To Animation
function flyToCamera(targetPos, targetLookAt, duration = 1200) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function animateFlight(currentTime) {
    const elapsed = currentTime - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, targetLookAt, ease);
    controls.update();

    if (t < 1) requestAnimationFrame(animateFlight);
  }
  requestAnimationFrame(animateFlight);
}

// ========================================================
// Power BI Filtering & Triage
// ========================================================
function filterMapByStatus(status) {
  State.statusFilter = status;
  document.querySelectorAll('.dga-filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === status));

  State.sitePins.forEach(pin => {
    const s = pin.userData.site;
    if (status === 'all') {
      pin.visible = true;
    } else if (status === 'danger') {
      pin.visible = (s.danger > 0);
    } else if (status === 'warning') {
      pin.visible = (s.warning > 0 && s.danger === 0);
    } else if (status === 'normal') {
      pin.visible = (s.danger === 0 && s.warning === 0);
    }
  });
}

function updateActiveSiteHud(plant) {
  State.activePlant = plant;
  document.getElementById('hudSiteName').textContent = plant.name;
  document.getElementById('hudSiteSub').textContent = `${plant.cluster || 'Cluster'} • ${plant.country} • ${plant.type || 'Power Substation'}`;
  document.getElementById('hudTestedCount').textContent = `${plant.val} / ${plant.total}`;
  document.getElementById('hudNormalCount').textContent = plant.normal;
  document.getElementById('hudWarningCount').textContent = plant.warning;
  document.getElementById('hudDangerCount').textContent = plant.danger;

  const badge = document.getElementById('hudStatusBadge');
  if (plant.danger > 0) {
    badge.textContent = 'Danger Alert';
    badge.className = 'status-pill danger';
  } else if (plant.warning > 0) {
    badge.textContent = 'DGA Warning';
    badge.className = 'status-pill warning';
  } else {
    badge.textContent = 'Normal';
    badge.className = 'status-pill normal';
  }
}

// Power BI Client Hash Listener
function applyPowerBiFiltering() {
  let hashStr = window.location.hash;
  if (!hashStr || hashStr.length <= 1) return;
  hashStr = hashStr.substring(1);

  try {
    const params = new URLSearchParams(hashStr);
    const dataStr = params.get('data');
    if (!dataStr) return;

    const payload = JSON.parse(decodeURIComponent(dataStr));
    const incomingSites = payload.sites || payload;

    if (Array.isArray(incomingSites) && incomingSites.length > 0) {
      const allowedNames = new Set(incomingSites.map(s => s.name.toLowerCase()));
      const allowedIds = new Set(incomingSites.map(s => s.id.toLowerCase()));

      let visibleCount = 0;
      let sumLat = 0;
      let sumLon = 0;
      let firstMatch = null;

      State.sitePins.forEach(pin => {
        const s = pin.userData.site;
        const matches = allowedNames.has(s.name.toLowerCase()) || allowedIds.has(s.id.toLowerCase());
        pin.visible = matches;

        if (matches) {
          visibleCount++;
          sumLat += s.lat;
          sumLon += s.lon;
          if (!firstMatch) firstMatch = s;

          const inc = incomingSites.find(x => x.id.toLowerCase() === s.id.toLowerCase() || x.name.toLowerCase() === s.name.toLowerCase());
          if (inc) Object.assign(s, inc);
        }
      });

      if (firstMatch) updateActiveSiteHud(firstMatch);

      if (visibleCount === 1 && firstMatch) {
        const pos = latLonToVector3(firstMatch.lat, firstMatch.lon, GLOBE_RADIUS, 14);
        flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
      } else if (visibleCount > 1) {
        const avgLat = sumLat / visibleCount;
        const avgLon = sumLon / visibleCount;
        const pos = latLonToVector3(avgLat, avgLon, GLOBE_RADIUS, 24);
        flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
      }
    }
  } catch (err) {
    console.warn("Hash filter parse notice:", err);
  }
}

window.addEventListener('hashchange', applyPowerBiFiltering);

// ========================================================
// Raycasting & Tooltip Interactions
// ========================================================
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  let targetObjects = [];
  if (State.mode === 'globe' || State.mode === 'heatmap') {
    targetObjects = State.sitePins.filter(p => p.visible).map(p => p.children[1]).filter(Boolean);
  } else if (State.mode === 'choropleth') {
    targetObjects = State.pedestalGroup.children;
  }

  const intersects = raycaster.intersectObjects(targetObjects, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const uData = hit.userData || hit.parent?.userData;

    if (uData && uData.site) {
      showTooltip(event.clientX, event.clientY, uData.site);
      document.body.style.cursor = 'pointer';
      return;
    }
  }

  tooltip.classList.remove('visible');
  document.body.style.cursor = 'default';
}

function showTooltip(x, y, data) {
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add('visible');

  document.getElementById('ttTitle').textContent = data.name;
  document.getElementById('ttCountry').textContent = data.country;
  document.getElementById('ttRegion').textContent = data.region || 'Region';
  document.getElementById('ttCluster').textContent = data.cluster || 'Cluster';

  const serialLine = document.getElementById('ttSerialLine');
  if (data.serial && data.serial !== '') {
    serialLine.style.display = 'block';
    document.getElementById('ttSerial').textContent = data.serial;
  } else {
    serialLine.style.display = 'none';
  }

  document.getElementById('ttNormalCount').textContent = data.normal;
  document.getElementById('ttWarningCount').textContent = data.warning;
  document.getElementById('ttDangerCount').textContent = data.danger;
  document.getElementById('ttTestedNum').textContent = data.val;
  document.getElementById('ttTotalNum').textContent = data.total;

  const pct = Math.min(Math.round((data.val / (data.total || 1)) * 100), 100);
  document.getElementById('ttProgressBar').style.width = `${pct}%`;

  const badge = document.getElementById('ttBadge');
  if (data.danger > 0) {
    badge.textContent = 'Danger';
    badge.className = 'tooltip-badge danger';
  } else if (data.warning > 0) {
    badge.textContent = 'Warning';
    badge.className = 'tooltip-badge warning';
  } else {
    badge.textContent = 'Normal';
    badge.className = 'tooltip-badge normal';
  }
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const targetObjects = State.sitePins.filter(p => p.visible).map(p => p.children[1]).filter(Boolean);
  const intersects = raycaster.intersectObjects(targetObjects, true);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const uData = hit.userData || hit.parent?.userData;
    if (uData && uData.site) {
      updateActiveSiteHud(uData.site);
      const pos = latLonToVector3(uData.site.lat, uData.site.lon, GLOBE_RADIUS, 14);
      flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
    }
  }
}

// ========================================================
// Animation Loop
// ========================================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  // Pulse Site Beacon Rings
  State.sitePins.forEach((pin, i) => {
    if (pin.visible) {
      const ring = pin.userData.ring;
      if (ring) {
        const scale = 1 + Math.sin(elapsedTime * 3.2 + i) * 0.4;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = 0.5 + Math.cos(elapsedTime * 3.2 + i) * 0.45;
      }
    }
  });

  // Animated Particles on Transmission Arcs
  State.animatingParticles.forEach(p => {
    p.progress += delta * 0.4;
    if (p.progress > 1) p.progress = 0;
    p.mesh.position.copy(p.curve.getPoint(p.progress));
  });

  renderer.render(scene, camera);
}

// Setup Event Listeners
function setupUI() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  document.querySelectorAll('.dga-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => filterMapByStatus(tab.dataset.filter));
  });

  const rotBtn = document.getElementById('btnToggleRotate');
  if (rotBtn) {
    rotBtn.addEventListener('click', () => {
      State.autoRotate = !State.autoRotate;
      controls.autoRotate = State.autoRotate;
      rotBtn.style.color = State.autoRotate ? 'var(--accent-cyan)' : 'inherit';
    });
  }

  const resetBtn = document.getElementById('btnResetView');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      flyToCamera({ x: 45, y: 38, z: 95 }, { x: 0, y: 0, z: 0 });
    });
  }

  const fsBtn = document.getElementById('btnFullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    });
  }

  const search = document.getElementById('siteSearch');
  if (search) {
    search.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      const found = State.plants.find(p => p.name.toLowerCase().includes(q) || p.cluster.toLowerCase().includes(q));
      if (found) {
        updateActiveSiteHud(found);
        const pos = latLonToVector3(found.lat, found.lon, GLOBE_RADIUS, 14);
        flyToCamera(pos, new THREE.Vector3(0, 0, 0), 1000);
      }
    });
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Bootstrap
function init() {
  buildGlobeMode();
  buildPedestalMode();
  buildDigitalTwinMode();
  buildHeatmapMode();
  setupUI();
  updateActiveSiteHud(State.activePlant);
  applyPowerBiFiltering();
  animate();
  console.log("ACWA DGA 3D Digital Twin Engine Initialized.");
}

window.addEventListener('DOMContentLoaded', init);
