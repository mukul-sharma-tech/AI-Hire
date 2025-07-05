// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { FiMic, FiMicOff, FiCheck, FiLoader } from 'react-icons/fi';

// export default function InterviewPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Starting interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [role, setRole] = useState('');
//   const [level, setLevel] = useState('');
//   const volumeInterval = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   // Load questions from URL params
//   useEffect(() => {
//     const questionsParam = searchParams.get('questions');
//     const roleParam = searchParams.get('role');
//     const levelParam = searchParams.get('level');
    
//     if (questionsParam) {
//       try {
//         const parsedQuestions = JSON.parse(questionsParam);
//         setQuestions(parsedQuestions);
//         setRole(roleParam || '');
//         setLevel(levelParam || '');
//       } catch (e) {
//         console.error('Error parsing questions:', e);
//         // Fallback questions
//         setQuestions([
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.'
//         ]);
//       }
//     }
//   }, [searchParams]);

//   // Countdown before starting call
//   useEffect(() => {
//     if (questions.length > 0) {
//       if (countdown > 0) {
//         const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//         return () => clearTimeout(timer);
//       } else {
//         setCallActive(true);
//         startInterview();
//       }
//     }
//   }, [countdown, questions]);

//   // Visual feedback for microphone activity
//   useEffect(() => {
//     if (listening) {
//       volumeInterval.current = setInterval(() => {
//         setVolumeLevel(Math.min(5, Math.floor(Math.random() * 3) + volumeLevel));
//       }, 200);
//     } else {
//       clearInterval(volumeInterval.current);
//       setVolumeLevel(0);
//     }

//     return () => clearInterval(volumeInterval.current);
//   }, [listening]);

//   const speak = (text, onComplete) => {
//     window.speechSynthesis.cancel();
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';

