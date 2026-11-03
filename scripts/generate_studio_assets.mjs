import fs from 'fs';
import zlib from 'zlib';

// High-resolution PNG generator with RGBA buffer
function createPngBuffer(width, height, getPixel) {
  const rowSize = width * 4 + 1;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y);
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(raw, { level: 9 });

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return crc ^ -1;
  }

  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const W = 640;
const H = 480;

// Helper color blending
function blend(bg, fg) {
  const a = fg[3] / 255;
  if (a <= 0) return bg;
  if (a >= 1) return fg;
  const outA = fg[3] + (bg[3] * (255 - fg[3])) / 255;
  const r = Math.round((fg[0] * a + bg[0] * (1 - a)));
  const g = Math.round((fg[1] * a + bg[1] * (1 - a)));
  const b = Math.round((fg[2] * a + bg[2] * (1 - a)));
  return [r, g, b, Math.round(outA)];
}

// =========================================================================
// 1. CINEMA DRONE PHOTO
// =========================================================================
function renderDrone() {
  console.log('Rendering Cinema Drone photo...');
  const png = createPngBuffer(W, H, (x, y) => {
    // Normalise
    const nx = (x - W / 2) / 200;
    const ny = (y - H / 2) / 160;

    let col = [0, 0, 0, 0];

    // Ambient studio shadow underneath
    const shadowDist = Math.hypot(nx * 0.8, (ny - 0.7) * 2.5);
    if (shadowDist < 1.0) {
      const alpha = Math.floor((1 - shadowDist) * 90);
      col = blend(col, [10, 12, 16, alpha]);
    }

    // Rear arms
    const inArmL1 = Math.abs(ny - (-0.45 - nx * 0.35)) < 0.08 && nx < -0.2 && nx > -1.2;
    const inArmR1 = Math.abs(ny - (-0.45 + nx * 0.35)) < 0.08 && nx > 0.2 && nx < 1.2;
    if (inArmL1 || inArmR1) {
      const shade = Math.floor(35 + ny * 20);
      col = blend(col, [shade, shade + 3, shade + 8, 255]);
    }

    // Front arms (thicker, carbon fiber)
    const inArmL2 = Math.abs(ny - (0.35 - nx * 0.45)) < 0.1 && nx < -0.15 && nx > -1.15;
    const inArmR2 = Math.abs(ny - (0.35 + nx * 0.45)) < 0.1 && nx > 0.15 && nx < 1.15;
    if (inArmL2 || inArmR2) {
      const highlight = Math.sin(x * 0.5) * 15;
      const shade = Math.floor(45 + highlight);
      col = blend(col, [shade, shade + 5, shade + 12, 255]);
    }

    // Rotor motor bells
    const motors = [
      [-1.1, -0.06],
      [1.1, -0.06],
      [-1.05, 0.82],
      [1.05, 0.82],
    ];

    for (const [mx, my] of motors) {
      const d = Math.hypot(nx - mx, (ny - my) * 1.5);
      if (d < 0.18) {
        // Motor bell rim
        const rim = Math.floor(65 - d * 180);
        col = blend(col, [rim + 20, rim + 25, rim + 35, 255]);
      }
      // Rotor blur discs
      const blurD = Math.hypot((nx - mx) * 0.4, (ny - my) * 1.8);
      if (blurD < 0.45) {
        const blurAlpha = Math.floor((1 - blurD / 0.45) * 80);
        col = blend(col, [210, 225, 245, blurAlpha]);
      }
    }

    // Central fuselage body
    const bodyD = Math.hypot(nx * 1.4, ny * 1.1);
    if (bodyD < 0.7) {
      // 3D curved lighting on body
      const light = 1 - Math.hypot(nx + 0.15, ny + 0.2) / 0.8;
      const baseShade = Math.max(18, Math.min(180, Math.floor(30 + light * 130)));
      col = blend(col, [baseShade, baseShade + 3, baseShade + 10, 255]);

      // Top carbon canopy plate
      const canopyD = Math.hypot(nx * 1.8, (ny + 0.05) * 1.5);
      if (canopyD < 0.45) {
        const weave = (Math.sin(x * 0.4) + Math.cos(y * 0.4)) * 12;
        const cShade = Math.floor(50 + weave + light * 60);
        col = blend(col, [cShade, cShade + 4, cShade + 15, 255]);
      }

      // Status indicator LED (Electric Blue)
      const ledD = Math.hypot(nx, ny - 0.12);
      if (ledD < 0.04) {
        col = blend(col, [96, 165, 250, 255]);
      } else if (ledD < 0.12) {
        const glow = Math.floor((1 - ledD / 0.12) * 160);
        col = blend(col, [59, 130, 246, glow]);
      }
    }

    // Gimbal Camera Pod
    const camD = Math.hypot(nx * 1.8, (ny - 0.5) * 1.6);
    if (camD < 0.28) {
      // Matte black camera sphere
      const camLight = 1 - Math.hypot(nx + 0.05, ny - 0.45) / 0.3;
      const cVal = Math.floor(25 + camLight * 80);
      col = blend(col, [cVal, cVal + 2, cVal + 6, 255]);

      // Lens Glass with deep blue optical multi-coating
      const lensD = Math.hypot(nx * 1.8, (ny - 0.52) * 1.8);
      if (lensD < 0.14) {
        const glassLight = Math.floor(20 + (1 - lensD / 0.14) * 60);
        col = blend(col, [15, glassLight + 20, glassLight + 90, 255]);
        // Specular glint
        if (Math.hypot(nx + 0.03, ny - 0.5) < 0.03) {
          col = blend(col, [255, 255, 255, 240]);
        }
      }
    }

    // Dual carbon landing legs
    const inLegL = Math.abs(nx - (-0.35 - (ny - 0.3) * 0.25)) < 0.03 && ny > 0.25 && ny < 0.75;
    const inLegR = Math.abs(nx - (0.35 + (ny - 0.3) * 0.25)) < 0.03 && ny > 0.25 && ny < 0.75;
    if (inLegL || inLegR) {
      col = blend(col, [50, 54, 62, 255]);
    }

    return col;
  });

  fs.writeFileSync('public/assets/generated/cinema-drone.png', png);
  console.log('Saved cinema-drone.png, size:', png.length);
}

