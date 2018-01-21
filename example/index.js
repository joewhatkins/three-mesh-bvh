import * as THREE from '../node_modules/three/build/three.module.js'
import Stats from '../node_modules/stats.js/src/Stats.js'
import TriangleBoundsTreeVisualizer from '../lib/TriangleBoundsTreeVisualizer.js'
import '../index.js'

const bgColor = 0x263238 / 2;

// renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(bgColor, 1);
document.body.appendChild(renderer.domElement);

// scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x263238 / 2, 20, 60)
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(1,1,1);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4))

// geometry setup
const radius = 1;
const tube = .3;
const tubularSegments = 400;
const radialSegments = 100;

let boundsViz = null;
const containerObj = new THREE.Object3D();
const knotGeometry = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments);
// const knotGeometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments);
const material = new THREE.MeshPhongMaterial({ color: 0xE91E63 });        
containerObj.scale.multiplyScalar(10);
scene.add(containerObj);

// camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.z = 40;
camera.far = 100;
camera.updateProjectionMatrix()

// stats setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// Create ray casters in the scene
const rayCasterObjects = [];
const raycaster = new THREE.Raycaster();
const sphere = new THREE.SphereGeometry(.25, 20, 20);
const cylinder = new THREE.CylinderGeometry(0.02, 0.02);
const pointDist = 25;

const knots = [];
const options = {
    raycasters: {
        count: 50,
        speed: 1,
    },

    mesh: {
        count: 1,
        useBoundsTree: true,
        visualizeBounds: false,
        speed: 1,
        visualBoundsDepth: 10
    }
}

// Delta timer
let lastFrameTime = null;
let deltaTime = 0;

const addKnot = () => {
    const mesh = new THREE.Mesh(knotGeometry, material);
    mesh.rotation.x = Math.random() * 10;
    mesh.rotation.y = Math.random() * 10;
    knots.push(mesh);
    containerObj.add(mesh);
}

const addRaycaster = () => {
    // Objects
    const obj = new THREE.Object3D();
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const origMesh = new THREE.Mesh(sphere, material);
    const hitMesh = new THREE.Mesh(sphere, material);
    hitMesh.scale.multiplyScalar(0.5);

    const cylinderMesh = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }));

    // Init the rotation root
    obj.add(cylinderMesh);
    obj.add(origMesh);
    obj.add(hitMesh);
    scene.add(obj);

    // set transforms
    origMesh.position.set(pointDist, 0, 0);
    obj.rotation.x = Math.random() * 10;
    obj.rotation.y = Math.random() * 10;

    // reusable vectors
    const origvec = new THREE.Vector3();
    const dirvec = new THREE.Vector3();
    const xdir = (Math.random() - 0.5);
    const ydir = (Math.random() - 0.5);
    rayCasterObjects.push({
        update: () => {
            obj.rotation.x += xdir * 0.0001 * options.raycasters.speed * deltaTime;
            obj.rotation.y += ydir * 0.0001 * options.raycasters.speed * deltaTime;

            origMesh.updateMatrixWorld();
            origvec.setFromMatrixPosition(origMesh.matrixWorld);
            dirvec.copy(origvec).multiplyScalar(-1).normalize();

            raycaster.set(origvec, dirvec);
            const res = raycaster.intersectObject(containerObj, true);
            const length = res.length ? res[0].distance : 1000;
            
            hitMesh.position.set(pointDist - length, 0, 0);
            
            cylinderMesh.position.set(pointDist - (length / 2), 0, 0);
            cylinderMesh.scale.set(1, length, 1);

            cylinderMesh.rotation.z = Math.PI / 2;
        },

        remove: () => {
            scene.remove(obj);
        }
    });
}

