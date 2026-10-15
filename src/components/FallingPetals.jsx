import { useEffect, useRef } from 'react';

/**
 * 4 Color Schemes: White, Pink, Red, Yellow
 * Matching the exact flower style in the user's reference:
 * - 5-petal Cherry Blossom / Sakura with notched heart petals & star stamen
 * - Hibiscus with side-angle petals, little green leaves, and protruding yellow pistil
 */
// 4 Color Schemes in soft, light, romantic pastel tones:
const FLOWER_PALETTES = [
  // 1. WHITE (Pure & delicate jasmine / white cherry blossom)
  {
    name: 'white',
    petalColor: '#ffffff',
    petalShade: '#faf7f5',
    petalStroke: 'rgba(230, 220, 210, 0.45)',
    centerDisc: '#fef9c3', // pale buttercup
    stamenColor: '#ffffff',
    stamenDot: '#fde047',
    leafColor: '#84cc16', // fresh spring green
    leafShade: '#65a30d',
  },
  // 2. PINK (Light sakura blossom / soft baby blush)
  {
    name: 'pink',
    petalColor: '#f9a8d4', // soft pastel blossom pink (lighter than #f472b6)
    petalShade: '#f472b6',
    petalStroke: 'rgba(244, 114, 182, 0.35)',
    centerDisc: '#fff1f2', // soft pale rose-white center
    stamenColor: '#ffffff', // clean white 5-ray stamen
    stamenDot: '#fbcfe8',
    leafColor: '#84cc16',
    leafShade: '#65a30d',
  },
  // 3. RED (Soft romantic rose-red / coral blush)
  {
    name: 'red',
    petalColor: '#fb7185', // soft light rose-red (lighter than #ef4444)
    petalShade: '#f43f5e',
    petalStroke: 'rgba(244, 63, 94, 0.35)',
    centerDisc: '#fef08a', // soft golden cream
    stamenColor: '#fef9c3',
    stamenDot: '#fde047',
    leafColor: '#65a30d',
    leafShade: '#4d7c0f',
  },
  // 4. YELLOW (Light sunny buttercup / soft pastel marigold)
  {
    name: 'yellow',
    petalColor: '#fde047', // light pastel butter yellow (lighter than #facc15)
    petalShade: '#facc15',
    petalStroke: 'rgba(250, 204, 21, 0.35)',
    centerDisc: '#fefce8', // gentle cream center
    stamenColor: '#ffffff',
    stamenDot: '#fbbf24',
    leafColor: '#84cc16',
    leafShade: '#65a30d',
  },
];

/**
 * Draw 5-Petal Cherry Blossom (Sakura)
 * 5 broad, overlapping petals with notched / heart-shaped tips
 * and a 5-ray star stamen in the center with little anther dots.
 */
