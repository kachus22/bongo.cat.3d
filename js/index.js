// Detect if WebGL is supported
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var statsEnabled = true, container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls;
const CAT_COLOR = 0xFFFFFF;
const PAWS_COLOR = 0xFE9BA1;
var cat, body, ears, arms, eyes, smile, bongos, legs;

init();
animate();

// Initialize the scene, objects, and so on.
function init() {
  // CONTAINER
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // CAMERA
  camera = new THREE.PerspectiveCamera( 45,
    window.innerWidth / window.innerHeight, .1, 1000 );
  camera.position.x = 14;
  camera.position.y = 12;
  camera.position.z = 40;
  // camera.position.x = 0;
  // camera.position.y = 0;
  // camera.position.z = 38;
  scene = new THREE.Scene();

  buildCat();
  buildTable();
  buildBongos();

  // POINTLIGHT
  let pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = 1000;
  // pointLight.position.y = -200; 
  scene.add(pointLight);
  pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = -1000;
  pointLight.position.y = -200; 
  scene.add(pointLight);
  pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = 0;
  pointLight.position.y = 100; 
  pointLight.position.x = 50; 
  scene.add(pointLight);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // MONITOR
  if ( statsEnabled ) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    stats.domElement.style.right = 'calc(50% - 35px)';
    container.appendChild( stats.domElement );
  }

  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0.5, 0 );
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = false;
}

// For future usage, let the animations work.
function animate() {
  requestAnimationFrame( animate );
  render();
  if ( statsEnabled ) stats.update();
}

// Render the scene
function render() {
  // For future reference, to move the camera position based on the mouse position.
  // camera.position.x += ( mouseX - camera.position.x ) * .005;
  // camera.position.y += ( - mouseY - camera.position.y ) * .005;
  camera.lookAt( scene.position );
  // controls.update();
  // console.log(camera.position);
  arms[0].rotation.x = Math.PI * 0.5;
  renderer.render( scene, camera );
}

function buildCat() { 
  cat = new THREE.Object3D();
  buildBody();
  buildArms();
  buildLegs();
  buildEars();
  buildEyes();
  buildSmile();
  scene.add(cat);
}

function buildBody() {
  let points = [];
  // The Egg Ecuation
  // x coordinate should be greater than zero to avoid degenerate triangles; it is not in this formula.
  // References: 
  // - http://nyjp07.com/index_egg_E.html
  // - https://stackoverflow.com/a/37107107/9483156
  for ( let deg = 0; deg <= 180; deg += 4 ) {
    let rad = Math.PI * deg / 180;
    let x = (( 0.94 + .02 * Math.cos( rad ) ) * Math.sin( rad ));
    let y = - Math.cos( rad ) * 1.1;
    let point = new THREE.Vector2( x * 6, y * 6 );
    points.push( point );
  }
  const geometry = new THREE.LatheBufferGeometry( points, 32 );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  body = new THREE.Mesh( geometry, material );
  body.position.set(0, 0, 0);
  cat.add(body);
}

function buildEars() {
  ears = [];
  const geometry = new THREE.ConeGeometry( 1.2, 1.3, 32, true );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  ears.push( new THREE.Mesh( geometry, material ) );
  ears[0].position.set(-2.7, 6.1, 0);
  ears[0].rotation.z = 0.4;
  ears.push( ears[0].clone() )
  ears[1].position.set(2.7, 6.1, 0);
  ears[1].rotation.z = -0.42;
  cat.add(ears[0]);
  cat.add(ears[1]);
}

function buildLimb() {
  const geometry = new THREE.CylinderGeometry( 1.2, 1.6, 4, 32 );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  const sleeve = new THREE.Mesh( geometry, material );
  return sleeve;
}

function buildLimbSmallEnd() {
  const geometry = new THREE.SphereGeometry( 1.2, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR, side: THREE.DoubleSide } );
  const hand = new THREE.Mesh( geometry, material );
  hand.rotation.x = Math.PI * 1.5  ;
  hand.position.y = 2;
  return hand;
}

function buildLimbBigEnd() {
  const geometry = new THREE.SphereGeometry( 1.6, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR, side: THREE.DoubleSide } );
  const elbow = new THREE.Mesh( geometry, material );
  elbow.rotation.x = Math.PI * 0.5  ;
  elbow.position.y = -2;
  return elbow;
}

function buildPaws() {
  const paws = [ new THREE.Object3D(), new THREE.Object3D() ];
  let geometry = new THREE.SphereGeometry( 0.55, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: PAWS_COLOR, side: THREE.DoubleSide } );
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, 2, 0.8);
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.35, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, 2.7, 0.7);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.28, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(-0.5, 2.4, 0.8);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.28, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0.5, 2.4, 0.8);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  return paws;
}

