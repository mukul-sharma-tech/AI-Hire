// "use client";

// import { useEffect, useRef, useState, useCallback } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import Avatar from '@/components/Avatar';
// import { motion } from 'framer-motion';

// export default function InterviewPlatform() {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const questions = JSON.parse(searchParams.get("questions") || "[]");
//     const interviewType = searchParams.get("interviewType") || "";

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [currentAnimation, setCurrentAnimation] = useState("Idle");
//     const [userAnswer, setUserAnswer] = useState("");
//     const [qaPairs, setQaPairs] = useState([]);
//     const [stream, setStream] = useState(null);
//     const [micOn, setMicOn] = useState(true);
//     const [videoOn, setVideoOn] = useState(true);
//     const [isListening, setIsListening] = useState(false);
//     const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);

//     const videoRef = useRef(null);
//     const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
//     const utteranceRef = useRef(null);

//     const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
//     const recognitionRef = useRef(null);

//     // Inject external 3D widget
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.id = 'omnidimension-web-widget';
//         script.async = true;
//         script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//         document.body.appendChild(script);
//         return () => {
//             document.getElementById('omnidimension-web-widget')?.remove();
//         };
//     }, []);

//     // Setup camera + mic stream
//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(mediaStream => {
//             setStream(mediaStream);
//             if (videoRef.current) videoRef.current.srcObject = mediaStream;
//         }).catch(console.error);

//         return () => {
//             if (stream) stream.getTracks().forEach(track => track.stop());
//         };
//     }, []);

//     // Speak the current question when index changes
//     useEffect(() => {
//         if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
//             speak(questions[currentIndex]);
//             setHasSpokenCurrentQuestion(true);
//         }
//     }, [currentIndex, questions, hasSpokenCurrentQuestion]);

//     const speak = useCallback((text) => {
//         if (!text?.trim() || !synthRef.current) return;

//         // Clean up any previous utterance
//         if (utteranceRef.current) {
//             synthRef.current.cancel();
//         }

//         const utterance = new SpeechSynthesisUtterance(text.trim());
//         utteranceRef.current = utterance;

//         // Event handlers
//         const cleanUp = () => {
//             setIsSpeaking(false);
//             setCurrentAnimation("Idle");
//             utterance.onend = null;
//             utterance.onerror = null;
//         };

//         utterance.onstart = () => {
//             setIsSpeaking(true);
//             setCurrentAnimation("Talking");
//         };

//         utterance.onend = cleanUp;

//         utterance.onerror = (event) => {
//             // Ignore empty errors and interruptions
//             if (event.error && !['interrupted', ''].includes(event.error)) {
//                 console.warn('Speech error:', event.error);
//             }
//             cleanUp();
//         };

//         try {
//             // Browser-specific fixes
//             if (synthRef.current.speaking) {
//                 synthRef.current.cancel();
//                 setTimeout(() => synthRef.current.speak(utterance), 100);
//             } else {
//                 synthRef.current.speak(utterance);
//             }
//         } catch (error) {
//             console.error('Speech failed:', error);
//             cleanUp();
//         }
//     }, []);

//     // Setup speech recognition
//     useEffect(() => {
//         if (SpeechRecognitionClass) {
//             const recognition = new SpeechRecognitionClass();
//             recognition.lang = 'en-US';
//             recognition.continuous = true;
//             recognition.interimResults = true;

//             recognition.onstart = () => setIsListening(true);

//             recognition.onresult = event => {
//                 let final = '';
//                 for (let i = event.resultIndex; i < event.results.length; i++) {
//                     const transcript = event.results[i][0].transcript;
//                     if (event.results[i].isFinal) final += transcript + ' ';
//                 }

//                 if (final.trim()) {
//                     setUserAnswer(prev => (prev + ' ' + final).trim());
//                 }
//             };

//             recognition.onerror = event => {
//                 console.error('Speech Recognition error:', event.error);
//                 setIsListening(false);
//             };

//             recognition.onend = () => setIsListening(false);

//             recognitionRef.current = recognition;
//         }
//     }, []);

