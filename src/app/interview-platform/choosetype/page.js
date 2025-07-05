// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { GoogleGenerativeAI } from '@google/generative-ai';
// // import { Moon, Sun, ChevronRight, Upload, Sparkles } from 'lucide-react';
// // import { motion, AnimatePresence } from 'framer-motion';

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

// // export default function ChooseType() {
// //   const router = useRouter();

// //   const [interviewType, setInterviewType] = useState('');
// //   const [customType, setCustomType] = useState('');
// //   const [interviewLevel, setInterviewLevel] = useState('');
// //   const [questionList, setQuestionList] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [activeTab, setActiveTab] = useState('generate');

// //   const types = ['SDE', 'HR', 'ML', 'System Design', 'Other'];
// //   const levels = ['Intern', 'Entry Level', 'Mid-Level', 'Senior Level'];

// //   const generateQuestions = async () => {
// //     const role = interviewType === 'Other' ? customType : interviewType;
// //     if (!role || !interviewLevel) return;
// //     setLoading(true);

// //     try {
// //       const prompt = `
// // You are an experienced technical interviewer.
// // Generate 4 concise and realistic interview questions for a ${interviewLevel} ${role} position.
// // - Focus on practical and commonly asked questions in real interviews.
// // - Keep each question short (1-2 lines), clear, and direct.
// // - Include topics relevant to current technologies and industry needs.
// // - Avoid complex multi-part or hypothetical case studies.
// // - Do NOT include any explanations or headings — only list the questions.
// // `.trim();

// //       const res = await fetch('/api/generate-ques', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ prompt }),
// //       });

// //       const data = await res.json();

// //       const aiQuestions = data.text
// //         .split('\n')
// //         .map(q => q.replace(/^[-•\d.]*\s*/, '').trim())
// //         .filter(Boolean)
// //         .slice(0, 4);

// //       setQuestionList(['Introduce yourself.', ...aiQuestions]);
// //     } catch (error) {
// //       console.error('Error generating questions:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //   const handleUploadPdf = async (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
  
// //     setLoading(true);
// //     try {
// //       const formData = new FormData();
// //       formData.append('pdf', file);
  
// //       const response = await fetch('/api/extract-ques', {
// //         method: 'POST',
// //         body: formData,
// //       });
  
// //       const data = await response.json();
  
// //       if (data.questions?.length > 0) {
// //         setQuestionList(data.questions);
// //       } else {
// //         alert('No questions extracted. Try another file.');
// //       }
// //     } catch (err) {
// //       console.error('Error uploading PDF:', err);
// //       alert('Something went wrong while uploading the PDF.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  
// //   const handleProceed = () => {
// //     if (questionList.length === 0) return;

// //     const role = interviewType === 'Other' ? customType : interviewType;
// //     const query = new URLSearchParams({
// //       role,
// //       level: interviewLevel,
// //       questions: JSON.stringify(questionList),
// //     }).toString();

// //     router.push(`/interview-platform/setup?${query}`);
// //   };

// //   useEffect(() => {
// //     const script = document.createElement('script');
// //     script.id = 'omnidimension-web-widget';
// //     script.async = true;
// //     script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
// //     document.body.appendChild(script);

// //     return () => {
// //       document.getElementById('omnidimension-web-widget')?.remove();
// //     };
// //   }, []);

// //   return (
// //     <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'} min-h-screen transition-colors duration-300`}>
// //       <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
// //         {/* Header with dark mode toggle */}
// //         <motion.div
// //           className="w-full flex justify-between items-center mb-8"
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
// //             Interview Prep AI
// //           </h1>
// //           <button
// //             onClick={() => setDarkMode(!darkMode)}
// //             className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'} shadow-md transition-colors`}
// //           >
// //             {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-blue-700" />}
// //           </button>
// //         </motion.div>

// //         {/* Main card */}
// //         <motion.div
// //           className={`w-full rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
// //           initial={{ scale: 0.95, opacity: 0 }}
// //           animate={{ scale: 1, opacity: 1 }}
// //           transition={{ duration: 0.4 }}
// //         >
// //           {/* Card header */}
// //           <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
// //             <h2 className="text-2xl font-bold">Prepare for Your Interview</h2>
// //             <p className="opacity-90">Get personalized questions based on your role and experience level</p>
// //           </div>

