var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},n=e.parcelRequire4485;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var a={id:e,exports:{}};return t[e]=a,n.call(a.exports,a,a.exports),a.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){o[e]=t},e.parcelRequire4485=n),n("27Lyk").register(JSON.parse('{"bTAAs":"cpuPathTracing.40b582bc.js","b4BBl":"generateAsync.worker.5bf93d10.js","9JIya":"asyncGenerate.924881df.js","1o4q0":"characterMovement.00d7d3c9.js","bEy7u":"asyncGenerate.6b6e94f2.js","7RGMC":"characterMovement.9329e59d.js","dzSTI":"characterMovement.af1137e5.js","efnpd":"cpuPathTracing.c866b4cf.js","817sr":"asyncGenerate.4d3a79b0.js","fI6hf":"clippedEdges.c7f3e0bd.js"}'));var a=n("ilwiq"),r=n("5Rd1x"),i=n("7lx9d"),s=n("7ePFa"),l=n("RPVlj"),c=n("kp7Te");const d=new((a=n("ilwiq")).Vector3),m=new a.Vector3,h=new a.Vector3,u=[[1,1],[-1,-3],[-3,2],[4,-1],[-5,-2],[2,5],[5,3],[3,-5],[-2,6],[0,-7],[-4,-6],[-6,4],[-8,0],[7,-4],[6,7],[-7,-8]];function p(e,t){return function(e,t){return t+(1-t)*Math.pow(1-e,5)}(e,Math.pow((1-t)/(1+t),2))}function f(e,t){Math.abs(e.x)>.5?d.set(0,1,0):d.set(1,0,0),m.crossVectors(e,d).normalize(),h.crossVectors(e,m).normalize(),t.makeBasis(h,m,e)}function g(e,t,o){return o.addVectors(e,t).normalize()}function y(e,t,o){return e.dot(t)>0===e.dot(o)>0}const w=new((a=n("ilwiq")).Vector3),M=new a.Vector3,b=new a.Vector3,S=new a.Vector3,x=new a.Vector3(0,0,1),C=Math.PI;function z(e,t){const o=Math.tan(e),n=o*o,a=t*t;return(-1+Math.sqrt(1+a*n))/2}function B(e,t){const o=t*t,n=e.z,a=Math.pow(n,4);if(0===n)return 0;const r=Math.acos(e.z),i=Math.tan(r),s=Math.pow(i,2);return o/(Math.PI*a*Math.pow(o+s,2))}function v(e,t,o){const n=Math.acos(e.z),a=B(t,o),r=function(e,t){return 1/(1+z(e,t))}(n,o);return a*r*Math.max(0,e.dot(t))/e.z}const T=new((a=n("ilwiq")).Vector3),V=new a.Vector3,I=new a.Color,A=new a.Color(16777215);function F(e,t,o,n){const a=t.filteredSurfaceRoughness;!function(e,t,o,n,a,r){const i=w.set(t*e.x,o*e.y,e.z).normalize(),s=i.z<.9999?M.crossVectors(i,x).normalize():M.set(1,0,0),l=b.crossVectors(s,i),c=1/(1+i.z),d=Math.sqrt(n),m=a<c?a/c*C:C+(a-c)/(1-c)*C,h=d*Math.cos(m),u=d*Math.sin(m)*(a<c?1:i.z);s.multiplyScalar(h),l.multiplyScalar(u);const p=S.addVectors(s,l).addScaledVector(i,Math.sqrt(Math.max(0,1-h*h-u*u)));p.x*=t,p.y*=o,p.z=Math.max(0,p.z),p.normalize(),r.copy(p)}(e,a,a,Math.random(),Math.random(),V),n.copy(e).reflect(V).multiplyScalar(-1)}function P(e,t,o,n,r){const{metalness:i,ior:s}=o,{frontFace:l}=n,c=n.filteredSurfaceRoughness;g(e,t,V);const d=l?1/s:s,m=function(e,t,o){const n=Math.acos(e.z),a=Math.acos(t.z);return 1/(1+z(n,o)+z(a,o))}(t,e,c),h=B(V,c);let u=p(t.dot(V),d);const f=Math.min(e.z,1);d*Math.sqrt(1-f*f)>1&&(u=1),r.lerpColors(A,o.color,i).multiplyScalar(m*h/(4*Math.abs(t.z*e.z))).multiplyScalar(a.MathUtils.lerp(u,1,i)).multiplyScalar(t.z)}function G(e,t,o,n){const{roughness:r,ior:i}=o,{frontFace:s}=t,l=s?1/i:i;T.copy(e).multiplyScalar(-1),function(e,t,o,n){let a=Math.min(-e.dot(t),1);d.copy(e).addScaledVector(t,a).multiplyScalar(o),n.copy(t).multiplyScalar(-Math.sqrt(Math.abs(1-d.lengthSq()))).add(d)}(T,new a.Vector3(0,0,1),l,n),T.randomDirection().multiplyScalar(r),n.add(T)}function W(e,t,o,n){const{ior:r,metalness:i,transmission:s}=o,{frontFace:l}=n,c=l?1/r:r,d=Math.min(e.z,1),m=Math.sqrt(1-d*d);let h=p(d,c);c*m>1&&(h=1);let u=0,f=0,y=0;t.z<0?y=function(e,t,o,n){const{ior:a}=o,{frontFace:r}=n,i=r?1/a:a,s=Math.min(e.z,1),l=Math.sqrt(1-s*s);let c=p(s,i);return i*l>1?0:1/(1-c)}(e,0,o,n):(u=function(e,t,o,n){const a=n.filteredSurfaceRoughness;return g(t,e,V),v(t,V,a)/(4*t.dot(V))}(e,t,0,n),f=function(e,t,o,n){return t.z/Math.PI}(0,t));const w=a.MathUtils.lerp(h,1,i),M=.5+.5*i;return u*s*w+y*s*(1-w)+u*(1-s)*M+f*(1-s)*(1-M)}function D(e,t,o,n,a){t.z<0?function(e,t,o,n,a){const{metalness:r,transmission:i}=o;a.copy(o.color).multiplyScalar(1-r).multiplyScalar(i)}(0,0,o,0,a):(!function(e,t,o,n,a){const{metalness:r,transmission:i}=o;a.copy(o.color).multiplyScalar((1-r)*t.z/Math.PI/Math.PI).multiplyScalar(1-i)}(0,t,o,0,a),a.multiplyScalar(1-o.transmission),P(e,t,o,n,I),a.add(I))}function k(e,t,o,n){const r=n.direction,{ior:i,metalness:s,transmission:l}=o,{frontFace:c}=t,d=c?1/i:i,m=Math.min(e.z,1),h=Math.sqrt(1-m*m);let u=p(m,d);if(d*h>1&&(u=1),Math.random()<l){const n=a.MathUtils.lerp(u,1,s);Math.random()<n?F(e,t,0,r):G(e,t,o,r)}else{const o=.5+.5*s;Math.random()<o?F(e,t,0,r):function(e,t,o,n){n.randomDirection(),n.z+=1,n.normalize()}(0,0,0,r)}n.pdf=W(e,r,o,t),D(e,r,o,t,n.color)}var R=n("jiuw3"),H=n("4CEV9"),E=n("8todg");let L,j,q,U,N,O,$,_,X,J,Y,Z,Q,K,ee,te,oe,ne,ae,re,ie;a.Mesh.prototype.raycast=H.acceleratedRaycast,a.BufferGeometry.prototype.computeBoundsTree=H.computeBoundsTree,a.BufferGeometry.prototype.disposeBoundsTree=H.disposeBoundsTree;const se=new a.Triangle,le=new a.Vector3,ce=new a.Vector3,de=new a.Vector3,me=new a.Vector3,he=new a.Spherical,ue=new a.Matrix4,pe=new a.Matrix4,fe=new a.Vector3,ge=new a.Color,ye=new a.Vector3,we={},Me={model:"Dragon",resolution:{resolutionScale:.5,smoothImageScaling:!1,stretchImage:!0},pathTracing:{pause:!1,displayScanLine:!1,antialiasing:!0,bounces:10,filterGlossyFactor:.5,smoothNormals:!0,directLightSampling:!0},material:{color:"#0099ff",emissive:"#000000",emissiveIntensity:1,roughness:.1,metalness:0,ior:1.8,transmission:0},floor:{enable:!0,color:"#7f7f7f",roughness:.1,metalness:.1,width:10,height:10},light:{enable:!0,position:"Diagonal",intensity:30,color:"#ffffff",width:1,height:1},environment:{skyMode:"sky",skyIntensity:.025}};function be(e,t=!0){const o=[],n=[];for(let r=0,i=e.length;r<i;r++){const i=e[r],s=e[r].geometry,l=t?s.clone():t;i.updateMatrixWorld(),l.applyMatrix4(i.matrixWorld);const c=l.attributes.position.count,d=new Uint8Array(c).fill(r);l.setAttribute("materialIndex",new a.BufferAttribute(d,1,!1)),o.push(l),n.push(i.material)}return{geometry:s.mergeBufferGeometries(o,!1),materials:n}}function Se(){function e(e,t){_&&_.image.width===e&&_.image.height===t||(_&&_.dispose(),_=new a.DataTexture(new Float32Array(e*t*4),e,t,a.RGBAFormat,a.FloatType),xe())}j.aspect=window.innerWidth/window.innerHeight,j.updateProjectionMatrix();const t=window.devicePixelRatio,o=Me.resolution.resolutionScale;Me.resolution.stretchImage?(K.style.width=`${window.innerWidth}px`,K.style.height=`${window.innerHeight}px`,q.setSize(window.innerWidth,window.innerHeight),q.setPixelRatio(t*o),e(Math.floor(window.innerWidth*t*o),Math.floor(window.innerHeight*t*o))):(K.style.width=window.innerWidth*o+"px",K.style.height=window.innerHeight*o+"px",q.setSize(Math.floor(window.innerWidth*o),Math.floor(window.innerHeight*o)),q.setPixelRatio(t),e(Math.floor(window.innerWidth*t*o),Math.floor(window.innerHeight*t*o))),q.domElement.style.imageRendering=Me.resolution.smoothImageScaling?"auto":"pixelated"}function xe(){_.image.data.fill(0),_.needsUpdate=!0,X=0,J=function*(){const{width:e,height:t,data:o}=_.image,n=parseInt(Me.pathTracing.bounces),r=parseFloat(Me.environment.skyIntensity),i=Me.environment.skyMode,s=Me.pathTracing.smoothNormals,l=new a.Color,c=new a.Color,d=new a.Vector3,m=new a.Vector3,h=new a.Vector2,p=new Array(n).fill().map((()=>new a.Ray)),g=new a.Vector3(0,0,1).transformDirection(re.matrixWorld),w=re.scale.x,M=re.scale.y,b=new a.Raycaster;b.firstHitOnly=!0;const S=new a.Ray,x={pdf:0,color:new a.Color,direction:new a.Vector3};let C=performance.now();te=performance.now(),oe=0,Z=100,Q.style.visibility=Me.pathTracing.displayScanLine?"visible":"hidden",ne.material.side=a.DoubleSide,ae.forEach((e=>{e.side=a.DoubleSide}));for(;;){let n=0,a=0;if(Me.pathTracing.antialiasing){const o=X%u.length;[n,a]=u[o],n=n/16/e,a=a/16/t}for(let r=t-1;r>=0;r--)for(let i=0;i<e;i++){h.set(n+i/(e-1),a+r/(t-1)),b.setFromCamera({x:2*h.x-1,y:2*h.y-1},j),ye.set(0,0,-1).transformDirection(j.matrixWorld),S.direction.copy(b.ray.direction),S.origin.copy(b.ray.origin).addScaledVector(b.ray.direction,j.near/b.ray.direction.dot(ye)),l.set(0),B(S,l);const s=4*(r*e+i),c=o[s+0],d=o[s+1],m=o[s+2];o[s+0]+=(l.r-c)/(X+1),o[s+1]+=(l.g-d)/(X+1),o[s+2]+=(l.b-m)/(X+1),o[s+3]=1;const u=performance.now()-C;u>16&&(oe+=u,Z=100*r/t,yield,C=performance.now())}X++}function z(e,t,o){const n=e.object,a=n.geometry.attributes.position,r=n.geometry.attributes.normal,i=n.geometry.attributes.materialIndex,l=e.face,c=e.face.normal;if(s){const t=e.point;se.a.fromBufferAttribute(a,l.a),se.b.fromBufferAttribute(a,l.b),se.c.fromBufferAttribute(a,l.c),le.fromBufferAttribute(r,l.a),ce.fromBufferAttribute(r,l.b),de.fromBufferAttribute(r,l.c),se.getBarycoord(t,me),m.setScalar(0).addScaledVector(le,me.x).addScaledVector(ce,me.y).addScaledVector(de,me.z).normalize()}else m.copy(c);c.transformDirection(n.matrixWorld),m.transformDirection(n.matrixWorld);const d=c.dot(t.direction)<0;d||(m.multiplyScalar(-1),c.multiplyScalar(-1));let h=n.material;if(i){const e=i.getX(l.a);h=ae[e]}e.material=h,e.normal=m,e.geometryNormal=c,e.frontFace=d,e.filteredSurfaceRoughness=Math.min(Math.max(1e-6,h.roughness,o*Me.pathTracing.filterGlossyFactor*5),1)}function B(e,t){let o=e,a=0,r=0;c.set(16777215);for(let e=0;e<n;e++){let n=null;b.ray.copy(o);const i=[ne];if(Me.light.enable&&i.push(re),Me.floor.enable&&i.push(ie),n=b.intersectObjects(i,!0)[0],!n){v(o.direction,ge),ge.multiply(c),t.add(ge);break}if(n.object===re){if(0===e){const e=re.material.color;t.r=Math.min(e.r,1),t.g=Math.min(e.g,1),t.b=Math.min(e.b,1)}else if(o.direction.dot(g)<0){const e=a/(a+n.distance*n.distance/(w*M*-o.direction.dot(g)));t.r+=e*c.r*re.material.color.r,t.g+=e*c.g*re.material.color.g,t.b+=e*c.b*re.material.color.b}break}{z(n,o,r);const{material:s}=n,l=p[e];if(f(n.normal,ue),pe.copy(ue).invert(),Me.light.enable&&(ye.set(Math.random()-.5,Math.random()-.5,0).applyMatrix4(re.matrixWorld),l.origin.copy(n.point).addScaledVector(n.geometryNormal,1e-7),l.direction.subVectors(ye,l.origin).normalize(),l.direction.dot(g)<0&&y(l.direction,n.normal,n.geometryNormal))){const e=w*M,a=l.origin.distanceToSquared(ye)/(e*-l.direction.dot(g));b.ray.copy(l);const r=b.intersectObjects(i,!0)[0];if(r&&r.object===re){fe.copy(o.direction).applyMatrix4(pe).multiplyScalar(-1).normalize(),ye.copy(l.direction).applyMatrix4(pe).normalize(),fe.normalize(),D(fe,ye,s,n,ge);const e=a/(W(fe,ye,s,n)+a);t.r+=re.material.color.r*c.r*ge.r*e/a,t.g+=re.material.color.g*c.g*ge.g*e/a,t.b+=re.material.color.b*c.b*ge.b*e/a}}fe.copy(o.direction).applyMatrix4(pe).multiplyScalar(-1).normalize(),k(fe,n,s,x),d.addVectors(fe,x.direction).normalize(),r+=Math.sin(Math.acos(d.z)),l.direction.copy(x.direction).applyMatrix4(ue).normalize();const m=l.direction.dot(n.geometryNormal)<0;l.origin.copy(n.point).addScaledVector(n.geometryNormal,m?-1e-7:1e-7);const{emissive:h,emissiveIntensity:u}=s;if(t.r+=u*h.r*c.r,t.g+=u*h.g*c.g,t.b+=u*h.b*c.b,x.pdf<=0||!y(l.direction,n.normal,n.geometryNormal))break;x.color.multiplyScalar(1/x.pdf),c.multiply(x.color),o=l,a=x.pdf}}}function v(e,t){if("checkerboard"===i){he.setFromVector3(e);const o=Math.PI/10,n=Math.floor(he.theta/o)%2==0===(Math.floor(he.phi/o)%2==0);t.set(n?0:16777215).multiplyScalar(1.5),t.multiplyScalar(r)}else if("sun"===i){le.setScalar(1).normalize();let o=Math.max(0,e.dot(le)+1)/2;if(o*=o,t.r=a.MathUtils.lerp(.01,.5,o),t.g=a.MathUtils.lerp(.01,.7,o),t.b=a.MathUtils.lerp(.01,1,o),o>.95){let e=(o-.95)/.05;e*=e,t.r=a.MathUtils.lerp(.5,10,e),t.g=a.MathUtils.lerp(.7,10,e),t.b=a.MathUtils.lerp(1,10,e)}t.multiplyScalar(r)}else{const o=(e.y+.5)/2;t.r=a.MathUtils.lerp(1,.5,o),t.g=a.MathUtils.lerp(1,.7,o),t.b=a.MathUtils.lerp(1,1,o),t.multiplyScalar(r)}}}(),Y=0,Q.style.visibility="hidden",Z=100,re.scale.set(Me.light.width,Me.light.height,1),re.material.color.set(Me.light.color).multiplyScalar(Me.light.intensity),re.visible=Me.light.enable,ie.scale.set(Me.floor.width,Me.floor.height,1),ie.material.color.set(Me.floor.color),ie.material.roughness=Math.pow(Me.floor.roughness,2),ie.material.metalness=Me.floor.metalness,ie.visible=Me.floor.enable}function Ce(e){let t=.001*(e=e||0);const o=Math.floor(t/60);t-=60*o;return`${(o<10?"0":"")+o}m ${(t<10?"0":"")+t.toFixed(3)}s`}!function(){q=new a.WebGLRenderer({antialias:!0}),q.setPixelRatio(window.devicePixelRatio),q.setSize(window.innerWidth,window.innerHeight),q.setClearColor(0,1),q.outputEncoding=a.sRGBEncoding,K=document.createElement("div"),K.style.position="absolute",K.style.inset="0",K.style.margin="auto",K.style.zIndex="-1",document.body.appendChild(K),K.appendChild(q.domElement),Q=document.createElement("div"),Q.style.width="100%",Q.style.position="absolute",Q.style.borderBottom="1px solid #e91e63",Q.style.visibility="hidden",K.appendChild(Q),ee=document.getElementById("output"),O=new l.FullScreenQuad(new a.MeshBasicMaterial),O.material.transparent=!0,L=new a.Scene,j=new a.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,50),j.position.set(-2.5,1.5,2.5),j.far=100,j.updateProjectionMatrix(),U=new a.HemisphereLight(16777215,6710886,1),L.add(U),re=new a.Mesh(new a.PlaneBufferGeometry(1,1,1,1),new a.MeshBasicMaterial({side:a.DoubleSide})),re.position.set(2,2,2),re.lookAt(0,0,0),L.add(re),ie=new a.Mesh(new a.PlaneBufferGeometry(1,1,1,1),new a.MeshStandardMaterial({side:a.DoubleSide})),ie.rotation.x=-Math.PI/2,ie.scale.setScalar(1),ie.material.ior=1.6,ie.material.transmission=0,L.add(ie),$=new r.OrbitControls(j,q.domElement),$.addEventListener("change",xe),window.addEventListener("resize",Se,!1),Se(),we.Sphere=null;{const e=new a.Mesh(new a.SphereGeometry(1,100,50),new a.MeshStandardMaterial),{geometry:t,materials:o}=be([e],!0),n=new a.Mesh(t,new a.MeshStandardMaterial);L.add(n),t.computeBoundsTree({strategy:H.SAH,maxLeafTris:1}),we.Sphere={mesh:n,materials:o,floorHeight:-1}}we["Cornell Box"]=null;{const e=new a.PlaneBufferGeometry(1,1,1,1),t=new a.Mesh(e,new a.MeshStandardMaterial({color:60928,side:a.DoubleSide}));t.rotation.y=Math.PI/2,t.position.x=-2,t.scale.setScalar(4),t.updateMatrixWorld(!0);const o=new a.Mesh(e,new a.MeshStandardMaterial({color:15597568}));o.rotation.y=Math.PI/2,o.position.x=2,o.scale.setScalar(4),o.updateMatrixWorld(!0);const n=new a.Mesh(e,new a.MeshStandardMaterial({color:15658734}));n.position.z=-2,n.scale.setScalar(4),n.updateMatrixWorld(!0);const r=new a.Mesh(e.clone(),new a.MeshStandardMaterial({color:15658734}));r.rotation.x=Math.PI/2,r.position.y=2,r.scale.setScalar(4),r.updateMatrixWorld(!0);const i=new a.Mesh(new a.BoxGeometry(1,2,1),new a.MeshStandardMaterial({side:a.DoubleSide}));i.position.y=-1,i.position.x=-.6,i.position.z=-.25,i.rotation.y=Math.PI/4;const s=new a.Mesh(new a.BoxGeometry(1,1,1),new a.MeshStandardMaterial({side:a.DoubleSide}));s.position.y=-1.5,s.position.x=.75,s.position.z=.5,s.rotation.y=-Math.PI/8;const{geometry:l,materials:c}=be([i,s,t,o,n,r],!0),d=new a.Mesh(l,new a.MeshStandardMaterial);L.add(d),l.computeBoundsTree({strategy:H.SAH,maxLeafTris:1}),we["Cornell Box"]={mesh:d,materials:c,floorHeight:-2}}we.Dragon=null,(new i.GLTFLoader).load("../models/DragonAttenuation.glb",(e=>{let t;e.scene.traverse((e=>{e.isMesh&&"Dragon"===e.name&&(t=e)})),t.material=new a.MeshStandardMaterial,t.geometry.center().scale(.25,.25,.25).rotateX(Math.PI/2),t.position.set(0,0,0),t.scale.set(1,1,1),t.quaternion.identity();const{geometry:o,materials:n}=be([t],!0),r=new a.Mesh(o,new a.MeshStandardMaterial),i=new E.GenerateMeshBVHWorker;i.generate(o,{maxLeafTris:1,strategy:H.SAH}).then((e=>{we.Dragon={mesh:r,materials:n,floorHeight:t.geometry.boundingBox.min.y},o.boundsTree=e,i.dispose(),L.add(r)}))})),we.Engine=null,(new i.GLTFLoader).setMeshoptDecoder(c.MeshoptDecoder).load("../models/internal_combustion_engine/model.gltf",(e=>{const t=e.scene.children[0],o=t.geometry,n=new a.BufferGeometry,r=o.attributes.position,i=o.attributes.normal,s=new a.BufferAttribute(new Float32Array(3*r.count),3,!1),l=new a.BufferAttribute(new Float32Array(3*i.count),3,!1),c=new a.Vector3;for(let e=0,t=r.count;e<t;e++)c.fromBufferAttribute(r,e),s.setXYZ(e,c.x,c.y,c.z),c.fromBufferAttribute(i,e),c.multiplyScalar(1/127),l.setXYZ(e,c.x,c.y,c.z);t.scale.multiplyScalar(5),t.updateMatrixWorld(),n.setAttribute("position",s),n.setAttribute("normal",l),n.setAttribute("materialIndex",new a.BufferAttribute(new Uint8Array(s.count),1,!1)),n.setIndex(o.index),n.applyMatrix4(t.matrixWorld).center(),n.computeBoundingBox();const d=new a.Mesh(n,new a.MeshStandardMaterial),m=new E.GenerateMeshBVHWorker;m.generate(n,{maxLeafTris:1,strategy:H.CENTER}).then((e=>{we.Engine={mesh:d,materials:[new a.MeshStandardMaterial],floorHeight:n.boundingBox.min.y},n.boundsTree=e,m.dispose(),L.add(d)}))})),X=0,N=new a.Clock;const e=new R.GUI;e.add(Me,"model",Object.keys(we)).onChange(xe);const t=e.addFolder("resolution");t.add(Me.resolution,"resolutionScale",.1,1,.01).onChange(Se),t.add(Me.resolution,"smoothImageScaling").onChange(Se),t.add(Me.resolution,"stretchImage").onChange(Se),t.open();const o=e.addFolder("path tracing");o.add(Me.pathTracing,"pause"),o.add(Me.pathTracing,"displayScanLine").onChange((e=>{Q.style.visibility=e?"visible":"hidden"})),o.add(Me.pathTracing,"antialiasing").onChange(xe),o.add(Me.pathTracing,"directLightSampling").onChange(xe),o.add(Me.pathTracing,"smoothNormals").onChange(xe),o.add(Me.pathTracing,"bounces",1,50,1).onChange(xe),o.add(Me.pathTracing,"filterGlossyFactor",0,1,.001).onChange(xe),o.open();const n=e.addFolder("model");n.addColor(Me.material,"color").onChange(xe),n.addColor(Me.material,"emissive").onChange(xe),n.add(Me.material,"emissiveIntensity",0,5,.001).onChange(xe),n.add(Me.material,"roughness",0,1,.001).onChange(xe),n.add(Me.material,"metalness",0,1,.001).onChange(xe),n.add(Me.material,"transmission",0,1,.001).onChange(xe),n.add(Me.material,"ior",1,2.5,.001).onChange(xe),n.open();const s=e.addFolder("floor");s.add(Me.floor,"enable").onChange(xe),s.addColor(Me.floor,"color").onChange(xe),s.add(Me.floor,"roughness",0,1,.001).onChange(xe),s.add(Me.floor,"metalness",0,1,.001).onChange(xe),s.add(Me.floor,"width",3,20,.001).onChange(xe),s.add(Me.floor,"height",3,20,.001).onChange(xe);const d=e.addFolder("light");d.add(Me.light,"enable").onChange(xe),d.addColor(Me.light,"color").onChange(xe),d.add(Me.light,"intensity",0,100,.001).onChange(xe),d.add(Me.light,"width",0,5,.001).onChange(xe),d.add(Me.light,"height",0,5,.001).onChange(xe),d.add(Me.light,"position",["Diagonal","Above","Below"]).onChange(xe);const m=e.addFolder("environment");m.add(Me.environment,"skyMode",["sky","sun","checkerboard"]).onChange(xe),m.add(Me.environment,"skyIntensity",0,5,.001).onChange(xe),Se()}(),function e(){requestAnimationFrame(e);for(const e in we)we[e]&&(we[e].mesh.visible=!1);if(we[Me.model]){const e=we[Me.model];e.mesh.visible=!0,ne=e.mesh,ae=e.materials,ie.position.y=e.floorHeight,ae.forEach((e=>{void 0===e.ior&&(e.ior=1),void 0===e.transmission&&(e.transmission=0)}));const t=ae[0];switch(t.color.set(Me.material.color).convertSRGBToLinear(),t.emissive.set(Me.material.emissive).convertSRGBToLinear(),t.emissiveIntensity=parseFloat(Me.material.emissiveIntensity),t.ior=parseFloat(Me.material.ior),t.metalness=parseFloat(Me.material.metalness),t.transmission=parseFloat(Me.material.transmission),t.roughness=Math.pow(parseFloat(Me.material.roughness),2),Me.light.position){case"Below":re.rotation.set(-Math.PI/2,0,0),re.position.set(0,e.floorHeight+.001,0);break;case"Above":re.rotation.set(Math.PI/2,0,0),re.position.set(0,1.999,0);break;default:re.position.set(2,2,2),re.lookAt(0,0,0)}}else ne=null,ae=null,ie.position.y=0;let t=0;Y>150&&(t=Math.min((Y-150)/150,1));Q.style.bottom=`${Z}%`,Me.resolution.stretchImage?Q.style.borderBottomWidth=`${Math.ceil(1/Me.resolution.resolutionScale)}px`:Q.style.borderBottomWidth="1px";q.render(L,j),q.autoClear=!1,O.material.map=_,O.material.opacity=t,O.render(q),q.autoClear=!0,ne&&!Me.pathTracing.pause&&J.next();_.needsUpdate=!0,q.compile(O._mesh),Y<300&&(Y+=1e3*N.getDelta());ee.innerText=`completed samples : ${X}\ncomputation time  : ${Ce(oe)}\nelapsed time      : ${Ce(performance.now()-te)}`}();
//# sourceMappingURL=cpuPathTracing.40b582bc.js.map