// =========================================================================
// 2. SPATIAL VR HEADSET PHOTO
// =========================================================================
function renderVR() {
  console.log('Rendering Spatial VR Headset photo...');
  const png = createPngBuffer(W, H, (x, y) => {
    const nx = (x - W / 2) / 220;
    const ny = (y - H / 2) / 160;

    let col = [0, 0, 0, 0];

    // Soft ground contact shadow
    const sDist = Math.hypot(nx * 0.7, (ny - 0.75) * 2.8);
    if (sDist < 1.0) {
      col = blend(col, [10, 12, 16, Math.floor((1 - sDist) * 100)]);
    }

    // Rear adjustable strap arch
    const strapD = Math.hypot(nx * 0.85, (ny + 0.25) * 1.5);
    if (strapD > 0.75 && strapD < 0.95 && ny < 0.2) {
      const shade = Math.floor(30 + (1 - Math.abs(ny)) * 30);
      col = blend(col, [shade, shade + 2, shade + 5, 255]);
    }

    // Spatial Audio Cups
    if (Math.hypot(Math.abs(nx) - 0.9, ny + 0.05) < 0.18) {
      col = blend(col, [40, 44, 52, 255]);
    }

    // Main Headset Chassis Box
    const inBox = Math.abs(nx) < 0.72 && Math.abs(ny) < 0.42;
    if (inBox) {
      // Rounded corner distance
      const dx = Math.max(0, Math.abs(nx) - 0.52);
      const dy = Math.max(0, Math.abs(ny) - 0.24);
      const cornerD = Math.hypot(dx, dy);

      if (cornerD < 0.2) {
        // Smooth chassis lighting
        const chassisLight = 1 - Math.hypot(nx * 0.7 + 0.2, ny * 1.1 + 0.1);
        const shade = Math.floor(25 + Math.max(0, chassisLight) * 80);
        col = blend(col, [shade, shade + 3, shade + 7, 255]);

        // Reflective Curved Glass Visor (Ultra-Gloss Front)
        const inVisor = Math.abs(nx) < 0.64 && Math.abs(ny) < 0.34;
        if (inVisor) {
          const vdx = Math.max(0, Math.abs(nx) - 0.48);
          const vdy = Math.max(0, Math.abs(ny) - 0.18);
          if (Math.hypot(vdx, vdy) < 0.16) {
            // Deep obsidian glass
            let glass = [8, 10, 14, 255];

            // Curved Horizon Specular Reflection
            const curveY = Math.sin(nx * 2.4) * 0.12 - 0.05;
            const refDist = Math.abs(ny - curveY);
            if (refDist < 0.18) {
              const specAlpha = Math.floor((1 - refDist / 0.18) * 140);
              glass = blend(glass, [240, 245, 255, specAlpha]);
            }

            // Dual Pass-through Camera Lenses
            const camLeft = Math.hypot(nx + 0.35, ny);
            const camRight = Math.hypot(nx - 0.35, ny);
            if (camLeft < 0.06 || camRight < 0.06) {
              glass = blend(glass, [59, 130, 246, 255]);
              if (camLeft < 0.02 || camRight < 0.02) {
                glass = blend(glass, [255, 255, 255, 255]);
              }
            } else if (camLeft < 0.1 || camRight < 0.1) {
              glass = blend(glass, [30, 35, 45, 255]);
            }

            col = blend(col, glass);
          }
        }
      }
    }

    return col;
  });

  fs.writeFileSync('public/assets/generated/spatial-vr.png', png);
  console.log('Saved spatial-vr.png, size:', png.length);
}

