// Detect if WebGL is supported
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

// Vector for motion
const ARMS_SPEED = 0.45;
var armsMovement = [ -ARMS_SPEED, -ARMS_SPEED ]

var statsEnabled = true, container, stats;
var camera, controls, renderer, scene;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
const CAT_COLOR = 0xFFFFFF;
const PAWS_COLOR = 0xFE9BA1

// AUDIO
// Create an AudioListener to use sounds.
const listener = new THREE.AudioListener();
// Create a global audio source.
const sound = new THREE.Audio( listener );
// Create a second global audio source.
const sound1 = new THREE.Audio( listener );
// Load a sound and set it as the Audio object's buffer.
const audioLoader = new THREE.AudioLoader();

// TEXTURES
// create an TextureLoader to use textures.
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('');
var cat, body, ears, arms, eyes, smile, bongos, legs, table, house;

const ballPosition = new THREE.Vector3( 0, - 45, 0 );
const ballSize = 60; //40

let sphere;
let object;

init();
animate();

function init() {
  // CONTAINER
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // SCENE
  // Create a new Three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xd8b365 );
  scene.fog = new THREE.Fog( 0xd8b365, 500, 10000 );

  // CAMERA
  // Create a camera so we can view the scene
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 800, 350, 1500 );

  // LIGHTS
  const ambientLight = new THREE.AmbientLight( 0x666666 );
  // ambientLight.intensity = 0.2;
  scene.add( ambientLight );

  const light = new THREE.DirectionalLight( 0xdfebff, 1 );
  light.position.set( 60, 150, -120 );
  light.position.multiplyScalar( 1.3 );
  light.castShadow = true;
  // light.intensity = 0.9;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  const d = 300;
  light.shadow.camera.left = - d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = - d;
  light.shadow.camera.far = 1000;
  scene.add( light );

  const light2 = new THREE.DirectionalLight( 0xff0000, 1 );
  light2.position.set( 20, 0, -100 );
  light2.position.multiplyScalar( 1.3 );
  scene.add( light2 );

  // const light3 = new THREE.DirectionalLight( 0xff0000, 1 );
  // light3.position.set( 60, 150, -120 );
  // light3.position.multiplyScalar( 1.3 );
  // light3.castShadow = true;
  // light3.intensity = 1.4;
  // light3.shadow.mapSize.width = 1024;
  // light3.shadow.mapSize.height = 1024;

  // light3.shadow.camera.left = - d;
  // light3.shadow.camera.right = d;
  // light3.shadow.camera.top = d;
  // light3.shadow.camera.bottom = - d;
  // light3.shadow.camera.far = 1000;
  // scene.add( light3 );

  const light4 = new THREE.DirectionalLight( 0xff0000, 1 );
  light4.position.set( 80, 80, -80 );
  light4.position.multiplyScalar( 2.3 );
  light4.castShadow = true;
  light4.intensity = 1.4;
  light4.shadow.mapSize.width = 1024;
  light4.shadow.mapSize.height = 1024;

  light4.shadow.camera.left = - d;
  light4.shadow.camera.right = d;
  light4.shadow.camera.top = d;
  light4.shadow.camera.bottom = - d;
  light4.shadow.camera.far = 1000;
  scene.add( light4 );

  // SPHERE
  const ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
  const ballMaterial = new THREE.MeshLambertMaterial();

  sphere = new THREE.Mesh( ballGeo, ballMaterial );
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.visible = false;
  scene.add( sphere );

  setPositions();

  // RENDERER
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  // Set the viewport size
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.outputEncoding = THREE.sRGBEncoding;
  // Turn on shadows
  renderer.shadowMap.enabled = true;
  // Attach the Three.js renderer
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
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 800;
  controls.maxDistance = 4000;
  controls.update();
}

function scaleObject(object) {
  object.scale.x = 30
  object.scale.y = 30
  object.scale.z = 30
}

function setPositions() {
  buildGround();
  buildCat();
  buildTable();
  buildBongos();

  scaleObject(table);
  scaleObject(cat);
  scaleObject(bongos);
  scene.add(table);
  scene.add(cat);
  scene.add(bongos);
  cat.position.y = -40;
  bongos.position.y = -40;
  table.position.y = -140;
  table.position.z = 310;
  buildTrees();
}

// For future usage, let the animations work.
function animate() {
  requestAnimationFrame( animate );
  render();
  if ( statsEnabled ) stats.update();
}

// Render the scene
function render() {
  sphere.position.copy( ballPosition );
  // For future reference, to move the camera position based on the mouse position.
  // camera.position.x += ( mouseX - camera.position.x ) * .005;
  // camera.position.y += ( - mouseY - camera.position.y ) * .005;
  camera.lookAt( scene.position );
  // controls.update();
  // console.log(camera.position);
  // arms[0].rotation.x = Math.PI * 0.5;
  
  movement(0);
  movement(1);

  renderer.render( scene, camera );
}

