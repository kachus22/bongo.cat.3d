// Detect if WebGL is supported
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//
var statsEnabled = true, container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

// Initialize the scene, objects, and so on.
function init() {
  // CONTAINER
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // CAMERA
  camera = new THREE.PerspectiveCamera( 45,
    window.innerWidth / window.innerHeight, .1, 10000 );
  camera.position.z = 30;
  camera.position.x = 0;
  camera.position.y = 0;
  scene = new THREE.Scene();

  // TEST OBJECT
  const geometry = new THREE.CubeGeometry(12, 9, 4, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial( { color: 0x222222 } );
  const circle = new THREE.Mesh( geometry, material );
  circle.position.x = 0;
  circle.position.y = 0;
  circle.position.z = 0;
  scene.add( circle );

  // POINTLIGHT
  let pointLight = new THREE.PointLight( 0xFFFFFF );
  pointLight.position.z = 1000;
  scene.add(pointLight);

  // RENDERER
  renderer = new THREE.WebGLRenderer();
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
  camera.position.x += ( mouseX - camera.position.x ) * .005;
  camera.position.y += ( - mouseY - camera.position.y ) * .005;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}