//     const startListening = () => {
//         setUserAnswer('');
//         recognitionRef.current?.start();
//     };

//     const stopListening = () => {
//         recognitionRef.current?.stop();
//     };

//     const handleAnswerSubmit = () => {
//         const q = questions[currentIndex];
//         const updatedQaPairs = [...qaPairs, { question: q, answer: userAnswer }];
//         stopListening();

//         if (currentIndex + 1 < questions.length) {
//             setQaPairs(updatedQaPairs);
//             setUserAnswer('');
//             setCurrentIndex(prev => prev + 1);
//             setHasSpokenCurrentQuestion(false); // Reset for next question
//         } else {
//             router.push(
//                 `/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}`
//               );
//         }
//     };

// "use client";

// import { useEffect, useRef, useState, useCallback } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import Avatar from '@/components/Avatar';
// import { motion } from 'framer-motion';

// export default function InterviewPlatform() {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const questions = JSON.parse(searchParams.get("questions") || "[]");
//     const interviewType = searchParams.get("interviewType") || "";

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [currentAnimation, setCurrentAnimation] = useState("Idle");
//     const [userAnswer, setUserAnswer] = useState("");
//     const [qaPairs, setQaPairs] = useState([]);
//     const [stream, setStream] = useState(null);
//     const [micOn, setMicOn] = useState(true);
//     const [videoOn, setVideoOn] = useState(true);
//     const [isListening, setIsListening] = useState(false);
//     const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);

//     const videoRef = useRef(null);
//     const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
//     const utteranceRef = useRef(null);

//     const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
//     const recognitionRef = useRef(null);

//     // Inject widget
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.id = 'omnidimension-web-widget';
//         script.async = true;
//         script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//         document.body.appendChild(script);
//         return () => {
//             document.getElementById('omnidimension-web-widget')?.remove();
//         };
//     }, []);

//     // Get user media
//     useEffect(() => {
//         const initMedia = async () => {
//             try {
//                 const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 setStream(mediaStream);
//                 if (videoRef.current) videoRef.current.srcObject = mediaStream;
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         initMedia();
//     }, []);

//     // Stop stream when component unmounts
//     useEffect(() => {
//         return () => {
//             stream?.getTracks().forEach(track => track.stop());
//         };
//     }, [stream]);

//     // Speak question
//     const speak = useCallback((text) => {
//         if (!text?.trim() || !synthRef.current) return;

//         if (utteranceRef.current) synthRef.current.cancel();

//         const utterance = new SpeechSynthesisUtterance(text.trim());
//         utteranceRef.current = utterance;

//         const cleanUp = () => {
//             setIsSpeaking(false);
//             setCurrentAnimation("Idle");
//             utterance.onend = null;
//             utterance.onerror = null;
//         };

//         utterance.onstart = () => {
//             setIsSpeaking(true);
//             setCurrentAnimation("Talking");
//         };
//         utterance.onend = cleanUp;
//         utterance.onerror = (event) => {
//             if (event.error && !['interrupted', ''].includes(event.error)) {
//                 console.warn('Speech error:', event.error);
//             }
//             cleanUp();
//         };

//         try {
//             if (synthRef.current.speaking) {
//                 synthRef.current.cancel();
//                 setTimeout(() => synthRef.current.speak(utterance), 100);
//             } else {
//                 synthRef.current.speak(utterance);
//             }
//         } catch (error) {
//             console.error('Speech failed:', error);
//             cleanUp();
//         }
//     }, []);

//     // Speak on question change
//     useEffect(() => {
//         if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
//             speak(questions[currentIndex]);
//             setHasSpokenCurrentQuestion(true);
//         }
//     }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

//     // Setup speech recognition
//     useEffect(() => {
//         if (!SpeechRecognitionClass) return;

//         const recognition = new SpeechRecognitionClass();
//         recognition.lang = 'en-US';
//         recognition.continuous = true;
//         recognition.interimResults = true;

//         recognition.onstart = () => setIsListening(true);
//         recognition.onresult = (event) => {
//             let final = '';
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) final += transcript + ' ';
//             }

