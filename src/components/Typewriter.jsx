import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 90, startDelay = 300 }) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setLength(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <>
      {text.slice(0, length)}
      <span className="typewriter-caret">|</span>
    </>
  );
}
