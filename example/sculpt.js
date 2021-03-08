import Stats from 'stats.js/src/Stats';
import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
	acceleratedRaycast,
	computeBoundsTree,
	disposeBoundsTree,
	CONTAINED,
	INTERSECTED,
	NOT_INTERSECTED,
	MeshBVHVisualizer,
} from '../src/index.js';
import "@babel/polyfill";

THREE.Mesh.prototype.raycast = acceleratedRaycast;
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

let stats;
let scene, camera, renderer, controls;
let targetMesh, brush, symmetryBrush, bvhHelper;
let normalZ = new THREE.Vector3( 0, 0, 1 );
let mouse = new THREE.Vector2(), lastMouse = new THREE.Vector2();
let mouseState = false, lastMouseState = false;
let lastCastPose = new THREE.Vector3();
let matcap;

const params = {
	size: 0.1,
	brush: 'clay',
	intensity: 50,
	maxSteps: 10,
	invert: false,
	symmetrical: true,
	flatShading: false,

	depth: 10,
	displayHelper: false,
};

init();
render();

// reset the sculpt mesh
function reset() {

	// dispose of the mesh if it exists
	if ( targetMesh ) {

		targetMesh.geometry.dispose();
		targetMesh.material.dispose();
		scene.remove( targetMesh );

	}

	// load the mat cap material if it hasn't been made yet
	if ( ! matcap ) {

		matcap = new THREE.TextureLoader().load( '../textures/skinHazardousarts2.jpg' );

	}

	// merge the vertices because they're not already merged
	let geometry = new THREE.IcosahedronBufferGeometry( 1, 100 );
	geometry.deleteAttribute( 'uv' );
	geometry = BufferGeometryUtils.mergeVertices( geometry );
	geometry.attributes.position.setUsage( THREE.DynamicDrawUsage );
	geometry.attributes.normal.setUsage( THREE.DynamicDrawUsage );
	geometry.computeBoundsTree();

	// disable frustum culling because the verts will be updated
	targetMesh = new THREE.Mesh(
		geometry,
		new THREE.MeshMatcapMaterial( {
			flatShading: params.flatShading,
			matcap
		} )
	);
	targetMesh.material.matcap.encoding = THREE.sRGBEncoding;
	targetMesh.frustumCulled = false;
	scene.add( targetMesh );

	// initialize bvh helper
	if ( ! bvhHelper ) {

		bvhHelper = new MeshBVHVisualizer( targetMesh, params.depth );
		bvhHelper.visible = params.displayHelper;
		scene.add( bvhHelper );

	}

	bvhHelper.mesh = targetMesh;
	bvhHelper.update();

}

