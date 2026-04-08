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

    const getPath = (): { x: number; y: number }[] => {
      const w = W();
      const h = H();
      const points: { x: number; y: number }[] = [];

      const cubicPoint = (
        u: number,
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number }
      ) => {
        const inv = 1 - u;
        const inv2 = inv * inv;
        const inv3 = inv2 * inv;
        const u2 = u * u;
        const u3 = u2 * u;
        return {
          x: inv3 * p0.x + 3 * inv2 * u * p1.x + 3 * inv * u2 * p2.x + u3 * p3.x,
          y: inv3 * p0.y + 3 * inv2 * u * p1.y + 3 * inv * u2 * p2.y + u3 * p3.y,
        };
      };

      // Single broad valley with smooth rise, based on reference shape.
      const p0 = { x: -0.06 * w, y: -0.1 * h };
      const p1 = { x: 0.14 * w, y: 1.05 * h };
      const p2 = { x: 0.48 * w, y: 1.2 * h };
      const p3 = { x: 0.72 * w, y: 0.62 * h };

      const p4 = { x: 0.86 * w, y: 0.28 * h };
      const p5 = { x: 0.96 * w, y: 0.14 * h };
      const p6 = { x: 1.05 * w, y: 0.18 * h };

      const segmentSteps = 150;
      for (let i = 0; i <= segmentSteps; i++) {
        const u = i / segmentSteps;
        points.push(cubicPoint(u, p0, p1, p2, p3));
      }

      for (let i = 1; i <= segmentSteps; i++) {
        const u = i / segmentSteps;
        points.push(cubicPoint(u, p3, p4, p5, p6));
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
      const isDarkMode = Boolean(canvas.closest(".bg-nocturne") || document.documentElement.classList.contains("dark"));

      const palette = isDarkMode
        ? {
            shadow: "rgba(0, 0, 0, 0.45)",
            outer: "hsl(214, 26%, 36%)",
            mid: "hsl(210, 30%, 46%)",
            highlight: "hsla(205, 92%, 84%, 0.72)",
            bottomShadow: "hsla(220, 32%, 8%, 0.5)",
            ribbed: "hsla(206, 28%, 86%, 0.16)",
            glow0: "hsla(181, 100%, 80%, 1)",
            glow1: "hsla(186, 95%, 64%, 1)",
            glow2: "hsla(192, 90%, 56%, 0)",
            coreA: "hsla(183, 100%, 93%, 0.95)",
            coreB: "hsla(188, 100%, 98%, 0.9)",
            endCap: "hsl(212, 28%, 38%)",
            spark0: "hsla(183, 100%, 95%, 1)",
            spark1: "hsla(188, 95%, 68%, 1)",
            spark2: "hsla(193, 90%, 52%, 0)",
          }
        : {
            shadow: "rgba(0,0,0,0.25)",
            outer: "hsl(210, 8%, 18%)",
            mid: "hsl(210, 6%, 24%)",
            highlight: "hsla(210, 5%, 38%, 0.6)",
            bottomShadow: "hsla(210, 8%, 10%, 0.4)",
            ribbed: "hsla(210, 5%, 15%, 0.15)",
            glow0: "hsla(175, 100%, 75%, 1)",
            glow1: "hsla(175, 90%, 60%, 1)",
            glow2: "hsla(175, 80%, 50%, 0)",
            coreA: "hsla(175, 100%, 90%, 0.9)",
            coreB: "hsla(180, 100%, 97%, 0.8)",
            endCap: "hsl(210, 6%, 20%)",
            spark0: "hsla(175, 100%, 90%, 1)",
            spark1: "hsla(175, 80%, 60%, 1)",
            spark2: "hsla(175, 60%, 40%, 0)",
          };

      ctx.clearRect(0, 0, w, h);

      const path = getPath();
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
      ctx.strokeStyle = palette.shadow;
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
      ctx.strokeStyle = palette.outer;
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
      ctx.strokeStyle = palette.mid;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.stroke();

      // Cable highlight (specular top edge for 3D look)
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y - 5);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y - 5);
      }
      ctx.strokeStyle = palette.highlight;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();

      // Subtle bottom edge shadow for roundness
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y + 5);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y + 5);
      }
      ctx.strokeStyle = palette.bottomShadow;
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
        ctx.strokeStyle = palette.ribbed;
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
          gradient.addColorStop(0, palette.glow0.replace("1)", `${0.8 * intensity})`));
          gradient.addColorStop(0.4, palette.glow1.replace("1)", `${0.4 * intensity})`));
          gradient.addColorStop(1, palette.glow2);
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
        ctx.strokeStyle = palette.coreA;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();

        // Even brighter core
        ctx.strokeStyle = palette.coreB;
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
        ctx.strokeStyle = palette.endCap;
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
        sparkGrad.addColorStop(0, palette.spark0.replace("1)", `${sparkIntensity})`));
        sparkGrad.addColorStop(0.5, palette.spark1.replace("1)", `${sparkIntensity * 0.5})`));
        sparkGrad.addColorStop(1, palette.spark2);
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
