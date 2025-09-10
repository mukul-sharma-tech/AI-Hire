// "use client";

// import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { motion } from 'framer-motion';
// import Avatar from '@/components/Avatar';

// function ErrorBoundary({ children }) {
//   const [hasError, setHasError] = useState(false);

//   if (hasError) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-red-900/20 text-red-200">
//         <div className="text-center p-4">
//           <h3 className="text-lg font-medium">3D Avatar Error</h3>
//           <p className="mt-2">The interview avatar failed to load.</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
//           >
//             Reload
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// }

// function InterviewContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const level = searchParams.get("level") || "";
//   const questions = JSON.parse(searchParams.get("questions") || "[]");
//   const interviewType = searchParams.get("interviewType") || "";

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [qaPairs, setQaPairs] = useState([]);
//   const [stream, setStream] = useState(null);
//   const [micOn, setMicOn] = useState(true);
//   const [videoOn, setVideoOn] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);
//   const [autoMicEnabled, setAutoMicEnabled] = useState(true);
//   const [shouldStartListening, setShouldStartListening] = useState(false);

//   const videoRef = useRef(null);
//   const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
//   const utteranceRef = useRef(null);

//   const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
//   const recognitionRef = useRef(null);

//   // Check WebGL support
//   useEffect(() => {
//     if (typeof window !== 'undefined' && !window.WebGLRenderingContext) {
//       alert('Your browser does not support WebGL. Please use a modern browser.');
//       router.push('/interview-platform/choosetype');
//     }
//   }, [router]);

//   // Inject widget
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.id = 'omnidimension-web-widget';
//     script.async = true;
//     script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//     document.body.appendChild(script);
//     return () => {
//       document.getElementById('omnidimension-web-widget')?.remove();
//     };
//   }, []);

//   // Get user media
//   useEffect(() => {
//     const initMedia = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(mediaStream);
//         if (videoRef.current) videoRef.current.srcObject = mediaStream;
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     initMedia();
//   }, []);

//   // Stop stream when component unmounts
//   useEffect(() => {
//     return () => {
//       stream?.getTracks().forEach(track => track.stop());
//     };
//   }, [stream]);

//   // Speak question with automatic mic control
//   const speak = useCallback((text) => {
//     if (!text?.trim() || !synthRef.current) return;

//     // Turn off mic when interviewer starts speaking
//     if (isListening) {
//       stopListening();
//     }
    
//     if (utteranceRef.current) synthRef.current.cancel();

//     const utterance = new SpeechSynthesisUtterance(text.trim());
//     utteranceRef.current = utterance;

//     const cleanUp = () => {
//       setIsSpeaking(false);
//       utterance.onend = null;
//       utterance.onerror = null;
      
//       // Auto-enable mic when interviewer finishes speaking
//       if (autoMicEnabled) {
//         setShouldStartListening(true);
//       }
//     };

//     utterance.onstart = () => {
//       setIsSpeaking(true);
//       // Ensure mic is off when interviewer speaks
//       stopListening();
//     };
    
//     utterance.onend = cleanUp;
//     utterance.onerror = (event) => {
//       if (event.error && !['interrupted', ''].includes(event.error)) {
//         console.warn('Speech error:', event.error);
//       }
//       cleanUp();
//     };

//     try {
//       if (synthRef.current.speaking) {
//         synthRef.current.cancel();
//         setTimeout(() => synthRef.current.speak(utterance), 100);
//       } else {
//         synthRef.current.speak(utterance);
//       }
//     } catch (error) {
//       console.error('Speech failed:', error);
//       cleanUp();
//     }
//   }, [autoMicEnabled, isListening]);

//   // Handle automatic mic activation
//   useEffect(() => {
//     if (shouldStartListening && !isSpeaking && !isListening && autoMicEnabled) {
//       startListening();
//       setShouldStartListening(false);
//     }
//   }, [shouldStartListening, isSpeaking, isListening, autoMicEnabled]);

//   // Speak on question change
//   useEffect(() => {
//     if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
//       speak(questions[currentIndex]);
//       setHasSpokenCurrentQuestion(true);
//     }
//   }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

//   // Setup speech recognition
//   useEffect(() => {
//     if (!SpeechRecognitionClass) return;

//     const recognition = new SpeechRecognitionClass();
//     recognition.lang = 'en-US';
//     recognition.continuous = true;
//     recognition.interimResults = true;

//     recognition.onstart = () => {
//       setIsListening(true);
//       setMicOn(true);
//     };
    
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) final += transcript + ' ';
//       }

//       if (final.trim()) {
//         setUserAnswer(prev => (prev + ' ' + final).trim());
//       }
//     };
    
//     recognition.onerror = (event) => {
//       console.error('Speech Recognition error:', event.error);
//       setIsListening(false);
//       setMicOn(false);
//     };
    
//     recognition.onend = () => {
//       setIsListening(false);
//       if (!autoMicEnabled) setMicOn(false);
//     };

//     recognitionRef.current = recognition;
//   }, [SpeechRecognitionClass, autoMicEnabled]);

//   const startListening = () => {
//     setUserAnswer('');
//     try {
//       recognitionRef.current?.start();
//     } catch (error) {
//       console.error('Failed to start recognition:', error);
//     }
//   };