function drawBlossom(ctx, r, palette) {
  const numPetals = 5;
  const step = (Math.PI * 2) / numPetals;
  const petalLen = r;
  const petalHalfW = r * 0.50; // wide enough to overlap and look full and rounded

  // 1. Draw 5 overlapping heart-notched petals
  for (let i = 0; i < numPetals; i++) {
    ctx.save();
    ctx.rotate(i * step);

    ctx.beginPath();
    // Start at petal base
    ctx.moveTo(0, 0);

    // Left outer curve
    ctx.bezierCurveTo(
      -petalHalfW * 0.7, -petalLen * 0.35,
      -petalHalfW * 1.05, -petalLen * 0.78,
      -petalHalfW * 0.40, -petalLen * 0.98
    );

    // Tip notch (cleft)
    ctx.quadraticCurveTo(
      0, -petalLen * 0.82,
      petalHalfW * 0.40, -petalLen * 0.98
    );

    // Right outer curve back to base
    ctx.bezierCurveTo(
      petalHalfW * 1.05, -petalLen * 0.78,
      petalHalfW * 0.7, -petalLen * 0.35,
      0, 0
    );

    ctx.closePath();

    // Fill petal with soft gradient shading
    ctx.fillStyle = palette.petalColor;
    ctx.shadowColor = palette.petalStroke;
    ctx.shadowBlur = 2;
    ctx.fill();

    // Subtle petal edge definition
    ctx.strokeStyle = palette.petalStroke;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  // 2. Soft inner tonal glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = palette.petalShade;
  ctx.globalAlpha = 0.45;
  ctx.fill();
  ctx.restore();

  // 3. Central 5-ray star stamen (with little dots on tips, matching reference image)
  ctx.save();
  for (let i = 0; i < 5; i++) {
    const angle = i * step + step * 0.5;
    const stamenLen = r * 0.36;
    const sx = Math.cos(angle) * stamenLen;
    const sy = Math.sin(angle) * stamenLen;

    // Stamen filament
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = palette.stamenColor;
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Anther dot
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = palette.stamenColor;
    ctx.fill();
  }

  // Center core dot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = palette.stamenDot;
  ctx.fill();
  ctx.restore();
}

/**
 * Draw Hibiscus Flower (Side / Tilted angle)
 * Shows 1-2 small green leaves at the base, 5 full overlapping rounded petals,
 * and a protruding yellow stamen with pollen dots (matching reference image).
 */
function drawHibiscus(ctx, r, palette) {
  // 1. Green leaves at the bottom-left base
  ctx.save();
  ctx.rotate(-Math.PI * 0.70);

  // Main leaf
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.45, -r * 0.35, -r * 0.85, -r * 0.65);
  ctx.quadraticCurveTo(-r * 0.35, -r * 0.85, 0, 0);
  ctx.fillStyle = palette.leafColor;
  ctx.fill();

  // Second small leaf
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-r * 0.70, -r * 0.15, -r * 1.05, -r * 0.35);
  ctx.quadraticCurveTo(-r * 0.70, -r * 0.55, 0, 0);
  ctx.fillStyle = palette.leafShade;
  ctx.fill();
  ctx.restore();

  // 2. Petals (5 rounded overlapping petals in a slightly tilted cluster)
  const numPetals = 5;
  const step = (Math.PI * 2) / numPetals;
  const petalLen = r * 0.95;
  const petalW = r * 0.52;

  for (let i = 0; i < numPetals; i++) {
    ctx.save();
    ctx.rotate(i * step);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-petalW * 0.75, -petalLen * 0.45, -petalW * 0.85, -petalLen * 0.90, 0, -petalLen);
    ctx.bezierCurveTo(petalW * 0.85, -petalLen * 0.90, petalW * 0.75, -petalLen * 0.45, 0, 0);
    ctx.closePath();

    ctx.fillStyle = palette.petalColor;
    ctx.shadowColor = palette.petalStroke;
    ctx.shadowBlur = 2;
    ctx.fill();

    ctx.strokeStyle = palette.petalStroke;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }

  // 3. Flower throat / center disc
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = palette.petalShade;
  ctx.fill();

  // 4. Protruding curved stamen (pistil column with pollen tips)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(r * 0.35, -r * 0.25, r * 0.68, -r * 0.58);
  ctx.strokeStyle = palette.stamenColor || '#fef08a';
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // Pollen tips
  const endX = r * 0.68;
  const endY = -r * 0.58;
  for (let d = -1; d <= 1; d++) {
    ctx.beginPath();
    ctx.arc(endX + d * r * 0.08, endY - Math.abs(d) * r * 0.05, r * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = palette.stamenDot || '#fde047';
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Create a falling flower item
 */
function createFlower(canvasWidth, canvasHeight, fromTop = false, index = -1) {
  // Size range: smaller flowers 5px - 9px radius (pink gets a boost)
  const baseR = Math.random() * 4 + 5;

  // Palette: evenly distribute across White, Pink, Red, Yellow
  const palette = index >= 0
    ? FLOWER_PALETTES[Math.floor(index / 2) % FLOWER_PALETTES.length]
    : FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];

  // Pink flowers are 40% larger
  const r = palette.name === 'pink' ? baseR * 1.4 : baseR;

  // Alternate between Blossom and Hibiscus styles from the reference
  const type = index >= 0
    ? (index % 2 === 0 ? 'blossom' : 'hibiscus')
    : (Math.random() < 0.6 ? 'blossom' : 'hibiscus');


  // Speed: very slow gentle fall (0.30 - 0.60 px/frame)
  const speedY = Math.random() * 0.30 + 0.30;

  // No lateral drift — falls straight down
  const speedX = 0;
  const wobble = Math.random() * Math.PI * 2;
  const wobbleSpeed = 0;
  const wobbleAmp = 0;

  // Gentle tumbling rotation
  const spin = (Math.random() - 0.5) * 0.015;
  const rotation = Math.random() * Math.PI * 2;

  // Opacity: subtle transparency (0.55 - 0.73) for an elegant, dreamy feel
  const opacity = Math.random() * 0.18 + 0.55;

  return {
    x: Math.random() * canvasWidth,
    y: fromTop
      ? -(r * 2) - Math.random() * 150 // spawn above top viewport
      : Math.random() * canvasHeight,  // scatter on initial mount
    r,
    type,
    palette,
    speedY,
    speedX,
    wobble,
    wobbleSpeed,
    wobbleAmp,
    spin,
    rotation,
    opacity,
  };
}

export default function FallingFlowers() {
  const canvasRef = useRef(null);
  const flowersRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 16 flowers: 4 White, 4 Pink, 4 Red, 4 Yellow (delicate, uncluttered density)
    const FLOWER_COUNT = 16;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial scatter across the screen with balanced color distribution
    flowersRef.current = Array.from({ length: FLOWER_COUNT }, (_, i) =>
      createFlower(canvas.width, canvas.height, false, i)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flowersRef.current.forEach((f) => {
        // Falling downwards physics
        f.wobble += f.wobbleSpeed;
        f.x += f.speedX + Math.sin(f.wobble) * f.wobbleAmp;
        f.y += f.speedY; // always descends from top to bottom
        f.rotation += f.spin;

        // Smooth vertical fade:
        // Flowers gracefully fade away into transparency as they approach the bottom of the screen
        const fadeStart = canvas.height * 0.60; // starts fading out in the lower 40%
        const fadeEnd = canvas.height * 0.96;   // completely faded away before the bottom
        let fadeFactor = 1;

        if (f.y > fadeStart) {
          fadeFactor = Math.max(0, (fadeEnd - f.y) / (fadeEnd - fadeStart));
        } else if (f.y < canvas.height * 0.10) {
          // Soft fade-in at the very top as they enter
          fadeFactor = Math.max(0, Math.min(1, (f.y + f.r * 2) / (canvas.height * 0.10 + f.r * 2)));
        }

        // Recycle cleanly above the top once completely faded out
        if (f.y >= fadeEnd) {
          const fresh = createFlower(canvas.width, canvas.height, true);
          Object.assign(f, fresh);
        }

        const currentAlpha = f.opacity * fadeFactor;
        if (currentAlpha <= 0.005) return;

        // Draw flower
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);

        if (f.type === 'blossom') {
          drawBlossom(ctx, f.r, f.palette);
        } else {
          drawHibiscus(ctx, f.r, f.palette);
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 30,
      }}
    />
  );
}
