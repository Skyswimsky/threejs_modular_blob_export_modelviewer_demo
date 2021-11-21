import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

let cube;
let scene;
const material = new THREE.MeshStandardMaterial({color: 0x8e8e8e});

//setup Three JS scene
const setupScene = () => {
    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    const directionalLight = new THREE.AmbientLight(0xffffff, 1);


    scene.add(directionalLight);

    scene.background = new THREE.Color(255, 255, 255);
    camera.position.z = 20;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

//setup datGui+generation of new object at runtime
const setupGeometryUi = ( ) => {

    const data = {
        width: 5,
        height: 5,
        depth: 5,
    };

    function generateGeometry() {
        scene.remove(cube);
        cube = new THREE.Mesh(new THREE.BoxGeometry(data.width,data.height,data.depth), material)
        scene.add(cube);

    }
    const gui = new GUI();

    gui.add( data, 'width', 1, 30 ).onChange( generateGeometry );
    gui.add( data, 'height', 1, 30 ).onChange( generateGeometry );
    gui.add( data, 'depth', 1, 30 ).onChange( generateGeometry );
    let obj = {add:function(){startAr()}};
    gui.add(obj,'Start AR');

    generateGeometry();

}

//start AR mode of Modelviewer
const startAr = async () => {
    const blob = await exportGLTF(cube)

    const modelViewer = document.getElementById('mv');
    const arBtn = document.getElementById('ar-button');
    modelViewer.setAttribute('src',URL.createObjectURL(blob));
    arBtn.click();
}

//export object to gltf
const exportGLTF = (input) => {
    return new Promise((res) => {
        const exporter = new GLTFExporter();

        exporter.parse(
            input,
            (result) => {
                const parsedValue = JSON.stringify(result, null, 2);

                const blob = new Blob([parsedValue], {type: 'text/plain'});
                res(blob);
            },
            {}
        );
    });
}

setupScene();
setupGeometryUi();