// =========================================================================
// 3. CINEMA GIMBAL PHOTO
// =========================================================================
function renderGimbal() {
  console.log('Rendering Cinema Gimbal photo...');
  const png = createPngBuffer(W, H, (x, y) => {
    const nx = (x - W / 2) / 180;
    const ny = (y - H / 2) / 210;

    let col = [0, 0, 0, 0];

    // Shadow on base
    const sDist = Math.hypot(nx * 0.8, (ny - 0.88) * 3.5);
    if (sDist < 1.0) {
      col = blend(col, [10, 12, 16, Math.floor((1 - sDist) * 110)]);
    }

    // Mini tripod feet
    if (ny > 0.72 && ny < 0.88) {
      if (Math.abs(nx + 0.3 - (ny - 0.72) * 2.0) < 0.05 || Math.abs(nx - 0.3 + (ny - 0.72) * 2.0) < 0.05) {
        col = blend(col, [35, 38, 45, 255]);
      }
    }

    // Gimbal Battery Grip Handle
    if (Math.abs(nx) < 0.12 && ny > 0.18 && ny < 0.76) {
      // Carbon grip texture
      const gripShade = Math.floor(30 + Math.sin(y * 0.8) * 8 + (1 - Math.abs(nx) / 0.12) * 45);
      col = blend(col, [gripShade, gripShade + 2, gripShade + 5, 255]);

      // OLED Status Screen on handle
      if (ny > 0.24 && ny < 0.34 && Math.abs(nx) < 0.08) {
        col = blend(col, [10, 15, 25, 255]);
        // OLED text glow
        if (Math.abs(nx) < 0.05 && ny > 0.28 && ny < 0.30) {
          col = blend(col, [59, 130, 246, 220]);
        }
      }
    }

    // Pan Axis Motor (Bottom motor)
    if (Math.hypot(nx, ny - 0.16) < 0.15) {
      const shade = Math.floor(55 + (1 - Math.hypot(nx, ny - 0.16) / 0.15) * 60);
      col = blend(col, [shade, shade + 3, shade + 8, 255]);
      // Red ring accent
      if (Math.hypot(nx, ny - 0.16) > 0.11 && Math.hypot(nx, ny - 0.16) < 0.13) {
        col = blend(col, [239, 68, 68, 255]);
      }
    }

    // Curved Roll Arm
    const inRoll = nx > 0.05 && nx < 0.48 && Math.abs(ny - (0.16 - Math.pow(nx - 0.05, 1.2) * 0.9)) < 0.08;
    if (inRoll) {
      col = blend(col, [45, 48, 55, 255]);
    }

    // Roll Motor
    if (Math.hypot(nx - 0.44, ny + 0.12) < 0.13) {
      const shade = Math.floor(50 + (1 - Math.hypot(nx - 0.44, ny + 0.12) / 0.13) * 55);
      col = blend(col, [shade, shade + 3, shade + 7, 255]);
    }

    // Tilt Arm and Motor
    const inTilt = ny < 0.14 && ny > -0.32 && Math.abs(nx - 0.42) < 0.07;
    if (inTilt) {
      col = blend(col, [42, 45, 52, 255]);
    }

    // Mounted Cinema Camera
    const inCamBody = nx > -0.38 && nx < 0.15 && ny > -0.38 && ny < -0.05;
    if (inCamBody) {
      const shade = Math.floor(25 + (1 - Math.hypot(nx + 0.1, ny + 0.2)) * 60);
      col = blend(col, [shade, shade + 2, shade + 5, 255]);

      // Top handle
      if (ny > -0.48 && ny < -0.38 && nx > -0.25 && nx < 0.05) {
        col = blend(col, [45, 48, 56, 255]);
      }

      // Matte Box and Cinema Lens
      const inMatte = nx < -0.38 && nx > -0.72 && Math.abs(ny + 0.22) < (0.28 - (nx + 0.72) * 0.2);
      if (inMatte) {
        const mShade = Math.floor(18 + Math.abs(nx) * 35);
        col = blend(col, [mShade, mShade + 2, mShade + 5, 255]);
      }

      // Lens Front Element (Iridescent Blue coating)
      if (Math.hypot(nx + 0.58, ny + 0.22) < 0.11) {
        col = blend(col, [20, 60, 160, 255]);
        if (Math.hypot(nx + 0.55, ny + 0.20) < 0.03) {
          col = blend(col, [255, 255, 255, 220]);
        }
      }
    }

    return col;
  });

  fs.writeFileSync('public/assets/generated/cinema-gimbal.png', png);
  console.log('Saved cinema-gimbal.png, size:', png.length);
}

