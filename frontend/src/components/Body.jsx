import { useEffect, useState } from "react";
import "../App.css";
export default function HomePage() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const alreadyVisited = localStorage.getItem("visited");
    if (!alreadyVisited) {
      setShowAnimation(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-none ml-10">
      <div
        className={`${
          showAnimation ? "fade-in-slow" : ""
        } bg-white p-10 rounded-lg shadow-lg`}
      >
        <h1 className="text-5xl font-bold text-gray-800">
          Indian Language to Indian Sign Language Converter
        </h1>
        <p className="text-gray-600 my-4 ">
          Bridging the Communication Gap for the Hearing-Impaired through
          Text-to-Sign Language Translation using NLP and AI
        </p>
        <button className="btn">Try Now</button>
      </div>
    </div>
  );
}
