// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a star field as background
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200; // Random position in space
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 5, 5).normalize();
scene.add(sunLight);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to load textures
const loadTexture = (url) => {
    return new THREE.TextureLoader().load(url);
};

// Planet data with textures
const planets = [
    { name: 'Mercury', radius: 0.07, distance: 1.2, speed: 0.02, texture: 'https://i.imgur.com/x2g5rQm.jpg' },
    { name: 'Venus', radius: 0.12, distance: 1.8, speed: 0.015, texture: 'https://i.imgur.com/YM8W4R9.jpg' },
    { name: 'Earth', radius: 0.12, distance: 2.5, speed: 0.01, texture: 'https://i.imgur.com/nv36s2H.jpg' },
    { name: 'Mars', radius: 0.09, distance: 3.5, speed: 0.007, texture: 'https://i.imgur.com/t2zNzsn.jpg' },
    { name: 'Jupiter', radius: 0.25, distance: 5.5, speed: 0.004, texture: 'https://i.imgur.com/G3Xr2Gv.jpg' },
    { name: 'Saturn', radius: 0.22, distance: 6.5, speed: 0.003, texture: 'https://i.imgur.com/lwOMm02.jpg' },
    { name: 'Uranus', radius: 0.2, distance: 8.5, speed: 0.002, texture: 'https://i.imgur.com/ZXYpNqZ.jpg' },
    { name: 'Neptune', radius: 0.2, distance: 10.5, speed: 0.001, texture: 'https://i.imgur.com/oH5M5Rs.jpg' },
];

// Create planet meshes
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        map: loadTexture(planet.texture),
        emissive: 0x222222,
        emissiveIntensity: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.distance = planet.distance;
    mesh.speed = planet.speed;
    mesh.angle = 0;

    scene.add(mesh);
    planet.mesh = mesh; // Store the mesh for later use
});

camera.position.z = 12;

// Speed control
const speedControl = document.getElementById('speed');
speedControl.addEventListener('input', () => {
    const speedFactor = parseFloat(speedControl.value);
    planets.forEach(planet => {
        planet.mesh.speed = planet.speed * speedFactor;
    });
});

// Update positions of planets
const updatePositions = () => {
    planets.forEach(planet => {
        planet.mesh.angle += planet.mesh.speed;
        planet.mesh.position.x = planet.mesh.distance * Math.cos(planet.mesh.angle);
        planet.mesh.position.z = planet.mesh.distance * Math.sin(planet.mesh.angle);
        planet.mesh.rotation.y += 0.01; // Rotate on its axis
    });
};

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    updatePositions();
    renderer.render(scene, camera);
};

// Handle window resizing
const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize);

// Start animation
animate();