function buildPawsBottom() {
  const paws = [ new THREE.Object3D(), new THREE.Object3D() ];
  let geometry = new THREE.SphereGeometry( 1, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: PAWS_COLOR, side: THREE.DoubleSide } );
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, -2.7, -0.2);
  sphere.scale.x = 1.1;
  sphere.rotation.x = Math.PI*0.5;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.65, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, -2.90, 0.42);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.rotation.x = Math.PI*0.5;
  sphere.scale.x = 1.1;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.55, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(-0.5, -2.95, 0.3);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.rotation.x = Math.PI*0.5;
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  geometry = new THREE.SphereGeometry( 0.55, 32, 32, 0, Math.PI );
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0.5, -2.95, 0.3);
  sphere.rotation.x = -Math.PI*0.25;
  sphere.rotation.x = Math.PI*0.5;
  sphere.scale.x = 0.9;
  paws[0].add( sphere );
  return paws;
}

function buildArms() {
  const x = 4;
  const y = 1;
  const z = 2.5;
  const xRotation = 0.4;
  const zRotation = -0.08;
  arms = []
  arms.push( new THREE.Object3D() );
  arms[0].position.set(x, y, z);
  arms[0].rotation.x = xRotation;
  arms[0].rotation.z = -zRotation;
  arms[0].add(buildLimb());
  arms[0].add(buildLimbSmallEnd());
  arms[0].add(buildLimbBigEnd());
  const paws = buildPaws();
  arms[0].add( paws[0] );
  arms[0].scale.z = 0.8;
  arms[0].scale.y = 1;
  arms[0].children.map((x) => {
    x.position.y += 2;
  });
  arms.push( arms[0].clone() );
  arms[1].position.x = -x;
  arms[1].rotation.z = zRotation;
  cat.add(arms[0]);
  cat.add(arms[1]);
}

function buildLegs() {
  const x = 3.5;
  const y = -5.5;
  const z = 4.5;
  const xRotation = Math.PI * 1.55;
  const zRotation = -0.5;
  legs = []
  legs.push( new THREE.Object3D() );
  legs[0].position.set(x, y, z);
  legs[0].rotation.x = xRotation;
  legs[0].rotation.z = -zRotation;
  legs[0].add(buildLimb());
  legs[0].add(buildLimbSmallEnd());
  legs[0].add(buildLimbBigEnd());
  const paws = buildPawsBottom();
  legs[0].add( paws[0] );
  legs[0].scale.z = 1;
  legs[0].scale.y = 1;
  legs[0].children.map((x) => {
    x.position.y += 2;
  });
  legs.push( legs[0].clone() );
  legs[1].position.x = -x;
  legs[1].rotation.z = zRotation;
  cat.add( legs[0] );
  cat.add( legs[1] ); 
}

function buildEyes() {
  const x = -1.5;
  const y = 3.5;
  const z = 4.2;
  eyes = new THREE.Object3D();
  const geometry = new THREE.SphereGeometry( 0.36, 32, 32 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00000 } );
  const eye1 = new THREE.Mesh( geometry, material );
  eye1.position.set(x, y, z);
  const eye2 = eye1.clone();
  eye2.position.x = -x;
  eyes.add( eye1 );
  eyes.add( eye2 );
  cat.add(eyes);
}

function buildSmile() {
  smile = new THREE.Object3D();
  const numPoints = 100;
  const start = new THREE.Vector3(0.48, 0, 0);
  const middle = new THREE.Vector3(0, 0.7, 0);
  const end = new THREE.Vector3(-0.48, 0, 0);
  const path = new THREE.QuadraticBezierCurve3(start, middle, end);
  const tube = new THREE.TubeGeometry(path, numPoints, 0.1, 10, false);
  const material = new THREE.MeshLambertMaterial( { color: 0x00000 } );
  const side1 = new THREE.Mesh(tube, material);
  side1.position.set( -0.45, 3.5, 4.7);
  side1.rotation.x = -0.6;
  side1.rotation.z = Math.PI;
  const side2 = side1.clone();
  side2.position.x = 0.45;
  smile.add(side1);
  smile.add(side2);
  cat.add(smile);
}

function buildTable() {
  const geometry = new THREE.BoxGeometry(20, 10, 0.5);
  const material = new THREE.MeshPhongMaterial({ color: 'purple' });
  const table = new THREE.Mesh(geometry, material);
  table.position.set( 0, -3.2, 11);
  table.rotation.x = Math.PI * 0.5;
  scene.add(table);
}

function buildBongos() {
  bongos = new THREE.Object3D();
  const x = -3;
  const y = -1.45;
  const z = 8;
  const geometry = new THREE.CylinderGeometry( 2, 1.6, 3, 32 );
  const material = new THREE.MeshLambertMaterial( { color: 'green' } );
  const bongo1 = new THREE.Mesh( geometry, material );
  bongo1.position.set( x, y, z);
  const bongo2 = bongo1.clone();
  bongo2.position.x = -x;
  bongos.add( bongo1 );
  bongos.add( bongo2 );
  buildBongosBridge();
  scene.add( bongos );
}

function buildBongosBridge() {
  const geometry = new THREE.BoxGeometry(4, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 'green' });
  const bridge = new THREE.Mesh(geometry, material);
  bridge.position.set( 0, -1.3, 8);
  bongos.add( bridge );
}
