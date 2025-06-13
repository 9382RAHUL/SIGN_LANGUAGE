// import React, { useState, useEffect, useRef } from "react";

// export default function ISLConverter() {
//   const [sentence, setSentence] = useState("");
//   const [images, setImages] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(-1);
//   const [loading, setLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [currentLabel, setCurrentLabel] = useState("");

//   const intervalRef = useRef(null);
//   const currentIdxRef = useRef(0);

//   // Speech synthesis
//   const speakText = (text) => {
//     if (!text) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-IN";
//     window.speechSynthesis.cancel(); // Stop any ongoing speech
//     window.speechSynthesis.speak(utterance);
//   };

//   const startSequence = () => {
//     stopSequence();
//     if (!images.length) return;

//     currentIdxRef.current = 0;
//     setCurrentIndex(0);
//     setCurrentLabel(images[0].label);
//     speakText(images[0].label);

//     intervalRef.current = setInterval(() => {
//       if (!isPaused) {
//         currentIdxRef.current += 1;
//         if (currentIdxRef.current < images.length) {
//           setCurrentIndex(currentIdxRef.current);
//           setCurrentLabel(images[currentIdxRef.current].label);
//           speakText(images[currentIdxRef.current].label);
//         } else {
//           clearInterval(intervalRef.current);
//         }
//       }
//     }, 2000);
//   };

//   const stopSequence = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   };

//   const handleConvert = async () => {
//     if (!sentence.trim()) return;

//     setLoading(true);
//     setCurrentIndex(-1);
//     setImages([]);
//     stopSequence();

//     try {
//       const res = await fetch("http://localhost:5000/convert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sentence: sentence.trim() }),
//       });
//       if (!res.ok) throw new Error("Network response not ok");
//       const data = await res.json();
//       setImages(data);
//     } catch (err) {
//       alert("Failed to fetch ISL images. Is the backend running?");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     stopSequence();
//     if (images.length) {
//       startSequence();
//     }
//     return () => stopSequence();
//   }, [images]);

//   const handlePauseResume = () => {
//     const newPaused = !isPaused;
//     setIsPaused(newPaused);

//     if (!newPaused) {
//       startSequence();
//     } else {
//       stopSequence();
//       speakText("Paused");
//     }
//   };

//   const handlePlayAgain = () => {
//     stopSequence();
//     setIsPaused(false);
//     setCurrentIndex(0);
//     currentIdxRef.current = 0;
//     setCurrentLabel(images[0]?.label || "");
//     startSequence();
//   };

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
//       {/* Left panel */}
//       <div className="flex-1 p-6 md:p-10 border-r border-gray-300">
//         <h1 className="text-3xl font-bold mb-6">ISL Converter (Text ➝ Indian Sign Language)</h1>
//         <label htmlFor="sentence" className="block mb-2 font-medium text-gray-700">
//           Enter a sentence:
//         </label>
//         <input
//           id="sentence"
//           type="text"
//           className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           placeholder="Type a sentence (e.g. I am fine)"
//           value={sentence}
//           onChange={(e) => setSentence(e.target.value)}
//         />

//         <div className="flex gap-4 mt-6">
//           <button
//             onClick={handleConvert}
//             disabled={loading}
//             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
//           >
//             Convert
//           </button>

//           {images.length > 0 && (
//             <>
//               <button
//                 onClick={handlePauseResume}
//                 className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
//                 aria-label={isPaused ? "Resume playback" : "Pause playback"}
//               >
//                 {isPaused ? "▶️ Resume" : "⏸ Pause"}
//               </button>
//               <button
//                 onClick={handlePlayAgain}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//                 aria-label="Play again"
//               >
//                 🔄 Play Again
//               </button>
//             </>
//           )}
//         </div>

//         {loading && <p className="mt-4 text-gray-600">Loading...</p>}
//       </div>

//       {/* Right panel */}
//       <div className="flex-1 p-6 md:p-10 bg-white flex flex-col items-center">
//         {currentLabel && (
//           <p className="mb-4 text-xl font-medium text-purple-700">
//             🔊 Speaking: <span className="font-bold">{currentLabel}</span>
//           </p>
//         )}

//         <div className="shadow-lg rounded-lg overflow-hidden w-[320px] h-[320px] flex items-center justify-center bg-gray-100">
//           {currentIndex >= 0 && currentIndex < images.length ? (
//             <img
//               key={currentIndex}
//               src={`data:image/gif;base64,${images[currentIndex].data}`}
//               alt={images[currentIndex].label}
//               className="object-contain max-w-full max-h-full"
//             />
//           ) : (
//             <p className="text-gray-400">No image to display</p>
//           )}
//         </div>