//   const stopListening = () => {
//     try {
//       recognitionRef.current?.stop();
//     } catch (error) {
//       console.error('Failed to stop recognition:', error);
//     }
//   };

//   const handleAnswerSubmit = () => {
//     // Turn off mic when submitting answer
//     stopListening();
    
//     const q = questions[currentIndex];
//     const updatedQaPairs = [...qaPairs, { question: q, answer: userAnswer }];

//     if (currentIndex + 1 < questions.length) {
//       setQaPairs(updatedQaPairs);
//       setUserAnswer('');
//       setCurrentIndex(prev => prev + 1);
//       setHasSpokenCurrentQuestion(false);
      
//       // Mic will be automatically enabled when next question finishes speaking
//     } else {
//       // For final submission, keep mic off
//       setAutoMicEnabled(false);
//       // router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}`);
//       router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}&level=${level}`);
//     }
//   };

//   const toggleMicMode = () => {
//     setAutoMicEnabled(!autoMicEnabled);
//     if (!autoMicEnabled && !isSpeaking) {
//       startListening();
//     } else if (!autoMicEnabled) {
//       stopListening();
//     }
//   };

//   return (
//     <div className="w-full h-full">
//       <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
//         {/* Header */}
//         <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-blue-900/30 backdrop-blur-sm border-b border-blue-700/50">
//           <div className="flex items-center">
//             <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//             </svg>
//             <span className="text-lg font-semibold text-blue-100">AI Interview Platform</span>
//           </div>
//           <div className="bg-blue-700/50 px-4 py-2 rounded-full text-sm font-medium text-blue-100">
//             {interviewType || 'Technical Interview'}
//           </div>
//           <div className="text-sm text-blue-300">
//             Question {currentIndex + 1} of {questions.length}
//           </div>
//         </div>

//         {/* Layout */}
//         <div className="w-full h-full flex flex-col md:flex-row pt-16">
//           {/* Left Panel (Video + Response) */}
//           <motion.div
//             className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col gap-4 overflow-hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Video */}
//             <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
//               <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-600/30 bg-blue-900/20">
//                 {videoOn ? (
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     className="w-full aspect-video object-cover"
//                   />
//                 ) : (
//                   <div className="w-full aspect-video bg-blue-900/50 flex items-center justify-center">
//                     <div className="text-center">
//                       <svg className="w-12 h-12 mx-auto text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                       </svg>
//                       <p className="mt-2 text-blue-300">Camera is disabled</p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="absolute top-4 right-4 flex gap-2">
//                   <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                   <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 </div>

//                 {isListening && (
//                   <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
//                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                     <span className="text-xs text-blue-100">
//                       {autoMicEnabled ? 'Auto Listening' : 'Manual Listening'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Response */}
//             <div className="flex-none w-full max-w-xl mx-auto p-5 bg-blue-800/60 rounded-xl backdrop-blur-md border border-blue-700/50 shadow-lg">
//               <h3 className="text-sm font-medium text-blue-300 mb-3">Your Response</h3>
//               <textarea
//                 rows={4}
//                 placeholder={isListening ? "Speak now..." : "Type or speak your answer..."}
//                 className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg p-4 mb-4 text-blue-100 placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                 value={userAnswer}
//                 onChange={(e) => setUserAnswer(e.target.value)}
//               />

//               <div className="flex flex-wrap justify-between gap-3">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={toggleMicMode}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
//                       autoMicEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-900/50'
//                     }`}
//                   >
//                     {autoMicEnabled ? '🎙️ Auto Mic ON' : '🎙️ Auto Mic OFF'}
//                   </button>
//                   {/* <button
//                     onClick={startListening}
//                     disabled={isListening || autoMicEnabled}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
//                       isListening || autoMicEnabled ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700'
//                     }`}
//                   >
//                     🎤 Start
//                   </button>
//                   <button
//                     onClick={stopListening}
//                     disabled={!isListening || autoMicEnabled}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
//                       !isListening || autoMicEnabled ? 'bg-blue-900/50' : 'bg-yellow-600 hover:bg-yellow-700'
//                     }`}
//                   >
//                     ⏹ Stop
//                   </button> */}
//                 </div>

//                 <button
//                   onClick={handleAnswerSubmit}
//                   disabled={!userAnswer.trim()}
//                   className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${
//                     !userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                   }`}
//                 >
//                   {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Interview ✔'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Panel: Avatar + Question */}
//           <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-blue-800/20 border-t md:border-t-0 md:border-l border-blue-700/30">
//             <ErrorBoundary>
//               <Canvas 
//                 camera={{ position: [0, 1.5, 3], fov: 50 }}
//                 gl={{ antialias: true, alpha: true }}
//                 dpr={[1, 2]}
//                 style={{ position: 'absolute', top: 0, left: 0 }}
//                 onCreated={({ gl }) => {
//                   gl.setClearColor('#0f172a', 1);
//                 }}
//               >
//                 <ambientLight intensity={0.5} />
//                 <directionalLight position={[2, 5, 2]} intensity={1} />
//                 <Suspense fallback={null}>
//                   <Avatar 
//                     isSpeaking={isSpeaking} 
//                     position={[0, -7, 0]} 
//                     scale={4.5} 
//                   />
//                 </Suspense>
//                 <OrbitControls 
//                   enableZoom={false} 
//                   enablePan={false} 
//                   maxPolarAngle={Math.PI / 2.2} 
//                   minPolarAngle={Math.PI / 2.5} 
//                 />
//               </Canvas>
//             </ErrorBoundary>

