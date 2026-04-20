import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 52;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

interface Panel {
  triggerAt: number;
  endAt: number;
}

function getActivePanelIndex(progress: number, panels: Panel[]): number {
  if (progress < 0.09) return -2;
  if (progress >= 0.86) return -3;
  for (let i = 0; i < panels.length; i++) {
    if (progress >= panels[i].triggerAt && progress < panels[i].endAt) return i;
  }
  return -1;
}

export function useScrollAnimation(panels: Panel[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const [activePanel, setActivePanel] = useState(-2);
  const [ready, setReady] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // Precarga todos los frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) setReady(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  // Dibuja el frame en canvas con cover behavior
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const idx = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1,
    );
    const img = framesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // Ajusta resolución del canvas al viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(progressRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // Redibuja cuando terminan de cargar todos los frames
  useEffect(() => {
    if (ready) drawFrame(progressRef.current);
  }, [ready, drawFrame]);

  const updateFrame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = window.scrollY;
    const containerTop = container.offsetTop;
    const scrollable = container.offsetHeight - window.innerHeight;
    const raw = (scrollTop - containerTop) / scrollable;
    const progress = Math.min(1, Math.max(0, raw));

    progressRef.current = progress;

    if (!prefersReducedMotion) drawFrame(progress);

    const next = getActivePanelIndex(progress, panels);
    setActivePanel((prev) => (prev !== next ? next : prev));
  }, [prefersReducedMotion, drawFrame, panels]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateFrame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateFrame();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateFrame]);

  return { canvasRef, containerRef, activePanel, ready };
}