// //           {/* Card body */}
// //           <div className="p-6">
// //             {/* Tab selector */}
// //             <div className="flex mb-6 border-b">
// //               <button
// //                 onClick={() => setActiveTab('generate')}
// //                 className={`px-4 py-2 font-medium ${activeTab === 'generate' ?
// //                   `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
// //                   `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
// //               >
// //                 <Sparkles className="inline mr-2 w-4 h-4" />
// //                 Generate Questions
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab('upload')}
// //                 className={`px-4 py-2 font-medium ${activeTab === 'upload' ?
// //                   `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
// //                   `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
// //               >
// //                 <Upload className="inline mr-2 w-4 h-4" />
// //                 Upload PDF
// //               </button>
// //             </div>

// //             <AnimatePresence mode="wait">
// //               {activeTab === 'generate' ? (
// //                 <motion.div
// //                   key="generate"
// //                   initial={{ opacity: 0, x: -10 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   exit={{ opacity: 0, x: 10 }}
// //                   transition={{ duration: 0.2 }}
// //                   className="space-y-4"
// //                 >
// //                   <div>
// //                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                       Interview Type
// //                     </label>
// //                     <select
// //                       className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
// //                       value={interviewType}
// //                       onChange={(e) => setInterviewType(e.target.value)}
// //                     >
// //                       <option value="">Select a type</option>
// //                       {types.map(type => (
// //                         <option key={type} value={type}>{type}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   {interviewType === 'Other' && (
// //                     <motion.div
// //                       initial={{ opacity: 0, height: 0 }}
// //                       animate={{ opacity: 1, height: 'auto' }}
// //                       transition={{ duration: 0.3 }}
// //                     >
// //                       <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                         Custom Role
// //                       </label>
// //                       <input
// //                         type="text"
// //                         placeholder="Enter your custom role"
// //                         className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
// //                         value={customType}
// //                         onChange={(e) => setCustomType(e.target.value)}
// //                       />
// //                     </motion.div>
// //                   )}

// //                   <div>
// //                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                       Experience Level
// //                     </label>
// //                     <select
// //                       className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
// //                       value={interviewLevel}
// //                       onChange={(e) => setInterviewLevel(e.target.value)}
// //                     >
// //                       <option value="">Select a level</option>
// //                       {levels.map(level => (
// //                         <option key={level} value={level}>{level}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="pt-4">
// //                     <button
// //                       disabled={!interviewType || (interviewType === 'Other' && !customType) || !interviewLevel || loading}
// //                       onClick={generateQuestions}
// //                       className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
// //                         } text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
// //                     >
// //                       {loading ? (
// //                         <>
// //                           <motion.span
// //                             animate={{ rotate: 360 }}
// //                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //                             className="inline-block"
// //                           >
// //                             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                               <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                               <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                             </svg>
// //                           </motion.span>
// //                           Generating...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <Sparkles className="w-5 h-5" />
// //                           Generate Questions with AI
// //                         </>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </motion.div>
// //               ) : (
// //                 <motion.div
// //                   key="upload"
// //                   initial={{ opacity: 0, x: 10 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   exit={{ opacity: 0, x: -10 }}
// //                   transition={{ duration: 0.2 }}
// //                   className="space-y-6"
// //                 >
// //                   <div>
// //                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
// //                       Upload Resume/Job Description (PDF)
// //                     </label>
// //                     <div className={`border-2 border-dashed rounded-lg p-8 text-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-blue-300 bg-blue-50'}`}>
// //                       <Upload className={`mx-auto w-10 h-10 mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
// //                       <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Drag & drop your PDF file here</p>
// //                       <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or</p>
// //                       <label className="inline-block mt-2">
// //                         <span className={`py-2 px-4 rounded-lg font-medium cursor-pointer ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
// //                           Browse Files
// //                           <input type="file" accept=".pdf" onChange={handleUploadPdf} className="hidden" />
// //                         </span>
// //                       </label>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>
// //           </div>
// //         </motion.div>

