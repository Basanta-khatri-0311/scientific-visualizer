import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, useTexture } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";

// Preload textures. Note: I've added placeholders for the remaining planets, 
// assuming you have these assets in your '/textures' directory.
const textures = {
  // Existing Textures
  sun: "/textures/sun.png",
  earth: "/textures/earth.png",
  mars: "/textures/mars.png",
  saturn: "/textures/saturn.png",
  saturnRing: "/textures/saturn_ring.png",
  // New Textures
  mercury: "/textures/mercury.png",
  venus: "/textures/venus.png",
  jupiter: "/textures/jupiter.png",
  uranus: "/textures/uranus.png",
  neptune: "/textures/neptune.png",
};

/**
 * Renders a single celestial body (Planet or Sun) with an orbit line.
 */
function Planet({ texture, radius, distance, speed, tilt = 0, ringTexture, type = "standard", name, data, onHover, onOut }) {
  const planetRef = useRef();
  const ringRef = useRef();

  const colorMap = useTexture(texture);
  const ringMap = ringTexture ? useTexture(ringTexture) : null;

  // Generate points for the orbit line geometry
  const orbitPoints = useMemo(
    () =>
      Array.from({ length: 128 }, (_, i) => { // Increased segments for smoother orbit
        const angle = (i / 128) * Math.PI * 2;
        // Orbits in the XZ plane
        return [Math.sin(angle) * distance, 0, Math.cos(angle) * distance];
      }),
    [distance]
  );

  useFrame((state) => {
    // Calculate time-based position for orbital movement
    const t = state.clock.elapsedTime * speed * 0.5; // Reduced speed multiplier for a less frenetic look

    const x = Math.sin(t) * distance;
    const z = Math.cos(t) * distance;
    planetRef.current.position.set(x, 0, z);

    // Planet spin (rotation on its own axis)
    planetRef.current.rotation.y += 0.01;

    // Apply tilt for visual realism
    planetRef.current.rotation.z = tilt;

    // Ring follows planet position and spins with it
    if (ringRef.current) {
      ringRef.current.position.set(x, 0, z);
      ringRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {/* Orbit line (conditional) */}
      {distance > 0 && (
        <Line
          points={orbitPoints}
          color="rgba(128, 128, 128, 0.5)" // Faded gray color
          lineWidth={0.5}
          dashed={false}
        />
      )}

      {/* Planet/Sun Mesh - Added pointer events for hover */}
      <mesh
        ref={planetRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          // Pass the data and the client coordinates for positioning the HTML popup
          onHover(data, e.clientX, e.clientY);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onOut();
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        {type === "sun" ? (
          // Sun uses Basic Material for light emission effect
          <meshBasicMaterial map={colorMap} />
        ) : (
          // Planets use Phong Material to react to the Sun's light
          <meshPhongMaterial map={colorMap} shininess={15} />
        )}
      </mesh>

      {/* Rings (e.g., Saturn, Uranus) */}
      {ringMap && (
        <mesh ref={ringRef} rotation={[tilt * 0.5, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.5, 64]} />
          <meshPhongMaterial
            map={ringMap}
            side={2} // Render on both sides
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </>
  );
}

// Main component containing the Solar System
export default function SolarSystem3D() {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Data for the Solar System objects, including informational text
  const PLANET_DATA = useMemo(() => [
    { name: "Sun", radius: 5, distance: 0, speed: 0, texture: textures.sun, type: "sun", info: "The star at the center of the Solar System. It accounts for 99.8% of the system's mass." },
    { name: "Mercury", radius: 0.7, distance: 10, speed: 1.2, texture: textures.mercury, info: "The smallest planet and the one closest to the Sun. It has the shortest orbit." },
    { name: "Venus", radius: 1.8, distance: 17, speed: 0.8, texture: textures.venus, info: "The second planet from the Sun, known for its dense, toxic atmosphere and extreme heat." },
    { name: "Earth", radius: 2.0, distance: 25, speed: 0.6, texture: textures.earth, info: "The third planet from the Sun and the only astronomical object known to harbor life." },
    { name: "Mars", radius: 1.4, distance: 35, speed: 0.4, texture: textures.mars, info: "The 'Red Planet' is home to Olympus Mons, the largest volcano in the Solar System." },
    { name: "Jupiter", radius: 4.5, distance: 50, speed: 0.3, texture: textures.jupiter, info: "The largest planet, known for its Great Red Spot—a persistent anti-cyclonic storm." },
    { name: "Saturn", radius: 3.5, distance: 65, speed: 0.2, texture: textures.saturn, tilt: 0.5, ringTexture: textures.saturnRing, info: "Famous for its vast and beautiful ring system, primarily made of ice particles." },
    { name: "Uranus", radius: 2.8, distance: 85, speed: 0.15, texture: textures.uranus, tilt: 1.0, ringTexture: textures.uranusRing, info: "An ice giant that rotates on its side, relative to the plane of the Solar System." },
    { name: "Neptune", radius: 2.7, distance: 100, speed: 0.1, texture: textures.neptune, info: "The most distant known planet, characterized by powerful supersonic winds." },
  ], []);

  const handlePointerOver = (data, clientX, clientY) => {
    setHoveredPlanet(data);
    // Position the tooltip slightly above and to the right of the cursor
    setTooltipPosition({ x: clientX + 15, y: clientY + 15 });
  };

  const handlePointerOut = () => {
    setHoveredPlanet(null);
  };

  return (
    // Set container to relative so the absolute tooltip is positioned correctly
    <div className="h-screen w-screen bg-black relative">
      <Canvas camera={{ position: [0, 80, 120] }}> {/* Adjusted camera for wider view */}

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <hemisphereLight skyColor="white" groundColor="gray" intensity={0.5} />
        {/* Point light positioned at the Sun's center */}
        <pointLight intensity={3} position={[0, 0, 0]} castShadow />

        {/* Background Stars */}
        <Stars speed={1} radius={50} depth={500} count={60000} factor={6} fade />


        {/* --- Solar System Objects --- */}
        {PLANET_DATA.map((planet) => (
          <Planet
            key={planet.name}
            name={planet.name}
            data={planet} // Pass the whole data object
            onHover={handlePointerOver}
            onOut={handlePointerOut}
            texture={planet.texture}
            radius={planet.radius}
            distance={planet.distance}
            speed={planet.speed}
            tilt={planet.tilt}
            ringTexture={planet.ringTexture}
            type={planet.type}
          />
        ))}

        <OrbitControls />
      </Canvas>

      {/* HTML Tooltip (Popup) */}
      {hoveredPlanet && (
        <div
          className="absolute max-w-xs p-3 bg-gray-900/50 text-white rounded-lg shadow-2xl pointer-events-none transition-opacity duration-150"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 100
          }}
        >
          <h3 className="text-lg font-bold text-yellow-400 mb-1">{hoveredPlanet.name}</h3>
          <p className="text-sm">{hoveredPlanet.info}</p>
        </div>
      )}
    </div>
  );
}