//     setStatus('Interviewer speaking...');
//     utterance.onend = () => {
//       if (onComplete) onComplete();
//       else {
//         setStatus('Your turn - speak now');
//         SpeechRecognition.startListening({ continuous: true });
//       }
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   const startInterview = () => {
//     if (questions.length > 0) {
//       speak(questions[currentQIndex]);
//     }
//   };

//   const endInterview = () => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll redirect you to your results now.", () => {
//       setCallEnded(true);
//       setTimeout(() => {
//         const qaPairs = conversation.map((item, index) => ({
//           question: questions[index],
//           answer: item.answer
//         }));
        
//         router.push(
//           `/interview-platform/result?data=${encodeURIComponent(JSON.stringify(qaPairs))}&role=${role}&level=${level}`
//         );
//       }, 2000);
//     });
//   };

//   const handleSubmit = () => {
//     if (!transcript.trim()) return;

//     SpeechRecognition.stopListening();
//     resetTranscript();

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript,
//     };

//     const updatedConversation = [...conversation, newEntry];
//     setConversation(updatedConversation);

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       endInterview();
//     }
//   };

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/');
//     }
//   }, []);

//   if (countdown > 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-blue-800 border-2 border-blue-600 flex items-center justify-center">
//             <span className="text-5xl animate-pulse">{countdown}</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Incoming Call</h1>
//           <p className="text-blue-200">Interview starting in {countdown} seconds</p>
//         </div>
//       </div>
//     );
//   }

//   if (callEnded) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-green-600 flex items-center justify-center">
//             <FiCheck className="text-5xl" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
//           <p className="text-blue-200">Redirecting to your results...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
//       {/* Call Header */}
//       <div className="w-full max-w-md text-center mb-6">
//         <div className="flex justify-center items-center mb-2">
//           <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-blue-500'}`}></div>
//           <p className="text-blue-200">{status}</p>
//         </div>
//         <div className="w-full bg-blue-800 h-px mb-4"></div>
//       </div>

//       {/* 3D Call Card */}
//       <div className="relative w-full max-w-md">
//         <div className="absolute inset-0 bg-blue-700 rounded-2xl shadow-lg transform rotate-1 -z-10"></div>
//         <div className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg transform -rotate-1 -z-10"></div>
        
//         <div className="bg-blue-800 rounded-2xl shadow-xl w-full p-6 flex flex-col items-center border-2 border-blue-600 relative overflow-hidden">
//           {/* Role and Level Badge */}
//           <div className="absolute top-4 left-4 bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full">
//             {role} {level && `• ${level}`}
//           </div>
          
//           {/* Current Question */}
//           <div className="w-full bg-blue-900 rounded-lg p-4 mb-6 border border-blue-700 mt-8">
//             <p className="text-blue-300 text-sm font-medium mb-1">
//               Question {currentQIndex + 1}/{questions.length}
//             </p>
//             <p className="text-white text-lg">
//               {questions[currentQIndex] || 'Loading question...'}
//             </p>
//           </div>

//           {/* Microphone Button */}
//           <div className="relative mb-8">
//             <div className="absolute inset-0 flex items-center justify-center">
//               {/* Sound waves */}
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute rounded-full border border-blue-400"
//                   style={{
//                     width: `${80 + i * 20}px`,
//                     height: `${80 + i * 20}px`,
//                     opacity: volumeLevel > i ? 0.4 - i * 0.08 : 0,
//                     transition: 'opacity 0.1s ease-out',
//                   }}
//                 />
//               ))}
//             </div>
//             <button
//               className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
//                 listening
//                   ? 'bg-red-600 hover:bg-red-700'
//                   : 'bg-blue-600 hover:bg-blue-700'
//               }`}
//               onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
//             >
//               {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
//             </button>
//           </div>

//           {/* Transcript */}
//           <div className="w-full bg-blue-900 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-blue-700">
//             <p className="text-blue-300 text-sm mb-1">Your response:</p>
//             <p className="text-white">
//               {transcript || (listening ? 'Speak now...' : 'Press mic to answer')}
//             </p>
//           </div>

//           {/* Controls */}
//           <div className="flex gap-3 w-full">
//             <button
//               onClick={handleSubmit}
//               disabled={!transcript}
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//             >
//               <FiCheck /> Submit
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Progress Indicator */}
//       <div className="mt-6 w-full max-w-md">
//         <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-green-500 transition-all duration-300" 
//             style={{ width: `${((currentQIndex + (transcript ? 0.5 : 0)) / questions.length) * 100}%` }}
//           ></div>
//         </div>
//         <p className="text-blue-200 text-sm mt-2 text-center">
//           Progress: {currentQIndex + 1} of {questions.length} questions
//         </p>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { FiMic, FiMicOff, FiCheck, FiLoader } from 'react-icons/fi';

// export default function InterviewPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Starting interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [role, setRole] = useState('');
//   const [level, setLevel] = useState('');
//   const volumeInterval = useRef(null);
//   const autoEndTimer = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   // Load questions from URL params
//   useEffect(() => {
//     const questionsParam = searchParams.get('questions');
//     const roleParam = searchParams.get('role');
//     const levelParam = searchParams.get('level');
    
//     if (questionsParam) {
//       try {
//         const parsedQuestions = JSON.parse(questionsParam);
//         setQuestions(parsedQuestions);
//         setRole(roleParam || '');
//         setLevel(levelParam || '');
//       } catch (e) {
//         console.error('Error parsing questions:', e);
//         // Fallback questions
//         setQuestions([
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.'
//         ]);
//       }
//     }
//   }, [searchParams]);

//   // Countdown before starting call
//   useEffect(() => {
//     if (questions.length > 0) {
//       if (countdown > 0) {
//         const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//         return () => clearTimeout(timer);
//       } else {
//         setCallActive(true);
//         startInterview();
//       }
//     }
//   }, [countdown, questions]);

//   // Visual feedback for microphone activity
//   useEffect(() => {
//     if (listening) {
//       volumeInterval.current = setInterval(() => {
//         setVolumeLevel(Math.min(5, Math.floor(Math.random() * 3) + volumeLevel));
//       }, 200);
//     } else {
//       clearInterval(volumeInterval.current);
//       setVolumeLevel(0);
//     }