//             <motion.div
//               className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent pt-16 pb-8 px-6"
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//             >
//               <motion.div
//                 className="max-w-2xl mx-auto bg-blue-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-blue-700/50"
//                 whileHover={{ scale: 1.01 }}
//               >
//                 <div className="flex items-start">
//                   <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
//                     <span className="font-bold text-white">{currentIndex + 1}</span>
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-medium text-blue-100 mb-2">
//                       {questions[currentIndex]}
//                     </h2>
//                     <div className="flex gap-2 mt-3">
//                       <div className={`text-xs px-2 py-1 rounded-full ${
//                         isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'
//                       }`}>
//                         {isSpeaking ? 'AI is speaking...' : 'Waiting for your answer'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function InterviewPlatform() {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(timer);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <Suspense fallback={
//       <div className="w-screen h-screen flex items-center justify-center bg-blue-900 text-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-blue-200">Preparing 3D Interview Environment</p>
//           <p className="text-sm text-blue-300 mt-2">This may take a few moments...</p>
//           <div className="w-full max-w-xs mx-auto mt-4 bg-blue-900/30 rounded-full h-2">
//             <div 
//               className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     }>
//       <InterviewContent />
//     </Suspense>
//   );
// }


// "use client";

// import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { motion } from 'framer-motion';
// import Avatar from '@/components/Avatar';

// function ErrorBoundary({ children }) {
//   const [hasError, setHasError] = useState(false);

//   if (hasError) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-red-900/20 text-red-200">
//         <div className="text-center p-4">
//           <h3 className="text-lg font-medium">3D Avatar Error</h3>
//           <p className="mt-2">The interview avatar failed to load.</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
//           >
//             Reload
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// }

// function InterviewContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const level = searchParams.get("level") || "";
//   const questions = JSON.parse(searchParams.get("questions") || "[]");
//   const interviewType = searchParams.get("interviewType") || "";

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [qaPairs, setQaPairs] = useState([]);
//   const [stream, setStream] = useState(null);
//   const [micOn, setMicOn] = useState(true);
//   const [videoOn, setVideoOn] = useState(true);
//   const [isListening, setIsListening] = useState(false);
//   const [hasSpokenCurrentQuestion, setHasSpokenCurrentQuestion] = useState(false);
//   const [autoMicEnabled, setAutoMicEnabled] = useState(true);
//   const [shouldStartListening, setShouldStartListening] = useState(false);

//   // --- Start: New State and Refs for Behavior Analysis ---
//   const [behaviorMetrics, setBehaviorMetrics] = useState({
//     blinkCount: 0,
//     emotion: 'neutral',
//     nervousnessScore: 0,
//     eyeContactScore: 100,
//     feedback: '',
//     gazeDirection: 'Center',
//     lipBiting: false,
//     handOnFace: false,
//     shrugging: false,
//     fidgeting: false,
//   });
//   const [analysisActive, setAnalysisActive] = useState(false);
//   const analysisInterval = useRef(null);
//   const behaviorHistory = useRef([]);
//   // --- End: New State and Refs ---

//   const videoRef = useRef(null);
//   const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
//   const utteranceRef = useRef(null);

//   const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined' && !window.WebGLRenderingContext) {
//       alert('Your browser does not support WebGL. Please use a modern browser.');
//       router.push('/interview-platform/choosetype');
//     }
//   }, [router]);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.id = 'omnidimension-web-widget';
//     script.async = true;
//     script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//     document.body.appendChild(script);
//     return () => {
//       document.getElementById('omnidimension-web-widget')?.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const initMedia = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setStream(mediaStream);
//         if (videoRef.current) videoRef.current.srcObject = mediaStream;
//       } catch (err) {
//         console.error("Error accessing media devices:", err);
//       }
//     };
//     initMedia();
//   }, []);

//   useEffect(() => {
//     return () => {
//       stream?.getTracks().forEach(track => track.stop());
//       stopBehaviorAnalysis(); // Stop analysis on component unmount
//     };
//   }, [stream]);

//   // --- Start: New Behavior Analysis Functions ---
//   const captureFrame = () => {
//     if (!videoRef.current || videoRef.current.readyState < 3) return null;

//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//     return canvas.toDataURL('image/jpeg', 0.7);
//   };

//   const startBehaviorAnalysis = () => {
//     if (analysisInterval.current) return;

//     analysisInterval.current = setInterval(async () => {
//       const frame = captureFrame();
//       if (!frame) return;

//       try {
//         const response = await fetch('https://emotion-s2l4.onrender.com/analyze', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ frame })
//         });

//         if (!response.ok) throw new Error(`Analysis API failed: ${response.statusText}`);
        
//         const data = await response.json();

//         setBehaviorMetrics(prev => ({
//           blinkCount: prev.blinkCount + (data.blink_count || 0),
//           emotion: data.emotion?.toLowerCase() || prev.emotion,
//           nervousnessScore: Math.max(prev.nervousnessScore, data.nervousness_score || 0),
//           eyeContactScore: data.eye_contact_score !== undefined ? data.eye_contact_score : prev.eyeContactScore,
//           feedback: data.feedback || prev.feedback,
//           gazeDirection: data.gaze_direction || prev.gazeDirection,
//           lipBiting: data.lip_biting || false,
//           handOnFace: data.hand_on_face || false,
//           shrugging: data.shrugging || false,
//           fidgeting: data.fidgeting || false,
//         }));

