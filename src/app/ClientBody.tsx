"use client";
import { useEffect, useRef, ReactNode, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  layer: number;
}

function createStars(width: number, height: number, starCount: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.5 + Math.random() * 1.0,
      alpha: 0.5 + Math.random() * 0.5,
      layer: Math.floor(Math.random() * 3) + 1,
    });
  }
  return stars;
}

function drawGalaxy(ctx: CanvasRenderingContext2D, width: number, height: number, t: number, isMobile: boolean) {
  ctx.save();
  ctx.translate(width * 0.65, height * 0.55);
  ctx.rotate(t * 0.0002);
  for (let arm = 0; arm < 5; arm++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * arm) / 5);
    for (let i = 0; i < (isMobile ? 100 : 200); i++) {
      const angle = i * 0.09 + Math.sin(i * 0.05) * 0.1;
      const r = 12 + i * (isMobile ? 0.8 : 1.2) + Math.sin(i * 0.13) * 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      ctx.globalAlpha = 0.07 + 0.13 * Math.exp(-i / (isMobile ? 40 : 70));
      ctx.beginPath();
      ctx.arc(x, y, (isMobile ? 1.2 : 2) + Math.max(0, (isMobile ? 3 : 7) - i * 0.04), 0, 2 * Math.PI);
      ctx.fillStyle = i < 30 ? '#fff' : i < 100 ? '#a5b4fc' : '#ffeaa7';
      ctx.shadowColor = i < 30 ? '#fff' : i < 100 ? '#a5b4fc' : '#ffeaa7';
      ctx.shadowBlur = isMobile ? 4 : 14 - i * 0.08;
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 16 : 32, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = isMobile ? 18 : 60;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawQuasar(ctx: CanvasRenderingContext2D, width: number, height: number, t: number, isMobile: boolean) {
  ctx.save();
  ctx.translate(width * 0.18, height * 0.22);
  ctx.rotate(t * 0.001);
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, (isMobile ? 30 : 60) + Math.sin(t * 0.01 + i) * (isMobile ? 4 : 8));
    ctx.strokeStyle = `rgba(255,255,255,${0.13 + 0.07 * Math.sin(t * 0.01 + i)})`;
    ctx.lineWidth = (isMobile ? 2 : 4) - i * 0.2;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = isMobile ? 6 : 18;
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 8 : 18, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = isMobile ? 10 : 30;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawSpace(ctx: CanvasRenderingContext2D, width: number, height: number, t: number, stars: Star[], isMobile: boolean) {
  ctx.clearRect(0, 0, width, height);
  // Фон
  const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.5);
  grad.addColorStop(0, '#181b3a');
  grad.addColorStop(1, '#0a0a16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Большая фоновая туманность
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(t * 0.0005);
  const nebulaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, width / (isMobile ? 4 : 2.5));
  nebulaGrad.addColorStop(0, 'rgba(165, 180, 252, 0.08)');
  nebulaGrad.addColorStop(1, 'rgba(165, 180, 252, 0)');
  ctx.fillStyle = nebulaGrad;
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.restore();

  // Галактика
  drawGalaxy(ctx, width, height, t, isMobile);

  // Квазар
  drawQuasar(ctx, width, height, t, isMobile);

  // Звезды
  stars.forEach(star => {
    const yOffset = t * 0.01 * star.layer;
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(star.x, (star.y + yOffset) % height, star.size, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Планета 1 (с кольцом)
  ctx.save();
  ctx.translate(width * 0.25, height * 0.7);
  ctx.rotate(t * 0.002);
  // Кольцо
  ctx.save();
  ctx.rotate(-0.7);
  ctx.beginPath();
  ctx.ellipse(0, 0, isMobile ? 50 : 90, isMobile ? 10 : 18, 0, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#a5b4fc';
  ctx.lineWidth = isMobile ? 4 : 8;
  ctx.shadowColor = '#a5b4fc';
  ctx.shadowBlur = isMobile ? 10 : 30;
  ctx.stroke();
  ctx.restore();
  // Атмосфера
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 38 : 68, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#a5b4fc';
  ctx.shadowColor = '#a5b4fc';
  ctx.shadowBlur = isMobile ? 12 : 40;
  ctx.fill();
  ctx.globalAlpha = 1;
  // Планета
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 32 : 60, 0, 2 * Math.PI);
  ctx.fillStyle = '#4a90e2';
  ctx.shadowColor = '#4a90e2';
  ctx.shadowBlur = isMobile ? 10 : 30;
  ctx.fill();
  // Блик
  ctx.beginPath();
  ctx.arc(-12, -12, isMobile ? 7 : 16, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Планета 2 (с кольцом)
  ctx.save();
  ctx.translate(width * 0.7, height * 0.3);
  ctx.rotate(-t * 0.0015);
  // Кольцо
  ctx.save();
  ctx.rotate(0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, isMobile ? 34 : 62, isMobile ? 6 : 12, 0, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = '#ffeaa7';
  ctx.lineWidth = isMobile ? 2.5 : 6;
  ctx.shadowColor = '#ffeaa7';
  ctx.shadowBlur = isMobile ? 6 : 20;
  ctx.stroke();
  ctx.restore();
  // Атмосфера
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 28 : 48, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = '#ffeaa7';
  ctx.shadowColor = '#ffeaa7';
  ctx.shadowBlur = isMobile ? 8 : 30;
  ctx.fill();
  ctx.globalAlpha = 1;
  // Планета
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 20 : 40, 0, 2 * Math.PI);
  ctx.fillStyle = '#e24a4a';
  ctx.shadowColor = '#e24a4a';
  ctx.shadowBlur = isMobile ? 6 : 20;
  ctx.fill();
  // Блик
  ctx.beginPath();
  ctx.arc(7, -7, isMobile ? 4 : 10, 0, 2 * Math.PI);
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Черная дыра 1 (реалистичный диск)
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(t * 0.001);
  for (let d = 0; d < 2; d++) {
    ctx.save();
    ctx.rotate(d * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, (isMobile ? 32 : 60) + d * (isMobile ? 4 : 8), (isMobile ? 8 : 18) + d * (isMobile ? 2 : 4), t * 0.002 + d * 0.1, 0, 2 * Math.PI);
    ctx.strokeStyle = d === 0 ? '#ffeaa7' : '#ff9900';
    ctx.lineWidth = d === 0 ? (isMobile ? 4 : 8) : (isMobile ? 2 : 4);
    ctx.globalAlpha = d === 0 ? 0.7 : 0.4;
    ctx.shadowColor = d === 0 ? '#ffeaa7' : '#ff9900';
    ctx.shadowBlur = d === 0 ? (isMobile ? 10 : 30) : (isMobile ? 6 : 20);
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 15 : 30, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = isMobile ? 4 : 10;
  ctx.fill();
  ctx.restore();

  // Черная дыра 2 (синий диск)
  ctx.save();
  ctx.translate(width * 0.82, height * 0.8);
  ctx.rotate(-t * 0.0012);
  for (let d = 0; d < 2; d++) {
    ctx.save();
    ctx.rotate(d * 0.18);
    ctx.beginPath();
    ctx.ellipse(0, 0, (isMobile ? 18 : 38) + d * (isMobile ? 2 : 6), (isMobile ? 4 : 10) + d * (isMobile ? 1 : 2), t * 0.002 + d * 0.1, 0, 2 * Math.PI);
    ctx.strokeStyle = d === 0 ? '#a5b4fc' : '#4a90e2';
    ctx.lineWidth = d === 0 ? (isMobile ? 2.5 : 5) : (isMobile ? 1.2 : 3);
    ctx.globalAlpha = d === 0 ? 0.6 : 0.3;
    ctx.shadowColor = d === 0 ? '#a5b4fc' : '#4a90e2';
    ctx.shadowBlur = d === 0 ? (isMobile ? 6 : 18) : (isMobile ? 3 : 10);
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(0, 0, isMobile ? 8 : 18, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = isMobile ? 2 : 6;
  ctx.fill();
  ctx.restore();

  // Кометы (несколько)
  for (let k = 0; k < (isMobile ? 1 : 3); k++) {
    ctx.save();
    const cometAngle = t * (0.008 + k * 0.003) + k * 1.5;
    const cometR = (isMobile ? 120 : 220) + Math.sin(t * 0.002 + k) * ((isMobile ? 12 : 30) + k * (isMobile ? 3 : 10));
    const cometX = width / 2 + Math.cos(cometAngle) * cometR;
    const cometY = height / 2 + Math.sin(cometAngle) * cometR;
    for (let i = 0; i < (isMobile ? 8 : 18); i++) {
      ctx.beginPath();
      ctx.moveTo(cometX, cometY);
      ctx.lineTo(cometX - Math.cos(cometAngle) * ((isMobile ? 12 : 30) + i * (isMobile ? 2 : 6)), cometY - Math.sin(cometAngle) * ((isMobile ? 12 : 30) + i * (isMobile ? 2 : 6)));
      ctx.strokeStyle = `rgba(255,255,255,${(isMobile ? 0.11 : 0.13) - i * (isMobile ? 0.012 : 0.007)})`;
      ctx.lineWidth = (isMobile ? 2 : 4) - i * (isMobile ? 0.09 : 0.18);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cometX, cometY, isMobile ? 3.5 : 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = isMobile ? 7 : 18;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

export default function ClientBody({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let frame: number;
    let t = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = createStars(canvas.width, canvas.height, window.innerWidth < 600 ? 120 : 400);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawSpace(ctx, canvas.width, canvas.height, t, starsRef.current, isMobile);
      t += 1;
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100vw', height: '100vh', touchAction: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', maxWidth: 600, margin: '0 auto', padding: isMobile ? '12px' : '32px', paddingBottom: isMobile ? '110px' : undefined, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