//             if (final.trim()) {
//                 setUserAnswer(prev => (prev + ' ' + final).trim());
//             }
//         };
//         recognition.onerror = (event) => {
//             console.error('Speech Recognition error:', event.error);
//             setIsListening(false);
//         };
//         recognition.onend = () => setIsListening(false);

//         recognitionRef.current = recognition;
//     }, [SpeechRecognitionClass]);

//     const startListening = () => {
//         setUserAnswer('');
//         recognitionRef.current?.start();
//     };

//     const stopListening = () => {
//         recognitionRef.current?.stop();
//     };

//     const handleAnswerSubmit = () => {
//         const q = questions[currentIndex];
//         const updatedQaPairs = [...qaPairs, { question: q, answer: userAnswer }];
//         stopListening();

//         if (currentIndex + 1 < questions.length) {
//             setQaPairs(updatedQaPairs);
//             setUserAnswer('');
//             setCurrentIndex(prev => prev + 1);
//             setHasSpokenCurrentQuestion(false);
//         } else {
//             router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}`);
//         }
//     };


//     return (
//         <div className="w-full h-full">
//             <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
//                 {/* Header */}
//                 <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-blue-900/30 backdrop-blur-sm border-b border-blue-700/50">
//                     <div className="flex items-center">
//                         <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//                         </svg>
//                         <span className="text-lg font-semibold text-blue-100">AI Interview Platform</span>
//                     </div>
//                     <div className="bg-blue-700/50 px-4 py-2 rounded-full text-sm font-medium text-blue-100">
//                         {interviewType || 'Technical Interview'}
//                     </div>
//                     <div className="text-sm text-blue-300">
//                         Question {currentIndex + 1} of {questions.length}
//                     </div>
//                 </div>

//                 {/* Layout */}
//                 <div className="w-full h-full flex flex-col md:flex-row pt-16">
//                     {/* Left Panel (Video + Response) */}
//                     <motion.div
//                         className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col gap-4 overflow-hidden"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         {/* Video */}
//                         <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
//                             <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-600/30 bg-blue-900/20">
//                                 {videoOn ? (
//                                     <video
//                                         ref={videoRef}
//                                         autoPlay
//                                         muted
//                                         className="w-full aspect-video object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full aspect-video bg-blue-900/50 flex items-center justify-center">
//                                         <div className="text-center">
//                                             <svg className="w-12 h-12 mx-auto text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                                             </svg>
//                                             <p className="mt-2 text-blue-300">Camera is disabled</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="absolute top-4 right-4 flex gap-2">
//                                     <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                     <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                 </div>

//                                 {isListening && (
//                                     <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
//                                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                                         <span className="text-xs text-blue-100">Listening</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Response */}
//                         <div className="flex-none w-full max-w-xl mx-auto p-5 bg-blue-800/60 rounded-xl backdrop-blur-md border border-blue-700/50 shadow-lg">
//                             <h3 className="text-sm font-medium text-blue-300 mb-3">Your Response</h3>
//                             <textarea
//                                 rows={4}
//                                 placeholder={isListening ? "Speak now..." : "Type or speak your answer..."}
//                                 className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg p-4 mb-4 text-blue-100 placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                                 value={userAnswer}
//                                 onChange={(e) => setUserAnswer(e.target.value)}
//                             />

//                             <div className="flex flex-wrap justify-between gap-3">
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={startListening}
//                                         disabled={isListening}
//                                         className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${isListening ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700'}`}
//                                     >
//                                         🎙️ Speak
//                                     </button>
//                                     <button
//                                         onClick={stopListening}
//                                         disabled={!isListening}
//                                         className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${!isListening ? 'bg-blue-900/50' : 'bg-yellow-600 hover:bg-yellow-700'}`}
//                                     >
//                                         ⏹ Stop
//                                     </button>
//                                 </div>

//                                 <button
//                                     onClick={handleAnswerSubmit}
//                                     disabled={!userAnswer.trim()}
//                                     className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${!userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                                 >
//                                     {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Interview ✔'}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>

