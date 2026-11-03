import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, Eye, Compass, RotateCcw, Box } from 'lucide-react';

interface Hero3DCanvasProps {
  isDark?: boolean;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ isDark = true }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [modelType, setModelType] = useState<'drone' | 'cinema'>('drone');
  const [isInteracting, setIsInteracting] = useState(false);

  // Mutable refs for animation loop
  const stateRef = useRef({
    targetRotX: 0.15,
    targetRotY: -0.3,
    currentRotX: 0.15,
    currentRotY: -0.3,
    hoverOffset: 0,
    isDark,
    wireframeMode: false,
    modelType: 'drone' as 'drone' | 'cinema',
  });

  useEffect(() => {
    stateRef.current.isDark = isDark;
    stateRef.current.wireframeMode = wireframeMode;
    stateRef.current.modelType = modelType;
  }, [isDark, wireframeMode, modelType]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 4.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.15 : 1.0;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflections via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Rig (Key, Fill, Rim)
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.4);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(
      isDark ? 0x2563eb : 0x60a5fa,
      isDark ? 0x050507 : 0xe2e8f0,
      1.2
    );
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Radial contact shadow under model
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.95;
    scene.add(shadowMesh);

    // Root Assembly Group
    const rootModelGroup = new THREE.Group();
    scene.add(rootModelGroup);

    // Materials Pool
    const titaniumDarkMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.9,
      roughness: 0.22,
    });

    const titaniumLightMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.28,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115,
      metalness: 0.35,
      roughness: 0.65,
    });

    const blueAccentMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: isSoftwareGl ? 0 : 0.95,
      transparent: true,
      opacity: isSoftwareGl ? 0.4 : 1,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.8,
    });

    const wireframeBaseMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x93c5fd : 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    // 1. Build Composite 8-Part Cinema Drone Model
    const droneGroup = new THREE.Group();

    // Part 1: Main Aerodynamic Fuselage
    const fuselageGeo = new THREE.BoxGeometry(0.9, 0.24, 1.4);
    const fuselage = new THREE.Mesh(fuselageGeo, titaniumDarkMat);
    fuselage.castShadow = !isSoftwareGl;
    droneGroup.add(fuselage);

    // Part 2: Top Carbon Canopy
    const canopyGeo = new THREE.CylinderGeometry(0.26, 0.4, 0.16, 16);
    canopyGeo.scale(1, 1, 1.6);
    const canopy = new THREE.Mesh(canopyGeo, carbonMat);
    canopy.position.y = 0.16;
    canopy.castShadow = !isSoftwareGl;
    droneGroup.add(canopy);

    // Part 3 & 4: 4 Carbon Fiber Motor Arms
    const armGeo = new THREE.BoxGeometry(0.08, 0.06, 1.1);
    const armFront = new THREE.Mesh(armGeo, carbonMat);
    armFront.rotation.y = Math.PI / 4;
    armFront.position.y = 0.02;
    droneGroup.add(armFront);

    const armBack = new THREE.Mesh(armGeo, carbonMat);
    armBack.rotation.y = -Math.PI / 4;
    armBack.position.y = 0.02;
    droneGroup.add(armBack);

    // Part 5: 4 Motor Pods & Rotors
    const motorPodGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.14, 16);
    const rotorBladeGeo = new THREE.BoxGeometry(0.68, 0.015, 0.07);
    const rotorMeshes: THREE.Mesh[] = [];

    const motorPositions = [
      [-0.75, 0.08, -0.75],
      [0.75, 0.08, -0.75],
      [-0.75, 0.08, 0.75],
      [0.75, 0.08, 0.75],
    ];

    motorPositions.forEach((pos, idx) => {
      const pod = new THREE.Mesh(motorPodGeo, blueAccentMat);
      pod.position.set(pos[0], pos[1], pos[2]);
      droneGroup.add(pod);

      const rotor = new THREE.Mesh(rotorBladeGeo, carbonMat);
      rotor.position.set(pos[0], pos[1] + 0.08, pos[2]);
      droneGroup.add(rotor);
      rotorMeshes.push(rotor);

      // Accent LED diodes
      const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const led = new THREE.Mesh(
        ledGeo,
        new THREE.MeshBasicMaterial({ color: idx < 2 ? 0x10b981 : 0xef4444 })
      );
      led.position.set(pos[0] * 0.95, pos[1] - 0.06, pos[2] * 0.95);
      droneGroup.add(led);
    });

    // Part 6: Front 3-Axis Gimbal & Optical Camera
    const gimbalArmGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12);
    const gimbalArm = new THREE.Mesh(gimbalArmGeo, carbonMat);
    gimbalArm.position.set(0, -0.16, 0.65);
    droneGroup.add(gimbalArm);

    const gimbalEyeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const gimbalEye = new THREE.Mesh(gimbalEyeGeo, titaniumDarkMat);
    gimbalEye.position.set(0, -0.26, 0.75);
    droneGroup.add(gimbalEye);

    // Part 7: Lens Barrel & Front Optical Element
    const lensBarrelGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.16, 20);
    lensBarrelGeo.rotateX(Math.PI / 2);
    const lensBarrel = new THREE.Mesh(lensBarrelGeo, carbonMat);
    lensBarrel.position.set(0, -0.26, 0.88);
    droneGroup.add(lensBarrel);

    const lensGlassGeo = new THREE.CircleGeometry(0.09, 20);
    const lensGlass = new THREE.Mesh(lensGlassGeo, glassMat);
    lensGlass.position.set(0, -0.26, 0.965);
    droneGroup.add(lensGlass);

    // Part 8: Landing Skids
    const skidGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
    skidGeo.rotateX(Math.PI / 2);
    const skidL = new THREE.Mesh(skidGeo, titaniumDarkMat);
    skidL.position.set(-0.35, -0.34, 0);
    droneGroup.add(skidL);

    const skidR = new THREE.Mesh(skidGeo, titaniumDarkMat);
    skidR.position.set(0.35, -0.34, 0);
    droneGroup.add(skidR);

    // 2. Build Alternative Cinema Camera Rig Model
    const cinemaGroup = new THREE.Group();

    // Body
    const camBodyGeo = new THREE.BoxGeometry(0.7, 0.8, 1.0);
    const camBody = new THREE.Mesh(camBodyGeo, titaniumDarkMat);
    cinemaGroup.add(camBody);

    // Top Handle
    const handleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.7);
    const handle = new THREE.Mesh(handleGeo, carbonMat);
    handle.position.set(0, 0.52, 0);
    cinemaGroup.add(handle);

    // Cinema Prime Lens
    const primeLensGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.6, 24);
    primeLensGeo.rotateX(Math.PI / 2);
    const primeLens = new THREE.Mesh(primeLensGeo, carbonMat);
    primeLens.position.set(0, 0, 0.75);
    cinemaGroup.add(primeLens);

    // Matte Box / Sun Hood
    const hoodGeo = new THREE.BoxGeometry(0.65, 0.55, 0.2);
    const hood = new THREE.Mesh(hoodGeo, carbonMat);
    hood.position.set(0, 0, 1.1);
    cinemaGroup.add(hood);

    // Side Monitor
    const monitorArmGeo = new THREE.BoxGeometry(0.04, 0.04, 0.3);
    const monitorArm = new THREE.Mesh(monitorArmGeo, carbonMat);
    monitorArm.position.set(-0.45, 0.2, 0.1);
    cinemaGroup.add(monitorArm);

    const monitorGeo = new THREE.BoxGeometry(0.04, 0.45, 0.65);
    const monitor = new THREE.Mesh(monitorGeo, titaniumDarkMat);
    monitor.position.set(-0.58, 0.2, 0.1);
    cinemaGroup.add(monitor);

    // Monitor screen glowing blue
    const screenGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const screen = new THREE.Mesh(screenGeo, blueAccentMat);
    screen.rotation.y = -Math.PI / 2;
    screen.position.set(-0.605, 0.2, 0.1);
    cinemaGroup.add(screen);

    // Add selected model
    rootModelGroup.add(droneGroup);

    // Switch model handler
    const applyModelSelection = (type: 'drone' | 'cinema') => {
      rootModelGroup.clear();
      if (type === 'drone') {
        rootModelGroup.add(droneGroup);
      } else {
        rootModelGroup.add(cinemaGroup);
      }
    };

    // Wireframe toggle handler
    const updateMaterialsMode = (isWireframe: boolean, isDarkMode: boolean) => {
      const activeColor = isDarkMode ? 0x93c5fd : 0x2563eb;
      wireframeBaseMat.color.setHex(activeColor);

      const applyWireframe = (obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          if (isWireframe) {
            obj.userData.originalMat = obj.material;
            obj.material = wireframeBaseMat;
          } else if (obj.userData.originalMat) {
            obj.material = obj.userData.originalMat;
          }
        }
        obj.children.forEach(applyWireframe);
      };

      applyWireframe(rootModelGroup);
    };

    // Cursor / Mouse Parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetRotY = x * 0.75;
      stateRef.current.targetRotX = 0.15 - y * 0.45;
    };

    // Touch support for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        stateRef.current.targetRotY = x * 0.65;
        stateRef.current.targetRotX = 0.15 - y * 0.35;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop (Damped Kinematics & 60 FPS Cap)
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Check model or material mode updates
      if (stateRef.current.modelType !== (rootModelGroup.children[0] === droneGroup ? 'drone' : 'cinema')) {
        applyModelSelection(stateRef.current.modelType);
        updateMaterialsMode(stateRef.current.wireframeMode, stateRef.current.isDark);
      }

      // Smooth exponential damping on rotation
      stateRef.current.currentRotY = THREE.MathUtils.damp(
        stateRef.current.currentRotY,
        stateRef.current.targetRotY,
        4.0,
        delta
      );
      stateRef.current.currentRotX = THREE.MathUtils.damp(
        stateRef.current.currentRotX,
        stateRef.current.targetRotX,
        4.0,
        delta
      );

      // Subtle atmospheric hover breathing
      const hoverY = Math.sin(time * 1.8) * 0.07;
      rootModelGroup.position.y = hoverY;
      rootModelGroup.rotation.y = stateRef.current.currentRotY;
      rootModelGroup.rotation.x = stateRef.current.currentRotX;

      // Spin drone rotor blades
      if (stateRef.current.modelType === 'drone') {
        rotorMeshes.forEach((r, idx) => {
          r.rotation.y += (idx % 2 === 0 ? 1 : -1) * 32 * delta;
        });
      }

      // Contact shadow responds to elevation
      shadowMesh.scale.setScalar(1 + hoverY * 0.6);
      shadowMat.opacity = 0.65 - hoverY * 1.2;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
      fuselageGeo.dispose();
      canopyGeo.dispose();
      armGeo.dispose();
      motorPodGeo.dispose();
      rotorBladeGeo.dispose();
      gimbalArmGeo.dispose();
      gimbalEyeGeo.dispose();
      lensBarrelGeo.dispose();
      lensGlassGeo.dispose();
      skidGeo.dispose();
      camBodyGeo.dispose();
      handleGeo.dispose();
      primeLensGeo.dispose();
      hoodGeo.dispose();
      monitorArmGeo.dispose();
      monitorGeo.dispose();
      screenGeo.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[460px] rounded-3xl overflow-hidden editorial-glass border border-black/10 dark:border-white/10 shadow-2xl group select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Spec Info */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 pointer-events-none flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
        <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-800 dark:text-neutral-200 font-semibold bg-white/70 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
          Interactive Three.js 3D Viewport
        </span>
      </div>

      {/* Subtle Hint Overlay */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/60 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
        <Compass className="w-3 h-3 text-blue-500" />
        <span>Move cursor or drag to tilt</span>
      </div>

      {/* Sleek Bottom Control Dock */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-between sm:justify-center gap-2 p-1.5 rounded-2xl bg-white/85 dark:bg-[#0A0B0E]/90 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-xl max-w-sm sm:max-w-md w-full">
        {/* Model Switcher */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setModelType('drone')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'drone'
                ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Drone 4K
          </button>
          <button
            onClick={() => setModelType('cinema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              modelType === 'cinema'
                ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Cinema Rig
          </button>
        </div>

        {/* Wireframe / PBR Finish Toggle */}
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer min-h-[36px] ${
            wireframeMode
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-black/5 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10'
          }`}
          title="Toggle Wireframe / Physical Finish"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{wireframeMode ? 'Wireframe' : 'Studio PBR'}</span>
        </button>

        {/* Reset Orientation */}
        <button
          onClick={() => {
            stateRef.current.targetRotX = 0.15;
            stateRef.current.targetRotY = -0.3;
          }}
          className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          title="Reset View"
          aria-label="Reset 3D camera angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
