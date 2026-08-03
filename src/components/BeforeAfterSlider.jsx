import { useRef, useState } from "react";

export default function BeforeAfterSlider({ before, after, beforeLabel = "Before", afterLabel = "After" }) {
  const [percent, setPercent] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  function updateFromClientX(clientX) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }

  function handlePointerDown(e) {
    dragging.current = true;
    updateFromClientX(e.clientX);
  }
  function handlePointerMove(e) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }
  function stopDragging() {
    dragging.current = false;
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-sm touch-none select-none overflow-hidden rounded-2xl shadow-lg"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
    >
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable="false"
      />
      <img
        src={before}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        draggable="false"
      />

      <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
        {beforeLabel}
      </span>
      <span className="absolute bottom-3 right-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-0.5 bg-white"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xs font-bold text-ink">↔</span>
        </div>
      </div>
    </div>
  );
}
