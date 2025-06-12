import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // Or Tailwind if using

function App() {
  const [sentence, setSentence] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");

  const intervalRef = useRef(null);
  const currentIdxRef = useRef(0);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel(); // Stop current speech
    window.speechSynthesis.speak(utterance);
  };

  const startSequence = () => {
    stopSequence();
    if (!images.length) return;

    currentIdxRef.current = 0;
    setCurrentIndex(0);
    setCurrentLabel(images[0].label);
    speakText(images[0].label);

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        currentIdxRef.current += 1;
        if (currentIdxRef.current < images.length) {
          setCurrentIndex(currentIdxRef.current);
          setCurrentLabel(images[currentIdxRef.current].label);
          speakText(images[currentIdxRef.current].label);
        } else {
          clearInterval(intervalRef.current);
        }
      }
    }, 2000);
  };

  const stopSequence = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleConvert = async () => {
    if (!sentence.trim()) return;

    setLoading(true);
    setCurrentIndex(-1);
    setImages([]);
    stopSequence();

    try {
      const response = await axios.post("http://localhost:5000/convert", {
        sentence: sentence.trim(),
      });
      setImages(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch ISL images. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    stopSequence();
    if (images.length) {
      startSequence();
    }

    return () => stopSequence();
  }, [images]);

  const handlePauseResume = () => {
    const newPauseState = !isPaused;
    setIsPaused(newPauseState);

    if (!newPauseState) {
      startSequence();
    } else {
      stopSequence();
      speakText("Paused");
    }
  };

  const handlePlayAgain = () => {
    stopSequence();
    setIsPaused(false);
    setCurrentIndex(0);
    currentIdxRef.current = 0;
    setCurrentLabel(images[0]?.label || "");
    startSequence();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 animate-pulse">
        ISL Converter (Text ➝ Indian Sign Language)
      </h1>

      <input
        type="text"
        className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Type a sentence (e.g. I am fine)"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleConvert}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Convert
        </button>
        {images.length > 0 && (
          <>
            <button
              onClick={handlePauseResume}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handlePlayAgain}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Play Again
            </button>
          </>
        )}
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}

      {currentLabel && (
        <p className="mt-6 text-xl font-medium text-purple-700">
          🔊 Speaking: <span className="font-bold">{currentLabel}</span>
        </p>
      )}

      <div className="mt-6 shadow-lg rounded-lg overflow-hidden">
        {currentIndex >= 0 && currentIndex < images.length && (
          <img
            key={currentIndex}
            src={`data:image/gif;base64,${images[currentIndex].data}`}
            alt={images[currentIndex].label}
            className="w-[300px] h-[300px] object-contain"
          />
        )}
      </div>
    </div>
  );
}

export default App;
