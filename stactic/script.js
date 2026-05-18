import * as THREE from 'three';

let scene, camera, renderer, particles, core, clock;
const params = { model_size: 7, hardware: 'NVIDIA_A100', grid_intensity: 400 };

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(5, 3, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // 1. Central Neural Core (The AI Model)
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        wireframe: true,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5 
    });
    core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // 2. Particle System (Energy Flow)
    const pCount = 2000;
    const pGeometry = new THREE.BufferGeometry();
    const posArr = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) posArr[i] = (Math.random() - 0.5) * 20;
    pGeometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    
    const pMaterial = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6
    });
    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    const light = new THREE.PointLight(0x00ffff, 10, 50);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Listeners
    window.addEventListener('resize', onWindowResize);
    document.getElementById('modelScale').addEventListener('input', updateSim);
    document.getElementById('hwType').addEventListener('change', updateSim);
    document.getElementById('carbonInt').addEventListener('input', updateSim);
    
    updateSim();
}

async function updateSim() {
    const data = {
        model_size: parseFloat(document.getElementById('modelScale').value),
        hardware: document.getElementById('hwType').value,
        utilization: 0.8,
        grid_intensity: parseFloat(document.getElementById('carbonInt').value)
    };

    const response = await fetch('/calculate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    const res = await response.json();

    // Update UI
    document.getElementById('out-watt').innerText = `${res.wattage}W`;
    document.getElementById('out-co2').innerText = `${res.carbon_gh} g/h`;
    document.getElementById('out-lat').innerText = `${res.latency}ms`;

    // Visual Feedback
    const heat = res.heat_level; // 0 to 1
    core.material.color.setHSL(0.5 - (heat * 0.5), 1, 0.5);
    core.material.emissive.setHSL(0.5 - (heat * 0.5), 1, 0.5);
    core.scale.set(1 + heat, 1 + heat, 1 + heat);
    particles.material.color.setHSL(0.3 - (heat * 0.3), 1, 0.5);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    core.rotation.y += 0.005;
    core.rotation.z += 0.005;

    const positions = particles.geometry.attributes.position.array;
    for(let i=0; i<positions.length; i+=3) {
        // Move particles towards center (consumption)
        positions[i] *= 0.99;
        positions[i+1] *= 0.99;
        positions[i+2] *= 0.99;

        // Reset if they hit the core
        if (Math.abs(positions[i]) < 0.1) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i+1] = (Math.random() - 0.5) * 20;
            positions[i+2] = (Math.random() - 0.5) * 20;
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