function init() {

	const bgColor = 0x263238 / 2;

	// renderer setup
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( bgColor, 1 );
	renderer.gammaOutput = true;
	document.body.appendChild( renderer.domElement );

	// scene setup
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x263238 / 2, 20, 60 );

	const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	scene.add( new THREE.AmbientLight( 0xffffff, 0.4 ) );

	// geometry setup
	reset();

	// initialize brush cursor
	const brushSegments = [ new THREE.Vector3(), new THREE.Vector3( 0, 0, 1 ) ];
	for ( let i = 0; i < 50; i ++ ) {

		const nexti = i + 1;
		const x1 = Math.sin( 2 * Math.PI * i / 50 );
		const y1 = Math.cos( 2 * Math.PI * i / 50 );

		const x2 = Math.sin( 2 * Math.PI * nexti / 50 );
		const y2 = Math.cos( 2 * Math.PI * nexti / 50 );

		brushSegments.push(
			new THREE.Vector3( x1, y1, 0 ),
			new THREE.Vector3( x2, y2, 0 )
		);

	}

	brush = new THREE.LineSegments();
	brush.geometry.setFromPoints( brushSegments );
	brush.material.color.set( 0xfb8c00 );
	scene.add( brush );

	symmetryBrush = brush.clone();
	scene.add( symmetryBrush );

	// camera setup
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
	camera.position.set( 0, 0, 3 );
	camera.far = 100;
	camera.updateProjectionMatrix();

	controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 1.5;

	// stats setup
	stats = new Stats();
	document.body.appendChild( stats.dom );

	const gui = new dat.GUI();

	const sculptFolder = gui.addFolder( 'Sculpting' );
	sculptFolder.add( params, 'brush', [ 'normal', 'clay', 'flatten' ] );
	sculptFolder.add( params, 'size' ).min( 0.025 ).max( 0.25 ).step( 0.005 );
	sculptFolder.add( params, 'intensity' ).min( 1 ).max( 100 ).step( 1 );
	sculptFolder.add( params, 'maxSteps' ).min( 1 ).max( 25 ).step( 1 );
	sculptFolder.add( params, 'symmetrical' );
	sculptFolder.add( params, 'invert' );
	sculptFolder.add( params, 'flatShading' ).onChange( value => {

		targetMesh.material.flatShading = value;
		targetMesh.material.needsUpdate = true;

	} );
	sculptFolder.open();

	const helperFolder = gui.addFolder( 'BVH Helper' );
	helperFolder.add( params, 'depth' ).min( 1 ).max( 20 ).step( 1 ).onChange( d => {

		bvhHelper.depth = parseFloat( d );
		bvhHelper.update();

	} );
	helperFolder.add( params, 'displayHelper' ).onChange( display => {

		bvhHelper.visible = display;

	} );
	helperFolder.open();

	gui.add( { reset }, 'reset' );
	gui.add( { rebuildBVH: () => {

		targetMesh.geometry.computeBoundsTree();
		bvhHelper.update();

	} }, 'rebuildBVH' );
	gui.open();

	controls.addEventListener( 'start', function () {

		this.active = true;

	} );

	controls.addEventListener( 'end', function () {

		this.active = false;

	} );

	window.addEventListener( 'resize', function () {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}, false );

	window.addEventListener( 'mousemove', function ( e ) {

		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	} );

	window.addEventListener( 'mousedown', e => {

		mouseState = Boolean( e.buttons & 1 );

	} );

	window.addEventListener( 'mouseup', e => {

		mouseState = Boolean( e.buttons & 1 );

	} );

	window.addEventListener( 'contextmenu', function ( e ) {

		e.preventDefault();

	} );

	window.addEventListener( 'wheel', function ( e ) {

		let delta = e.deltaY;

		if ( e.deltaMode === 1 ) {

			delta *= 40;

		}

		if ( e.deltaMode === 2 ) {

			delta *= 40;

		}

		params.size += delta * 0.0001;
		params.size = Math.max( Math.min( params.size, 0.25 ), 0.025 );

		gui.updateDisplay();

	} );

}

