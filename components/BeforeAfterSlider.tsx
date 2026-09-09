"use client";

import { useRef, useState } from "react";

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt
}: {
  beforeImage: string;
  afterImage: string;
  alt: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(2, Math.min(98, pct)));
  }

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={`Before and after comparison: ${alt}`}
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition((p) => Math.max(2, p - 4));
        if (e.key === "ArrowRight") setPosition((p) => Math.min(98, p + 4));
      }}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) updateFromClientX(e.clientX);
      }}
      className="relative h-52 w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[10px] bg-forest-900/10 outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50"
    >
      {/* Before (base layer) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${beforeImage})` }}
        aria-hidden="true"
      />
      {/* After (clipped layer): the finished job is always the right-hand side. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${afterImage})`,
          clipPath: `inset(0 0 0 ${position}%)`
        }}
        aria-hidden="true"
      />

      {/* Divider + handle */}
      <div className="absolute inset-y-0" style={{ left: `${position}%` }} aria-hidden="true">
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-forest-900 shadow-lg">
            ◂▸
          </div>
        </div>
      </div>

      {position > 14 && (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-forest-900/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          Before
        </span>
      )}
      {position < 86 && (
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-forest-600/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          After
        </span>
      )}
    </div>
  );
}