function movement(index) {
  if(arms[index].rotation.x <= Math.PI * 0.5 && arms[index].rotation.x >= 0.4) {
    arms[index].rotation.x += armsMovement[index];
  }

  if(arms[index].rotation.x < 0.4) {
    arms[index].rotation.x = 0.4;
  } else if(arms[index].rotation.x > Math.PI * 0.5) {
    arms[index].rotation.x = Math.PI * 0.5 ;
  }
}
      

function buildCat() { 
  cat = new THREE.Object3D();
  buildBody();
  buildArms();
  buildLegs();
  buildEars();
  buildEyes();
  buildSmile();
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
  body.receiveShadow = true;
  body.castShadow = true;
  cat.add(body);
}

function buildEars() {
  ears = [];
  const geometry = new THREE.ConeGeometry( 1.2, 1.3, 32, true );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  ears.push( new THREE.Mesh( geometry, material ) );
  ears[0].position.set(-2.7, 6.1, 0);
  ears[0].rotation.z = 0.4;
  ears[0].receiveShadow = true;
  ears[0].castShadow = true;
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
  sleeve.receiveShadow = true;
  sleeve.castShadow = true;
  return sleeve;
}

function buildLimbSmallEnd() {
  const geometry = new THREE.SphereGeometry( 1.2, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  const hand = new THREE.Mesh( geometry, material );
  hand.rotation.x = Math.PI * 1.5  ;
  hand.position.y = 2;
  hand.receiveShadow = true;
  hand.castShadow = true;
  return hand;
}

function buildLimbBigEnd() {
  const geometry = new THREE.SphereGeometry( 1.6, 32, 32, 0, Math.PI );
  const material = new THREE.MeshLambertMaterial( { color: CAT_COLOR } );
  const elbow = new THREE.Mesh( geometry, material );
  elbow.rotation.x = Math.PI * 0.5  ;
  elbow.position.y = -2;
  elbow.receiveShadow = true;
  elbow.castShadow = true;
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
  paws[0].receiveShadow = true;
  paws[0].castShadow = true;
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
  paws[0].receiveShadow = true;
  paws[0].castShadow = true;
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
  const geometry = new THREE.BoxGeometry(20, 10, 0.8);
  const texture = loader.load('img/wood-texture.jpg');
  const material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture, bumpScale: 1 } );
  table = new THREE.Mesh(geometry, material);
  table.position.set( 0, -3.36, 11);
  table.rotation.x = Math.PI * 0.5;
  table.castShadow = true;
  table.receiveShadow = true;
  buildTableLegs();
}

function buildTableLegs() {
  const geometry = new THREE.BoxGeometry(10, 3.2, 1);
  const texture = loader.load('img/wood-texture.jpg');
  const material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture, bumpScale: 1 } );
  // const material = new THREE.MeshPhongMaterial({ color: 'purple' });
  const leg = new THREE.Mesh(geometry, material);
  leg.position.set( 9, 0, 2);
  leg.rotation.x = Math.PI * 0.5;
  leg.rotation.y = Math.PI * 0.5;
  leg.castShadow = true;
  leg.receiveShadow = true;
  const leg1 = leg.clone();
  leg1.position.x = -9;
  table.add(leg);
  table.add(leg1);
}

function buildBongos() {
  bongos = new THREE.Object3D();
  const x = -3;
  const y = -1.45;
  const z = 8;
  const geometry = new THREE.CylinderGeometry( 2, 1.6, 3, 32 );
  const topTexture = loader.load('img/bongo-texture-top.png');
  topTexture.center = new THREE.Vector2(0.5, 0.5);
  topTexture.rotation = -Math.PI * 0.5;
  const sidesTexture = loader.load('img/bongo-texture-sides.jpg');
  const materials = [
    new THREE.MeshPhongMaterial( { map: sidesTexture, bumpMap: sidesTexture, bumpScale: 1 } ),
    new THREE.MeshPhongMaterial( { map: topTexture, bumpMap: topTexture, bumpScale: 1  } ),
    new THREE.MeshPhongMaterial({map: loader.load('img/wood-texture.jpg')})
  ]
  const bongo1 = new THREE.Mesh( geometry, materials );
  bongo1.position.set( x, y, z);
  bongo1.receiveShadow = true;
  bongo1.castShadow = true;
  const bongo2 = bongo1.clone();
  bongo2.position.x = -x;
  bongos.add( bongo1 );
  bongos.add( bongo2 );
  buildBongosBridge();
}

function buildBongosBridge() {
  const geometry = new THREE.BoxGeometry(4, 1, 1);
  const texture = loader.load('img/bongo-texture-connection.png');
  const material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: texture, bumpScale: 1, side: THREE.DoubleSide });
  const bridge = new THREE.Mesh(geometry, material);
  bridge.position.set( 0, -1.3, 8);
  bongos.add( bridge );
}

function buildGround() {
  const texture = loader.load( 'img/grass-texture.jpg' );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 25, 25 );
  texture.anisotropy = 16;
  texture.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshLambertMaterial( { map: texture } );
  let ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), material );
  ground.position.y = - 250;
  ground.rotation.x = - Math.PI / 2;
  ground.receiveShadow = true;
  scene.add( ground );
}