// Run the perform the brush movement
function performStroke( point, brushObject, brushOnly = false ) {

	const inverseMatrix = new THREE.Matrix4();
	inverseMatrix.copy( targetMesh.matrixWorld ).invert();

	const sphere = new THREE.Sphere();
	sphere.center.copy( point ).applyMatrix4( inverseMatrix );
	sphere.radius = params.size;

	// Collect the intersected vertices
	const indices = new Set();
	const tempVec = new THREE.Vector3();
	const tempVec2 = new THREE.Vector3();
	const normal = new THREE.Vector3();
	const bvh = targetMesh.geometry.boundsTree;
	bvh.shapecast(
		targetMesh,
		box => {

			const intersects = sphere.intersectsBox( box );
			const { min, max } = box;
			if ( intersects ) {

				for ( let x = 0; x <= 1; x ++ ) {

					for ( let y = 0; y <= 1; y ++ ) {

						for ( let z = 0; z <= 1; z ++ ) {

							tempVec.set(
								x === 0 ? min.x : max.x,
								y === 0 ? min.y : max.y,
								z === 0 ? min.z : max.z
							);
							if ( ! sphere.containsPoint( tempVec ) ) {

								return INTERSECTED;

							}

						}

					}

				}

				return CONTAINED;

			}

			return intersects ? INTERSECTED : NOT_INTERSECTED;

		},
		( tri, a, b, c, contained ) => {

			if ( contained ) {

				indices.add( a );
				indices.add( b );
				indices.add( c );

			} else {

				if ( sphere.containsPoint( tri.a ) ) {

					indices.add( a );

				}

				if ( sphere.containsPoint( tri.b ) ) {

					indices.add( b );

				}

				if ( sphere.containsPoint( tri.c ) ) {

					indices.add( c );

				}

			}

			return false;

		}
	);

	// Compute the average normal at this point
	const indexAttr = targetMesh.geometry.index;
	const posAttr = targetMesh.geometry.attributes.position;
	const normalAttr = targetMesh.geometry.attributes.normal;
	const localPoint = new THREE.Vector3();
	localPoint.copy( point ).applyMatrix4( inverseMatrix );

	const planePoint = new THREE.Vector3();
	let totalPoints = 0;
	indices.forEach( i => {

		const index = indexAttr.getX( i );
		tempVec.fromBufferAttribute( normalAttr, index );
		normal.add( tempVec );

		// compute the average point for cases where we need to flatten
		// to the plane.
		if ( ! brushOnly ) {

			totalPoints ++;
			tempVec.fromBufferAttribute( posAttr, index );
			planePoint.add( tempVec );

		}

	} );
	normal.normalize();
	brushObject.quaternion.setFromUnitVectors( normalZ, normal );

	if ( totalPoints ) {

		planePoint.multiplyScalar( 1 / totalPoints );

	}

	// Early out if we just want to adjust the brush
	if ( brushOnly ) {

		return;

	}

	// perform vertex adjustment
	const targetHeight = params.intensity * 0.000025;
	const plane = new THREE.Plane();
	plane.setFromNormalAndCoplanarPoint( normal, planePoint );

	const indexToTriangles = {};
	const triangles = new Set();
	indices.forEach( i => {

		const index = indexAttr.getX( i );
		tempVec.fromBufferAttribute( posAttr, index );

		// compute the offset intensity
		const dist = tempVec.distanceTo( localPoint );
		const negated = params.invert ? - 1 : 1;
		let intensity = 1.0 - ( dist / params.size );

		// offset the vertex
		if ( params.brush === 'clay' ) {

			intensity = Math.pow( intensity, 3 );
			const planeDist = plane.distanceToPoint( tempVec );
			const clampedIntensity = negated * Math.min( intensity * 2, 0.5 ) * 2.0;
			tempVec.addScaledVector( normal, clampedIntensity * targetHeight - negated * planeDist * clampedIntensity * 0.1 );

		} else if ( params.brush === 'normal' ) {

			intensity = Math.pow( intensity, 3 );
			tempVec.addScaledVector( normal, negated * intensity * targetHeight );

		} else if ( params.brush === 'flatten' ) {

			intensity = Math.pow( intensity, 2 );

			const planeDist = plane.distanceToPoint( tempVec );
			tempVec.addScaledVector( normal, - planeDist * intensity * params.intensity * 0.01 * 0.5 );

		}

		posAttr.setXYZ( index, tempVec.x, tempVec.y, tempVec.z );
		normalAttr.setXYZ( index, 0, 0, 0 );
		triangles.add( ~ ~ ( i / 3 ) );

	} );

	// If we found vertices
	if ( indices.size ) {

		// accumulate the normals in place in the normal buffer
		const triangle = new THREE.Triangle();
		triangles.forEach( tri => {

			const tri3 = tri * 3;
			const i0 = tri3 + 0;
			const i1 = tri3 + 1;
			const i2 = tri3 + 2;

			const v0 = indexAttr.getX( i0 );
			const v1 = indexAttr.getX( i1 );
			const v2 = indexAttr.getX( i2 );

			triangle.a.fromBufferAttribute( posAttr, v0 );
			triangle.b.fromBufferAttribute( posAttr, v1 );
			triangle.c.fromBufferAttribute( posAttr, v2 );
			triangle.getNormal( tempVec2 );

			if ( indices.has( i0 ) ) {

				tempVec.fromBufferAttribute( normalAttr, v0 );
				tempVec.add( tempVec2 );
				normalAttr.setXYZ( v0, tempVec.x, tempVec.y, tempVec.z );

			}

			if ( indices.has( i1 ) ) {

				tempVec.fromBufferAttribute( normalAttr, v1 );
				tempVec.add( tempVec2 );
				normalAttr.setXYZ( v1, tempVec.x, tempVec.y, tempVec.z );

			}

			if ( indices.has( i2 ) ) {

				tempVec.fromBufferAttribute( normalAttr, v2 );
				tempVec.add( tempVec2 );
				normalAttr.setXYZ( v2, tempVec.x, tempVec.y, tempVec.z );

			}

		} );

		// normalize the accumulated normals
		indices.forEach( i => {

			const v = indexAttr.getX( i );
			tempVec.fromBufferAttribute( normalAttr, v );
			tempVec.normalize();
			normalAttr.setXYZ( v, tempVec.x, tempVec.y, tempVec.z );

		} );

		posAttr.needsUpdate = true;
		normalAttr.needsUpdate = true;

		// TODO: refit bounds here once it's optimized so we don't miss raycasts
		// due to out of date bounds

	}

}

