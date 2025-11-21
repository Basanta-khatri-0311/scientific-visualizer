import { Link } from "react-router-dom";

export default function Card({ title, description, icon, to }) {
  return (
    <Link
      to={to}
      className="bg-[#162533] p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-[#1b2f44] transition-all cursor-pointer flex flex-col items-center space-y-3"
    >
      <div className="text-5xl">{icon}</div>
      <h2 className="text-white font-bold text-xl">{title}</h2>
      <p className="text-gray-300 text-center text-sm">{description}</p>
    </Link>
  );
}
