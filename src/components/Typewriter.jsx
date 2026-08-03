import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 90,
  deleteSpeed = 45,
  startDelay = 300,
  pauseDuration = 1800,
  loop = false,
}) {
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    setLength(0);
    setPhase("typing");
  }, [text]);

  useEffect(() => {
    let timer;

    if (phase === "typing") {
      if (length < text.length) {
        timer = setTimeout(
          () => setLength((l) => l + 1),
          length === 0 ? startDelay : speed,
        );
      } else if (loop) {
        timer = setTimeout(() => setPhase("deleting"), pauseDuration);
      }
    } else if (phase === "deleting") {
      if (length > 0) {
        timer = setTimeout(() => setLength((l) => l - 1), deleteSpeed);
      } else {
        timer = setTimeout(() => setPhase("typing"), 400);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, length, text, speed, deleteSpeed, startDelay, pauseDuration, loop]);

  return (
    <>
      {text.slice(0, length)}
      <span className="typewriter-caret">|</span>
    </>
  );
}