function buildTrees() {
  const treesToAdd = Math.floor(Math.random() * 8) + 4;
  // const treesToAdd = 1;
  for( let i = 0; i <= treesToAdd; i++) {
    let newTree = buildTree();
    let randomX = -1 * (Math.floor(Math.random() * 2000) + 800);
    let randomZ = Math.floor(Math.random() * 4000) + 700 * randomSign();
    newTree.position.set(randomX, 0, randomZ);
    newTree.castShadow = true;
    newTree.receiveShadow = true;
    scene.add(newTree);
  }

  for( let i = 0; i <= treesToAdd; i++) {
    let newTree = buildTree();
    let randomX = -1 * (Math.floor(Math.random() * 2000) + 800);
    let randomZ = (Math.floor(Math.random() * 4000) + 1200) * -1;
    newTree.position.set(randomX, 0, randomZ);
    newTree.castShadow = true;
    newTree.receiveShadow = true;
    scene.add(newTree);
  }

  for( let i = 0; i <= treesToAdd/2; i++) {
    let newTree = buildTree();
    let randomX = (Math.floor(Math.random() * 1000) + 400);
    let randomZ = (Math.floor(Math.random() * 2000) + 1000) * -1;
    newTree.position.set(randomX, 0, randomZ);
    newTree.castShadow = true;
    newTree.receiveShadow = true;
    scene.add(newTree);
  }
}

function buildTree() {
  const geometry = new THREE.BoxGeometry(220, 800, 180);
  const texture = loader.load('img/tree-texture.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 4 );
  const material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture, bumpScale: 0.8 } );
  let tree = new THREE.Mesh(geometry, material);
  tree.castShadow = true;
  tree.receiveShadow = true;
  let leaves = buildTreeLeaves();
  tree.add(leaves);
  return tree;
}

function buildTreeLeaves() {
  const geometry = new THREE.BoxGeometry(520, 500, 380);
  const texture = loader.load('img/leave-texture.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );
  const material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture, bumpScale: 1 } );
  let leaves = new THREE.Mesh(geometry, material);
  leaves.position.y = 380;
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  const leavesToAdd = Math.floor(Math.random() * 8) + 2;
  for( let i = 0; i <= leavesToAdd; i++) {
    leaves.add(buildTreeLeavesRandom());
  }
  return leaves;
}

function buildTreeLeavesRandom() {
  let randomX = Math.floor(Math.random() * 300) + 100;
  let randomY = Math.floor(Math.random() * 400) + 250;
  let randomZ = Math.floor(Math.random() * 400) + 200;
  const geometry = new THREE.BoxGeometry(randomX, randomY, randomZ);
  const texture = loader.load('img/leave-texture.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );
  const material = new THREE.MeshPhongMaterial( { map: texture, bumpMap: texture, bumpScale: 1 } );
  let leaves = new THREE.Mesh(geometry, material);
  leaves.position.y = Math.floor(Math.random() * 260) * randomSign();
  leaves.position.x = Math.floor(Math.random() * 260) * randomSign();
  leaves.position.z = Math.floor(Math.random() * 180) * randomSign();
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  return leaves;
}

function randomSign() {
  return -1 + Math.round(Math.random()) * 2;
}

// Function to play bongo 0 sound.
function playBongo0() {
  audioLoader.load( 'sounds/bongo0.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( false );
    sound.setVolume( 0.5 );
    sound.play();
  });
}

// Function to stop bongo 0 sound.
function stopBongo0() {
  audioLoader.load( 'sounds/bongo0.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.stop();
  });
}

// Function to play bongo 1 sound.
function playBongo1() {
  audioLoader.load( 'sounds/bongo1.mp3', function( buffer ) {
    sound1.setBuffer( buffer );
    sound1.setLoop( false );
    sound1.setVolume( 0.5 );
    sound1.play();
  });
}

// Function to stop bongo 1 sound.
function stopBongo1() {
  audioLoader.load( 'sounds/bongo1.mp3', function( buffer ) {
    sound1.setBuffer( buffer );
    sound1.stop();
  });
}

// Function to handle keyboard events.
// Specifically when the key is pressed
function handleKeyDown(event) {
  console.log(event.keyCode);
  console.log(arms[0].rotation.x)
  if (event.keyCode === 65) { //64 is "a"
    armsMovement[1] = ARMS_SPEED;
    playBongo1();
  } else if (event.keyCode === 68) {
    armsMovement[0] = ARMS_SPEED;
    playBongo0();
  }
}

// Function to handle keyboard events.
// Specifically when the key is depressed :(
function handleKeyUp(event) {
  if (event.keyCode === 65) { // 'a' was pressed
    armsMovement[1] = -ARMS_SPEED;
    stopBongo1();
    
  } else if (event.keyCode === 68) { // 'd' was pressed
    armsMovement[0] = -ARMS_SPEED;
    stopBongo0();
  }
}

window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);