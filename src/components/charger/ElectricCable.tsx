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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
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
      const steps = 600;
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const x = frac * w;
        const amplitude = h * 0.15;
        const freq = 1.5;
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
    const snakeSpeed = 0.256; // cable lengths per second (matches original fill speed)
    const segLen = 1.0; // snake body spans full cable length
    const glowLength = 0.05;
    let startTime: number | null = null;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const w = W();
      const h = H();

      ctx.clearRect(0, 0, w, h);
      ctx.filter = "blur(0.8px)";

      const path = getPath(elapsed);
      const cumDist = getCumulativeDist(path);
      const totalLen = cumDist[cumDist.length - 1];

      // Snake animation: head moves charger→car, then tail follows charger→car, then loops.
      const headPos = (elapsed * snakeSpeed) % (1 + segLen);
      const tailPos = headPos - segLen;
      const visibleHead = Math.min(headPos, 1);
      const visibleTail = Math.max(tailPos, 0);
      const headOnCable = headPos <= 1;

      // Cable shadow
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y + 2);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y + 2);
      }
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.stroke();

      // Cable outer
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = "hsl(65 0.9% 77.1% / 0.8)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.stroke();

      // Cable inner
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = "hsl(65 0.9% 77.1%)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.stroke();

      // Specular highlight
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y - 1.5);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y - 1.5);
      }
      ctx.strokeStyle = "hsla(210, 5%, 42%, 0.5)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw glow layer
      for (let i = 0; i < path.length; i++) {
        const frac = cumDist[i] / totalLen;

        // Snake: lit segment between visibleTail and visibleHead
        if (frac >= visibleTail && frac <= visibleHead) {
          const distFromHead = visibleHead - frac;
          const distFromTail = frac - visibleTail;
          let intensity: number;

          if (headOnCable && distFromHead < glowLength) {
            // Leading edge: start at body level (0.6) and ramp smoothly to 1 at the tip
            const t = 1 - (distFromHead / glowLength); // 0 at body edge, 1 at tip
            intensity = 0.6 + 0.4 * t * t;
          } else {
            // Body
            intensity = 0.6;
          }
          // Fade tail as it slides along the cable
          if (tailPos >= 0 && distFromTail < glowLength) {
            intensity *= distFromTail / glowLength;
          }

          // Tip boost: make the very front a larger continuous glow
          const tipBoost = (headOnCable && distFromHead < glowLength)
            ? (1 - distFromHead / glowLength)
            : 0;
          const glowRadius = (5 + tipBoost * 1) * Math.max(intensity, 0.01);
          const centerAlpha = 0.2 + tipBoost * 0.1;
          const gradient = ctx.createRadialGradient(
            path[i].x, path[i].y, 0,
            path[i].x, path[i].y, glowRadius
          );
          gradient.addColorStop(0, `hsla(175, 100%, 75%, ${centerAlpha * intensity})`);
          gradient.addColorStop(0.4, `hsla(175, 90%, 60%, ${0.15 * intensity})`);
          gradient.addColorStop(1, `hsla(175, 20%, 50%, 0)`);
          ctx.beginPath();
          ctx.arc(path[i].x, path[i].y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
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
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
      };
      drawEndCap(path[0], path[1]);
      drawEndCap(path[path.length - 1], path[path.length - 2]);

      // End spark as head reaches the car end
      if (headPos > 0.95 && headPos < 1.1) {
        const sparkIntensity = headPos <= 1.0
          ? (headPos - 0.95) / 0.05
          : Math.max(0, 1 - (headPos - 1.0) / 0.1);
        const last = path[path.length - 1];
        const sparkGrad = ctx.createRadialGradient(
          last.x, last.y, 0, last.x, last.y, 15 * sparkIntensity
        );
        sparkGrad.addColorStop(0, `hsla(175, 100%, 90%, ${sparkIntensity * 0.6})`);
        sparkGrad.addColorStop(0.5, `hsla(175, 80%, 60%, ${sparkIntensity * 0.3})`);
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
    <div className="flex min-h-screen items-center justify-center bg-cable-bg">
      <canvas
        ref={canvasRef}
        className="w-[200px] max-w-xl"
        style={{ height: 100 }}
      />
    </div>
  );
};

export default ElectricCable;
