"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;  // ms per character
  startDelay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  speed = 28,
  startDelay = 400,
  className = "",
  showCursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [prevText, setPrevText] = useState(text);
  const done = displayed.length >= text.length;

  if (prevText !== text) {
    setPrevText(text);
    setDisplayed("");
  }

  useEffect(() => {
    if (done) {
      onComplete?.();
      return;
    }
    const delay = displayed.length === 0 ? startDelay : 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed((current) => text.slice(0, current.length + 1));
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay, displayed, done, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !done && (
        <span
          className="inline-block w-0.5 h-[1em] bg-cyan-400 align-middle ml-0.5 rounded-sm"
          style={{ animation: "blink 0.75s step-end infinite" }}
          aria-hidden
        />
      )}
    </span>
  );
}