function render() {

	requestAnimationFrame( render );

	stats.begin();

	if ( controls.active ) {

		// If the controls are being used then don't perform the strokes
		brush.visible = false;
		lastCastPose.setScalar( Infinity );

	} else {

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera( mouse, camera );
		raycaster.firstHitOnly = true;

		const hit = raycaster.intersectObject( targetMesh, true )[ 0 ];
		// if we hit the target mesh
		if ( hit ) {

			brush.visible = true;
			brush.scale.set( params.size, params.size, 0.1 );
			brush.position.copy( hit.point );

			symmetryBrush.visible = params.symmetrical;
			symmetryBrush.scale.set( params.size, params.size, 0.1 );
			symmetryBrush.position.copy( hit.point );
			symmetryBrush.position.x *= - 1;

			controls.enabled = false;

			// if the last cast pose was missed in the last frame then set it to
			// the current point so we don't streak across the surface
			if ( lastCastPose.x === Infinity ) {

				lastCastPose.copy( hit.point );

			}

			// If the mouse isn't pressed don't perform the stroke
			if ( ! ( mouseState || lastMouseState ) ) {

				performStroke( hit.point, brush, true );
				if ( params.symmetrical ) {

					hit.point.x *= - 1;
					performStroke( hit.point, symmetryBrush, true );
					hit.point.x *= - 1;

				}

				lastMouse.copy( mouse );
				lastCastPose.copy( hit.point );

			} else {

				// compute the distance the mouse moved and that the cast point moved
				const mdx = ( mouse.x - lastMouse.x ) * window.innerWidth * window.devicePixelRatio;
				const mdy = ( mouse.y - lastMouse.y ) * window.innerHeight * window.devicePixelRatio;
				let mdist = Math.sqrt( mdx * mdx + mdy * mdy );
				let castDist = hit.point.distanceTo( lastCastPose );

				const step = params.size * 0.15;
				const percent = Math.max( step / castDist, 1 / params.maxSteps );
				const mstep = mdist * percent;
				let stepCount = 0;

				// perform multiple iterations toward the current mouse pose for a consistent stroke
				// TODO: recast here so he cursor is on the surface of the model which requires faster
				// refitting of the model
				while ( castDist > step && mdist > params.size * 200 / hit.distance ) {

					lastMouse.lerp( mouse, percent );
					lastCastPose.lerp( hit.point, percent );
					castDist -= step;
					mdist -= mstep;

					performStroke( lastCastPose, brush, false );

					if ( params.symmetrical ) {

						lastCastPose.x *= - 1;
						performStroke( lastCastPose, symmetryBrush, false );
						lastCastPose.x *= - 1;

					}

					stepCount ++;
					if ( stepCount > params.maxSteps ) {

						break;

					}

				}

				// refit the bounds if we adjusted the mesh
				if ( stepCount > 0 ) {

					targetMesh.geometry.boundsTree.refit( targetMesh.geometry );
					bvhHelper.update();

				} else {

					performStroke( hit.point, brush, true );
					if ( params.symmetrical ) {

						hit.point.x *= - 1;
						performStroke( hit.point, symmetryBrush, true );
						hit.point.x *= - 1;

					}

				}

			}

		} else {

			// if we didn't hit
			controls.enabled = true;
			brush.visible = false;
			symmetryBrush.visible = false;
			lastMouse.copy( mouse );
			lastCastPose.setScalar( Infinity );

		}

	}

	lastMouseState = mouseState;

	renderer.render( scene, camera );
	stats.end();

}