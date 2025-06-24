import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function ISLConverter() {
    const [sentence, setSentence] = useState("");
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentLabel, setCurrentLabel] = useState("");
    const [error, setError] = useState("");
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
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
        const token = localStorage.getItem("token");
        if (!token) {   
            navigate("/signin");
            return;
        }
    }, []);

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
        "I am fine",
        "I love coding",
        "I am a software engineer",
        "I am a student",
    ];
    const reexample = [
        "I am a nurse",
        "I am a lawyer",
        "I am a scientist",
        "I am a teacher",
        "I am a doctor",
        "I am a nurse",
        "I am a lawyer",
        "I am a scientist",
    ];
    const examplesmain = [
        "God is great",
        "I love my country",
        "I am a good person",
        "I am a good student",
        "I am a good teacher",
        "I am a good doctor",
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

    if (localStorage.getItem("token")) {
        return (
        // <div className=" md:flex-row  bg-gradient-to-r from-[#1ED6B9] to-[#5C4DF4] ">
        <div className=" md:flex-row  bg-gradient-to-r from-indigo-900 to-blue-500 ">
            <div className="w-1/2 text-white ">
                <div className="pt-5">

                    <h1 className="pl-11 py-3 text-2xl md:text-4xl font-extrabold mb-4  text-white  tracking-tight  bg-clip-text ">
                        <span className="text-blue-700">  🌟 </span> Indian Sign Language Converter
                    </h1>



                    <p className="text-sm ml-14 mb-7">
                        Our main objective is to develop a software prototype which takes input as text in English and generate multiple images in a slideshow manner or videos of that meaning with using the grammar and protocols of Indian Sign Language.We have integrated a ML model that checks the similarity between the input text and entries in our database. If a match is found, the most relevant sign language video is displayed. If not, the text is broken down into words or letters, and corresponding videos are shown as output.
                    </p>
                </div>
            </div>

            <div className="flex  h-[34rem]   ">

                <div className=" p-6 md:p-10 w-1/2  border-gray-200 bg-amber-50 backdrop-blur-md shadow-inner  overflow-hidden ">
                    {/* <hr className=" bg-gray-700 border-2 border-gray-700 w-1/2" /> */}

                    <div className="mb-6  ml-4">
                        <label
                            htmlFor="sentence"
                            className="block mb-2 font-semibold text-gray-700"
                        >
                            Enter a sentence:
                        </label>
                        <div className="">
                            <input
                                ref={inputRef}
                                id="sentence"
                                type="text"
                                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all shadow-md focus:shadow-xl"
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
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6 ml-4">
                        <button
                            onClick={handleConvert}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-2 font-semibold"
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
                                    className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
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
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                                    aria-label="Play again"
                                >
                                    <RefreshIcon /> Play Again
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mt-8 space-y-4 ml-4">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Try these examples:
                        </h2>

                        {/* Loop 1 - Left Scroll */}
                        <div className="overflow-hidden whitespace-nowrap relative">
                            <div className="animate-scroll-left inline-block">
                                {[...examples, ...examples].map((example, index) => (
                                    <button
                                        key={`ex1-${index}`}
                                        onClick={() => setSentence(example)}
                                        className="px-6 py-4 mx-4 bg-blue-100 hover:bg-blue-200 hover:text-blue-900 rounded-md text-blue-700 font-medium transition-transform hover:scale-105 shadow-sm"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Loop 2 - Right Scroll */}
                        <div className="overflow-hidden whitespace-nowrap relative">
                            <div className="animate-scroll-right inline-block">
                                {[...reexample, ...reexample].map((reex, index) => (
                                    <button
                                        key={`ex2-${index}`}
                                        onClick={() => setSentence(reex)}
                                        className="px-6 py-4 mx-4 bg-blue-100 hover:bg-blue-200 hover:text-blue-900 rounded-md text-blue-700 font-medium transition-transform hover:scale-105 shadow-sm"
                                    >
                                        {reex}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Loop 3 - Left Scroll */}
                        <div className="overflow-hidden whitespace-nowrap relative">
                            <div className="animate-scroll-left inline-block">
                                {[...examplesmain, ...examplesmain].map((mainex, index) => (
                                    <button
                                        key={`ex3-${index}`}
                                        onClick={() => setSentence(mainex)}
                                        className="px-6 py-4 mx-4 bg-blue-100 hover:bg-blue-200 hover:text-blue-900 rounded-md text-blue-700 font-medium transition-transform hover:scale-105 shadow-sm"
                                    >
                                        {mainex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className=" p-6 md:p-10 w-1/2 flex flex-col items-center justify-center bg-amber-50 backdrop-blur-sm ">
                    <div className="w-full max-w-md ml-20">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up relative bottom-44 ">
                            <div className="p-4 bg-gradient-to-r from-blue-700 to-[#5346d8] text-white flex justify-between items-center rounded-t-xl">
                                <h2 className="font-semibold">Sign Language Translation</h2>
                                {currentIndex >= 0 && (
                                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                                        {currentIndex + 1} / {images.length}
                                    </span>
                                )}
                            </div>

                            {currentLabel && (
                                <div className="px-4 py-3 bg-blue-50 flex items-center gap-2 animate-fade-in text-blue-800 font-medium">
                                    <VolumeIcon />
                                    <p>{currentLabel}</p>
                                </div>
                            )}

                            <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-white relative">
                                {currentIndex >= 0 && currentIndex < images.length ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {images[currentIndex].type === "gif" || images[currentIndex].type === "image" ? (
                                            <img
                                                src={`data:image/${images[currentIndex].type === "gif" ? "gif" : "png"};base64,${images[currentIndex].data}`}
                                                alt={images[currentIndex].label}
                                                className="object-contain transition-transform duration-700 ease-in-out transform hover:scale-105 max-h-[300px] drop-shadow-xl rounded-xl"
                                            />
                                        ) : (
                                            <video
                                                controls
                                                autoPlay
                                                className="max-h-[300px] rounded-xl drop-shadow-xl"
                                            >
                                                <source
                                                    src={`data:video/mp4;base64,${images[currentIndex].data}`}
                                                    type="video/mp4"
                                                />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}

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
                                            Enter a sentence and click \"Convert\" to see sign language
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
    } else {
        navigate("/signin");
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-900 to-blue-500">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <AlertIcon />
                    <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Please log in to access the ISL Converter.</p>
                    <button
                        onClick={() => navigate("/signin")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }
}
