import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useStore } from "@/store/useStore";

export default function Layout() {
  const fetchUser = useStore((s) => s.fetchUser);
  const fetchCampaigns = useStore((s) => s.fetchCampaigns);

  useEffect(() => {
    fetchUser();
    fetchCampaigns();
  }, [fetchUser, fetchCampaigns]);

  return (
    <>
      <BackgroundAura />
      <div className="app-layout">
        <Sidebar />
        <main className="mainLayout">
          <Topbar />
          <div id="page">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

function BackgroundAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const x = c.getContext("2d");
    if (!x) return;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let p: any[] = [];
    let pulses: any[] = [];
    let mx = -999, my = -999;
    let px = 0, py = 0;
    let t = 0;
    let hidden = false;
    let running = false;
    let animId: number;
    let spotAnimId: number;

    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    function sz() {
      w = window.innerWidth;
      h = window.innerHeight;
      c!.width = Math.round(w * dpr);
      c!.height = Math.round(h * dpr);
      x!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sz();
    window.addEventListener("resize", sz);

    const N = Math.min(70, Math.round((w * h) / 24000));
    for (let i = 0; i < N; i++) {
      p.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        ph: Math.random() * 6.28,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        mx = my = -999;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseout", onMouseOut);

    function loop() {
      if (hidden || rm) {
        running = false;
        return;
      }
      running = true;
      t++;

      px += (((mx < 0 ? w / 2 : mx) - w / 2) * 0.012 - px) * 0.06;
      py += (((my < 0 ? h / 2 : my) - h / 2) * 0.012 - py) * 0.06;

      x!.clearRect(0, 0, w, h);

      for (let i = 0; i < p.length; i++) {
        const a = p[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < -20) a.x = w + 20;
        if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20;
        if (a.y > h + 20) a.y = -20;

        const ax = a.x + px;
        const ay = a.y + py;
        const tw = 0.5 + Math.sin(t * 0.02 + a.ph) * 0.5;

        x!.beginPath();
        x!.arc(ax, ay, 1.1 + tw * 0.9, 0, 7);
        x!.fillStyle = "rgba(90,195,255," + (0.3 + tw * 0.35) + ")";
        x!.fill();

        for (let j = i + 1; j < p.length; j++) {
          const b = p[j];
          const bx = b.x + px;
          const by = b.y + py;
          const dx = ax - bx;
          const dy = ay - by;
          const d = Math.hypot(dx, dy);
          if (d < 125) {
            x!.beginPath();
            x!.moveTo(ax, ay);
            x!.lineTo(bx, by);
            x!.strokeStyle = "rgba(0,130,255," + 0.11 * (1 - d / 125) + ")";
            x!.lineWidth = 1;
            x!.stroke();
          }
        }

        if (mx > 0) {
          const dm = Math.hypot(ax - mx, ay - my);
          if (dm < 170) {
            x!.beginPath();
            x!.moveTo(ax, ay);
            x!.lineTo(mx, my);
            x!.strokeStyle = "rgba(33,212,253," + 0.24 * (1 - dm / 170) + ")";
            x!.lineWidth = 1;
            x!.stroke();
          }
        }
      }

      if (t % 80 === 0 && p.length > 3) {
        const a = p[(Math.random() * p.length) | 0];
        const b = p[(Math.random() * p.length) | 0];
        if (a !== b && pulses.length < 8) {
          pulses.push({ a, b, t: 0 });
        }
      }

      pulses = pulses.filter((pu) => {
        pu.t += 0.022;
        if (pu.t >= 1) return false;
        const ax = pu.a.x + px;
        const ay = pu.a.y + py;
        const cx = ax + (pu.b.x + px - ax) * pu.t;
        const cy = ay + (pu.b.y + py - ay) * pu.t;
        x!.beginPath();
        x!.arc(cx, cy, 2.4, 0, 7);
        x!.fillStyle = "rgba(130,230,255," + (1 - pu.t) + ")";
        x!.fill();
        return true;
      });

      animId = requestAnimationFrame(loop);
    }

    function start() {
      if (!running) loop();
    }

    const onVisibilityChange = () => {
      hidden = document.hidden;
      if (!hidden) start();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    // cursor spotlight (lerped for buttery follow)
    const sp = spotlightRef.current;
    if (sp && !rm) {
      let sx = window.innerWidth / 2;
      let sy = window.innerHeight / 2;
      const spl = () => {
        sx += ((mx < 0 ? window.innerWidth / 2 : mx) - sx) * 0.09;
        sy += ((my < 0 ? window.innerHeight / 2 : my) - sy) * 0.09;
        sp.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`;
        spotAnimId = requestAnimationFrame(spl);
      };
      spl();
    }

    return () => {
      window.removeEventListener("resize", sz);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(animId);
      cancelAnimationFrame(spotAnimId);
    };
  }, []);

  return (
    <>
      <div className="aurora-spin"></div>
      <div className="aura a"></div>
      <div className="aura b"></div>
      <div className="aura c"></div>
      <canvas ref={canvasRef} id="bg-canvas"></canvas>
      <div id="spotlight" ref={spotlightRef}></div>
    </>
  );
}