//         behaviorHistory.current.push({
//           timestamp: new Date().toISOString(),
//           metrics: data
//         });
//       } catch (error) {
//         console.error('Analysis error:', error);
//       }
//     }, 3000); // Analyze every 3 seconds
//   };

//   const stopBehaviorAnalysis = () => {
//     if (analysisInterval.current) {
//       clearInterval(analysisInterval.current);
//       analysisInterval.current = null;
//     }
//   };

//   // --- End: New Behavior Analysis Functions ---

//   // --- Start: New useEffect to control analysis ---
//   useEffect(() => {
//     if (videoOn && stream) {
//       startBehaviorAnalysis();
//       setAnalysisActive(true);
//     } else {
//       stopBehaviorAnalysis();
//       setAnalysisActive(false);
//     }
//   }, [videoOn, stream]);
//   // --- End: New useEffect ---

//   const speak = useCallback((text) => {
//     if (!text?.trim() || !synthRef.current) return;
//     if (isListening) stopListening();
//     if (utteranceRef.current) synthRef.current.cancel();

//     const utterance = new SpeechSynthesisUtterance(text.trim());
//     utteranceRef.current = utterance;

//     const cleanUp = () => {
//       setIsSpeaking(false);
//       utterance.onend = null;
//       utterance.onerror = null;
//       if (autoMicEnabled) setShouldStartListening(true);
//     };

//     utterance.onstart = () => {
//       setIsSpeaking(true);
//       stopListening();
//     };
//     utterance.onend = cleanUp;
//     utterance.onerror = (event) => {
//       if (event.error && !['interrupted', ''].includes(event.error)) console.warn('Speech error:', event.error);
//       cleanUp();
//     };

//     try {
//       if (synthRef.current.speaking) {
//         synthRef.current.cancel();
//         setTimeout(() => synthRef.current.speak(utterance), 100);
//       } else {
//         synthRef.current.speak(utterance);
//       }
//     } catch (error) {
//       console.error('Speech failed:', error);
//       cleanUp();
//     }
//   }, [autoMicEnabled, isListening]);

//   useEffect(() => {
//     if (shouldStartListening && !isSpeaking && !isListening && autoMicEnabled) {
//       startListening();
//       setShouldStartListening(false);
//     }
//   }, [shouldStartListening, isSpeaking, isListening, autoMicEnabled]);

//   useEffect(() => {
//     if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
//       speak(questions[currentIndex]);
//       setHasSpokenCurrentQuestion(true);
//     }
//   }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

//   useEffect(() => {
//     if (!SpeechRecognitionClass) return;
//     const recognition = new SpeechRecognitionClass();
//     recognition.lang = 'en-US';
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.onstart = () => { setIsListening(true); setMicOn(true); };
//     recognition.onresult = (event) => {
//       let final = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) final += transcript + ' ';
//       }
//       if (final.trim()) setUserAnswer(prev => (prev + ' ' + final).trim());
//     };
//     recognition.onerror = (event) => { console.error('Speech Recognition error:', event.error); setIsListening(false); setMicOn(false); };
//     recognition.onend = () => { setIsListening(false); if (!autoMicEnabled) setMicOn(false); };
//     recognitionRef.current = recognition;
//   }, [SpeechRecognitionClass, autoMicEnabled]);

//   const startListening = () => {
//     setUserAnswer('');
//     try { recognitionRef.current?.start(); } catch (error) { console.error('Failed to start recognition:', error); }
//   };

//   const stopListening = () => {
//     try { recognitionRef.current?.stop(); } catch (error) { console.error('Failed to stop recognition:', error); }
//   };

//   // --- Start: Modified handleAnswerSubmit ---
//   const handleAnswerSubmit = () => {
//     stopListening();
    
//     const q = questions[currentIndex];
//     const updatedQaPairs = [...qaPairs, { 
//       question: q, 
//       answer: userAnswer,
//       behaviorMetrics: {
//         ...behaviorMetrics,
//         behaviorHistory: [...behaviorHistory.current],
//         timestamp: new Date().toISOString()
//       }
//     }];

//     behaviorHistory.current = [];
//     setBehaviorMetrics({
//       blinkCount: 0,
//       emotion: 'neutral',
//       nervousnessScore: 0,
//       eyeContactScore: 100,
//       feedback: '',
//       gazeDirection: 'Center',
//       lipBiting: false,
//       handOnFace: false,
//       shrugging: false,
//       fidgeting: false,
//     });

//     if (currentIndex + 1 < questions.length) {
//       setQaPairs(updatedQaPairs);
//       setUserAnswer('');
//       setCurrentIndex(prev => prev + 1);
//       setHasSpokenCurrentQuestion(false);
//     } else {
//       stopBehaviorAnalysis();
//       setAutoMicEnabled(false);
//       router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}&level=${level}`);
//     }
//   };
//   // --- End: Modified handleAnswerSubmit ---

//   const toggleMicMode = () => {
//     setAutoMicEnabled(!autoMicEnabled);
//     if (!autoMicEnabled && !isSpeaking) startListening();
//     else if (!autoMicEnabled) stopListening();
//   };

