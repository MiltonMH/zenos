import { useEffect, useRef } from "react";

const ElectricCable = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Cable path points
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const getPath = (t: number): { x: number; y: number }[] => {
      const w = W();
      const h = H();
      const points: { x: number; y: number }[] = [];
      const steps = 300;
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * w;
        // Create a more compact S-curve with tighter waves
        const amplitude = h * 0.3;
        const freq = 2;
        const y = h / 2 + Math.sin(frac * Math.PI * freq - 0.5) * amplitude;
        points.push({ x, y });
      }
      return points;
    };

    // Compute cumulative distances
    const getCumulativeDist = (pts: { x: number; y: number }[]) => {
      const d = [0];
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x;
        const dy = pts[i].y - pts[i - 1].y;
        d.push(d[i - 1] + Math.sqrt(dx * dx + dy * dy));
      }
      return d;
    };

    let animId: number;
    const pulseSpeed = 0.4; // fraction of path per second
    const pulseLength = 0.18;
    const glowLength = 0.25;
    let startTime: number | null = null;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const w = W();
      const h = H();

      ctx.clearRect(0, 0, w, h);

      const path = getPath(elapsed);
      const cumDist = getCumulativeDist(path);
      const totalLen = cumDist[cumDist.length - 1];

      // Pulse position (loops)
      const pulseHead = ((elapsed * pulseSpeed) % 1.4) - 0.2;

      // Draw cable shadow
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y + 2);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y + 2);
      }
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Draw cable outer (dark rubber)
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = "hsl(210, 8%, 18%)";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // Cable mid layer (dark grey rubber)
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = "hsl(210, 6%, 24%)";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Cable highlight (specular top edge for 3D look)
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y - 5);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y - 5);
      }
      ctx.strokeStyle = "hsla(210, 5%, 38%, 0.6)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Subtle bottom edge shadow for roundness
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y + 5);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y + 5);
      }
      ctx.strokeStyle = "hsla(210, 8%, 10%, 0.4)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Ribbed texture lines across the cable
      for (let i = 0; i < path.length; i += 6) {
        const frac = cumDist[i] / totalLen;
        // Get tangent direction
        const next = Math.min(i + 1, path.length - 1);
        const prev = Math.max(i - 1, 0);
        const dx = path[next].x - path[prev].x;
        const dy = path[next].y - path[prev].y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        // Normal perpendicular to tangent
        const nx = -dy / len;
        const ny = dx / len;

        ctx.beginPath();
        ctx.moveTo(path[i].x + nx * 3, path[i].y + ny * 3);
        ctx.lineTo(path[i].x - nx * 3, path[i].y - ny * 3);
        ctx.strokeStyle = "hsla(210, 5%, 15%, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw glow layer
      for (let i = 0; i < path.length; i++) {
        const frac = cumDist[i] / totalLen;
        const dist = frac - pulseHead;

        // Main pulse glow
        if (dist > -glowLength && dist < pulseLength) {
          let intensity: number;
          if (dist < 0) {
            // Trailing glow
            intensity = 1 - Math.abs(dist) / glowLength;
            intensity = intensity * intensity * 0.6;
          } else {
            // Leading edge
            intensity = 1 - dist / pulseLength;
            intensity = intensity * intensity;
          }

          // Outer glow
          const glowRadius = 10 * intensity;
          const gradient = ctx.createRadialGradient(
            path[i].x, path[i].y, 0,
            path[i].x, path[i].y, glowRadius
          );
          gradient.addColorStop(0, `hsla(175, 100%, 75%, ${0.8 * intensity})`);
          gradient.addColorStop(0.4, `hsla(175, 90%, 60%, ${0.4 * intensity})`);
          gradient.addColorStop(1, `hsla(175, 80%, 50%, 0)`);
          ctx.beginPath();
          ctx.arc(path[i].x, path[i].y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // Draw bright pulse core
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < path.length; i++) {
        const frac = cumDist[i] / totalLen;
        const dist = frac - pulseHead;
        if (dist > -0.02 && dist < pulseLength * 0.6) {
          if (!started) {
            ctx.moveTo(path[i].x, path[i].y);
            started = true;
          } else {
            ctx.lineTo(path[i].x, path[i].y);
          }
        }
      }
      if (started) {
        ctx.strokeStyle = "hsla(175, 100%, 90%, 0.9)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Even brighter core
        ctx.strokeStyle = "hsla(180, 100%, 97%, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Cable end caps (flat cut ends)
      const drawEndCap = (pt: { x: number; y: number }, nextPt: { x: number; y: number }) => {
        const dx = nextPt.x - pt.x;
        const dy = nextPt.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        ctx.beginPath();
        ctx.moveTo(pt.x + nx * 4, pt.y + ny * 4);
        ctx.lineTo(pt.x - nx * 4, pt.y - ny * 4);
        ctx.strokeStyle = "hsl(210, 6%, 20%)";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.stroke();
      };
      drawEndCap(path[0], path[1]);
      drawEndCap(path[path.length - 1], path[path.length - 2]);

      // End spark
      const endPulse = pulseHead - 1;
      if (endPulse > -0.05 && endPulse < 0.15) {
        const sparkIntensity = 1 - Math.abs(endPulse) / 0.15;
        const last = path[path.length - 1];
        const sparkGrad = ctx.createRadialGradient(
          last.x, last.y, 0, last.x, last.y, 15 * sparkIntensity
        );
        sparkGrad.addColorStop(0, `hsla(175, 100%, 90%, ${sparkIntensity})`);
        sparkGrad.addColorStop(0.5, `hsla(175, 80%, 60%, ${sparkIntensity * 0.5})`);
        sparkGrad.addColorStop(1, `hsla(175, 60%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(last.x, last.y, 15 * sparkIntensity, 0, Math.PI * 2);
        ctx.fillStyle = sparkGrad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full overflow-visible">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: 50 }}
      />
    </div>
  );
};

export default ElectricCable;