// =========================================================================
// 4. SIGNATURE PHOTOGRAPHY CAMERA PHOTO
// =========================================================================
function renderCamera() {
  console.log('Rendering Signature Camera photo...');
  const png = createPngBuffer(W, H, (x, y) => {
    const nx = (x - W / 2) / 200;
    const ny = (y - H / 2) / 160;

    let col = [0, 0, 0, 0];

    // Studio tabletop shadow
    const sDist = Math.hypot(nx * 0.75, (ny - 0.7) * 2.8);
    if (sDist < 1.0) {
      col = blend(col, [10, 12, 16, Math.floor((1 - sDist) * 110)]);
    }

    // Camera Chassis Body
    const inBody = Math.abs(nx) < 0.75 && ny > -0.35 && ny < 0.48;
    if (inBody) {
      // Grip contour on right
      const isGrip = nx > 0.42;
      const light = 1 - Math.hypot(nx + 0.15, ny + 0.1);
      const baseShade = isGrip ? 22 : Math.floor(28 + light * 60);

      // Textured rubber stippling on grip
      const texture = isGrip ? (Math.sin(x * 0.6) * Math.cos(y * 0.6)) * 10 : 0;
      col = blend(col, [baseShade + texture, baseShade + texture + 2, baseShade + texture + 5, 255]);

      // Viewfinder / Prism housing on top
      if (Math.abs(nx + 0.08) < 0.28 && ny > -0.55 && ny <= -0.35) {
        const prismShade = Math.floor(45 + light * 50);
        col = blend(col, [prismShade, prismShade + 2, prismShade + 6, 255]);

        // Hotshoe plate on top
        if (Math.abs(nx + 0.08) < 0.12 && ny < -0.51) {
          col = blend(col, [60, 65, 75, 255]);
        }
      }

      // Shutter button dial
      if (nx > 0.48 && nx < 0.62 && ny > -0.42 && ny < -0.34) {
        col = blend(col, [70, 75, 85, 255]);
      }
    }

    // Massive Prime Optical Lens Assembly
    const lensCenter = [-0.08, 0.08];
    const lDist = Math.hypot(nx - lensCenter[0], ny - lensCenter[1]);

    if (lDist < 0.48) {
      // Outer lens barrel ring (Matte black aluminum)
      const barrelLight = 1 - Math.hypot(nx - lensCenter[0] + 0.1, ny - lensCenter[1] + 0.1) / 0.5;
      const bShade = Math.floor(30 + barrelLight * 75);
      col = blend(col, [bShade, bShade + 2, bShade + 6, 255]);

      // Iconic Signature Red Ring (Cinema Luxury distinction)
      if (lDist > 0.38 && lDist < 0.41) {
        col = blend(col, [239, 68, 68, 255]);
      }

      // Inner Lens Aperture Cavity
      if (lDist < 0.35) {
        // Multi-coated glass gradient (Cyan to violet optical reflections)
        const glassLight = (1 - lDist / 0.35);
        const rVal = Math.floor(20 + glassLight * 25);
        const gVal = Math.floor(40 + glassLight * 65);
        const bVal = Math.floor(110 + glassLight * 140);
        col = blend(col, [rVal, gVal, bVal, 255]);

        // Aperture blades circle inside
        if (lDist < 0.18) {
          const iris = Math.floor(10 + glassLight * 20);
          col = blend(col, [iris, iris + 5, iris + 15, 255]);
        }

        // Curved specular light reflection
        const refD = Math.hypot(nx - lensCenter[0] + 0.1, ny - lensCenter[1] + 0.08);
        if (refD < 0.1) {
          const spec = Math.floor((1 - refD / 0.1) * 220);
          col = blend(col, [255, 255, 255, spec]);
        }
      }
    }

    return col;
  });

  fs.writeFileSync('public/assets/generated/signature-camera.png', png);
  console.log('Saved signature-camera.png, size:', png.length);
}

// Run all renders
renderDrone();
renderVR();
renderGimbal();
renderCamera();
console.log('All studio assets generated successfully!');