const updateFromOptions = () => {
    // Update raycaster count
    while (rayCasterObjects.length > options.raycasters.count) rayCasterObjects.pop().remove();
    while (rayCasterObjects.length < options.raycasters.count) addRaycaster();

    // Update whether or not to use the bounds tree
    if (!options.mesh.useBoundsTree && knotGeometry.boundsTree) knotGeometry.disposeBoundsTree();
    if (options.mesh.useBoundsTree && !knotGeometry.boundsTree) {
        console.time('computing bounds tree');
        knotGeometry.computeBoundsTree();
        console.timeEnd('computing bounds tree');
    }

    // Update knot count
    const oldLen = knots.length;
    while (knots.length > options.mesh.count) {
        containerObj.remove(knots.pop());
    }
    while (knots.length < options.mesh.count) {
        addKnot();
    }

    if (oldLen !== knots.length) {
        const lerp = (a, b, t) => a + (b - a) * t;
        const lerpAmt = (knots.length - 1) / (300 - 1);
        const dist = lerp(0, 2, lerpAmt);
        const scale = lerp(1, 0.2, lerpAmt);

        knots.forEach(c => {
            c.scale.set(1, 1, 1).multiplyScalar(scale);

            const vec3 = new THREE.Vector3(0, 1, 0);
            vec3.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * Math.random());
            vec3.applyAxisAngle(new THREE.Vector3(0, 1, 0), 2 * Math.PI * Math.random());
            vec3.multiplyScalar(dist)

            c.position.set(vec3.x, vec3.y, vec3.z);
        })
    }

    // Update bounds viz
    if (boundsViz && !options.mesh.visualizeBounds) {
        containerObj.remove(boundsViz);
        boundsViz = null;
    }
    if (!boundsViz && options.mesh.visualizeBounds) {
        boundsViz = new TriangleBoundsTreeVisualizer(knots[0]);
        containerObj.add(boundsViz);
    }

    if(boundsViz) boundsViz.depth = options.mesh.visualBoundsDepth;
}

containerObj.rotation.x = 10.989999999999943;
containerObj.rotation.y = 10.989999999999943;
const render = () => {
    stats.begin();

    const currTime = window.performance.now();
    lastFrameTime = lastFrameTime || currTime;
    deltaTime = currTime - lastFrameTime;

    containerObj.rotation.x += 0.0001 * options.mesh.speed * deltaTime;
    containerObj.rotation.y += 0.0001 * options.mesh.speed * deltaTime;
    containerObj.children.forEach(c => {
        c.rotation.x += 0.0001 * options.mesh.speed * deltaTime;
        c.rotation.y += 0.0001 * options.mesh.speed * deltaTime;
    })
    containerObj.updateMatrixWorld();

    if(boundsViz) boundsViz.update();
    
    // raycaster.set(camera.position, new THREE.Vector3(0, 0, -1));

    // const st = window.performance.now();
    // raycaster.intersectObject(containerObj, true);
    // console.log(window.performance.now() - st, 'ms')

    rayCasterObjects.forEach(f => f.update());

    renderer.render(scene, camera);

    lastFrameTime = currTime;

    stats.end();
    
    requestAnimationFrame(render);
};

// Run
const gui = new dat.GUI();
const rcfolder = gui.addFolder('Raycasters');
rcfolder.add(options.raycasters, 'count').min(1).max(400).step(1).onChange(() => updateFromOptions());
rcfolder.add(options.raycasters, 'speed').min(0).max(20);
rcfolder.open();

const meshfolder = gui.addFolder('Mesh');
meshfolder.add(options.mesh, 'count').min(1).max(300).step(1).onChange(() => updateFromOptions());
meshfolder.add(options.mesh, 'useBoundsTree').onChange(() => updateFromOptions());
meshfolder.add(options.mesh, 'speed').min(0).max(20);
meshfolder.add(options.mesh, 'visualizeBounds').onChange(() => updateFromOptions());
meshfolder.add(options.mesh, 'visualBoundsDepth').min(1).max(40).step(1).onChange(() => updateFromOptions());
meshfolder.open();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

updateFromOptions();
render();