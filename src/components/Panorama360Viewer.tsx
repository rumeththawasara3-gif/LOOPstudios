import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Compass,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Eye,
  Glasses,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { getWhatsAppUrl } from '../types.ts';

interface Hotspot {
  id: string;
  name: string;
  phi: number; // polar angle (from zenith, radians)
  theta: number; // azimuthal angle (radians)
  description: string;
  badge: string;
  coordsText: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'stage',
    name: 'Front Row & Stage View',
    phi: Math.PI / 2,
    theta: Math.PI * 0.25,
    description: 'Experience what the audience felt right in front of the main stage, or look around to see the crowd reaction.',
    badge: 'Stage Perspective',
    coordsText: 'Front Row View',
  },
  {
    id: 'vip',
    name: 'VIP Guest & Networking Lounge',
    phi: Math.PI / 2.05,
    theta: Math.PI * 0.85,
    description: 'Relive the energy and candid atmosphere in the hospitality lounge as guests celebrate.',
    badge: 'Lounge Perspective',
    coordsText: 'Guest Area',
  },
  {
    id: 'deck',
    name: 'Sound & Production Booth',
    phi: Math.PI / 1.95,
    theta: Math.PI * 1.45,
    description: 'A behind-the-scenes vantage point capturing all stage lighting, sound engineering, and keynote pacing.',
    badge: 'Director Angle',
    coordsText: 'Control Booth',
  },
  {
    id: 'atrium',
    name: 'Full Venue Architecture',
    phi: Math.PI / 2.02,
    theta: Math.PI * 1.85,
    description: 'Look all the way up to the ceiling trusses and around to take in the full architectural scale of the setting.',
    badge: 'Panoramic Angle',
    coordsText: 'Full Atrium',
  },
];

// Generates an equirectangular 360-degree canvas texture representing an architectural event venue
function generateProcedural360Texture(): HTMLCanvasElement {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Ambient Horizon & Sky/Ceiling Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#040508');
  skyGrad.addColorStop(0.3, '#080a10');
  skyGrad.addColorStop(0.5, '#0e121a');
  skyGrad.addColorStop(0.7, '#07080c');
  skyGrad.addColorStop(1, '#020305');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ceiling Structural Trusses & Light Rigs (Upper hemisphere)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let y = 100; y < 450; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let x = 0; x < width; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x, 450);
    ctx.stroke();
  }

  // Suspended Stage Lights (cones of warm and cyan light)
  const spotlightX = [280, 520, 880, 1240, 1600, 1920];
  spotlightX.forEach((sx, i) => {
    const isCyan = i % 2 === 0;
    const coneGrad = ctx.createRadialGradient(sx, 440, 10, sx, 600, 260);
    coneGrad.addColorStop(0, isCyan ? 'rgba(56, 189, 248, 0.4)' : 'rgba(251, 191, 36, 0.35)');
    coneGrad.addColorStop(0.7, isCyan ? 'rgba(37, 99, 235, 0.1)' : 'rgba(245, 158, 11, 0.08)');
    coneGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(sx - 20, 440);
    ctx.lineTo(sx + 20, 440);
    ctx.lineTo(sx + 160, 780);
    ctx.lineTo(sx - 160, 780);
    ctx.closePath();
    ctx.fill();
  });

  // 3. Horizon Landmark Architectural Features
  // Zone 01: Main Stage Screen (around x = width * 0.15 to 0.35)
  const stageX = width * 0.22;
  const stageGrad = ctx.createLinearGradient(stageX - 180, 420, stageX + 180, 600);
  stageGrad.addColorStop(0, '#1e293b');
  stageGrad.addColorStop(0.5, '#0284c7');
  stageGrad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = stageGrad;
  ctx.fillRect(stageX - 160, 440, 320, 160);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(stageX - 160, 440, 320, 160);

  ctx.font = 'bold 24px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('LOOP STUDIOS · 360° RECORDED EXPERIENCE', stageX, 520);
  ctx.font = '14px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('RELIVE THE MOMENT FROM ANY ANGLE', stageX, 550);

  // Zone 02: Executive Lounge Mezzanine (around x = width * 0.48)
  const loungeX = width * 0.48;
  ctx.fillStyle = 'rgba(20, 24, 33, 0.85)';
  ctx.fillRect(loungeX - 140, 470, 280, 120);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.strokeRect(loungeX - 140, 470, 280, 120);
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('EXECUTIVE VIP MEZZANINE', loungeX, 530);

  // Zone 03: Broadcast Deck (around x = width * 0.72)
  const deckX = width * 0.72;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(deckX - 120, 480, 240, 110);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.strokeRect(deckX - 120, 480, 240, 110);
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('OPTICAL CONTROL DECK', deckX, 535);

  // Zone 04: Grand Atrium Columns (around x = width * 0.92)
  const atriumX = width * 0.92;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  for (let c = -100; c <= 100; c += 50) {
    ctx.fillRect(atriumX + c - 8, 400, 16, 240);
  }

  // 4. Polished Floor Grid & Reflective Horizon
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 580; y < height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Floor ambient reflection
  const floorGrad = ctx.createLinearGradient(0, 580, 0, height);
  floorGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
  floorGrad.addColorStop(0.4, 'rgba(37, 99, 235, 0.04)');
  floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, 580, width, height - 580);

  return canvas;
}

