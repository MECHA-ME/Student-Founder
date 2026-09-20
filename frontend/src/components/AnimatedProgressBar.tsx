"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedProgressBarProps {
  /** Value 0-100 */
  value: number;
  color?: string;
  height?: string;
  delay?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function AnimatedProgressBar({
  value,
  color = "#22d3ee",
  height = "h-2",
  delay = 0,
  showLabel = false,
  label,
  className = "",
}: AnimatedProgressBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setWidth(value), delay);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full ${className}`} ref={ref}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5 text-sm text-slate-300">
          {label && <span>{label}</span>}
          <span className="tabular-nums ml-auto">{clampedValue}%</span>
        </div>
      )}
      <div className={`${height} w-full rounded-full bg-slate-800 overflow-hidden`}>
        <div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${width}%`,
            transition: `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
          }}
        >
          {/* Highlight stripe */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
            }}
          />
          {/* Moving sheen */}
          {width > 0 && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