//                     {/* Right Panel: Avatar + Question */}
//                     <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-blue-800/20 border-t md:border-t-0 md:border-l border-blue-700/30">
//                         <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
//                             <ambientLight intensity={0.5} />
//                             <directionalLight position={[2, 5, 2]} intensity={1} />
//                             <Avatar isSpeaking={isSpeaking} animationName={currentAnimation} position={[0, -7, 0]} scale={4.5} />
//                             <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 2.5} />
//                         </Canvas>

//                         <motion.div
//                             className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent pt-16 pb-8 px-6"
//                             initial={{ y: 50, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.3, duration: 0.5 }}
//                         >
//                             <motion.div
//                                 className="max-w-2xl mx-auto bg-blue-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-blue-700/50"
//                                 whileHover={{ scale: 1.01 }}
//                             >
//                                 <div className="flex items-start">
//                                     <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
//                                         <span className="font-bold text-white">{currentIndex + 1}</span>
//                                     </div>
//                                     <div>
//                                         <h2 className="text-xl font-medium text-blue-100 mb-2">
//                                             {questions[currentIndex]}
//                                         </h2>
//                                         <div className="flex gap-2 mt-3">
//                                             <div className={`text-xs px-2 py-1 rounded-full ${isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'}`}>
//                                                 {isSpeaking ? 'AI is speaking...' : 'Waiting for your answer'}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// "use client";

// import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import Avatar from '@/components/Avatar';
// import { motion } from 'framer-motion';

// function InterviewContent() {
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     const questions = JSON.parse(searchParams.get("questions") || "[]");
//     const interviewType = searchParams.get("interviewType") || "";

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [currentAnimation, setCurrentAnimation] = useState("Idle");
//     const [userAnswer, setUserAnswer] = useState("");
//     const [qaPairs, setQaPairs] = useState([]);
//     const [stream, setStream] = useState(null);
//     const [micOn, setMicOn] = useState(true);
//     const [videoOn, setVideoOn] = useState(true);
//     const [isListening, setIsListening] = useState(false);
//     const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);

//     const videoRef = useRef(null);
//     const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
//     const utteranceRef = useRef(null);

//     const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
//     const recognitionRef = useRef(null);

//     // Inject widget
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.id = 'omnidimension-web-widget';
//         script.async = true;
//         script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//         document.body.appendChild(script);
//         return () => {
//             document.getElementById('omnidimension-web-widget')?.remove();
//         };
//     }, []);

//     // Get user media
//     useEffect(() => {
//         const initMedia = async () => {
//             try {
//                 const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 setStream(mediaStream);
//                 if (videoRef.current) videoRef.current.srcObject = mediaStream;
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         initMedia();
//     }, []);

//     // Stop stream when component unmounts
//     useEffect(() => {
//         return () => {
//             stream?.getTracks().forEach(track => track.stop());
//         };
//     }, [stream]);

//     // Speak question
//     const speak = useCallback((text) => {
//         if (!text?.trim() || !synthRef.current) return;

//         if (utteranceRef.current) synthRef.current.cancel();

//         const utterance = new SpeechSynthesisUtterance(text.trim());
//         utteranceRef.current = utterance;

//         const cleanUp = () => {
//             setIsSpeaking(false);
//             setCurrentAnimation("Idle");
//             utterance.onend = null;
//             utterance.onerror = null;
//         };

//         utterance.onstart = () => {
//             setIsSpeaking(true);
//             setCurrentAnimation("Talking");
//         };
//         utterance.onend = cleanUp;
//         utterance.onerror = (event) => {
//             if (event.error && !['interrupted', ''].includes(event.error)) {
//                 console.warn('Speech error:', event.error);
//             }
//             cleanUp();
//         };

//         try {
//             if (synthRef.current.speaking) {
//                 synthRef.current.cancel();
//                 setTimeout(() => synthRef.current.speak(utterance), 100);
//             } else {
//                 synthRef.current.speak(utterance);
//             }
//         } catch (error) {
//             console.error('Speech failed:', error);
//             cleanUp();
//         }
//     }, []);