//   return (
//     <div className="w-full h-full">
//       <div className="w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
//         {/* Header */}
//         <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-blue-900/30 backdrop-blur-sm border-b border-blue-700/50">
//           <div className="flex items-center">
//             <svg className="w-6 h-6 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//             </svg>
//             <span className="text-lg font-semibold text-blue-100">AI Interview Platform</span>
//           </div>
//           <div className="bg-blue-700/50 px-4 py-2 rounded-full text-sm font-medium text-blue-100">
//             {interviewType || 'Technical Interview'}
//           </div>
//           <div className="text-sm text-blue-300">
//             Question {currentIndex + 1} of {questions.length}
//           </div>
//         </div>

//         {/* --- Start: New Behavior Analysis UI Panel --- */}
//         {analysisActive && (
//           <motion.div
//             className="absolute top-20 right-4 z-20 bg-blue-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-700/50 w-64"
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h3 className="text-sm font-semibold text-blue-200 mb-2">Behavior Analysis</h3>
//             <div className="space-y-2 text-xs">
//               <div className="flex justify-between">
//                 <span className="text-blue-300">Emotion:</span>
//                 <span className="font-medium capitalize">{behaviorMetrics.emotion}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-blue-300">Blinks:</span>
//                 <span>{behaviorMetrics.blinkCount}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-blue-300">Eye Contact:</span>
//                 <span>{behaviorMetrics.eyeContactScore}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-blue-300">Confidence:</span>
//                 <span>{100 - behaviorMetrics.nervousnessScore}%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-blue-300">Gaze:</span>
//                 <span>{behaviorMetrics.gazeDirection}</span>
//               </div>
//               <div className="flex justify-between">
//                   <span className="text-blue-300">Lip Biting:</span>
//                   <span className={behaviorMetrics.lipBiting ? 'text-yellow-400 font-semibold' : ''}>
//                     {behaviorMetrics.lipBiting ? 'Detected' : 'No'}
//                   </span>
//               </div>
//               <div className="flex justify-between">
//                   <span className="text-blue-300">Hand on Face:</span>
//                   <span className={behaviorMetrics.handOnFace ? 'text-yellow-400 font-semibold' : ''}>
//                     {behaviorMetrics.handOnFace ? 'Detected' : 'No'}
//                   </span>
//               </div>
//               <div className="flex justify-between">
//                   <span className="text-blue-300">Shrugging:</span>
//                   <span className={behaviorMetrics.shrugging ? 'text-yellow-400 font-semibold' : ''}>
//                     {behaviorMetrics.shrugging ? 'Detected' : 'No'}
//                   </span>
//               </div>
//               {behaviorMetrics.feedback && (
//                 <div className="mt-2 pt-2 border-t border-blue-700/50 text-blue-100 text-xs">
//                   {behaviorMetrics.feedback}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//         {/* --- End: New Behavior Analysis UI Panel --- */}


//         {/* Layout */}
//         <div className="w-full h-full flex flex-col md:flex-row pt-16">
//           {/* Left Panel (Video + Response) */}
//           <motion.div
//             className="w-full md:w-1/2 h-1/2 md:h-full p-4 flex flex-col gap-4 overflow-hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Video */}
//             <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
//               <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-600/30 bg-blue-900/20">
//                 {videoOn ? (
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     className="w-full aspect-video object-cover"
//                   />
//                 ) : (
//                   <div className="w-full aspect-video bg-blue-900/50 flex items-center justify-center">
//                     <div className="text-center">
//                       <svg className="w-12 h-12 mx-auto text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                       </svg>
//                       <p className="mt-2 text-blue-300">Camera is disabled</p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="absolute top-4 right-4 flex gap-2">
//                   <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`} title={micOn ? 'Microphone On' : 'Microphone Off'}></div>
//                   <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`} title={videoOn ? 'Camera On' : 'Camera Off'}></div>
//                   {/* --- Start: New Status Indicator --- */}
//                   <div className={`w-3 h-3 rounded-full ${analysisActive ? 'bg-purple-500' : 'bg-gray-500'}`} title={analysisActive ? 'Analysis active' : 'Analysis inactive'}></div>
//                   {/* --- End: New Status Indicator --- */}
//                 </div>

//                 {isListening && (
//                   <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
//                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                     <span className="text-xs text-blue-100">
//                       {autoMicEnabled ? 'Auto Listening' : 'Manual Listening'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Response */}
//             <div className="flex-none w-full max-w-xl mx-auto p-5 bg-blue-800/60 rounded-xl backdrop-blur-md border border-blue-700/50 shadow-lg">
//               <h3 className="text-sm font-medium text-blue-300 mb-3">Your Response</h3>
//               <textarea
//                 rows={4}
//                 placeholder={isListening ? "Speak now..." : "Type or speak your answer..."}
//                 className="w-full bg-blue-900/50 border border-blue-700/50 rounded-lg p-4 mb-4 text-blue-100 placeholder-blue-300/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                 value={userAnswer}
//                 onChange={(e) => setUserAnswer(e.target.value)}
//               />

