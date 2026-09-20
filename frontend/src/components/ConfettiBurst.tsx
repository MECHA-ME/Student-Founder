"use client";

import { useEffect, useState } from "react";

interface Piece {
  id: number;
  x: number;
  color: string;
  animIndex: number;
  size: number;
  shape: "circle" | "square" | "triangle";
  delay: number;
}

const COLORS = ["#f43f5e", "#22d3ee", "#a78bfa", "#f59e0b", "#4ade80", "#fb923c"];

function randomPiece(id: number): Piece {
  return {
    id,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    animIndex: Math.floor(Math.random() * 5) + 1,
    size: 6 + Math.random() * 8,
    shape: (["circle", "square", "triangle"] as const)[Math.floor(Math.random() * 3)],
    delay: Math.random() * 0.3,
  };
}

interface ConfettiBurstProps {
  show: boolean;
  count?: number;
  className?: string;
}

export default function ConfettiBurst({ show, count = 18, className = "" }: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    const next = Array.from({ length: count }, (_, i) => randomPiece(i));
    const showTimer = setTimeout(() => {
      setPieces(next);
      setVisible(true);
    }, 0);
    const hideTimer = setTimeout(() => setVisible(false), 900);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [show, count]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            position: "absolute",
            left: `${piece.x}%`,
            top: "40%",
            width: piece.size,
            height: piece.size,
            backgroundColor:
              piece.shape !== "triangle" ? piece.color : "transparent",
            borderRadius:
              piece.shape === "circle"
                ? "50%"
                : piece.shape === "square"
                ? "2px"
                : "0",
            borderLeft:
              piece.shape === "triangle"
                ? `${piece.size / 2}px solid transparent`
                : undefined,
            borderRight:
              piece.shape === "triangle"
                ? `${piece.size / 2}px solid transparent`
                : undefined,
            borderBottom:
              piece.shape === "triangle"
                ? `${piece.size}px solid ${piece.color}`
                : undefined,
            animation: `confettiFall${piece.animIndex} 0.8s ease-out ${piece.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