//     // Speak on question change
//     useEffect(() => {
//         if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
//             speak(questions[currentIndex]);
//             setHasSpokenCurrentQuestion(true);
//         }
//     }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

//     // Setup speech recognition
//     useEffect(() => {
//         if (!SpeechRecognitionClass) return;

//         const recognition = new SpeechRecognitionClass();
//         recognition.lang = 'en-US';
//         recognition.continuous = true;
//         recognition.interimResults = true;

//         recognition.onstart = () => setIsListening(true);
//         recognition.onresult = (event) => {
//             let final = '';
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) final += transcript + ' ';
//             }

//             if (final.trim()) {
//                 setUserAnswer(prev => (prev + ' ' + final).trim());
//             }
//         };
//         recognition.onerror = (event) => {
//             console.error('Speech Recognition error:', event.error);
//             setIsListening(false);
//         };
//         recognition.onend = () => setIsListening(false);

//         recognitionRef.current = recognition;
//     }, [SpeechRecognitionClass]);

//     const startListening = () => {
//         setUserAnswer('');
//         recognitionRef.current?.start();
//     };

//     const stopListening = () => {
//         recognitionRef.current?.stop();
//     };

//     const handleAnswerSubmit = () => {
//         const q = questions[currentIndex];
//         const updatedQaPairs = [...qaPairs, { question: q, answer: userAnswer }];
//         stopListening();

//         if (currentIndex + 1 < questions.length) {
//             setQaPairs(updatedQaPairs);
//             setUserAnswer('');
//             setCurrentIndex(prev => prev + 1);
//             setHasSpokenCurrentQuestion(false);
//         } else {
//             router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}`);
//         }
//     };

//     return (
//         <div className="w-full h-full">
//             <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
//                 {/* Header */}
//                 <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-blue-900/30 backdrop-blur-sm border-b border-blue-700/50">
//                     <div className="flex items-center">
//                         <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//                         </svg>
//                         <span className="text-lg font-semibold text-blue-100">AI Interview Platform</span>
//                     </div>
//                     <div className="bg-blue-700/50 px-4 py-2 rounded-full text-sm font-medium text-blue-100">
//                         {interviewType || 'Technical Interview'}
//                     </div>
//                     <div className="text-sm text-blue-300">
//                         Question {currentIndex + 1} of {questions.length}
//                     </div>
//                 </div>

//                 {/* Layout */}
//                 <div className="w-full h-full flex flex-col md:flex-row pt-16">
//                     {/* Left Panel (Video + Response) */}
//                     <motion.div
//                         className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col gap-4 overflow-hidden"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         {/* Video */}
//                         <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
//                             <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-600/30 bg-blue-900/20">
//                                 {videoOn ? (
//                                     <video
//                                         ref={videoRef}
//                                         autoPlay
//                                         muted
//                                         className="w-full aspect-video object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full aspect-video bg-blue-900/50 flex items-center justify-center">
//                                         <div className="text-center">
//                                             <svg className="w-12 h-12 mx-auto text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                                             </svg>
//                                             <p className="mt-2 text-blue-300">Camera is disabled</p>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="absolute top-4 right-4 flex gap-2">
//                                     <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                     <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                 </div>

//                                 {isListening && (
//                                     <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
//                                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                                         <span className="text-xs text-blue-100">Listening</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Response */}
//                         <div className="flex-none w-full max-w-xl mx-auto p-5 bg-blue-800/60 rounded-xl backdrop-blur-md border border-blue-700/50 shadow-lg">
//                             <h3 className="text-sm font-medium text-blue-300 mb-3">Your Response</h3>
//                             <textarea
//                                 rows={4}
//                                 placeholder={isListening ? "Speak now..." : "Type or speak your answer..."}
//                                 className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg p-4 mb-4 text-blue-100 placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                                 value={userAnswer}
//                                 onChange={(e) => setUserAnswer(e.target.value)}
//                             />

