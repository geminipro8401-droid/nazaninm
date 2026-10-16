import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Sparkles, Heart, Compass, Flower2, Eye, EyeOff, Maximize2, Minimize2, Camera } from 'lucide-react';
import { loveSoundEngine } from '../audio/loveSynth';

// Module-level reusable math objects (Zero GC in tick)
const _vec3 = new THREE.Vector3();
const _targetRotation = new THREE.Vector2(0, 0);
const _currentRotation = new THREE.Vector2(0, 0);
const _targetCamPos = new THREE.Vector3(0, 0.35, 7.5);
const _currentCamPos = new THREE.Vector3(0, 0.35, 7.5);
const _mouseParallax = new THREE.Vector2(0, 0);

interface ThreeCanvasProps {
  onHeartbeatTrigger?: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ onHeartbeatTrigger }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Crystal Rose is the primary center hero visual
  const [activeSceneMode, setActiveSceneMode] = useState<'rose' | 'heart' | 'bridge'>('rose');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.75);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [glowIntensity, setGlowIntensity] = useState<number>(1.3);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'cinematic' | 'macro' | 'orbit'>('front');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for render loop
  const modeRef = useRef<'rose' | 'heart' | 'bridge'>(activeSceneMode);
  const speedRef = useRef<number>(rotationSpeed);
  const glowRef = useRef<number>(glowIntensity);
  const mouseDistFromCenter = useRef<number>(0);

  useEffect(() => {
    modeRef.current = activeSceneMode;
  }, [activeSceneMode]);

  useEffect(() => {
    speedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    glowRef.current = glowIntensity;
  }, [glowIntensity]);

  useEffect(() => {
    switch (cameraPreset) {
      case 'front':
        _targetCamPos.set(0, 0.3, 7.5);
        break;
      case 'cinematic':
        _targetCamPos.set(2.2, 1.5, 6.5);
        break;
      case 'macro':
        _targetCamPos.set(0, 0.5, 4.4);
        break;
      case 'orbit':
        _targetCamPos.set(-2.6, 1.6, 7.2);
        break;
    }
  }, [cameraPreset]);

  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL is not available in this environment:', e);
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040106, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(_targetCamPos);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Post-Processing Bloom Setup for Luxury Crystal Glow
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.4,  // strength - tuned for luxury soft glow
      0.45, // radius - smooth diffusion
      0.72  // threshold - illuminates crystal highlights & core
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // 4. Balanced Studio Rig
    const ambientLight = new THREE.AmbientLight(0xffb3c6, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff2a5f, 3.2);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff758f, 4.0, 25);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Dynamic soft glow point light placed inside the rose blossom
    const roseGlowLight = new THREE.PointLight(0xff2a6d, 3.8, 12);
    roseGlowLight.position.set(0, 0.7, 0.15);
    scene.add(roseGlowLight);

    // Soft contact shadow plane under the rose
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const shadowGrad = sctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    shadowGrad.addColorStop(0.5, 'rgba(30, 0, 15, 0.3)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = shadowGrad;
    sctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -1.9;
    scene.add(contactShadow);

    // ========================================================
    // HERO ASSET: HIGH-QUALITY 3D CRYSTAL ROSE (REFINED & SCALED SLIGHTLY SMALLER)
    // ========================================================
    const roseGroup = new THREE.Group();

    // 1. Crystal Petal Material (High Refraction & Reflectivity MeshPhysicalMaterial)
    const crystalPetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xff1361,
      transmission: 0.94,            // ultra-clear crystal transparency
      ior: 1.76,                     // diamond/sapphire crystal refractive index
      thickness: 1.7,                // optical absorption depth
      roughness: 0.04,               // mirror-polished facets
      metalness: 0.08,               // crisp specular reflection
      reflectivity: 0.98,            // maximum surface reflectance
      clearcoat: 1.0,                // brilliant secondary reflective layer
      clearcoatRoughness: 0.02,
      specularColor: new THREE.Color(0xffffff),
      specularIntensity: 1.0,
      attenuationColor: new THREE.Color(0xff0055), // glowing ruby-pink refraction
      attenuationDistance: 0.85,
      side: THREE.DoubleSide
    });

    // Inner Glowing Core Petal Material (MeshPhysicalMaterial with luminous heart)
    const innerPetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xff004f,
      emissive: 0x990033,
      emissiveIntensity: 0.65,        // glowing center for bloom pass
      transmission: 0.82,
      ior: 1.68,
      thickness: 1.9,
      roughness: 0.06,
      metalness: 0.1,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      side: THREE.DoubleSide
    });

    // 2. Procedural Fibonacci Petals Assembly (Refined Scale: delicate and slightly smaller)
    const totalPetalLayers = 7;
    const goldenAngle = 137.5 * (Math.PI / 180);

    let petalGlobalIndex = 0;
    for (let layer = 0; layer < totalPetalLayers; layer++) {
      const isInner = layer < 2;
      const petalsInLayer = layer === 0 ? 3 : 4 + layer;
      // Scaled down base radius and heights for the refined slightly smaller size
      const baseRadius = 0.14 + layer * 0.14;
      const layerHeight = 0.62 - layer * 0.07;

      for (let p = 0; p < petalsInLayer; p++) {
        petalGlobalIndex++;
        const angle = petalGlobalIndex * goldenAngle;

        // Custom sculpted petal geometry with organic scaling
        const petalWidth = 0.32 + layer * 0.1;
        const petalHeight = 0.48 + layer * 0.11;
        const petalDepth = 0.22 + layer * 0.05;

        const petalGeo = new THREE.SphereGeometry(
          petalWidth,
          20,
          20,
          0,
          Math.PI,
          0,
          Math.PI * 0.72
        );
        petalGeo.scale(0.85, petalHeight / petalWidth, petalDepth / petalWidth);
        petalGeo.center();

        const petalMesh = new THREE.Mesh(
          petalGeo,
          isInner ? innerPetalMat : crystalPetalMat
        );

        // Position & natural curve rotation
        const r = baseRadius * (0.85 + Math.random() * 0.08);
        petalMesh.position.set(
          Math.cos(angle) * r,
          layerHeight + (Math.random() - 0.5) * 0.03,
          Math.sin(angle) * r
        );

        // Flaring outwards gracefully
        petalMesh.rotation.y = -angle + Math.PI / 2;
        petalMesh.rotation.x = 0.26 + layer * 0.13;
        petalMesh.rotation.z = (Math.random() - 0.5) * 0.15;

        roseGroup.add(petalMesh);
      }
    }

    // 3. Rose Core Center Bud
    const budGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
    budGeo.rotateX(Math.PI);
    const budMesh = new THREE.Mesh(budGeo, innerPetalMat);
    budMesh.position.set(0, 0.68, 0);
    roseGroup.add(budMesh);

    // 4. Sepals (Crystalline green/gold MeshPhysicalMaterial)
    const sepalMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      transmission: 0.78,
      ior: 1.58,
      thickness: 1.1,
      roughness: 0.1,
      reflectivity: 0.9,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });

    const sepalCount = 5;
    for (let s = 0; s < sepalCount; s++) {
      const sAngle = (s / sepalCount) * Math.PI * 2;
      const sepalGeo = new THREE.ConeGeometry(0.09, 0.55, 8);
      sepalGeo.rotateX(Math.PI / 2);
      const sepal = new THREE.Mesh(sepalGeo, sepalMat);
      sepal.position.set(Math.cos(sAngle) * 0.28, 0.38, Math.sin(sAngle) * 0.28);
      sepal.rotation.y = -sAngle;
      sepal.rotation.x = 0.62;
      roseGroup.add(sepal);
    }

    // 5. Crystal Jade Stem (MeshPhysicalMaterial with high refractive transmission)
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.38, 0),
      new THREE.Vector3(0.06, -0.35, 0.05),
      new THREE.Vector3(-0.05, -1.0, -0.03),
      new THREE.Vector3(0.04, -1.5, 0.02),
      new THREE.Vector3(0, -1.9, 0)
    ]);

    const stemGeo = new THREE.TubeGeometry(stemCurve, 36, 0.07, 12, false);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0x166534,
      transmission: 0.82,
      ior: 1.6,
      thickness: 1.2,
      roughness: 0.08,
      reflectivity: 0.92,
      clearcoat: 1.0
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    roseGroup.add(stem);

    // 6. Crystal Rose Leaves (2 branched crystalline leaves)
    const leafGeo = new THREE.SphereGeometry(0.5, 16, 16);
    leafGeo.scale(0.35, 0.07, 0.85);
    leafGeo.center();

    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      transmission: 0.84,
      ior: 1.58,
      thickness: 1.0,
      roughness: 0.09,
      reflectivity: 0.9,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });

    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(0.38, -0.42, 0.16);
    leaf1.rotation.set(0.35, 0.8, -0.3);
    roseGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(-0.38, -0.92, -0.12);
    leaf2.rotation.set(-0.25, -0.9, 0.35);
    roseGroup.add(leaf2);

    // 7. Swirling Ethereal Crystal Pollen & Star Dust (1400 glowing particles)
    const pollenCount = 1400;
    const pollenPositions = new Float32Array(pollenCount * 3);
    const pollenColors = new Float32Array(pollenCount * 3);

    const pollenPalette = [
      new THREE.Color(0xff2a6d),
      new THREE.Color(0xff758f),
      new THREE.Color(0xffb3c6),
      new THREE.Color(0xffffff),
      new THREE.Color(0xffd700)
    ];

    for (let i = 0; i < pollenCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 2.2;
      const yPos = -1.2 + Math.random() * 2.8;

      pollenPositions[i * 3] = Math.cos(angle) * radius;
      pollenPositions[i * 3 + 1] = yPos;
      pollenPositions[i * 3 + 2] = Math.sin(angle) * radius;

      const col = pollenPalette[Math.floor(Math.random() * pollenPalette.length)];
      pollenColors[i * 3] = col.r;
      pollenColors[i * 3 + 1] = col.g;
      pollenColors[i * 3 + 2] = col.b;
    }

    const pollenGeo = new THREE.BufferGeometry();
    pollenGeo.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3));
    pollenGeo.setAttribute('color', new THREE.BufferAttribute(pollenColors, 3));

    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 64;
    particleCanvas.height = 64;
    const pctx = particleCanvas.getContext('2d')!;
    const pgrad = pctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pgrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pgrad.addColorStop(0.3, 'rgba(255, 105, 180, 0.85)');
    pgrad.addColorStop(0.7, 'rgba(225, 29, 72, 0.35)');
    pgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pctx.fillStyle = pgrad;
    pctx.fillRect(0, 0, 64, 64);

    const pollenTexture = new THREE.CanvasTexture(particleCanvas);
    pollenTexture.colorSpace = THREE.SRGBColorSpace;

    const pollenMat = new THREE.PointsMaterial({
      size: 0.11,
      map: pollenTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pollenParticles = new THREE.Points(pollenGeo, pollenMat);
    roseGroup.add(pollenParticles);

    // 8. Soft Glowing Aura Ring around Blossom
    const auraGeo = new THREE.TorusGeometry(1.3, 0.02, 16, 80);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      transparent: true,
      opacity: 0.4
    });
    const auraRing = new THREE.Mesh(auraGeo, auraMat);
    auraRing.position.y = 0.6;
    auraRing.rotation.x = Math.PI / 2.5;
    roseGroup.add(auraRing);

    // Scaling the entire crystal rose slightly smaller as requested (0.85 scale)
    roseGroup.scale.set(0.85, 0.85, 0.85);
    roseGroup.position.set(0, 0.25, 0);
    scene.add(roseGroup);

    // ========================================================
    // SECONDARY ASSET: GALAXY CRYSTAL HEART
    // ========================================================
    const heartGroup = new THREE.Group();
    heartGroup.visible = false;

    const heartShape = new THREE.Shape();
    const hx0 = 0, hy0 = 0;
    heartShape.moveTo(hx0 + 0.25, hy0 + 0.25);
    heartShape.bezierCurveTo(hx0 + 0.25, hy0 + 0.25, hx0 + 0.2, hy0, hx0, hy0);
    heartShape.bezierCurveTo(hx0 - 0.3, hy0, hx0 - 0.3, hy0 + 0.35, hx0 - 0.3, hy0 + 0.35);
    heartShape.bezierCurveTo(hx0 - 0.3, hy0 + 0.55, hx0 - 0.1, hy0 + 0.77, hx0 + 0.25, hy0 + 1.0);
    heartShape.bezierCurveTo(hx0 + 0.6, hy0 + 0.77, hx0 + 0.8, hy0 + 0.55, hx0 + 0.8, hy0 + 0.35);
    heartShape.bezierCurveTo(hx0 + 0.8, hy0 + 0.35, hx0 + 0.8, hy0, hx0 + 0.5, hy0);
    heartShape.bezierCurveTo(hx0 + 0.35, hy0, hx0 + 0.25, hy0 + 0.25, hx0 + 0.25, hy0 + 0.25);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 3,
      bevelSize: 0.13,
      bevelThickness: 0.13
    });
    heartGeo.center();

    const crystalHeartMesh = new THREE.Mesh(heartGeo, crystalPetalMat);
    crystalHeartMesh.scale.set(1.7, 1.7, 1.7);
    crystalHeartMesh.rotation.z = Math.PI;
    heartGroup.add(crystalHeartMesh);

    scene.add(heartGroup);

    // ========================================================
    // SECONDARY ASSET: LONG DISTANCE BRIDGE
    // ========================================================
    const bridgeGroup = new THREE.Group();
    bridgeGroup.visible = false;

    const planetAGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const planetAMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x4c0519,
      emissiveIntensity: 0.5
    });
    const planetA = new THREE.Mesh(planetAGeo, planetAMat);
    planetA.position.set(-2.8, -0.4, 0);
    bridgeGroup.add(planetA);

    const planetBGeo = new THREE.SphereGeometry(0.95, 32, 32);
    const planetBMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2,
      metalness: 0.85,
      emissive: 0xbe123c,
      emissiveIntensity: 0.7
    });
    const planetB = new THREE.Mesh(planetBGeo, planetBMat);
    planetB.position.set(2.8, 0.4, 0);
    bridgeGroup.add(planetB);

    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, -0.4, 0),
      new THREE.Vector3(-1.2, 1.8, 0.9),
      new THREE.Vector3(1.2, 1.9, 0.9),
      new THREE.Vector3(2.8, 0.4, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(bridgeCurve, 64, 0.05, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.8 });
    const bridgeTube = new THREE.Mesh(tubeGeo, tubeMat);
    bridgeGroup.add(bridgeTube);

    scene.add(bridgeGroup);

    // ========================================================
    // MOUSE REACTION & PARALLAX TRACKING
    // ========================================================
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      const dist = Math.sqrt(normX * normX + normY * normY);
      mouseDistFromCenter.current = Math.min(dist, 1.5);

      _mouseParallax.set(normX * 0.4, normY * 0.3);

      if (!isDragging) return;

      const deltaX = clientX - previousPointerX;
      const deltaY = clientY - previousPointerY;

      _targetRotation.y += deltaX * 0.007;
      _targetRotation.x += deltaY * 0.007;

      previousPointerX = clientX;
      previousPointerY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', onPointerDown);
    canvasDom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================
    // RENDER LOOP (Post-Processing Bloom & Luxury Crystal Glow)
    // ========================================================
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const speed = speedRef.current;
      const glow = glowRef.current;
      const currentMode = modeRef.current;

      // Smooth camera position damping
      _currentCamPos.x = THREE.MathUtils.damp(_currentCamPos.x, _targetCamPos.x + _mouseParallax.x * 0.35, 4, delta);
      _currentCamPos.y = THREE.MathUtils.damp(_currentCamPos.y, _targetCamPos.y + _mouseParallax.y * 0.35, 4, delta);
      _currentCamPos.z = THREE.MathUtils.damp(_currentCamPos.z, _targetCamPos.z, 4, delta);
      camera.position.copy(_currentCamPos);
      camera.lookAt(0, 0.35, 0);

      // Slow and graceful rotation
      _targetRotation.y += delta * 0.22 * speed;
      _currentRotation.x = THREE.MathUtils.damp(_currentRotation.x, _targetRotation.x, 5, delta);
      _currentRotation.y = THREE.MathUtils.damp(_currentRotation.y, _targetRotation.y, 5, delta);

      // Mode toggling
      roseGroup.visible = currentMode === 'rose';
      heartGroup.visible = currentMode === 'heart';
      bridgeGroup.visible = currentMode === 'bridge';

      if (currentMode === 'rose') {
        roseGroup.rotation.y = _currentRotation.y;
        roseGroup.rotation.x = _currentRotation.x + _mouseParallax.y * 0.22;
        roseGroup.rotation.z = -_mouseParallax.x * 0.22 + Math.sin(elapsedTime * 1.2) * 0.025;

        // Soft Glowing & Bloom Modulation
        const freqData = loveSoundEngine.getAudioFrequencyData();
        const audioBass = freqData && freqData.length > 0 ? freqData[0] / 255 : 0;

        const proximityBonus = (1.5 - mouseDistFromCenter.current) * 0.35;
        const softGlowFactor = (1 + Math.sin(elapsedTime * 2.0) * 0.12 + audioBass * 0.25 + proximityBonus) * glow;

        roseGlowLight.intensity = 3.6 * softGlowFactor;
        crystalPetalMat.attenuationDistance = 0.85 * softGlowFactor;
        auraMat.opacity = 0.3 * softGlowFactor;
        auraRing.rotation.z = elapsedTime * 0.25;

        // Dynamic bloom strength modulation for luxury radiance
        bloomPass.strength = THREE.MathUtils.damp(bloomPass.strength, 1.35 * softGlowFactor, 4, delta);

        // Swirling crystal pollen motion
        pollenParticles.rotation.y = -elapsedTime * 0.12 * speed;
      } else if (currentMode === 'heart') {
        heartGroup.rotation.x = _currentRotation.x;
        heartGroup.rotation.y = _currentRotation.y;
        const pulse = 1 + Math.sin(elapsedTime * 3.5) * 0.05;
        crystalHeartMesh.scale.set(1.7 * pulse, 1.7 * pulse, 1.7 * pulse);
        bloomPass.strength = 1.2 * glow;
      } else if (currentMode === 'bridge') {
        bridgeGroup.rotation.y = _currentRotation.y * 0.5;
        planetA.rotation.y += delta * 0.5;
        planetB.rotation.y += delta * 0.7;
        bloomPass.strength = 1.1 * glow;
      }

      // Render via EffectComposer (Bloom + OutputPass)
      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvasDom.removeEventListener('mousedown', onPointerDown);
      canvasDom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      composer.dispose();
      bloomPass.dispose();
      crystalPetalMat.dispose();
      innerPetalMat.dispose();
      sepalMat.dispose();
      stemMat.dispose();
      leafMat.dispose();
      pollenGeo.dispose();
      pollenMat.dispose();
      pollenTexture.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleHeartbeatClick = () => {
    loveSoundEngine.playHeartbeat();
    if (navigator.vibrate) {
      navigator.vibrate([80, 60, 100]);
    }
    if (onHeartbeatTrigger) {
      onHeartbeatTrigger();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[650px] md:h-[720px] bg-radial from-[#1e071c] via-[#0d030f] to-[#040106] overflow-hidden rounded-3xl border border-luxury-glow box-glow-luxury shadow-2xl"
    >
      {/* 3D WebGL Canvas Mount */}
      {webglSupported ? (
        <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-900 via-red-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-900 mb-4 animate-heartbeat-luxury border border-rose-300/40">
            <span className="text-5xl">🌹</span>
          </div>
          <h3 className="text-xl font-bold text-rose-200 mb-1">رز کریستالی ابدی برای نازنین</h3>
          <p className="text-xs text-pink-300/70 max-w-sm">
            فاصله‌ها محو می‌شوند وقتی یاد تو در جانم جاری است ❤️
          </p>
        </div>
      )}

      {/* Top Floating Badge & Specs */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 select-none">
        <div className="bg-black/70 border border-rose-500/30 px-4 py-1.5 rounded-full text-xs text-rose-300 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_#f43f5e]" />
          <span>رز کریستالی ابدی • هاله بلوم لوکس</span>
        </div>
      </div>

      {/* Top Left: Fullscreen & Hint */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/60 hover:bg-black text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer shadow-md"
          title={isFullscreen ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه استودیویی'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <span className="hidden sm:inline-block text-[11px] text-pink-300/60 bg-black/50 px-3 py-1 rounded-full border border-rose-950">
          ✨ افکت بلوم لوکس و شکست نور کریستال با حرکت ماوس
        </span>
      </div>

      {/* THREE.JS SKILL DIRECTIVE: UNIFIED COLLAPSIBLE BOTTOM DOCK */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[880px] flex flex-col items-center">
        {/* Collapse / Expand Toggle Tab */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="mb-2 px-3.5 py-1 bg-black/85 hover:bg-black text-rose-300 border border-rose-500/30 rounded-full text-xs flex items-center gap-1.5 shadow-xl transition-colors cursor-pointer"
        >
          {isZenMode ? (
            <>
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>نمایش پنل کنترل سه‌بعدی</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
              <span>حالت خلوت سینمایی (Zen Mode)</span>
            </>
          )}
        </button>

        {/* The Sleek Bottom Glassmorphic Dock */}
        {!isZenMode && (
          <div className="w-full bg-[#0a030c]/95 border border-rose-500/40 rounded-2xl p-3.5 md:p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-sm backdrop-blur-md">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-rose-950">
              <button
                onClick={() => {
                  setActiveSceneMode('rose');
                  loveSoundEngine.playHoverChime();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSceneMode === 'rose'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-950'
                    : 'text-pink-300/70 hover:text-white'
                }`}
              >
                <Flower2 className="w-3.5 h-3.5" />
                <span>رز کریستالی</span>
              </button>

              <button
                onClick={() => {
                  setActiveSceneMode('heart');
                  loveSoundEngine.playHoverChime();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSceneMode === 'heart'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-950'
                    : 'text-pink-300/70 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>قلب کهکشانی</span>
              </button>

              <button
                onClick={() => {
                  setActiveSceneMode('bridge');
                  loveSoundEngine.playHoverChime();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSceneMode === 'bridge'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-rose-950'
                    : 'text-pink-300/70 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>پل لانگ دیستنس</span>
              </button>
            </div>

            {/* Camera Presets Selector */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-rose-950 text-xs">
              <Camera className="w-3.5 h-3.5 text-rose-400 mx-1" />
              {(['front', 'cinematic', 'macro', 'orbit'] as const).map((cam) => (
                <button
                  key={cam}
                  onClick={() => {
                    setCameraPreset(cam);
                    loveSoundEngine.playHoverChime();
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    cameraPreset === cam
                      ? 'bg-rose-900/80 text-rose-200 border border-rose-500/40'
                      : 'text-pink-300/60 hover:text-white'
                  }`}
                >
                  {cam === 'front' ? 'روبرو' : cam === 'cinematic' ? 'مایل' : cam === 'macro' ? 'کلوزآپ گلبرگ‌ها' : 'مدار'}
                </button>
              ))}
            </div>

            {/* Sliders & Action Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Rotation Speed */}
              <div className="flex items-center gap-1.5 text-xs text-pink-300/80">
                <span>سرعت چرخش:</span>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-14 accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Heartbeat Trigger Button */}
              <button
                onClick={handleHeartbeatClick}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950 active:scale-95 transition-transform cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>طپش عشق</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