//     return () => clearInterval(volumeInterval.current);
//   }, [listening]);

//   // Auto-submit after pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(() => {
//         handleSubmit();
//       }, 3000); // 3 seconds of silence triggers submit
//     }

//     return () => clearTimeout(autoEndTimer.current);
//   }, [transcript, listening]);

//   const speak = (text, onComplete) => {
//     window.speechSynthesis.cancel();
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';

//     setStatus('Interviewer speaking...');
//     utterance.onend = () => {
//       if (onComplete) onComplete();
//       else {
//         setStatus('Your turn - speak now');
//         SpeechRecognition.startListening({ continuous: true });
//       }
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   const startInterview = () => {
//     if (questions.length > 0) {
//       speak(questions[currentQIndex]);
//     }
//   };

//   const endInterview = () => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll redirect you to your results now.", () => {
//       setCallEnded(true);
//       setTimeout(() => {
//         const qaPairs = conversation.map((item, index) => ({
//           question: questions[index],
//           answer: item.answer
//         }));
        
//         router.push(
//           `/interview-platform/result?data=${encodeURIComponent(JSON.stringify(qaPairs))}&role=${role}&level=${level}`
//         );
//       }, 2000);
//     });
//   };

//   const handleSubmit = () => {
//     if (!transcript.trim()) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);
//     resetTranscript();

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript,
//     };

//     const updatedConversation = [...conversation, newEntry];
//     setConversation(updatedConversation);

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       endInterview();
//     }
//   };

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/');
//     }
//   }, []);

//   if (countdown > 0) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
//             <span className="text-5xl animate-pulse">{countdown}</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Incoming Call</h1>
//           <p className="text-gray-400">Interview starting in {countdown} seconds</p>
//         </div>
//       </div>
//     );
//   }

//   if (callEnded) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-green-900 flex items-center justify-center">
//             <FiCheck className="text-5xl" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
//           <p className="text-gray-400">Redirecting to your results...</p>
//         </div>
//       </div>
//     );
//   }









// 'use client';

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { FiMic, FiMicOff, FiCheck } from 'react-icons/fi';

// export default function InterviewPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Starting interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [role, setRole] = useState('');
//   const [level, setLevel] = useState('');

//   const volumeInterval = useRef(null);
//   const autoEndTimer = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   useEffect(() => {
//     const questionsParam = searchParams.get('questions');
//     const roleParam = searchParams.get('role');
//     const levelParam = searchParams.get('level');

//     if (questionsParam) {
//       try {
//         const parsed = JSON.parse(questionsParam);
//         setQuestions(parsed);
//         setRole(roleParam || '');
//         setLevel(levelParam || '');
//       } catch (e) {
//         setQuestions([
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.'
//         ]);
//       }
//     }
//   }, [searchParams]);

//   const speak = useCallback((text, onComplete) => {
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';

//     setStatus('Interviewer speaking...');
//     utterance.onend = () => {
//       if (onComplete) onComplete();
//       else {
//         setStatus('Your turn - speak now');
//         SpeechRecognition.startListening({ continuous: true });
//       }
//     };

//     window.speechSynthesis.speak(utterance);
//   }, []);

//   const startInterview = useCallback(() => {
//     if (questions.length > 0) {
//       speak(questions[currentQIndex]);
//     }
//   }, [questions, currentQIndex, speak]);

//   const endInterview = useCallback((finalConversation) => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll redirect you to your results now.", () => {
//       setCallEnded(true);
//       setTimeout(() => {
//         const qaPairs = finalConversation.map((item, i) => ({
//           question: questions[i],
//           answer: item.answer,
//         }));

//         router.push(
//           `/interview-platform/result?data=${encodeURIComponent(
//             JSON.stringify(qaPairs)
//           )}&role=${role}&level=${level}`
//         );
//       }, 2000);
//     });
//   }, [questions, role, level, router, speak]);

//   const handleSubmit = useCallback(() => {
//     if (!transcript.trim()) return;

//     SpeechRecognition.stopListening();
//     if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//     resetTranscript();

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript
//     };

//     const updated = [...conversation, newEntry];
//     setConversation(updated);

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       endInterview(updated);
//     }
//   }, [transcript, resetTranscript, questions, currentQIndex, conversation, speak, endInterview]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/');
//     }
//   }, [router]);

//   useEffect(() => {
//     if (questions.length > 0 && countdown > 0) {
//       const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (questions.length > 0 && countdown === 0) {
//       setCallActive(true);
//       startInterview();
//     }
//   }, [countdown, questions, startInterview]);

//   useEffect(() => {
//     if (listening) {
//       volumeInterval.current = setInterval(() => {
//         setVolumeLevel((v) => Math.min(5, Math.floor(Math.random() * 3) + v));
//       }, 200);
//     } else {
//       clearInterval(volumeInterval.current);
//       setVolumeLevel(0);
//     }

//     return () => {
//       clearInterval(volumeInterval.current);
//     };
//   }, [listening]);

//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(() => handleSubmit(), 3000);
//     }

//     return () => {
//       if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//     };
//   }, [transcript, listening, handleSubmit]);

//   if (countdown > 0) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="text-5xl font-bold animate-pulse">{countdown}</div>
//           <p className="text-gray-400 mt-4">Interview starts in {countdown} second(s)...</p>
//         </div>
//       </div>
//     );
//   }

//   if (callEnded) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
//         <FiCheck className="text-green-500 text-6xl mb-4" />
//         <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
//         <p className="text-gray-400">Redirecting to your results...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//       {/* Call Header */}
//       <div className="w-full max-w-sm text-center mb-6">
//         <div className="flex justify-center items-center mb-2">
//           <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
//           <p className="text-gray-300">{status}</p>
//         </div>
//         <div className="w-full bg-gray-900 h-px mb-4"></div>
//       </div>

//       {/* Call Container */}
//       <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
//         {/* Current Question */}
//         <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
//           <p className="text-gray-400 text-sm font-medium mb-1">
//             Question {currentQIndex + 1}/{questions.length}
//           </p>
//           <p className="text-white text-lg">
//             {questions[currentQIndex] || 'Loading question...'}
//           </p>
//         </div>

//         {/* Microphone Button */}
//         <div className="relative mb-8">
//           <div className="absolute inset-0 flex items-center justify-center">
//             {/* Sound waves */}
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute rounded-full border border-blue-400"
//                 style={{
//                   width: `${80 + i * 20}px`,
//                   height: `${80 + i * 20}px`,
//                   opacity: volumeLevel > i ? 0.4 - i * 0.08 : 0,
//                   transition: 'opacity 0.1s ease-out',
//                 }}
//               />
//             ))}
//           </div>
//           <button
//             className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
//               listening
//                 ? 'bg-red-600 hover:bg-red-700'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//             onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
//           >
//             {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
//           </button>
//         </div>

//         {/* Transcript */}
//         <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
//           <p className="text-gray-400 text-sm mb-1">Your response:</p>
//           <p className="text-white">
//             {transcript || (listening ? 'Speak now...' : 'Press mic to answer')}
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="flex gap-3 w-full">
//           <button
//             onClick={handleSubmit}
//             disabled={!transcript}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//           >
//             <FiCheck /> Submit
//           </button>
//         </div>
//       </div>

//       {/* Progress Indicator */}
//       <div className="mt-6 w-full max-w-sm">
//         <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-green-500 transition-all duration-300" 
//             style={{ width: `${((currentQIndex + (transcript ? 0.5 : 0)) / questions.length) * 100}%` }}
//           ></div>
//         </div>
//         <p className="text-gray-400 text-sm mt-2 text-center">
//           Progress: {currentQIndex + 1} of {questions.length} questions
//         </p>
//       </div>

//       {/* Conversation Log */}
//       {conversation.length > 0 && (
//         <div className="mt-6 w-full max-w-sm bg-gray-900 rounded-lg p-5 border border-gray-800">
//           <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
//             <span className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm">
//               {conversation.length}
//             </span>
//             Responses
//           </h2>
//           <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
//             {conversation.map((item, i) => (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
//                 <p className="text-blue-400 text-sm font-medium mb-1">Q: {item.question}</p>
//                 <p className="text-white text-sm">A: {item.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { FiMic, FiMicOff, FiCheck } from 'react-icons/fi';

// function InterviewContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Starting interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [role, setRole] = useState('');
//   const [level, setLevel] = useState('');

//   const volumeInterval = useRef(null);
//   const autoEndTimer = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   useEffect(() => {
//     const questionsParam = searchParams.get('questions');
//     const roleParam = searchParams.get('role');
//     const levelParam = searchParams.get('level');

//     if (questionsParam) {
//       try {
//         const parsed = JSON.parse(questionsParam);
//         setQuestions(parsed);
//         setRole(roleParam || '');
//         setLevel(levelParam || '');
//       } catch (e) {
//         setQuestions([
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.'
//         ]);
//       }
//     }
//   }, [searchParams]);

//   const speak = useCallback((text, onComplete) => {
//     window.speechSynthesis.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';

//     setStatus('Interviewer speaking...');
//     utterance.onend = () => {
//       if (onComplete) onComplete();
//       else {
//         setStatus('Your turn - speak now');
//         SpeechRecognition.startListening({ continuous: true });
//       }
//     };

//     window.speechSynthesis.speak(utterance);
//   }, []);

//   const startInterview = useCallback(() => {
//     if (questions.length > 0) {
//       speak(questions[currentQIndex]);
//     }
//   }, [questions, currentQIndex, speak]);

//   const endInterview = useCallback((finalConversation) => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll redirect you to your results now.", () => {
//       setCallEnded(true);
//       setTimeout(() => {
//         const qaPairs = finalConversation.map((item, i) => ({
//           question: questions[i],
//           answer: item.answer,
//         }));

//         router.push(
//           `/interview-platform/result?data=${encodeURIComponent(
//             JSON.stringify(qaPairs)
//           )}&role=${role}&level=${level}`
//         );
//       }, 2000);
//     });
//   }, [questions, role, level, router, speak]);

//   const handleSubmit = useCallback(() => {
//     if (!transcript.trim()) return;

//     SpeechRecognition.stopListening();
//     if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//     resetTranscript();

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript
//     };

//     const updated = [...conversation, newEntry];
//     setConversation(updated);

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       endInterview(updated);
//     }
//   }, [transcript, resetTranscript, questions, currentQIndex, conversation, speak, endInterview]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/');
//     }
//   }, [router]);

//   useEffect(() => {
//     if (questions.length > 0 && countdown > 0) {
//       const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (questions.length > 0 && countdown === 0) {
//       setCallActive(true);
//       startInterview();
//     }
//   }, [countdown, questions, startInterview]);

//   useEffect(() => {
//     if (listening) {
//       volumeInterval.current = setInterval(() => {
//         setVolumeLevel((v) => Math.min(5, Math.floor(Math.random() * 3) + v));
//       }, 200);
//     } else {
//       clearInterval(volumeInterval.current);
//       setVolumeLevel(0);
//     }

//     return () => {
//       clearInterval(volumeInterval.current);
//     };
//   }, [listening]);

//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(() => handleSubmit(), 3000);
//     }

//     return () => {
//       if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
//     };
//   }, [transcript, listening, handleSubmit]);

//   if (countdown > 0) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="text-5xl font-bold animate-pulse">{countdown}</div>
//           <p className="text-gray-400 mt-4">Interview starts in {countdown} second(s)...</p>
//         </div>
//       </div>
//     );
//   }

//   if (callEnded) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
//         <FiCheck className="text-green-500 text-6xl mb-4" />
//         <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
//         <p className="text-gray-400">Redirecting to your results...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//       {/* Call Header */}
//       <div className="w-full max-w-sm text-center mb-6">
//         <div className="flex justify-center items-center mb-2">
//           <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
//           <p className="text-gray-300">{status}</p>
//         </div>
//         <div className="w-full bg-gray-900 h-px mb-4"></div>
//       </div>

//       {/* Call Container */}
//       <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
//         {/* Current Question */}
//         <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
//           <p className="text-gray-400 text-sm font-medium mb-1">
//             Question {currentQIndex + 1}/{questions.length}
//           </p>
//           <p className="text-white text-lg">
//             {questions[currentQIndex] || 'Loading question...'}
//           </p>
//         </div>

//         {/* Microphone Button */}
//         <div className="relative mb-8">
//           <div className="absolute inset-0 flex items-center justify-center">
//             {/* Sound waves */}
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute rounded-full border border-blue-400"
//                 style={{
//                   width: `${80 + i * 20}px`,
//                   height: `${80 + i * 20}px`,
//                   opacity: volumeLevel > i ? 0.4 - i * 0.08 : 0,
//                   transition: 'opacity 0.1s ease-out',
//                 }}
//               />
//             ))}
//           </div>
//           <button
//             className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
//               listening
//                 ? 'bg-red-600 hover:bg-red-700'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//             onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
//           >
//             {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
//           </button>
//         </div>

//         {/* Transcript */}
//         <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
//           <p className="text-gray-400 text-sm mb-1">Your response:</p>
//           <p className="text-white">
//             {transcript || (listening ? 'Speak now...' : 'Press mic to answer')}
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="flex gap-3 w-full">
//           <button
//             onClick={handleSubmit}
//             disabled={!transcript}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//           >
//             <FiCheck /> Submit
//           </button>
//         </div>
//       </div>

//       {/* Progress Indicator */}
//       <div className="mt-6 w-full max-w-sm">
//         <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-green-500 transition-all duration-300" 
//             style={{ width: `${((currentQIndex + (transcript ? 0.5 : 0)) / questions.length) * 100}%` }}
//           ></div>
//         </div>
//         <p className="text-gray-400 text-sm mt-2 text-center">
//           Progress: {currentQIndex + 1} of {questions.length} questions
//         </p>
//       </div>

//       {/* Conversation Log */}
//       {conversation.length > 0 && (
//         <div className="mt-6 w-full max-w-sm bg-gray-900 rounded-lg p-5 border border-gray-800">
//           <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
//             <span className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm">
//               {conversation.length}
//             </span>
//             Responses
//           </h2>
//           <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
//             {conversation.map((item, i) => (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
//                 <p className="text-blue-400 text-sm font-medium mb-1">Q: {item.question}</p>
//                 <p className="text-white text-sm">A: {item.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function InterviewPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading interview...</div>}>
//       <InterviewContent />
//     </Suspense>
//   );
// }


'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FiMic, FiMicOff, FiCheck } from 'react-icons/fi';

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('Starting interview...');
  const [countdown, setCountdown] = useState(3);
  const [callActive, setCallActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  const volumeInterval = useRef(null);
  const autoEndTimer = useRef(null);
  const isSpeakingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const questionsParam = searchParams.get('questions');
    const roleParam = searchParams.get('role');
    const levelParam = searchParams.get('level');

    if (questionsParam) {
      try {
        const parsed = JSON.parse(questionsParam);
        setQuestions(parsed);
        setRole(roleParam || '');
        setLevel(levelParam || '');
      } catch (e) {
        setQuestions([
          'Hi, can you tell me a little about yourself?',
          'What interests you most about this role?',
          'What are your biggest strengths?',
          'Tell me about a time you faced a challenge.'
        ]);
      }
    }
  }, [searchParams]);

  const speak = useCallback((text, onComplete) => {
    if (isSpeakingRef.current) return;
    isSpeakingRef.current = true;

    console.log('Speaking:', text);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    setStatus('Interviewer speaking...');
    utterance.onend = () => {
      isSpeakingRef.current = false;
      if (onComplete) onComplete();
      else {
        setStatus('Your turn - speak now');
        SpeechRecognition.startListening({ continuous: true });
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const startInterview = useCallback(() => {
    if (questions.length > 0) {
      SpeechRecognition.stopListening(); // ✅ Ensure mic is off before first question
      resetTranscript();                 // ✅ Clear any previous text
      speak(questions[currentQIndex]);   // ✅ mic will start *after* AI finishes speaking
    }
  }, [questions, currentQIndex, speak, resetTranscript]);
  
  const endInterview = useCallback((finalConversation) => {
    setStatus('Finishing interview...');
    speak("Thank you for your time today. We'll redirect you to your results now.", () => {
      setCallEnded(true);
      setTimeout(() => {
        const qaPairs = finalConversation.map((item, i) => ({
          question: questions[i],
          answer: item.answer,
        }));

        router.push(
          `/interview-platform/result?data=${encodeURIComponent(
            JSON.stringify(qaPairs)
          )}&role=${role}&level=${level}`
        );
      }, 2000);
    });
  }, [questions, role, level, router, speak]);

  const handleSubmit = useCallback(() => {
    if (!transcript.trim()) return;

    SpeechRecognition.stopListening();
    if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
    resetTranscript();

    const newEntry = {
      question: questions[currentQIndex],
      answer: transcript
    };

    const updated = [...conversation, newEntry];
    setConversation(updated);

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeout(() => speak(questions[currentQIndex + 1]), 800);
    } else {
      endInterview(updated);
    }
  }, [transcript, resetTranscript, questions, currentQIndex, conversation, speak, endInterview]);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition.');
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (questions.length > 0 && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questions.length > 0 && countdown === 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setCallActive(true);
      startInterview();
    }
  }, [countdown, questions, startInterview]);

  useEffect(() => {
    if (listening) {
      volumeInterval.current = setInterval(() => {
        setVolumeLevel((v) => Math.min(5, Math.floor(Math.random() * 3) + v));
      }, 200);
    } else {
      clearInterval(volumeInterval.current);
      setVolumeLevel(0);
    }

    return () => clearInterval(volumeInterval.current);
  }, [listening]);

  useEffect(() => {
    if (transcript.trim() && listening) {
      if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
      autoEndTimer.current = setTimeout(() => handleSubmit(), 3000);
    }

    return () => {
      if (autoEndTimer.current) clearTimeout(autoEndTimer.current);
    };
  }, [transcript, listening, handleSubmit]);

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl font-bold animate-pulse">{countdown}</div>
          <p className="text-gray-400 mt-4">Interview starts in {countdown} second(s)...</p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <FiCheck className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
        <p className="text-gray-400">Redirecting to your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-sm text-center mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <p className="text-gray-300">{status}</p>
        </div>
        <div className="w-full bg-gray-900 h-px mb-4"></div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-1">
            Question {currentQIndex + 1}/{questions.length}
          </p>
          <p className="text-white text-lg">
            {questions[currentQIndex] || 'Loading question...'}
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-400"
                style={{
                  width: `${80 + i * 20}px`,
                  height: `${80 + i * 20}px`,
                  opacity: volumeLevel > i ? 0.4 - i * 0.08 : 0,
                  transition: 'opacity 0.1s ease-out',
                }}
              />
            ))}
          </div>
          <button
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${
              listening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
          >
            {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
          </button>
        </div>

        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Your response:</p>
          <p className="text-white">{transcript || (listening ? 'Speak now...' : 'Press mic to answer')}</p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleSubmit}
            disabled={!transcript}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <FiCheck /> Submit
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{
              width: `${((currentQIndex + (transcript ? 0.5 : 0)) / questions.length) * 100}%`
            }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Progress: {currentQIndex + 1} of {questions.length} questions
        </p>
      </div>

      {/* {conversation.length > 0 && (
        <div className="mt-6 w-full max-w-sm bg-gray-900 rounded-lg p-5 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm">
              {conversation.length}
            </span>
            Responses
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {conversation.map((item, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <p className="text-blue-400 text-sm font-medium mb-1">Q: {item.question}</p>
                <p className="text-white text-sm">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading interview...</div>}>
      <InterviewContent />
    </Suspense>
  );
}
