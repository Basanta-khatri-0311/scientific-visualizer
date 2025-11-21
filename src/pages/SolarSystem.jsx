import { useEffect, useState } from "react";

export default function SolarSystem() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((r) => r + 0.5);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#041019] flex flex-col items-center py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Solar System Visualizer</h1>

      <div className="relative w-[400px] h-[400px] flex items-center justify-center">

        {/* SUN */}
        <div className="absolute w-24 h-24 bg-yellow-400 rounded-full shadow-lg" />

        {/* EARTH ORBIT */}
        <div
          className="absolute w-full h-full border border-gray-600 rounded-full"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute w-10 h-10 bg-blue-400 rounded-full -right-0 top-1/2 -translate-y-1/2" />
        </div>

        {/* MARS ORBIT */}
        <div
          className="absolute w-[300px] h-[300px] border border-gray-700 rounded-full"
          style={{ transform: `rotate(${rotation * 1.3}deg)` }}
        >
          <div className="absolute w-8 h-8 bg-red-400 rounded-full -right-0 top-1/2 -translate-y-1/2" />
        </div>

      </div>
    </div>
  );
}
