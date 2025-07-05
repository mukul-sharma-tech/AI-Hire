// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';

// const QUESTIONS = [
//   'Tell me about yourself.',
//   'What are your strengths?',
//   'Describe a challenge you faced.',
// ];

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//   } = useSpeechRecognition();

//   const speak = (text) => {
//     setIsSpeaking(true);
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       SpeechRecognition.startListening({ continuous: false });
//     };
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleNext = async () => {
//     if (!transcript) return;

//     const entry = {
//       question: QUESTIONS[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     setConversation((prev) => [...prev, entry]);
//     resetTranscript();

//     if (currentQIndex + 1 < QUESTIONS.length) {
//       setCurrentQIndex((prev) => prev + 1);
//     } else {
//       await supabase
//         .from('pings')
//         .update({ status: 'completed', conversation })
//         .eq('id', pingId);
//       alert('✅ Interview completed!');
//       router.push('/dashboard/candidate');
//     }
//   };

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return '👍 Great!';
//     if (ans.length > 10) return '✅ Okay!';
//     return '🙂 Try to elaborate more.';
//   };

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Speech recognition not supported in this browser.');
//     } else {
//       speak(QUESTIONS[currentQIndex]);
//     }
//   }, [currentQIndex]);

//   return (
//     <div className="min-h-screen bg-white p-6 flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">🎙️ AI Interview</h1>

//       <div className="bg-gray-100 p-6 rounded-lg shadow w-full max-w-xl">
//         <h2 className="text-lg font-semibold text-gray-700 mb-2">Q{currentQIndex + 1}:</h2>
//         <p className="text-gray-800 italic mb-4">{QUESTIONS[currentQIndex]}</p>

//         <div className="border p-3 rounded bg-white text-sm text-gray-700 mb-3 min-h-[60px]">
//           {transcript || (listening ? '🎤 Listening...' : 'Press Start to answer')}
//         </div>

//         <div className="flex items-center gap-4">
//           {!listening && !isSpeaking && (
//             <button
//               onClick={() => SpeechRecognition.startListening({ continuous: false })}
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               🎤 Start Answer
//             </button>
//           )}
//           {listening && (
//             <button
//               onClick={SpeechRecognition.stopListening}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//             >
//               ⏹️ Stop
//             </button>
//           )}
//           <button
//             onClick={handleNext}
//             disabled={listening || !transcript}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//           >
//             ✅ Submit & Next
//           </button>
//         </div>
//       </div>

//       <div className="mt-6 w-full max-w-xl">
//         <h2 className="text-md font-semibold mb-2 text-gray-800">🗒️ Conversation Log</h2>
//         <ul className="space-y-3">
//           {conversation.map((c, i) => (
//             <li key={i} className="bg-gray-50 p-3 rounded border">
//               <p><strong>Q:</strong> {c.question}</p>
//               <p><strong>A:</strong> {c.answer}</p>
//               <p className="text-sm text-green-700"><strong>AI:</strong> {c.feedback}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';

// const QUESTIONS = [
//   'Hi, can you tell me a little about yourself?',
//   'What are your biggest strengths?',
//   'Tell me about a time you faced a challenge.',
// ];

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Calling...');
//   const autoEndTimer = useRef(null);

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//   } = useSpeechRecognition();

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';
//     setStatus('Speaking...');
//     utterance.onend = () => {
//       setStatus('Listening...');
//       SpeechRecognition.startListening({ continuous: true });
//     };
//     window.speechSynthesis.speak(utterance);
//   };

//   const startInterview = () => {
//     speak(QUESTIONS[currentQIndex]);
//   };

//   const handleAutoSubmit = async () => {
//     if (!transcript.trim()) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);

//     const entry = {
//       question: QUESTIONS[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     setConversation((prev) => [...prev, entry]);
//     resetTranscript();

//     if (currentQIndex + 1 < QUESTIONS.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(QUESTIONS[currentQIndex + 1]), 1000);
//     } else {
//       setStatus('Saving...');
//       await supabase
//         .from('pings')
//         .update({ status: 'completed', conversation })
//         .eq('id', pingId);
//       alert('✅ Interview completed!');
//       router.push('/dashboard/candidate');
//     }
//   };

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return '👍 Great answer!';
//     if (ans.length > 10) return '✅ Sounds good.';
//     return '📝 Try to add more details.';
//   };

//   // Auto-submit on pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(() => {
//         handleAutoSubmit();
//       }, 5000); // 5 seconds of silence
//     }
//   }, [transcript]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Speech recognition not supported.');
//     } else {
//       startInterview();
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//       <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center">
//         <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 flex items-center justify-center">
//           <span className="text-3xl">🎙️</span>
//         </div>
//         <h1 className="text-xl font-semibold mb-1">AI HR Interview</h1>
//         <p className="text-sm text-gray-400 mb-4">{status}</p>

//         <div className="text-center mb-4">
//           <p className="text-lg font-medium mb-2">Q{currentQIndex + 1}</p>
//           <p className="italic text-gray-200">{QUESTIONS[currentQIndex]}</p>
//         </div>

//         <div className="w-full bg-gray-800 rounded p-3 text-sm h-20 overflow-y-auto mb-4">
//           {transcript || (listening ? '🎤 Listening...' : '...')}
//         </div>

//         <button
//           onClick={() => {
//             SpeechRecognition.stopListening();
//             handleAutoSubmit();
//           }}
//           disabled={!transcript}
//           className="bg-green-600 px-5 py-2 rounded text-white font-medium hover:bg-green-700 disabled:opacity-50"
//         >
//           ✅ Submit Now
//         </button>
//       </div>

//       {conversation.length > 0 && (
//         <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold mb-3">📒 Log</h2>
//           <ul className="space-y-3 text-sm">
//             {conversation.map((c, i) => (
//               <li key={i} className="bg-gray-800 p-3 rounded">
//                 <p><strong>Q:</strong> {c.question}</p>
//                 <p><strong>A:</strong> {c.answer}</p>
//                 <p className="text-green-400"><strong>AI:</strong> {c.feedback}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';

// const QUESTIONS = [
//   'Hi, can you tell me a little about yourself?',
//   'What are your biggest strengths?',
//   'Tell me about a time you faced a challenge.',
// ];

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('📞 Calling...');
//   const autoEndTimer = useRef(null);
//   const conversationRef = useRef([]);
//   const isSaving = useRef(false);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return '👍 Great answer!';
//     if (ans.length > 10) return '✅ Sounds good.';
//     return '📝 Try to add more details.';
//   };

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     utterance.lang = 'en-US';

//     setStatus('🗣️ Speaking...');
//     utterance.onend = () => {
//       setStatus('🎤 Listening...');
//       SpeechRecognition.startListening({ continuous: true });
//     };

//     window.speechSynthesis.speak(utterance);
//   };

//   const startInterview = () => {
//     speak(QUESTIONS[currentQIndex]);
//   };

//   const handleAutoSubmit = async () => {
//     if (!transcript.trim() || isSaving.current) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);

//     const newEntry = {
//       question: QUESTIONS[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     const updatedConversation = [...conversationRef.current, newEntry];
//     conversationRef.current = updatedConversation;
//     setConversation(updatedConversation);
//     resetTranscript();

//     if (currentQIndex + 1 < QUESTIONS.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(QUESTIONS[currentQIndex + 1]), 800);
//     } else {
//       setStatus('💾 Saving...');
//       isSaving.current = true;
//       await supabase
//         .from('pings')
//         .update({ status: 'completed', conversation: updatedConversation })
//         .eq('id', pingId);
//       isSaving.current = false;
//       alert('✅ Interview completed!');
//       router.push('/dashboard/candidate');
//     }
//   };

//   // Auto-submit after pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(handleAutoSubmit, 5000); // 5s pause
//     }
//   }, [transcript]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Speech recognition not supported.');
//     } else {
//       startInterview();
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//       <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center">
//         <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 flex items-center justify-center">
//           <span className="text-3xl">📞</span>
//         </div>
//         <h1 className="text-xl font-semibold mb-1">AI HR Interview</h1>
//         <p className="text-sm text-gray-400 mb-4">{status}</p>

//         <div className="text-center mb-4">
//           <p className="text-lg font-medium mb-2">Q{currentQIndex + 1}</p>
//           <p className="italic text-gray-200">{QUESTIONS[currentQIndex]}</p>
//         </div>

//         <div className="w-full bg-gray-800 rounded p-3 text-sm h-20 overflow-y-auto mb-4">
//           {transcript || (listening ? '🎤 Listening...' : '...')}
//         </div>

//         <button
//           onClick={handleAutoSubmit}
//           disabled={!transcript || isSaving.current}
//           className="bg-green-600 px-5 py-2 rounded text-white font-medium hover:bg-green-700 disabled:opacity-50"
//         >
//           ✅ Submit Now
//         </button>
//       </div>

//       {conversation.length > 0 && (
//         <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold mb-3">📒 Interview Log</h2>
//           <ul className="space-y-3 text-sm">
//             {conversation.map((c, i) => (
//               <li key={i} className="bg-gray-800 p-3 rounded">
//                 <p><strong>Q:</strong> {c.question}</p>
//                 <p><strong>A:</strong> {c.answer}</p>
//                 <p className="text-green-400"><strong>AI:</strong> {c.feedback}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';
// import { FiMic, FiMicOff, FiCheck, FiX } from 'react-icons/fi';

// const QUESTIONS = [
//   'Hi, can you tell me a little about yourself?',
//   'What are your biggest strengths?',
//   'Tell me about a time you faced a challenge.',
// ];

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Connecting...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const autoEndTimer = useRef(null);
//   const conversationRef = useRef([]);
//   const isSaving = useRef(false);
//   const volumeInterval = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   // Countdown before starting call
//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCallActive(true);
//       startInterview();
//     }
//   }, [countdown]);

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

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return 'Excellent detailed answer!';
//     if (ans.length > 10) return 'Good response.';
//     return 'Please elaborate more in your answers.';
//   };

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
//     speak(QUESTIONS[currentQIndex]);
//   };

//   const endInterview = async () => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll review your answers and get back to you soon.", () => {
//       setCallEnded(true);
//       setTimeout(() => router.push('/dashboard/candidate'), 2000);
//     });
//   };

//   const handleAutoSubmit = async () => {
//     if (!transcript.trim() || isSaving.current) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);

//     const newEntry = {
//       question: QUESTIONS[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     const updatedConversation = [...conversationRef.current, newEntry];
//     conversationRef.current = updatedConversation;
//     setConversation(updatedConversation);
//     resetTranscript();

//     if (currentQIndex + 1 < QUESTIONS.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(QUESTIONS[currentQIndex + 1]), 800);
//     } else {
//       isSaving.current = true;
//       await supabase
//         .from('pings')
//         .update({ status: 'completed', conversation: updatedConversation })
//         .eq('id', pingId);
//       endInterview();
//     }
//   };

//   // Auto-submit after pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(handleAutoSubmit, 3000);
//     }
//   }, [transcript]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/dashboard/candidate');
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
//           <p className="text-gray-400">Preparing your interview session</p>
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
//           <p className="text-gray-400">Redirecting to your dashboard...</p>
//         </div>
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
//           <p className="text-gray-400 text-sm font-medium mb-1">Question {currentQIndex + 1}/{QUESTIONS.length}</p>
//           <p className="text-white text-lg">{QUESTIONS[currentQIndex]}</p>
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
//             onClick={handleAutoSubmit}
//             disabled={!transcript || isSaving.current}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//           >
//             <FiCheck /> Submit
//           </button>
//         </div>
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
//             {conversation.map((c, i) => (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
//                 <p className="text-blue-400 text-sm font-medium mb-1">Q: {c.question}</p>
//                 <p className="text-white mb-1 text-sm">A: {c.answer}</p>
//                 <p className="text-green-400 text-xs">Feedback: {c.feedback}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';
// import { FiMic, FiMicOff, FiCheck, FiX, FiLoader } from 'react-icons/fi';

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Loading interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
//   const autoEndTimer = useRef(null);
//   const conversationRef = useRef([]);
//   const isSaving = useRef(false);
//   const volumeInterval = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   // Load ping data and generate questions
//   useEffect(() => {
//     const loadInterviewData = async () => {
//       try {
//         setIsLoadingQuestions(true);
//         setStatus('Preparing your interview...');

//         // Get ping data
//         const { data: pingData, error: pingError } = await supabase
//           .from('pings')
//           .select('job_description')
//           .eq('id', pingId)
//           .single();

//         if (pingError) {
//           console.error('Error fetching ping:', pingError);
//           throw new Error('Failed to load interview data');
//         }

//         // Generate questions based on job description
//         if (pingData?.job_description) {
//           const response = await fetch('/api/generate-questions', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               jobDescription: pingData.job_description,
//             }),
//           });

//           const data = await response.json();
//           setQuestions(data.questions || []);
//         } else {
//           // Fallback questions if no job description
//           const fallbackQuestions = [
//             'Hi, can you tell me a little about yourself?',
//             'What interests you most about this role?',
//             'What are your biggest strengths?',
//             'Tell me about a time you faced a challenge.',
//             'Where do you see yourself in the next few years?'
//           ];
//           setQuestions(fallbackQuestions);
//         }

//         setStatus('Interview ready - starting soon...');
//       } catch (error) {
//         console.error('Error loading interview:', error);
//         // Use fallback questions on error
//         const fallbackQuestions = [
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.',
//           'Where do you see yourself in the next few years?'
//         ];
//         setQuestions(fallbackQuestions);
//         setStatus('Interview ready - starting soon...');
//       } finally {
//         setIsLoadingQuestions(false);
//       }
//     };

//     loadInterviewData();
//   }, [pingId]);

//   // Countdown before starting call
//   useEffect(() => {
//     if (!isLoadingQuestions && questions.length > 0) {
//       if (countdown > 0) {
//         const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//         return () => clearTimeout(timer);
//       } else {
//         setCallActive(true);
//         startInterview();
//       }
//     }
//   }, [countdown, isLoadingQuestions, questions]);

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

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return 'Excellent detailed answer!';
//     if (ans.length > 10) return 'Good response.';
//     return 'Please elaborate more in your answers.';
//   };

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

//   const endInterview = async () => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We'll review your answers and get back to you soon.", () => {
//       setCallEnded(true);
//       setTimeout(() => router.push('/dashboard/candidate'), 2000);
//     });
//   };

//   const handleAutoSubmit = async () => {
//     if (!transcript.trim() || isSaving.current || questions.length === 0) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     const updatedConversation = [...conversationRef.current, newEntry];
//     conversationRef.current = updatedConversation;
//     setConversation(updatedConversation);
//     resetTranscript();

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       isSaving.current = true;
//       await supabase
//         .from('pings')
//         .update({ status: 'completed', conversation: updatedConversation })
//         .eq('id', pingId);
//       endInterview();
//     }
//   };

//   // Auto-submit after pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(handleAutoSubmit, 3000);
//     }
//   }, [transcript]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/dashboard/candidate');
//     }
//   }, []);

//   // Loading state
//   if (isLoadingQuestions) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
//             <FiLoader className="text-5xl animate-spin" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Preparing Interview</h1>
//           <p className="text-gray-400">Generating personalized questions...</p>
//         </div>
//       </div>
//     );
//   }

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
//           <p className="text-gray-400">Redirecting to your dashboard...</p>
//         </div>
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
//             onClick={handleAutoSubmit}
//             disabled={!transcript || isSaving.current}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//           >
//             <FiCheck /> Submit
//           </button>
//         </div>
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
//             {conversation.map((c, i) => (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
//                 <p className="text-blue-400 text-sm font-medium mb-1">Q: {c.question}</p>
//                 <p className="text-white mb-1 text-sm">A: {c.answer}</p>
//                 <p className="text-green-400 text-xs">Feedback: {c.feedback}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import supabase from '@/lib/supabaseClient';
// import { FiMic, FiMicOff, FiCheck, FiX, FiLoader } from 'react-icons/fi';

// export default function InterviewPage() {
//   const { pingId } = useParams();
//   const router = useRouter();
//   const [questions, setQuestions] = useState([]);
//   const [currentQIndex, setCurrentQIndex] = useState(0);
//   const [conversation, setConversation] = useState([]);
//   const [status, setStatus] = useState('Loading interview...');
//   const [countdown, setCountdown] = useState(3);
//   const [callActive, setCallActive] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [callEnded, setCallEnded] = useState(false);
//   const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
//   const autoEndTimer = useRef(null);
//   const conversationRef = useRef([]);
//   const isSaving = useRef(false);
//   const volumeInterval = useRef(null);

//   const { transcript, listening, resetTranscript } = useSpeechRecognition();

//   // Load ping data and generate questions
//   useEffect(() => {
//     const loadInterviewData = async () => {
//       try {
//         setIsLoadingQuestions(true);
//         setStatus('Preparing your interview...');

//         // Get ping data
//         const { data: pingData, error: pingError } = await supabase
//           .from('pings')
//           .select('job_description')
//           .eq('id', pingId)
//           .single();

//         if (pingError) {
//           console.error('Error fetching ping:', pingError);
//           throw new Error('Failed to load interview data');
//         }

//         // Generate questions based on job description
//         if (pingData?.job_description) {
//           const response = await fetch('/api/generate-questions', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               jobDescription: pingData.job_description,
//             }),
//           });

//           const data = await response.json();
//           setQuestions(data.questions || []);
//         } else {
//           // Fallback questions if no job description
//           const fallbackQuestions = [
//             'Hi, can you tell me a little about yourself?',
//             'What interests you most about this role?',
//             'What are your biggest strengths?',
//             'Tell me about a time you faced a challenge.',
//             'Where do you see yourself in the next few years?'
//           ];
//           setQuestions(fallbackQuestions);
//         }

//         setStatus('Interview ready - starting soon...');
//       } catch (error) {
//         console.error('Error loading interview:', error);
//         // Use fallback questions on error
//         const fallbackQuestions = [
//           'Hi, can you tell me a little about yourself?',
//           'What interests you most about this role?',
//           'What are your biggest strengths?',
//           'Tell me about a time you faced a challenge.',
//           'Where do you see yourself in the next few years?'
//         ];
//         setQuestions(fallbackQuestions);
//         setStatus('Interview ready - starting soon...');
//       } finally {
//         setIsLoadingQuestions(false);
//       }
//     };

//     loadInterviewData();
//   }, [pingId]);

//   // Countdown before starting call
//   useEffect(() => {
//     if (!isLoadingQuestions && questions.length > 0) {
//       if (countdown > 0) {
//         const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//         return () => clearTimeout(timer);
//       } else {
//         setCallActive(true);
//         startInterview();
//       }
//     }
//   }, [countdown, isLoadingQuestions, questions]);

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

//   const getFeedback = (ans) => {
//     if (ans.length > 30) return 'Excellent detailed answer!';
//     if (ans.length > 10) return 'Good response.';
//     return 'Please elaborate more in your answers.';
//   };

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

//   const assessAndSaveInterview = async (finalConversation) => {
//     try {
//       setStatus('Evaluating your responses...');
      
//       // Get job description for assessment
//       const { data: pingData } = await supabase
//         .from('pings')
//         .select('job_description')
//         .eq('id', pingId)
//         .single();

//       // Generate feedback using Gemini
//       const assessmentResponse = await fetch('/api/assess-responses', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jobDescription: pingData?.job_description || '',
//           conversation: finalConversation,
//         }),
//       });

//       const { feedback } = await assessmentResponse.json();

//       // Save conversation and feedback to database
//       await supabase
//         .from('pings')
//         .update({ 
//           status: 'completed', 
//           conversation: finalConversation,
//           feedback: feedback
//         })
//         .eq('id', pingId);

//       return feedback;
//     } catch (error) {
//       console.error('Assessment error:', error);
//       // Save without feedback if assessment fails
//       await supabase
//         .from('pings')
//         .update({ 
//           status: 'completed', 
//           conversation: finalConversation
//         })
//         .eq('id', pingId);
//       return null;
//     }
//   };

//   const endInterview = async (finalConversation) => {
//     setStatus('Finishing interview...');
//     speak("Thank you for your time today. We're evaluating your responses and will get back to you soon.", async () => {
//       // Assess and save the interview
//       await assessAndSaveInterview(finalConversation);
//       setCallEnded(true);
//       setTimeout(() => router.push('/dashboard/candidate'), 3000);
//     });
//   };

//   const handleAutoSubmit = async () => {
//     if (!transcript.trim() || isSaving.current || questions.length === 0) return;

//     SpeechRecognition.stopListening();
//     clearTimeout(autoEndTimer.current);

//     const newEntry = {
//       question: questions[currentQIndex],
//       answer: transcript,
//       feedback: getFeedback(transcript),
//     };

//     const updatedConversation = [...conversationRef.current, newEntry];
//     conversationRef.current = updatedConversation;
//     setConversation(updatedConversation);
//     resetTranscript();

//     if (currentQIndex + 1 < questions.length) {
//       setCurrentQIndex((prev) => prev + 1);
//       setTimeout(() => speak(questions[currentQIndex + 1]), 800);
//     } else {
//       isSaving.current = true;
//       endInterview(updatedConversation);
//     }
//   };

//   // Auto-submit after pause
//   useEffect(() => {
//     if (transcript.trim() && listening) {
//       clearTimeout(autoEndTimer.current);
//       autoEndTimer.current = setTimeout(handleAutoSubmit, 3000);
//     }
//   }, [transcript]);

//   useEffect(() => {
//     if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//       alert('Your browser does not support speech recognition.');
//       router.push('/dashboard/candidate');
//     }
//   }, []);

//   // Loading state
//   if (isLoadingQuestions) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
//         <div className="text-center">
//           <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
//             <FiLoader className="text-5xl animate-spin" />
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Preparing Interview</h1>
//           <p className="text-gray-400">Generating personalized questions...</p>
//         </div>
//       </div>
//     );
//   }

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
//           <p className="text-gray-400">Evaluating your responses...</p>
//           <p className="text-gray-500 text-sm mt-1">You&apos;ll receive feedback shortly</p>
//         </div>
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
//             onClick={handleAutoSubmit}
//             disabled={!transcript || isSaving.current}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
//           >
//             <FiCheck /> Submit
//           </button>
//         </div>
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
//             {conversation.map((c, i) => (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
//                 <p className="text-blue-400 text-sm font-medium mb-1">Q: {c.question}</p>
//                 <p className="text-white mb-1 text-sm">A: {c.answer}</p>
//                 <p className="text-green-400 text-xs">Feedback: {c.feedback}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import supabase from '@/lib/supabaseClient';
import { FiMic, FiMicOff, FiCheck, FiX, FiLoader } from 'react-icons/fi';

export default function InterviewPage() {
  const { pingId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('Loading interview...');
  const [countdown, setCountdown] = useState(3);
  const [callActive, setCallActive] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const autoEndTimer = useRef(null);
  const conversationRef = useRef([]);
  const isSaving = useRef(false);
  const volumeInterval = useRef(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const getFeedback = useCallback((ans) => {
    if (ans.length > 30) return 'Excellent detailed answer!';
    if (ans.length > 10) return 'Good response.';
    return 'Please elaborate more in your answers.';
  }, []);

  const assessAndSaveInterview = useCallback(async (finalConversation) => {
    try {
      setStatus('Evaluating your responses...');
      const { data: pingData } = await supabase
        .from('pings')
        .select('job_description')
        .eq('id', pingId)
        .single();

      const assessmentResponse = await fetch('/api/assess-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: pingData?.job_description || '',
          conversation: finalConversation,
        }),
      });

      const { feedback } = await assessmentResponse.json();

      await supabase
        .from('pings')
        .update({ status: 'completed', conversation: finalConversation, feedback })
        .eq('id', pingId);

      return feedback;
    } catch (error) {
      await supabase
        .from('pings')
        .update({ status: 'completed', conversation: finalConversation })
        .eq('id', pingId);
      return null;
    }
  }, [pingId]);

  const speak = useCallback((text, onComplete) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    setStatus('Interviewer speaking...');
    utterance.onend = () => {
      if (onComplete) onComplete();
      else {
        setStatus('Your turn - speak now');
        SpeechRecognition.startListening({ continuous: true });
      }
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const endInterview = useCallback(async (finalConversation) => {
    setStatus('Finishing interview...');
    speak("Thank you for your time today. We're evaluating your responses and will get back to you soon.", async () => {
      await assessAndSaveInterview(finalConversation);
      setCallEnded(true);
      setTimeout(() => router.push('/dashboard/candidate'), 3000);
    });
  }, [assessAndSaveInterview, router, speak]);

  const startInterview = useCallback(() => {
    if (questions.length > 0) {
      speak(questions[currentQIndex]);
    }
  }, [questions, currentQIndex, speak]);

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        setIsLoadingQuestions(true);
        setStatus('Preparing your interview...');
        const { data: pingData, error: pingError } = await supabase
          .from('pings')
          .select('job_description')
          .eq('id', pingId)
          .single();

        if (pingError) {
          throw new Error('Failed to load interview data');
        }

        if (pingData?.job_description) {
          const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription: pingData.job_description }),
          });

          const data = await response.json();
          setQuestions(data.questions || []);
        } else {
          setQuestions([
            'Hi, can you tell me a little about yourself?',
            'What interests you most about this role?',
            'What are your biggest strengths?',
            'Tell me about a time you faced a challenge.',
            'Where do you see yourself in the next few years?',
          ]);
        }

        setStatus('Interview ready - starting soon...');
      } catch (error) {
        setQuestions([
          'Hi, can you tell me a little about yourself?',
          'What interests you most about this role?',
          'What are your biggest strengths?',
          'Tell me about a time you faced a challenge.',
          'Where do you see yourself in the next few years?',
        ]);
        setStatus('Interview ready - starting soon...');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadInterviewData();
  }, [pingId]);

  useEffect(() => {
    if (!isLoadingQuestions && questions.length > 0) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setCallActive(true);
        startInterview();
      }
    }
  }, [countdown, isLoadingQuestions, questions, startInterview]);

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

  const handleAutoSubmit = useCallback(async () => {
    if (!transcript.trim() || isSaving.current || questions.length === 0) return;

    SpeechRecognition.stopListening();
    clearTimeout(autoEndTimer.current);

    const newEntry = {
      question: questions[currentQIndex],
      answer: transcript,
      feedback: getFeedback(transcript),
    };

    const updatedConversation = [...conversationRef.current, newEntry];
    conversationRef.current = updatedConversation;
    setConversation(updatedConversation);
    resetTranscript();

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setTimeout(() => speak(questions[currentQIndex + 1]), 800);
    } else {
      isSaving.current = true;
      endInterview(updatedConversation);
    }
  }, [transcript, questions, currentQIndex, resetTranscript, getFeedback, speak, endInterview]);

  useEffect(() => {
    if (transcript.trim() && listening) {
      clearTimeout(autoEndTimer.current);
      autoEndTimer.current = setTimeout(handleAutoSubmit, 3000);
    }
  }, [transcript, listening, handleAutoSubmit]);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Your browser does not support speech recognition.');
      router.push('/dashboard/candidate');
    }
  }, [router]);

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
            <FiLoader className="text-5xl animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Preparing Interview</h1>
          <p className="text-gray-400">Generating personalized questions...</p>
        </div>
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
            <span className="text-5xl animate-pulse">{countdown}</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Incoming Call</h1>
          <p className="text-gray-400">Interview starting in {countdown} seconds</p>
        </div>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <div className="text-center">
          <div className="w-32 h-32 mb-8 mx-auto rounded-full bg-green-900 flex items-center justify-center">
            <FiCheck className="text-5xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Interview Completed</h1>
          <p className="text-gray-400">Evaluating your responses...</p>
          <p className="text-gray-500 text-sm mt-1">You&apos;ll receive feedback shortly</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      {/* Call Header */}
      <div className="w-full max-w-sm text-center mb-6">
        <div className="flex justify-center items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${callActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <p className="text-gray-300">{status}</p>
        </div>
        <div className="w-full bg-gray-900 h-px mb-4"></div>
      </div>

      {/* Call Container */}
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center border border-gray-800">
        {/* Current Question */}
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-gray-400 text-sm font-medium mb-1">
            Question {currentQIndex + 1}/{questions.length}
          </p>
          <p className="text-white text-lg">
            {questions[currentQIndex] || 'Loading question...'}
          </p>
        </div>

        {/* Microphone Button */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Sound waves */}
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
            className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-200 ${listening
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
            onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
          >
            {listening ? <FiMic className="text-3xl" /> : <FiMicOff className="text-3xl" />}
          </button>
        </div>

        {/* Transcript */}
        <div className="w-full bg-gray-800 rounded-lg p-4 mb-6 h-32 overflow-y-auto border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Your response:</p>
          <p className="text-white">
            {transcript || (listening ? 'Speak now...' : 'Press mic to answer')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleAutoSubmit}
            disabled={!transcript || isSaving.current}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            <FiCheck /> Submit
          </button>
        </div>
      </div>

      {/* Conversation Log */}
      {conversation.length > 0 && (
        <div className="mt-6 w-full max-w-sm bg-gray-900 rounded-lg p-5 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm">
              {conversation.length}
            </span>
            Responses
          </h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {conversation.map((c, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <p className="text-blue-400 text-sm font-medium mb-1">Q: {c.question}</p>
                <p className="text-white mb-1 text-sm">A: {c.answer}</p>
                <p className="text-green-400 text-xs">Feedback: {c.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}