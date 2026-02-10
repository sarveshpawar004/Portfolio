// ================================================
// THREE.JS SCENE - Neural Network Particles
// ================================================

let scene, camera, renderer, particleSystem, connectionLines;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    
    // Scene Setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 30;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create Particle System
    createParticleSystem();
    
    // Create Connection Lines
    createConnectionLines();
    
    // Mouse Movement
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Animate
    animate();
    
    // Handle Resize
    window.addEventListener('resize', onWindowResize, false);
}

function createParticleSystem() {
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    const color1 = new THREE.Color(0x3B82F6); // Blue
    const color2 = new THREE.Color(0x8B5CF6); // Purple
    const color3 = new THREE.Color(0x06B6D4); // Cyan
    
    for (let i = 0; i < particleCount; i++) {
        // Random position in a sphere
        const radius = 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions.push(x, y, z);
        
        // Random color between blue, purple, cyan
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            colors.push(color1.r, color1.g, color1.b);
        } else if (colorChoice < 0.66) {
            colors.push(color2.r, color2.g, color2.b);
        } else {
            colors.push(color3.r, color3.g, color3.b);
        }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createConnectionLines() {
    const positions = particleSystem.geometry.attributes.position.array;
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3B82F6,
        transparent: true,
        opacity: 0.1
    });
    
    const linePositions = [];
    const maxDistance = 5;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x1 = positions[i];
        const y1 = positions[i + 1];
        const z1 = positions[i + 2];
        
        for (let j = i + 3; j < positions.length; j += 3) {
            const x2 = positions[j];
            const y2 = positions[j + 1];
            const z2 = positions[j + 2];
            
            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) +
                Math.pow(y2 - y1, 2) +
                Math.pow(z2 - z1, 2)
            );
            
            if (distance < maxDistance) {
                linePositions.push(x1, y1, z1);
                linePositions.push(x2, y2, z2);
            }
        }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionLines);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotationX = mouseY * 0.3;
    targetRotationY = mouseX * 0.3;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation towards mouse
    particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.05;
    particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.05;
    
    // Auto rotation
    particleSystem.rotation.y += 0.001;
    
    // Sync connection lines
    if (connectionLines) {
        connectionLines.rotation.copy(particleSystem.rotation);
    }
    
    // Pulse effect
    const time = Date.now() * 0.001;
    const positions = particleSystem.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        const distance = Math.sqrt(x * x + y * y + z * z);
        const offset = Math.sin(time + distance * 0.1) * 0.1;
        
        positions[i] = x * (1 + offset);
        positions[i + 1] = y * (1 + offset);
        positions[i + 2] = z * (1 + offset);
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}