//               <div className="flex flex-wrap justify-between gap-3">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={toggleMicMode}
//                     className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
//                       autoMicEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-900/50'
//                     }`}
//                   >
//                     {autoMicEnabled ? '🎙️ Auto Mic ON' : '🎙️ Auto Mic OFF'}
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleAnswerSubmit}
//                   disabled={!userAnswer.trim()}
//                   className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${
//                     !userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                   }`}
//                 >
//                   {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Interview ✔'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Panel: Avatar + Question */}
//           <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-blue-800/20 border-t md:border-t-0 md:border-l border-blue-700/30">
//             <ErrorBoundary>
//               <Canvas
//                 camera={{ position: [0, 1.5, 3], fov: 50 }}
//                 gl={{ antialias: true, alpha: true }}
//                 dpr={[1, 2]}
//                 style={{ position: 'absolute', top: 0, left: 0 }}
//                 onCreated={({ gl }) => {
//                   gl.setClearColor('#0f172a', 1);
//                 }}
//               >
//                 <ambientLight intensity={0.5} />
//                 <directionalLight position={[2, 5, 2]} intensity={1} />
//                 <Suspense fallback={null}>
//                   <Avatar
//                     isSpeaking={isSpeaking}
//                     position={[0, -7, 0]}
//                     scale={4.5}
//                   />
//                 </Suspense>
//                 <OrbitControls
//                   enableZoom={false}
//                   enablePan={false}
//                   maxPolarAngle={Math.PI / 2.2}
//                   minPolarAngle={Math.PI / 2.5}
//                 />
//               </Canvas>
//             </ErrorBoundary>

//             <motion.div
//               className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent pt-16 pb-8 px-6"
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//             >
//               <motion.div
//                 className="max-w-2xl mx-auto bg-blue-800/70 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-blue-700/50"
//                 whileHover={{ scale: 1.01 }}
//               >
//                 <div className="flex items-start">
//                   <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
//                     <span className="font-bold text-white">{currentIndex + 1}</span>
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-medium text-blue-100 mb-2">
//                       {questions[currentIndex]}
//                     </h2>
//                     <div className="flex gap-2 mt-3">
//                       <div className={`text-xs px-2 py-1 rounded-full ${
//                         isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'
//                       }`}>
//                         {isSpeaking ? 'AI is speaking...' : 'Waiting for your answer'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function InterviewPlatform() {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) {
//           clearInterval(timer);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 300);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <Suspense fallback={
//       <div className="w-screen h-screen flex items-center justify-center bg-blue-900 text-white">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-xl text-blue-200">Preparing 3D Interview Environment</p>
//           <p className="text-sm text-blue-300 mt-2">This may take a few moments...</p>
//           <div className="w-full max-w-xs mx-auto mt-4 bg-blue-900/30 rounded-full h-2">
//             <div
//               className="bg-blue-400 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     }>
//       <InterviewContent />
//     </Suspense>
//   );
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

  const level = searchParams.get("level") || "";
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
  const [autoMicEnabled, setAutoMicEnabled] = useState(true);
  const [shouldStartListening, setShouldStartListening] = useState(false);
