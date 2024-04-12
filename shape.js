import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);


let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        torusKnot.quaternion.multiplyQuaternions(deltaRotationQuaternion, torusKnot.quaternion);

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousedown', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set raycaster origin and direction based on mouse position
    raycaster.setFromCamera(mouse, camera);

    // Define a plane at z = 0 to check for intersection with empty area
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    // Create a new torus knot at the intersection point
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x2b885d });
    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.copy(intersection);
    scene.add(torusKnot);

    // Update previousMousePosition for rotation calculation
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});


function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