//                             <div className="flex flex-wrap justify-between gap-3">
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={startListening}
//                                         disabled={isListening}
//                                         className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${isListening ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700'}`}
//                                     >
//                                         🎙️ Speak
//                                     </button>
//                                     <button
//                                         onClick={stopListening}
//                                         disabled={!isListening}
//                                         className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${!isListening ? 'bg-blue-900/50' : 'bg-yellow-600 hover:bg-yellow-700'}`}
//                                     >
//                                         ⏹ Stop
//                                     </button>
//                                 </div>

//                                 <button
//                                     onClick={handleAnswerSubmit}
//                                     disabled={!userAnswer.trim()}
//                                     className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${!userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                                 >
//                                     {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Interview ✔'}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>

//                     {/* Right Panel: Avatar + Question */}
//                     <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-blue-800/20 border-t md:border-t-0 md:border-l border-blue-700/30">
//                         <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
//                             <ambientLight intensity={0.5} />
//                             <directionalLight position={[2, 5, 2]} intensity={1} />
//                             <Avatar isSpeaking={isSpeaking} animationName={currentAnimation} position={[0, -7, 0]} scale={4.5} />
//                             <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 2.5} />
//                         </Canvas>

//                         <motion.div
//                             className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent pt-16 pb-8 px-6"
//                             initial={{ y: 50, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.3, duration: 0.5 }}
//                         >
//                             <motion.div
//                                 className="max-w-2xl mx-auto bg-blue-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-blue-700/50"
//                                 whileHover={{ scale: 1.01 }}
//                             >
//                                 <div className="flex items-start">
//                                     <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
//                                         <span className="font-bold text-white">{currentIndex + 1}</span>
//                                     </div>
//                                     <div>
//                                         <h2 className="text-xl font-medium text-blue-100 mb-2">
//                                             {questions[currentIndex]}
//                                         </h2>
//                                         <div className="flex gap-2 mt-3">
//                                             <div className={`text-xs px-2 py-1 rounded-full ${isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'}`}>
//                                                 {isSpeaking ? 'AI is speaking...' : 'Waiting for your answer'}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function InterviewPlatform() {
//     return (
//         <Suspense fallback={
//             <div className="w-screen h-screen flex items-center justify-center bg-blue-900 text-white">
//                 <div className="text-center">
//                     <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="mt-4 text-blue-200">Loading interview...</p>
//                 </div>
//             </div>
//         }>
//             <InterviewContent />
//         </Suspense>
//     );
// }


