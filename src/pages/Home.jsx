import Card from "../components/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f1c2c] text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-12">Scientific Concepts Visualizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[90%] max-w-4xl">

        <Card
          title="Solar System"
          description="Visualization of the solar system"
          icon="🌞"
          to="/solar-system"
        />

        <Card
          title="Atom"
          description="Visualization of an atom"
          icon="⚛️"
          to="/atom"
        />

        <Card
          title="Physics"
          description="Simulation of physics concepts"
          icon="📐"
          to="/physics"
        />

        <Card
          title="Chemistry"
          description="Visualization of molecular structures"
          icon="🧪"
          to="/chemistry"
        />

      </div>
    </div>
  );
}