const [recognitionActive, setRecognitionActive] = useState(false);

  // --- Start: New State and Refs for Behavior Analysis ---
  const [behaviorMetrics, setBehaviorMetrics] = useState({
    blinkCount: 0,
    emotion: 'neutral',
    nervousnessScore: 0,
    eyeContactScore: 100,
    feedback: '',
    gazeDirection: 'Center',
    lipBiting: false,
    handOnFace: false,
    shrugging: false,
    fidgeting: false,
  });
  const [analysisActive, setAnalysisActive] = useState(false);
  const analysisInterval = useRef(null);
  const behaviorHistory = useRef([]);
  // --- End: New State and Refs ---

  // --- Start: Confusion Detection State ---
  const [confusionStatus, setConfusionStatus] = useState({
    isConfused: false,
    confidence: 0,
    lastUpdated: null
  });
  const confusionInterval = useRef(null);
  // --- End: Confusion Detection State ---

  const videoRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  const SpeechRecognitionClass = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.WebGLRenderingContext) {
      alert('Your browser does not support WebGL. Please use a modern browser.');
      router.push('/interview-platform/choosetype');
    }
  }, [router]);

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

  useEffect(() => {
    const initMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    initMedia();
  }, []);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      stopBehaviorAnalysis(); // Stop analysis on component unmount
      stopConfusionDetection(); // Stop confusion detection on component unmount
    };
  }, [stream]);

  // --- Start: New Behavior Analysis Functions ---
  const captureFrame = () => {
    if (!videoRef.current || videoRef.current.readyState < 3) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const startBehaviorAnalysis = () => {
    if (analysisInterval.current) return;

    analysisInterval.current = setInterval(async () => {
      const frame = captureFrame();
      if (!frame) return;

      try {
        const response = await fetch('https://emotion-s2l4.onrender.com/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frame })
        });

        if (!response.ok) throw new Error(`Analysis API failed: ${response.statusText}`);
        
        const data = await response.json();

        setBehaviorMetrics(prev => ({
          blinkCount: prev.blinkCount + (data.blink_count || 0),
          emotion: data.emotion?.toLowerCase() || prev.emotion,
          nervousnessScore: Math.max(prev.nervousnessScore, data.nervousness_score || 0),
          eyeContactScore: data.eye_contact_score !== undefined ? data.eye_contact_score : prev.eyeContactScore,
          feedback: data.feedback || prev.feedback,
          gazeDirection: data.gaze_direction || prev.gazeDirection,
          lipBiting: data.lip_biting || false,
          handOnFace: data.hand_on_face || false,
          shrugging: data.shrugging || false,
          fidgeting: data.fidgeting || false,
        }));

        behaviorHistory.current.push({
          timestamp: new Date().toISOString(),
          metrics: data
        });
      } catch (error) {
        console.error('Analysis error:', error);
      }
    }, 3000); // Analyze every 3 seconds
  };

  const stopBehaviorAnalysis = () => {
    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
      analysisInterval.current = null;
    }
  };

  // --- End: New Behavior Analysis Functions ---

  // --- Start: Confusion Detection Functions ---
  const detectConfusion = async () => {
    const frame = captureFrame();
    if (!frame) return;

    try {
      // Extract base64 data from data URL
      const base64Data = frame.split(',')[1];
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data })
      });

      if (!response.ok) throw new Error(`Confusion API failed: ${response.statusText}`);
      
      const data = await response.json();
      
      if (data.faces && data.faces.length > 0) {
        const face = data.faces[0];
        setConfusionStatus({
          isConfused: face.confusion === 'Confused',
          confidence: face.confusion_probability || 0.5,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Confusion detection error:', error);
    }
  };

  const startConfusionDetection = () => {
    if (confusionInterval.current) return;
    
    // Run immediately first time
    detectConfusion();
    
    // Then set up interval
    confusionInterval.current = setInterval(detectConfusion, 4000); // Check every 4 seconds
  };

  const stopConfusionDetection = () => {
    if (confusionInterval.current) {
      clearInterval(confusionInterval.current);
      confusionInterval.current = null;
    }
  };
  // --- End: Confusion Detection Functions ---

  // --- Start: New useEffect to control analysis ---
  useEffect(() => {
    if (videoOn && stream) {
      startBehaviorAnalysis();
      startConfusionDetection();
      setAnalysisActive(true);
    } else {
      stopBehaviorAnalysis();
      stopConfusionDetection();
      setAnalysisActive(false);
    }
  }, [videoOn, stream]);
  // --- End: New useEffect ---

  const speak = useCallback((text) => {
    if (!text?.trim() || !synthRef.current) return;
    if (isListening) stopListening();
    if (utteranceRef.current) synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utteranceRef.current = utterance;

    const cleanUp = () => {
      setIsSpeaking(false);
      utterance.onend = null;
      utterance.onerror = null;
      if (autoMicEnabled) setShouldStartListening(true);
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      stopListening();
    };
    utterance.onend = cleanUp;
    utterance.onerror = (event) => {
      if (event.error && !['interrupted', ''].includes(event.error)) console.warn('Speech error:', event.error);
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
  }, [autoMicEnabled, isListening]);

  useEffect(() => {
    if (shouldStartListening && !isSpeaking && !isListening && autoMicEnabled) {
      startListening();
      setShouldStartListening(false);
    }
  }, [shouldStartListening, isSpeaking, isListening, autoMicEnabled]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length && !hasSpokenCurrentQuestion) {
      speak(questions[currentIndex]);
      setHasSpokenCurrentQuestion(true);
    }
  }, [currentIndex, questions, hasSpokenCurrentQuestion, speak]);

  useEffect(() => {
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    // recognition.onstart = () => { setIsListening(true); setMicOn(true); };
      recognition.onstart = () => {
    setIsListening(true);
    setMicOn(true);
    setRecognitionActive(true);
  };

    recognition.onresult = (event) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + ' ';
      }
      if (final.trim()) setUserAnswer(prev => (prev + ' ' + final).trim());
    };
    recognition.onerror = (event) => { console.error('Speech Recognition error:', event.error); setIsListening(false); setMicOn(false); };
    // recognition.onend = () => { setIsListening(false); if (!autoMicEnabled) setMicOn(false); };
      recognition.onend = () => {
    setIsListening(false);
    setRecognitionActive(false);
    if (!autoMicEnabled) setMicOn(false);
  };

    recognitionRef.current = recognition;
  }, [SpeechRecognitionClass, autoMicEnabled]);

  // const startListening = () => {
  //   setUserAnswer('');
  //   try { recognitionRef.current?.start(); } catch (error) { console.error('Failed to start recognition:', error); }
  // };

  // const stopListening = () => {
  //   try { recognitionRef.current?.stop(); } catch (error) { console.error('Failed to stop recognition:', error); }
  // };

  const startListening = () => {
  setUserAnswer('');
  if (recognitionActive) return; // Prevent double start
  try {
    recognitionRef.current?.start();
    setRecognitionActive(true);
  } catch (error) {
    console.error('Failed to start recognition:', error);
  }
};