export const Panorama360Viewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [yaw, setYaw] = useState<number>(45);
  const [pitch, setPitch] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomFov, setZoomFov] = useState<number>(68);
  const [vrViewMode, setVrViewMode] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Refs for animation loop
  const stateRef = useRef({
    yaw: 45,
    pitch: 0,
    targetYaw: 45,
    targetPitch: 0,
    isDragging: false,
    autoRotate: true,
    zoomFov: 68,
    vrViewMode: false,
    dragStartX: 0,
    dragStartY: 0,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.zoomFov = zoomFov;
    stateRef.current.vrViewMode = vrViewMode;
  }, [autoRotate, zoomFov, vrViewMode]);

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

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    // Perspective Camera placed in center of sphere
    const camera = new THREE.PerspectiveCamera(
      stateRef.current.zoomFov,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Build Inverted Normals SphereGeometry
    const sphereGeo = new THREE.SphereGeometry(60, 64, 40);
    sphereGeo.scale(-1, 1, 1); // Invert normals so texture faces interior!

    const panoCanvas = generateProcedural360Texture();
    const panoTexture = new THREE.CanvasTexture(panoCanvas);
    panoTexture.colorSpace = THREE.SRGBColorSpace;
    panoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const sphereMat = new THREE.MeshBasicMaterial({
      map: panoTexture,
    });

    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // Build 3D Spatial Hotspots
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);

    const hotspotMeshes: { mesh: THREE.Mesh; data: Hotspot }[] = [];
    const hotspotRingGeo = new THREE.RingGeometry(1.2, 1.6, 24);
    const hotspotCoreGeo = new THREE.CircleGeometry(0.8, 24);

    HOTSPOTS.forEach((spot) => {
      // Calculate 3D Cartesian coords on radius 50
      const radius = 48;
      const x = radius * Math.sin(spot.phi) * Math.sin(spot.theta);
      const y = radius * Math.cos(spot.phi);
      const z = radius * Math.sin(spot.phi) * Math.cos(spot.theta);

      const spotNode = new THREE.Group();
      spotNode.position.set(x, y, z);
      spotNode.lookAt(0, 0, 0);

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(hotspotRingGeo, ringMat);
      spotNode.add(ring);

      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const core = new THREE.Mesh(hotspotCoreGeo, coreMat);
      spotNode.add(core);

      hotspotGroup.add(spotNode);
      hotspotMeshes.push({ mesh: core, data: spot });
    });

    // Pointer Interaction (Orbit Look Around)
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      stateRef.current.isDragging = true;
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      stateRef.current.dragStartX = clientX;
      stateRef.current.dragStartY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!stateRef.current.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - stateRef.current.dragStartX;
      const dy = clientY - stateRef.current.dragStartY;

      stateRef.current.dragStartX = clientX;
      stateRef.current.dragStartY = clientY;

      stateRef.current.targetYaw = (stateRef.current.targetYaw - dx * 0.35 + 360) % 360;
      stateRef.current.targetPitch = Math.max(-75, Math.min(75, stateRef.current.targetPitch + dy * 0.28));
    };

    const handlePointerUp = () => {
      stateRef.current.isDragging = false;
      setIsDragging(false);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Raycast click on hotspots
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes.map((h) => h.mesh));

      if (intersects.length > 0) {
        const hit = hotspotMeshes.find((h) => h.mesh === intersects[0].object);
        if (hit) {
          setActiveHotspot(hit.data);
          setAutoRotate(false);
          // Gently pivot camera toward clicked hotspot
          const targetDegYaw = ((hit.data.theta * 180) / Math.PI + 360) % 360;
          stateRef.current.targetYaw = targetDegYaw;
        }
      }
    };

    dom.addEventListener('click', handleCanvasClick);

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

    // Animation Loop with Stereoscopic VR View Support
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Auto-orbit drift when not manually dragging
      if (stateRef.current.autoRotate && !stateRef.current.isDragging) {
        stateRef.current.targetYaw = (stateRef.current.targetYaw + 8 * delta) % 360;
      }

      // Smooth exponential damping on orientation
      stateRef.current.yaw = THREE.MathUtils.damp(
        stateRef.current.yaw,
        stateRef.current.targetYaw,
        6.0,
        delta
      );
      stateRef.current.pitch = THREE.MathUtils.damp(
        stateRef.current.pitch,
        stateRef.current.targetPitch,
        6.0,
        delta
      );

      // Camera FOV damping
      camera.fov = THREE.MathUtils.damp(camera.fov, stateRef.current.zoomFov, 6.0, delta);
      camera.updateProjectionMatrix();

      // Convert Yaw & Pitch into Camera LookAt vector
      const phi = THREE.MathUtils.degToRad(90 - stateRef.current.pitch);
      const theta = THREE.MathUtils.degToRad(stateRef.current.yaw);

      const targetX = 500 * Math.sin(phi) * Math.sin(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(targetX, targetY, targetZ);

      // Pulse hotspot rings
      const pulse = 1 + Math.sin(time * 3.5) * 0.18;
      hotspotMeshes.forEach((h) => {
        h.mesh.parent?.scale.setScalar(pulse);
      });

      // Synchronize UI telemetry states periodically
      setYaw(Math.round(stateRef.current.yaw));
      setPitch(Math.round(stateRef.current.pitch));

      const w = container.clientWidth;
      const h = container.clientHeight;

      // Render Standard Monoscopic vs Stereoscopic VR View
      if (stateRef.current.vrViewMode) {
        renderer.setScissorTest(true);

        const halfW = Math.floor(w / 2);

        // Left Eye Viewport
        renderer.setViewport(0, 0, halfW, h);
        renderer.setScissor(0, 0, halfW, h);
        camera.aspect = halfW / h;
        camera.updateProjectionMatrix();
        camera.position.set(-0.15, 0, 0); // Left IPD offset
        renderer.render(scene, camera);

        // Right Eye Viewport
        renderer.setViewport(halfW, 0, halfW, h);
        renderer.setScissor(halfW, 0, halfW, h);
        camera.aspect = halfW / h;
        camera.updateProjectionMatrix();
        camera.position.set(0.15, 0, 0); // Right IPD offset
        renderer.render(scene, camera);

        renderer.setScissorTest(false);
      } else {
        renderer.setViewport(0, 0, w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        camera.position.set(0, 0, 0);
        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      dom.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      panoTexture.dispose();
      hotspotRingGeo.dispose();
      hotspotCoreGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#070709] shadow-2xl select-none">
      {/* Clean Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/10 bg-[#090A0E]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                Recorded 360° Review Player
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                Cloud Hosted · No App Required
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-light">
              Click & drag or tilt your device to look around naturally in 360°
            </div>
          </div>
        </div>

        {/* Viewport Action Controls */}
        <div className="flex items-center gap-2">
          {/* Simulate VR View Toggle */}
          <button
            onClick={() => setVrViewMode(!vrViewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all cursor-pointer min-h-[36px] ${
              vrViewMode
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Simulate VR Headset Dual-Lens Experience"
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>{vrViewMode ? 'VR Mode: Dual-Lens' : 'Simulate VR View'}</span>
          </button>

          {/* Auto-Orbit Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all cursor-pointer min-h-[36px] ${
              autoRotate
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle Automatic 360° Pan"
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Auto-Pan: On' : 'Auto-Pan: Off'}</span>
          </button>

          {/* Zoom In/Out */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setZoomFov((f) => Math.max(45, f - 8))}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomFov((f) => Math.min(88, f + 8))}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 360° Spherical Canvas Viewport */}
      <div
        ref={mountRef}
        className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] cursor-grab active:cursor-grabbing select-none overflow-hidden"
      >
        {/* Clean Status Pill with Emerald Signal */}
        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 text-xs text-white bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 z-10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">360° Interactive Experience</span>
          <span className="text-slate-500">·</span>
          <span className="text-[11px] text-cyan-300 font-mono">Any Device</span>
        </div>

        {/* Rotating Navigation Compass Indicator on Top Right */}
        <div className="hidden sm:flex absolute top-4 right-4 pointer-events-none items-center gap-2 text-[11px] font-mono text-cyan-300 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/20 z-10 shadow-lg">
          <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Click & Drag to Look Around</span>
        </div>

        {/* Stereoscopic Center Divider (VR Mode) */}
        {vrViewMode && (
          <div className="absolute inset-0 pointer-events-none z-10 flex">
            {/* Center Split Line */}
            <div className="w-[2px] h-full bg-white/20 mx-auto shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

            {/* Left Eye Label */}
            <div className="absolute top-4 left-8 text-[10px] font-mono uppercase tracking-widest text-purple-400 bg-black/70 px-2.5 py-1 rounded-full border border-purple-500/30">
              Left Eye View
            </div>

            {/* Right Eye Label */}
            <div className="absolute top-4 right-8 text-[10px] font-mono uppercase tracking-widest text-purple-400 bg-black/70 px-2.5 py-1 rounded-full border border-purple-500/30">
              Right Eye View
            </div>

            {/* Circular Vignette Overlay simulating Headset Optics */}
            <div className="absolute inset-0 border-[24px] sm:border-[40px] border-black/85 rounded-none pointer-events-none" />
          </div>
        )}

        {/* Dynamic Rotating Navigation Arrows Hint when Idle */}
        {!isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2.5 text-xs text-white bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-400/40 shadow-[0_0_25px_rgba(0,242,254,0.25)] z-10 animate-pulse">
            <span className="text-cyan-400 font-bold">↺ ↻</span>
            <span className="font-medium">Click & drag in any direction to explore the space</span>
          </div>
        )}

        {/* Active Hotspot Modal Card */}
        {activeHotspot && (
          <div className="absolute bottom-6 right-6 max-w-sm w-full bg-[#0B0C10]/95 border border-white/20 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200 z-20">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
                  {activeHotspot.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeHotspot.coordsText}
                </span>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5 cursor-pointer"
                aria-label="Close hotspot detail"
              >
                ✕
              </button>
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">{activeHotspot.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
              {activeHotspot.description}
            </p>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to book 360° Memory Capture for: ${activeHotspot.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-white text-black hover:bg-slate-200 transition-colors shadow-md cursor-pointer"
            >
              <span>Inquire for 360° Event Recording</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Review Footer Bar & CTA */}
      <div className="p-6 sm:p-8 bg-[#070709] border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Web Delivery · Zero Apps Required</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Relive Every Angle of Your Event, Exactly as It Happened.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            We record on-site with cinema 360° optical rigs and deliver a private, hosted interactive link. Anyone with the link can re-watch on their phone, computer, or VR headset anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setAutoRotate(true);
              setVrViewMode(false);
              setZoomFov(75);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer min-h-[44px]"
            title="Start automatic rotating preview"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Watch a 360° Sample</span>
          </button>

          <a
            href={getWhatsAppUrl(`Hi Loop Studios, I'd like to book 360° Memory Capture & Recorded Video for our upcoming event.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-95 shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all active:scale-95 whitespace-nowrap font-display"
          >
            <span>Book 360° Memory Capture</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </a>
        </div>
      </div>
    </div>
  );
};