// //         {/* Questions preview card */}
// //         {questionList.length > 0 && (
// //           <motion.div
// //             className={`w-full mt-6 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: 0.2 }}
// //           >
// //             <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} border-b ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
// //               <h3 className="font-bold flex items-center">
// //                 <span className={`inline-block w-2 h-2 rounded-full mr-2 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
// //                 Generated Questions Preview
// //               </h3>
// //             </div>
// //             <div className="p-4">
// //               <ul className="space-y-3">
// //                 {questionList.map((q, idx) => (
// //                   <motion.li
// //                     key={idx}
// //                     className={`flex items-start p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-blue-50 hover:bg-blue-100'} transition-colors`}
// //                     initial={{ opacity: 0, x: -10 }}
// //                     animate={{ opacity: 1, x: 0 }}
// //                     transition={{ duration: 0.3, delay: idx * 0.1 }}
// //                   >
// //                     <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 flex-shrink-0 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-200 text-blue-800'}`}>
// //                       {idx + 1}
// //                     </span>
// //                     <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{q}</span>
// //                   </motion.li>
// //                 ))}
// //               </ul>
// //               <div className="mt-6 flex justify-end">
// //                 <button
// //                   onClick={handleProceed}
// //                   className={`py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
// //                     } text-white shadow-md`}
// //                 >
// //                   Start Interview
// //                   <ChevronRight className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>
// //           </motion.div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { Moon, Sun, ChevronRight, Upload, Sparkles } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

// export default function ChooseType() {
//   const router = useRouter();

//   const [interviewType, setInterviewType] = useState('');
//   const [customType, setCustomType] = useState('');
//   const [interviewLevel, setInterviewLevel] = useState('');
//   const [questionList, setQuestionList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('generate');
//   const [countdown, setCountdown] = useState(0);
//   const [isStarting, setIsStarting] = useState(false);
  
//   const countdownRef = useRef(null);
//   const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

//   const types = ['SDE', 'HR', 'ML', 'System Design', 'Other'];
//   const levels = ['Intern', 'Entry Level', 'Mid-Level', 'Senior Level'];

//   const generateQuestions = async () => {
//     const role = interviewType === 'Other' ? customType : interviewType;
//     if (!role || !interviewLevel) return;
//     setLoading(true);

//     try {
//       const prompt = `
// You are an experienced technical interviewer.
// Generate 4 concise and realistic interview questions for a ${interviewLevel} ${role} position.
// - Focus on practical and commonly asked questions in real interviews.
// - Keep each question short (1-2 lines), clear, and direct.
// - Include topics relevant to current technologies and industry needs.
// - Avoid complex multi-part or hypothetical case studies.
// - Do NOT include any explanations or headings — only list the questions.
// `.trim();

//       const res = await fetch('/api/generate-ques', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await res.json();

//       const aiQuestions = data.text
//         .split('\n')
//         .map(q => q.replace(/^[-•\d.]*\s*/, '').trim())
//         .filter(Boolean)
//         .slice(0, 4);

//       setQuestionList(['Introduce yourself.', ...aiQuestions]);
//     } catch (error) {
//       console.error('Error generating questions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadPdf = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);
  
//       const response = await fetch('/api/extract-ques', {
//         method: 'POST',
//         body: formData,
//       });
  
//       const data = await response.json();
  
//       if (data.questions?.length > 0) {
//         setQuestionList(data.questions);
//       } else {
//         alert('No questions extracted. Try another file.');
//       }
//     } catch (err) {
//       console.error('Error uploading PDF:', err);
//       alert('Something went wrong while uploading the PDF.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const speakCountdown = (num) => {
//     if (!synthRef.current) return;
//     synthRef.current.cancel();
    
//     const text = num === 5 ? 
//       "Let us set up your interview. Starting in 5..." : 
//       num.toString();
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     synthRef.current.speak(utterance);
//   };

//   const handleProceed = () => {
//     if (questionList.length === 0) return;
    
//     setIsStarting(true);
//     setCountdown(5);
//     speakCountdown(5);
    
//     countdownRef.current = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(countdownRef.current);
          
//           // Use setTimeout to defer the router navigation
//           setTimeout(() => {
//             const role = interviewType === 'Other' ? customType : interviewType;
//             const query = new URLSearchParams({
//               role,
//               level: interviewLevel,
//               questions: JSON.stringify(questionList),
//             }).toString();
            