"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Avatar from '@/components/Avatar';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900/20 text-red-200">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium">3D Avatar Error</h3>
          <p className="mt-2">The interview avatar failed to load.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const questions = JSON.parse(searchParams.get("questions") || "[]");
  const interviewType = searchParams.get("interviewType") || "";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [qaPairs, setQaPairs] = useState([]);
  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);

  const videoRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognitionRef = useRef(null);

  // Check WebGL support
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.WebGLRenderingContext) {
      alert('Your browser does not support WebGL. Please use a modern browser.');
      router.push('/interview-platform/choosetype');
    }
  }, [router]);

  // Inject widget
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'omnidimension-web-widget';
    script.async = true;
    script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
    document.body.appendChild(script);
    return () => {
      document.getElementById('omnidimension-web-widget')?.remove();
    };
  }, []);

  // Get user media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error(err);
      }
    };
    initMedia();
  }, []);

  // Stop stream when component unmounts
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  // Speak question
  const speak = useCallback((text) => {
    if (!text?.trim() || !synthRef.current) return;

    if (utteranceRef.current) synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utteranceRef.current = utterance;

    const cleanUp = () => {
      setIsSpeaking(false);
      utterance.onend = null;
      utterance.onerror = null;
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = cleanUp;
    utterance.onerror = (event) => {
      if (event.error && !['interrupted', ''].includes(event.error)) {
        console.warn('Speech error:', event.error);
      }
      cleanUp();
    };

    try {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
        setTimeout(() => synthRef.current.speak(utterance), 100);
      } else {
        synthRef.current.speak(utterance);
      }
    } catch (error) {
      console.error('Speech failed:', error);
      cleanUp();
    }
  }, []);

  // Speak on question change
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
      speak(questions[currentIndex]);
      setHasSpokenCurrentQuestion(true);
    }
  }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

  // Setup speech recognition
  useEffect(() => {
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + ' ';
      }

      if (final.trim()) {
        setUserAnswer(prev => (prev + ' ' + final).trim());
      }
    };
    recognition.onerror = (event) => {
      console.error('Speech Recognition error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [SpeechRecognitionClass]);

  const startListening = () => {
    setUserAnswer('');
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const handleAnswerSubmit = () => {
    const q = questions[currentIndex];
    const updatedQaPairs = [...qaPairs, { question: q, answer: userAnswer }];
    stopListening();

    if (currentIndex + 1 < questions.length) {
      setQaPairs(updatedQaPairs);
      setUserAnswer('');
      setCurrentIndex(prev => prev + 1);
      setHasSpokenCurrentQuestion(false);
    } else {
      router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}`);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-blue-900/30 backdrop-blur-sm border-b border-blue-700/50">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="text-lg font-semibold text-blue-100">AI Interview Platform</span>
          </div>
          <div className="bg-blue-700/50 px-4 py-2 rounded-full text-sm font-medium text-blue-100">
            {interviewType || 'Technical Interview'}
          </div>
          <div className="text-sm text-blue-300">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Layout */}
        <div className="w-full h-full flex flex-col md:flex-row pt-16">
          {/* Left Panel (Video + Response) */}
          <motion.div
            className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col gap-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Video */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
              <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-600/30 bg-blue-900/20">
                {videoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-blue-900/50 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-blue-300">Camera is disabled</p>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>

                {isListening && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100">Listening</span>
                  </div>
                )}
              </div>
            </div>

            {/* Response */}
            <div className="flex-none w-full max-w-xl mx-auto p-5 bg-blue-800/60 rounded-xl backdrop-blur-md border border-blue-700/50 shadow-lg">
              <h3 className="text-sm font-medium text-blue-300 mb-3">Your Response</h3>
              <textarea
                rows={4}
                placeholder={isListening ? "Speak now..." : "Type or speak your answer..."}
                className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg p-4 mb-4 text-blue-100 placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />

              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${isListening ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    🎙️ Speak
                  </button>
                  <button
                    onClick={stopListening}
                    disabled={!isListening}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${!isListening ? 'bg-blue-900/50' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                  >
                    ⏹ Stop
                  </button>
                </div>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${!userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Interview ✔'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Avatar + Question */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-blue-800/20 border-t md:border-t-0 md:border-l border-blue-700/30">
            <ErrorBoundary>
              <Canvas 
                camera={{ position: [0, 1.5, 3], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                style={{ position: 'absolute', top: 0, left: 0 }}
                onCreated={({ gl }) => {
                  gl.setClearColor('#0f172a', 1);
                }}
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 5, 2]} intensity={1} />
                <Suspense fallback={null}>
                  <Avatar 
                    isSpeaking={isSpeaking} 
                    position={[0, -7, 0]} 
                    scale={4.5} 
                  />
                </Suspense>
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  maxPolarAngle={Math.PI / 2.2} 
                  minPolarAngle={Math.PI / 2.5} 
                />
              </Canvas>
            </ErrorBoundary>

            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent pt-16 pb-8 px-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="max-w-2xl mx-auto bg-blue-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-blue-700/50"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                    <span className="font-bold text-white">{currentIndex + 1}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-blue-100 mb-2">
                      {questions[currentIndex]}
                    </h2>
                    <div className="flex gap-2 mt-3">
                      <div className={`text-xs px-2 py-1 rounded-full ${isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'}`}>
                        {isSpeaking ? 'AI is speaking...' : 'Waiting for your answer'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewPlatform() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center bg-blue-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-blue-200">Preparing 3D Interview Environment</p>
          <p className="text-sm text-blue-300 mt-2">This may take a few moments...</p>
          <div className="w-full max-w-xs mx-auto mt-4 bg-blue-900/30 rounded-full h-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}