//         {/* Pagination dots */}
//         {images.length > 1 && (
//           <div className="flex gap-2 mt-4">
//             {images.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={`h-2 w-2 rounded-full ${idx === currentIndex ? "bg-indigo-600" : "bg-gray-300"}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
export default function ISLConverter() {
  const [sentence, setSentence] = useState("");
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 100;

  const intervalRef = useRef(null);
  const currentIdxRef = useRef(0);
  const inputRef = useRef(null);

  // Speech synthesis
  const speakText = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel(); // Stop any ongoing speech
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

  // const handleConvert = async () => {
  //   if (!sentence.trim()) return;

  //   setLoading(true);
  //   setCurrentIndex(-1);
  //   setImages([]);
  //   stopSequence();

  //   try {
  //     const response = await axios.post("http://localhost:5000/convert", {
  //       sentence: sentence.trim(),
  //     });
  //     setImages(response.data);
  //     console.log("ISL images:", response.data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to fetch ISL images. Is the backend running?");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

    if (response.data && response.data.length > 0) {
      setImages(response.data);
      setCurrentIndex(0);
      setCurrentLabel(response.data[0].label || "");
      startSequence();
    } else {
      alert("No ISL images found for this sentence.");
    }

    console.log("ISL images:", response.data);
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

  useEffect(() => {
    setCharCount(sentence.length);
  }, [sentence]);

  const handlePauseResume = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);

    if (!newPaused) {
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

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      stopSequence();
      setIsPaused(true);
      setCurrentIndex(currentIndex + 1);
      currentIdxRef.current = currentIndex + 1;
      setCurrentLabel(images[currentIndex + 1].label);
      speakText(images[currentIndex + 1].label);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      stopSequence();
      setIsPaused(true);
      setCurrentIndex(currentIndex - 1);
      currentIdxRef.current = currentIndex - 1;
      setCurrentLabel(images[currentIndex - 1].label);
      speakText(images[currentIndex - 1].label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const examples = [
    "Hello, how are you?",
    "My name is John",
    "I am learning sign language",
  ];

  // Simple SVG icons (Play, Pause, Refresh, Volume, ChevronLeft, ChevronRight, Alert)
  const PlayIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v18l15-9L5 3z"
      />
    </svg>
  );
  const PauseIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" ry="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" ry="1" />
    </svg>
  );
  const RefreshIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v6h6M20 20v-6h-6"
      />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
  const VolumeIcon = () => (
    <svg
      className="w-4 h-4 text-blue-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5L6 9H2v6h4l5 4V5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9a4 4 0 010 6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 6a8 8 0 010 12"
      />
    </svg>
  );
  const ChevronLeftIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
  const ChevronRightIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
  const AlertIcon = () => (
    <svg
      className="w-4 h-4 mr-1 text-red-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Left panel */}
      <div className="flex-1 p-6 md:p-10 border-r border-gray-200">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">ISL Converter</h1>
        <p className="text-gray-600 mb-6">
          Convert text to Indian Sign Language
        </p>

        <div className="mb-6">
          <label
            htmlFor="sentence"
            className="block mb-2 font-medium text-gray-700"
          >
            Enter a sentence:
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="sentence"
              type="text"
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Type a sentence (e.g. I am fine)"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxChars}
              aria-describedby="char-count"
            />
            <span
              id="char-count"
              className="absolute bottom-2 right-3 text-xs text-gray-500"
            >
              {charCount}/{maxChars}
            </span>
          </div>
          {error && (
            <div className="flex items-center mt-2 text-red-600">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleConvert}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Converting...
              </>
            ) : (
              "Convert to ISL"
            )}
          </button>

          {images.length > 0 && (
            <>
              <button
                onClick={handlePauseResume}
                className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 font-medium"
                aria-label={isPaused ? "Resume playback" : "Pause playback"}
              >
                {isPaused ? (
                  <>
                    <PlayIcon /> Resume
                  </>
                ) : (
                  <>
                    <PauseIcon /> Pause
                  </>
                )}
              </button>
              <button
                onClick={handlePlayAgain}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
                aria-label="Play again"
              >
                <RefreshIcon /> Play Again
              </button>
            </>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-3 text-gray-700">
            Try these examples:
          </h2>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSentence(example)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="font-medium">Sign Language Translation</h2>
              {currentIndex >= 0 && (
                <span className="text-sm bg-white/20 px-2 py-1 rounded">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {currentLabel && (
              <div className="px-4 py-3 bg-blue-50 flex items-center gap-2">
                <VolumeIcon />
                <p className="text-blue-800 font-medium">{currentLabel}</p>
              </div>
            )}

            <div className="w-full aspect-square flex items-center justify-center bg-gray-50 relative">
              {currentIndex >= 0 && currentIndex < images.length ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={`data:image/${
                      images[currentIndex].type === "gif" ? "gif" : "png"
                    };base64,${images[currentIndex].data}`}
                    alt={images[currentIndex].label}
                    className="object-contain transition-opacity duration-300 max-h-[300px]"
                  />
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Loading signs...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-gray-400 mb-2">No signs to display</p>
                  <p className="text-sm text-gray-400">
                    Enter a sentence and click "Convert" to see sign language
                  </p>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex <= 0}
                  className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous sign"
                >
                  <ChevronLeftIcon />
                </button>

                <div className="flex gap-1.5">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= images.length - 1}
                  className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next sign"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Click the arrows to navigate manually or use the play/pause
              controls
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