//             router.push(`/interview-platform/setup?${query}`);
//           }, 0);
          
//           return 0;
//         }
        
//         speakCountdown(prev - 1);
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.id = 'omnidimension-web-widget';
//     script.async = true;
//     script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=6183fc7d6bcb5beb03d9dc89bd806233';
//     document.body.appendChild(script);

//     return () => {
//       document.getElementById('omnidimension-web-widget')?.remove();
//       clearInterval(countdownRef.current);
//       if (synthRef.current) {
//         synthRef.current.cancel();
//       }
//     };
//   }, []);

//   return (
//     <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'} min-h-screen transition-colors duration-300`}>
//       <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
//         {/* Header with dark mode toggle */}
//         <motion.div
//           className="w-full flex justify-between items-center mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
//             Interview Prep AI
//           </h1>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'} shadow-md transition-colors`}
//           >
//             {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-blue-700" />}
//           </button>
//         </motion.div>

//         {/* Main card */}
//         <motion.div
//           className={`w-full rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//         >
//           {/* Card header */}
//           <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
//             <h2 className="text-2xl font-bold">Prepare for Your Interview</h2>
//             <p className="opacity-90">Get personalized questions based on your role and experience level</p>
//           </div>

//           {/* Card body */}
//           <div className="p-6">
//             {/* Tab selector */}
//             <div className="flex mb-6 border-b">
//               <button
//                 onClick={() => setActiveTab('generate')}
//                 className={`px-4 py-2 font-medium ${activeTab === 'generate' ?
//                   `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
//                   `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
//               >
//                 <Sparkles className="inline mr-2 w-4 h-4" />
//                 Generate Questions
//               </button>
//               <button
//                 onClick={() => setActiveTab('upload')}
//                 className={`px-4 py-2 font-medium ${activeTab === 'upload' ?
//                   `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
//                   `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
//               >
//                 <Upload className="inline mr-2 w-4 h-4" />
//                 Upload PDF
//               </button>
//             </div>

//             <AnimatePresence mode="wait">
//               {activeTab === 'generate' ? (
//                 <motion.div
//                   key="generate"
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 10 }}
//                   transition={{ duration: 0.2 }}
//                   className="space-y-4"
//                 >
//                   <div>
//                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Interview Type
//                     </label>
//                     <select
//                       className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                       value={interviewType}
//                       onChange={(e) => setInterviewType(e.target.value)}
//                     >
//                       <option value="">Select a type</option>
//                       {types.map(type => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                   </div>

//                   {interviewType === 'Other' && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                         Custom Role
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="Enter your custom role"
//                         className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                         value={customType}
//                         onChange={(e) => setCustomType(e.target.value)}
//                       />
//                     </motion.div>
//                   )}

//                   <div>
//                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Experience Level
//                     </label>
//                     <select
//                       className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                       value={interviewLevel}
//                       onChange={(e) => setInterviewLevel(e.target.value)}
//                     >
//                       <option value="">Select a level</option>
//                       {levels.map(level => (
//                         <option key={level} value={level}>{level}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="pt-4">
//                     <button
//                       disabled={!interviewType || (interviewType === 'Other' && !customType) || !interviewLevel || loading}
//                       onClick={generateQuestions}
//                       className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//                         } text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
//                     >
//                       {loading ? (
//                         <>
//                           <motion.span
//                             animate={{ rotate: 360 }}
//                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                             className="inline-block"
//                           >
//                             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                               <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                               <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                           </motion.span>
//                           Generating...
//                         </>
//                       ) : (
//                         <>
//                           <Sparkles className="w-5 h-5" />
//                           Generate Questions with AI
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="upload"
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       Upload Custom Interview Questions (PDF)
//                     </label>
//                     <div className={`border-2 border-dashed rounded-lg p-8 text-center ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-blue-300 bg-blue-50'}`}>
//                       <Upload className={`mx-auto w-10 h-10 mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                       <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Drag & drop your PDF file here</p>
//                       <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or</p>
//                       <label className="inline-block mt-2">
//                         <span className={`py-2 px-4 rounded-lg font-medium cursor-pointer ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
//                           Browse Files
//                           <input type="file" accept=".pdf" onChange={handleUploadPdf} className="hidden" />
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>

