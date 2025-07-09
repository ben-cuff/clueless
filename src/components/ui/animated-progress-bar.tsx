import { useEffect, useState } from "react";

export default function AnimatedProgressBar({
  progress,
}: {
  progress: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(progress), 50);
  }, [progress]);
  return (
    <div
      className="h-full bg-green-500 transition-all duration-700 ease-out"
      style={{
        width: `${width}%`,
        transitionProperty: "width",
      }}
    />
  );
}