const stopListening = () => {
  try {
    recognitionRef.current?.stop();
    setRecognitionActive(false);
  } catch (error) {
    console.error('Failed to stop recognition:', error);
  }
};


  // --- Start: Modified handleAnswerSubmit ---
  const handleAnswerSubmit = () => {
    stopListening();
    
    const q = questions[currentIndex];
    const updatedQaPairs = [...qaPairs, { 
      question: q, 
      answer: userAnswer,
      behaviorMetrics: {
        ...behaviorMetrics,
        confusionStatus: confusionStatus, // Add confusion status to metrics
        behaviorHistory: [...behaviorHistory.current],
        timestamp: new Date().toISOString()
      }
    }];

    behaviorHistory.current = [];
    setBehaviorMetrics({
      blinkCount: 0,
      emotion: 'neutral',
      nervousnessScore: 0,
      eyeContactScore: 100,
      feedback: '',
      gazeDirection: 'Center',
      lipBiting: false,
      handOnFace: false,
      shrugging: false,
      fidgeting: false,
    });
    
    // Reset confusion status
    setConfusionStatus({
      isConfused: false,
      confidence: 0,
      lastUpdated: null
    });

    if (currentIndex + 1 < questions.length) {
      setQaPairs(updatedQaPairs);
      setUserAnswer('');
      setCurrentIndex(prev => prev + 1);
      setHasSpokenCurrentQuestion(false);
    } else {
      stopBehaviorAnalysis();
      stopConfusionDetection();
      setAutoMicEnabled(false);
      router.push(`/interview-platform/result?data=${encodeURIComponent(JSON.stringify(updatedQaPairs))}&type=${interviewType}&level=${level}`);
    }
  };
  // --- End: Modified handleAnswerSubmit ---

  const toggleMicMode = () => {
    setAutoMicEnabled(!autoMicEnabled);
    if (!autoMicEnabled && !isSpeaking) startListening();
    else if (!autoMicEnabled) stopListening();
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

        {/* --- Start: New Behavior Analysis UI Panel --- */}
        {analysisActive && (
          <motion.div
            className="absolute top-20 right-4 z-20 bg-blue-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-700/50 w-64"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-blue-200 mb-2">Behavior Analysis</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-300">Emotion:</span>
                <span className="font-medium capitalize">{behaviorMetrics.emotion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Blinks:</span>
                <span>{behaviorMetrics.blinkCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Eye Contact:</span>
                <span>{behaviorMetrics.eyeContactScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Confidence:</span>
                <span>{100 - behaviorMetrics.nervousnessScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Gaze:</span>
                <span>{behaviorMetrics.gazeDirection}</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-blue-300">Lip Biting:</span>
                  <span className={behaviorMetrics.lipBiting ? 'text-yellow-400 font-semibold' : ''}>
                    {behaviorMetrics.lipBiting ? 'Detected' : 'No'}
                  </span>
              </div>
              <div className="flex justify-between">
                  <span className="text-blue-300">Hand on Face:</span>
                  <span className={behaviorMetrics.handOnFace ? 'text-yellow-400 font-semibold' : ''}>
                    {behaviorMetrics.handOnFace ? 'Detected' : 'No'}
                  </span>
              </div>
              <div className="flex justify-between">
                  <span className="text-blue-300">Shrugging:</span>
                  <span className={behaviorMetrics.shrugging ? 'text-yellow-400 font-semibold' : ''}>
                    {behaviorMetrics.shrugging ? 'Detected' : 'No'}
                  </span>
              </div>
              {/* Confusion Status Display */}
              <div className="flex justify-between">
                <span className="text-blue-300">Confusion:</span>
                <span className={confusionStatus.isConfused ? 'text-yellow-400 font-semibold' : 'text-green-400'}>
                  {confusionStatus.isConfused ? 'Detected' : 'Not Detected'}
                </span>
              </div>
              {behaviorMetrics.feedback && (
                <div className="mt-2 pt-2 border-t border-blue-700/50 text-blue-100 text-xs">
                  {behaviorMetrics.feedback}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* --- End: New Behavior Analysis UI Panel --- */}


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

                {/* Confusion Indicator in Video Corner */}
                {videoOn && analysisActive && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      confusionStatus.isConfused ? 'bg-yellow-500/90' : 'bg-green-500/90'
                    }`}>
                      <span className="text-white text-sm font-bold">
                        {confusionStatus.isConfused ? '?' : '✓'}
                      </span>
                    </div>
                    <div className="text-xs text-white mt-1 bg-black/50 px-1 rounded">
                      {confusionStatus.isConfused ? 'Confused' : 'Focused'}
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <div className={`w-3 h-3 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`} title={micOn ? 'Microphone On' : 'Microphone Off'}></div>
                  <div className={`w-3 h-3 rounded-full ${videoOn ? 'bg-green-500' : 'bg-red-500'}`} title={videoOn ? 'Camera On' : 'Camera Off'}></div>
                  {/* --- Start: New Status Indicator --- */}
                  <div className={`w-3 h-3 rounded-full ${analysisActive ? 'bg-purple-500' : 'bg-gray-500'}`} title={analysisActive ? 'Analysis active' : 'Analysis inactive'}></div>
                  {/* --- End: New Status Indicator --- */}
                </div>

                {isListening && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-blue-800/80 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100">
                      {autoMicEnabled ? 'Auto Listening' : 'Manual Listening'}
                    </span>
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
                    onClick={toggleMicMode}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
                      autoMicEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-900/50'
                    }`}
                  >
                    {autoMicEnabled ? '🎙️ Auto Mic ON' : '🎙️ Auto Mic OFF'}
                  </button>
                </div>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm ${
                    !userAnswer.trim() ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
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
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isSpeaking ? 'bg-blue-600/50 text-blue-200' : 'bg-blue-900/30 text-blue-400'
                      }`}>
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