//         {/* Questions preview card */}
//         {questionList.length > 0 && (
//           <motion.div
//             className={`w-full mt-6 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} border-b ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
//               <h3 className="font-bold flex items-center">
//                 <span className={`inline-block w-2 h-2 rounded-full mr-2 ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
//                 Generated Questions Preview
//               </h3>
//             </div>
//             <div className="p-4">
//               <ul className="space-y-3">
//                 {questionList.map((q, idx) => (
//                   <motion.li
//                     key={idx}
//                     className={`flex items-start p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-blue-50 hover:bg-blue-100'} transition-colors`}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.3, delay: idx * 0.1 }}
//                   >
//                     <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 flex-shrink-0 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-200 text-blue-800'}`}>
//                       {idx + 1}
//                     </span>
//                     <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{q}</span>
//                   </motion.li>
//                 ))}
//               </ul>
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={handleProceed}
//                   className={`py-2 px-6 rounded-lg font-medium flex items-center gap-2 transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//                     } text-white shadow-md`}
//                 >
//                   Start Interview
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Countdown overlay */}
//         <AnimatePresence>
//           {isStarting && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//             >
//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4"
//               >
//                 <h2 className="text-3xl font-bold mb-4 dark:text-white">
//                   {countdown > 0 ? `Starting in ${countdown}...` : "Starting Interview..."}
//                 </h2>
//                 <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
//                   {countdown > 0 ? "Getting everything ready" : "Redirecting you now"}
//                 </p>
//                 <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-6">
//                   <div 
//                     className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-linear" 
//                     style={{ width: `${100 - (countdown * 20)}%` }}
//                   ></div>
//                 </div>
//                 <div className="text-gray-500 dark:text-gray-400">
//                   {countdown > 0 ? "Please wait while we prepare your interview environment" : "You'll be redirected automatically"}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun, ChevronRight, Upload, Sparkles, Phone, Typewriter, Mic, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChooseType() {
  const router = useRouter();

  const [interviewType, setInterviewType] = useState('');
  const [customType, setCustomType] = useState('');
  const [interviewLevel, setInterviewLevel] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [countdown, setCountdown] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  
  const countdownRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const types = ['SDE', 'HR', 'ML', 'System Design', 'Other'];
  const levels = ['Intern', 'Entry Level', 'Mid-Level', 'Senior Level'];

  const generateQuestions = async () => {
    const role = interviewType === 'Other' ? customType : interviewType;
    if (!role || !interviewLevel) return;
    setLoading(true);

    try {
      const prompt = `
You are an experienced technical interviewer.
Generate 4 concise and realistic interview questions for a ${interviewLevel} ${role} position.
- Focus on practical and commonly asked questions in real interviews.
- Keep each question short (1-2 lines), clear, and direct.
- Include topics relevant to current technologies and industry needs.
- Avoid complex multi-part or hypothetical case studies.
- Do NOT include any explanations or headings — only list the questions.
`.trim();

      const res = await fetch('/api/generate-ques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      const aiQuestions = data.text
        .split('\n')
        .map(q => q.replace(/^[-•\d.]*\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 4);

      setQuestionList(['Introduce yourself.', ...aiQuestions]);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
  
      const response = await fetch('/api/extract-ques', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.questions?.length > 0) {
        setQuestionList(data.questions);
      } else {
        alert('No questions extracted. Try another file.');
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      alert('Something went wrong while uploading the PDF.');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = (mode) => {
    if (questionList.length === 0) return;
    
    setIsStarting(true);
    setCountdown(3);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          
          setTimeout(() => {
            const role = interviewType === 'Other' ? customType : interviewType;
            const query = new URLSearchParams({
              role,
              level: interviewLevel,
              questions: JSON.stringify(questionList),
            }).toString();
            
            router.push(`/interview-platform/${mode}?${query}`);
          }, 0);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col items-center">
        {/* Header with dark mode toggle */}
        <motion.div
          className="w-full flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Interview Prep AI
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'} shadow-md transition-colors`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-blue-700" />}
          </button>
        </motion.div>

        {/* Main card */}
        <motion.div
          className={`w-full rounded-xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Card header */}
          <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
            <h2 className="text-2xl font-bold">Prepare for Your Interview</h2>
            <p className="opacity-90">Get personalized questions based on your role and experience level</p>
          </div>

          {/* Card body */}
          <div className="p-6">
            {/* Tab selector */}
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 font-medium ${activeTab === 'generate' ?
                  `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
                  `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
              >
                <Sparkles className="inline mr-2 w-4 h-4" />
                Generate Questions
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 font-medium ${activeTab === 'upload' ?
                  `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'}` :
                  `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
              >
                <Upload className="inline mr-2 w-4 h-4" />
                Upload PDF
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'generate' ? (
                <motion.div
                  key="generate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Interview Type
                    </label>
                    <select
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                    >
                      <option value="">Select a type</option>
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {interviewType === 'Other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Custom Role
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your custom role"
                        className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Experience Level
                    </label>
                    <select
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      value={interviewLevel}
                      onChange={(e) => setInterviewLevel(e.target.value)}
                    >
                      <option value="">Select a level</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      disabled={!interviewType || (interviewType === 'Other' && !customType) || !interviewLevel || loading}
                      onClick={generateQuestions}
                      className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                        loading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      } text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Questions with AI
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Upload Custom Interview Questions (PDF)
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      darkMode ? 'border-gray-600 bg-gray-700' : 'border-blue-300 bg-blue-50'
                    }`}>
                      <Upload className={`mx-auto w-10 h-10 mb-3 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Drag & drop your PDF file here
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or</p>
                      <label className="inline-block mt-2">
                        <span className={`py-2 px-4 rounded-lg font-medium cursor-pointer ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}>
                          Browse Files
                          <input type="file" accept=".pdf" onChange={handleUploadPdf} className="hidden" />
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Questions preview card */}
        {questionList.length > 0 && (
          <motion.div
            className={`w-full mt-6 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-100 to-indigo-100'} border-b ${
              darkMode ? 'border-gray-600' : 'border-blue-200'
            }`}>
              <h3 className="font-bold flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  darkMode ? 'bg-blue-400' : 'bg-blue-600'
                }`}></span>
                Generated Questions Preview
              </h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {questionList.map((q, idx) => (
                  <motion.li
                    key={idx}
                    className={`flex items-start p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-blue-50 hover:bg-blue-100'
                    } transition-colors`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 flex-shrink-0 ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-200 text-blue-800'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{q}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Interview Mode Selection */}
              <div className="mt-8">
                <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select Interview Mode:
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Call Interview Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={`rounded-xl p-5 cursor-pointer ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200'
                    } border ${
                      darkMode ? 'border-gray-600' : 'border-blue-200'
                    } transition-all`}
                    onClick={() => startInterview('call')}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-3 rounded-full ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-200 text-blue-700'
                      } mr-3`}>
                        <Mic className="w-6 h-6" />
                      </div>
                      <h3 className={`font-bold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>Call Interview</h3>
                    </div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Voice-based interview with speech recognition and real-time feedback</p>
                  </motion.div>

                  {/* 3D Interview Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className={`rounded-xl p-5 cursor-pointer ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200'
                    } border ${
                      darkMode ? 'border-gray-600' : 'border-indigo-200'
                    } transition-all`}
                    onClick={() => startInterview('3d')}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-3 rounded-full ${
                        darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-200 text-indigo-700'
                      } mr-3`}>
                        <Headphones className="w-6 h-6" />
                      </div>
                      <h3 className={`font-bold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>3D Interview</h3>
                    </div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Immersive 3D environment with spatial audio and realistic avatars</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {isStarting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`text-center p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <h2 className={`text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {countdown > 0 ? `Starting in ${countdown}...` : "Starting Interview..."}
                </h2>
                <p className={`text-xl mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {countdown > 0 ? "Getting everything ready" : "Redirecting you now"}
                </p>
                <div className={`w-full ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                } rounded-full h-4 mb-6`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${100 - (countdown * 33.3)}%` }}
                  ></div>
                </div>
                <div className={`${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {countdown > 0 ? "Please wait while we prepare your interview environment" : "You'll be redirected automatically"}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}