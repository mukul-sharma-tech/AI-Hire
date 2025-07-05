// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { FiArrowRight, FiUser, FiBriefcase, FiMic, FiVideo, FiFileText, FiCheckCircle , FiSmartphone} from 'react-icons/fi';

// export default function Home() {
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white overflow-hidden">
//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
//         {/* Header */}
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-4xl w-full text-center space-y-10"
//         >
//           <motion.h1
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.8 }}
//             className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
//           >
//             AI Hire Platform
//           </motion.h1>

//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.8 }}
//             className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
//           >
//             Revolutionizing recruitment with AI-powered screening, resume analysis, and intelligent interviews.
//           </motion.p>

//           {/* Action Buttons */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//             className="flex flex-wrap justify-center gap-4 sm:gap-6"
//           >
//             <Link
//               href="/auth/login"
//               className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-cyan-500/20 text-sm sm:text-base"
//             >
//               <FiUser /> Login
//             </Link>

//             <Link
//               href="/auth/signup"
//               className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-white/20 text-sm sm:text-base"
//             >
//               <FiBriefcase /> Sign Up
//             </Link>

//             <Link
//               href="/interview-platform/choosetype"
//               className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
//             >
//               <FiMic /> Try Interview
//             </Link>

//             <Link
//               href="/ats-score-checker"
//               className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-green-500/20 text-sm sm:text-base"
//             >
//               <FiCheckCircle /> ATS Checker
//             </Link>
//           </motion.div>
//         </motion.div>

//         {/* Features Section */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="mt-24 max-w-6xl w-full px-4"
//         >
//           <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
//             How It Works
//           </h2>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Feature 1 */}
//             <motion.div 
//               whileHover={{ y: -10 }}
//               className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
//             >
//               <div className="bg-cyan-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiUser className="text-cyan-400 text-xl" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">For Candidates</h3>
//               <ul className="text-gray-300 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
//                   <span>Create profile & upload resume</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
//                   <span>Check ATS score against job descriptions</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
//                   <span>Practice with AI interview simulator</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
//                   <span>Get instant feedback & reports</span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* Feature 2 */}
//             <motion.div 
//               whileHover={{ y: -10 }}
//               className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
//             >
//               <div className="bg-purple-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiBriefcase className="text-purple-400 text-xl" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">For Managers</h3>
//               <ul className="text-gray-300 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
//                   <span>Post jobs & analyze candidate resumes</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
//                   <span>View ATS compatibility scores</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
//                   <span>Send interview pings to top candidates</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
//                   <span>Review AI-analyzed interview results</span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* Feature 3 */}
//             <motion.div 
//               whileHover={{ y: -10 }}
//               className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
//             >
//               <div className="bg-pink-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <FiFileText className="text-pink-400 text-xl" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">ATS Score Checker</h3>
//               <ul className="text-gray-300 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
//                   <span>Upload your resume and job description</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
//                   <span>Get instant compatibility score (1-100)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
//                   <span>Detailed analysis of keyword matching</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
//                   <span>Personalized improvement suggestions</span>
//                 </li>
//               </ul>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* ATS Checker Spotlight */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="mt-20 max-w-4xl w-full px-4"
//         >
//           <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm p-8 rounded-xl border border-emerald-800 shadow-lg">
//             <div className="flex flex-col md:flex-row items-center gap-8">
//               <div className="flex-1">
//                 <h2 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
//                   <FiCheckCircle className="text-2xl" /> ATS Score Checker
//                 </h2>
//                 <p className="text-gray-300 mb-4">
//                   Our advanced Applicant Tracking System analyzer helps you optimize your resume for specific job postings. 
//                   Get an instant score and detailed feedback to improve your chances of getting noticed.
//                 </p>
//                 <ul className="text-gray-300 space-y-2 mb-6">
//                   <li className="flex items-start gap-2">
//                     <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
//                     <span>Keyword matching analysis</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
//                     <span>Skills gap identification</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
//                     <span>Formatting optimization</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
//                     <span>Personalized improvement plan</span>
//                   </li>
//                 </ul>
//                 <Link
//                   href="/ats-score-checker"
//                   className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-green-500/20"
//                 >
//                   Try ATS Checker Now <FiArrowRight />
//                 </Link>
//               </div>
//               <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
//                 <div className="text-center">
//                   <div className="text-5xl font-bold text-emerald-500 mb-2">87</div>
//                   <div className="text-sm uppercase tracking-wider">Sample ATS Score</div>
//                   <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
//                     <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '87%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//            {/* 3D Interview Spotlight */}
//      <div className="mt-20 max-w-4xl w-full px-4">
//            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-8 rounded-xl border border-purple-800 shadow-lg">
//              <div className="flex flex-col md:flex-row items-center gap-8">
//                <div className="flex-1">
//                  <h2 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-2">
//                    <FiVideo className="text-2xl" /> 3D AI Interview Experience
//                  </h2>
//                  <p className="text-gray-300 mb-4">
//                    Our cutting-edge 3D interview simulator creates the most realistic interview environment outside of an actual face-to-face meeting.
//                 </p>
//                  <div className="grid grid-cols-2 gap-4 mb-6">
//                    <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
//                      <h4 className="font-medium text-purple-300 mb-1">Real-time Feedback</h4>
//                      <p className="text-xs text-gray-400">Get instant analysis on your answers</p>
//                   </div>
//                    <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
//                      <h4 className="font-medium text-purple-300 mb-1">12+ Avatars</h4>
//                      <p className="text-xs text-gray-400">Choose your interviewer persona</p>
//                    </div>
//                   <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
//                     <h4 className="font-medium text-purple-300 mb-1">5 Environments</h4>
//                     <p className="text-xs text-gray-400">Office, Tech, Casual and more</p>
//                   </div>
//                   <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
//                     <h4 className="font-medium text-purple-300 mb-1">AI Analysis</h4>
//                     <p className="text-xs text-gray-400">Content, delivery, and body language</p>
//                    </div>
//                  </div>
//                 <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105">
//                   Try 3D Interview <FiArrowRight />
//                  </button>
//               </div>
//                <div className="flex-1 bg-gray-800/50 border-2 border-purple-900/30 rounded-xl p-4 h-64 flex items-center justify-center">
//                  <div className="relative w-full h-full">
//                    <div className="absolute inset-0 bg-purple-900/10 rounded-lg border border-purple-800/20 flex items-center justify-center">
//                     <div className="text-center">
//                        <div className="text-5xl font-bold text-purple-400 mb-2">3D</div>
//                        <div className="text-sm uppercase tracking-wider text-purple-300">Interview Simulator</div>
//                      </div>
//                    </div>
//                    <div className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
//                      NEW
//                   </div>
//                  </div>
//                </div>
//             </div>
//            </div>
//          </div>
//          {/* AI Calling Interview Spotlight */}
//          <div className="mt-8 max-w-4xl w-full px-4">
//            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-xl border border-cyan-800 shadow-lg">
//              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
//                <div className="flex-1">
//                  <h2 className="text-2xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
//                   <FiSmartphone className="text-2xl" /> AI Calling Interview
//                  </h2>
//                  <p className="text-gray-300 mb-4">
//                   Experience the convenience of phone interviews with the power of AI analysis. Perfect for practicing on-the-go.
//                 </p>
//                 <div className="space-y-3 mb-6">
//                   <div className="flex items-start gap-3">
//                      <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
//                       <FiCheckCircle className="text-cyan-400" />
//                      </div>
//                    <div>
//                        <h4 className="font-medium text-cyan-300">Natural Conversation Flow</h4>
//                      <p className="text-xs text-gray-400">No robotic questions - dynamic follow-ups based on your answers</p>
//                      </div>
//                    </div>
//                    <div className="flex items-start gap-3">
//                      <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
//                        <FiCheckCircle className="text-cyan-400" />
//                      </div>
//                      <div>
//                        <h4 className="font-medium text-cyan-300">Voice Analysis</h4>
//                        <p className="text-xs text-gray-400">Pace, clarity, filler words, and tone evaluation</p>
//                      </div>
//                    </div>
//                   <div className="flex items-start gap-3">
//                      <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
//                        <FiCheckCircle className="text-cyan-400" />
//                      </div>
//                      <div>
//                       <h4 className="font-medium text-cyan-300">Mobile Friendly</h4>
//                        <p className="text-xs text-gray-400">Practice from your smartphone anytime</p>
//                      </div>
//                    </div>
//                  </div>
//                 <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
//                   Try Phone Interview <FiArrowRight />
//                 </button>
//               </div>
//               <div className="flex-1 bg-gray-800/50 border-2 border-cyan-900/30 rounded-xl p-4 h-64 flex items-center justify-center">
//                  <div className="relative w-full h-full">
//                    <div className="absolute inset-0 bg-cyan-900/10 rounded-lg border border-cyan-800/20 flex items-center justify-center">
//                     <div className="text-center">
//                        <FiSmartphone className="mx-auto text-5xl text-cyan-400 mb-3" />
//                        <div className="text-sm uppercase tracking-wider text-cyan-300">Call-Style Interface</div>
//                      </div>
//                   </div>
//                   <div className="absolute -bottom-3 -left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
//                    POPULAR
//                    </div>
//                  </div>
//               </div>
//            </div>
//            </div>
//          </div>


//         {/* Manual Section */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//           viewport={{ once: true }}
//           className="mt-24 max-w-4xl w-full px-4"
//         >
//           <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
//             Platform Manual
//           </h2>

//           <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 shadow-lg">
//             <div className="space-y-8">
//               {/* ATS Checker Section */}
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
//                   <FiCheckCircle /> ATS Score Checker
//                 </h3>
//                 <div className="space-y-4">
//                   <p><strong>How to use the ATS Score Checker:</strong></p>
//                   <ol className="ml-4 space-y-3">
//                     <li className="flex items-start gap-2">
//                       <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
//                       <span>Upload your resume (PDF or DOCX format)</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
//                       <span>Paste the job description you're applying for</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
//                       <span>Get instant analysis with your ATS score (1-100)</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
//                       <span>Review detailed feedback on:
//                         <ul className="ml-6 mt-2 space-y-1 text-gray-300">
//                           <li>• Keyword matches/misses</li>
//                           <li>• Skills alignment</li>
//                           <li>• Resume structure</li>
//                           <li>• Suggested improvements</li>
//                         </ul>
//                       </span>
//                     </li>
//                   </ol>
//                   <p className="pt-2"><strong>Note:</strong> The ATS score predicts how well your resume will perform in automated screening systems used by most companies today.</p>
//                 </div>
//               </div>

//               {/* Candidate Flow */}
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
//                   <FiUser /> Candidate Flow
//                 </h3>
//                 <div className="space-y-4">
//                   <p>1. <strong>Create Account</strong> - Sign up with basic details</p>
//                   <p>2. <strong>Dashboard Access</strong> - Upload resume and check ATS scores</p>
//                   <p>3. <strong>Interview Preparation</strong> - Practice with AI interviews</p>
//                   <p>4. <strong>Application Process</strong> - Respond to interview pings</p>
//                 </div>
//               </div>

//               {/* Manager Flow */}
//               <div>
//                 <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
//                   <FiBriefcase /> Manager Flow
//                 </h3>
//                 <div className="space-y-4">
//                   <p>1. <strong>Create Account</strong> - Company registration</p>
//                   <p>2. <strong>Post Jobs</strong> - Add job descriptions</p>
//                   <p>3. <strong>Candidate Screening</strong> - View ATS-ranked applicants</p>
//                   <p>4. <strong>Interview Management</strong> - Schedule and review interviews</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

   
//          {/* CTA Section */}
//          <div className="mt-20 text-center">
//            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
//              Ready to Transform Your Hiring Journey?
//           </h2>
//            <div className="flex flex-wrap justify-center gap-4">
//            <Link href="/interview-platform/choosetype">
//             <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105">
//               <FiVideo /> Try 3D Interview
//             </button>
//           </Link>

//           <Link href="/interview-platform/choosetype">
//             <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
//               <FiSmartphone /> Try Phone Interview
//             </button>
//           </Link>

//           <Link href="/ats-score-checker">
//             <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:scale-105">
//               <FiCheckCircle /> Check ATS Score
//             </button>
//           </Link>
//           </div>
//          </div>
//        </div>
//     </div>
//   );
// }



'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiUser, FiBriefcase, FiMic, FiVideo, FiFileText, FiCheckCircle , FiSmartphone} from 'react-icons/fi';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full text-center space-y-10"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
          >
            AI Hire Platform
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Revolutionizing recruitment with AI-powered screening, resume analysis, and intelligent interviews.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
          >
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-cyan-500/20 text-sm sm:text-base"
            >
              <FiUser /> Login
            </Link>

            <Link
              href="/auth/signup"
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-white/20 text-sm sm:text-base"
            >
              <FiBriefcase /> Sign Up
            </Link>

            <Link
              href="/interview-platform/choosetype"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
            >
              <FiMic /> Try Interview
            </Link>

            <Link
              href="/ats-score-checker"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg hover:shadow-green-500/20 text-sm sm:text-base"
            >
              <FiCheckCircle /> ATS Checker
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-24 max-w-6xl w-full px-4"
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
            >
              <div className="bg-cyan-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiUser className="text-cyan-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Candidates</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Create profile &amp; upload resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Check ATS score against job descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Practice with AI interview simulator</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-cyan-400 mt-1 flex-shrink-0" />
                  <span>Get instant feedback &amp; reports</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
            >
              <div className="bg-purple-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiBriefcase className="text-purple-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Managers</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
                  <span>Post jobs &amp; analyze candidate resumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
                  <span>View ATS compatibility scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
                  <span>Send interview pings to top candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-purple-400 mt-1 flex-shrink-0" />
                  <span>Review AI-analyzed interview results</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 shadow-lg"
            >
              <div className="bg-pink-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiFileText className="text-pink-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ATS Score Checker</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
                  <span>Upload your resume and job description</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
                  <span>Get instant compatibility score (1-100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
                  <span>Detailed analysis of keyword matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiArrowRight className="text-pink-400 mt-1 flex-shrink-0" />
                  <span>Personalized improvement suggestions</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* ATS Checker Spotlight */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl w-full px-4"
        >
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm p-8 rounded-xl border border-emerald-800 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                  <FiCheckCircle className="text-2xl" /> ATS Score Checker
                </h2>
                <p className="text-gray-300 mb-4">
                  Our advanced Applicant Tracking System analyzer helps you optimize your resume for specific job postings. 
                  Get an instant score and detailed feedback to improve your chances of getting noticed.
                </p>
                <ul className="text-gray-300 space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Keyword matching analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Skills gap identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Formatting optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiArrowRight className="text-emerald-400 mt-1 flex-shrink-0" />
                    <span>Personalized improvement plan</span>
                  </li>
                </ul>
                <Link
                  href="/ats-score-checker"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-green-500/20"
                >
                  Try ATS Checker Now <FiArrowRight />
                </Link>
              </div>
              <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-500 mb-2">87</div>
                  <div className="text-sm uppercase tracking-wider">Sample ATS Score</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3D Interview Spotlight */}
        <div className="mt-20 max-w-4xl w-full px-4">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-8 rounded-xl border border-purple-800 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-purple-300 flex items-center gap-2">
                  <FiVideo className="text-2xl" /> 3D AI Interview Experience
                </h2>
                <p className="text-gray-300 mb-4">
                  Our cutting-edge 3D interview simulator creates the most realistic interview environment outside of an actual face-to-face meeting.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                    <h4 className="font-medium text-purple-300 mb-1">Real-time Feedback</h4>
                    <p className="text-xs text-gray-400">Get instant analysis on your answers</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                    <h4 className="font-medium text-purple-300 mb-1">12+ Avatars</h4>
                    <p className="text-xs text-gray-400">Choose your interviewer persona</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                    <h4 className="font-medium text-purple-300 mb-1">5 Environments</h4>
                    <p className="text-xs text-gray-400">Office, Tech, Casual and more</p>
                  </div>
                  <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-800/30">
                    <h4 className="font-medium text-purple-300 mb-1">AI Analysis</h4>
                    <p className="text-xs text-gray-400">Content, delivery, and body language</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105">
                  Try 3D Interview <FiArrowRight />
                </button>
              </div>
              <div className="flex-1 bg-gray-800/50 border-2 border-purple-900/30 rounded-xl p-4 h-64 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-purple-900/10 rounded-lg border border-purple-800/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-purple-400 mb-2">3D</div>
                      <div className="text-sm uppercase tracking-wider text-purple-300">Interview Simulator</div>
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Calling Interview Spotlight */}
        <div className="mt-8 max-w-4xl w-full px-4">
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-xl border border-cyan-800 shadow-lg">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                  <FiSmartphone className="text-2xl" /> AI Calling Interview
                </h2>
                <p className="text-gray-300 mb-4">
                  Experience the convenience of phone interviews with the power of AI analysis. Perfect for practicing on-the-go.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
                      <FiCheckCircle className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cyan-300">Natural Conversation Flow</h4>
                      <p className="text-xs text-gray-400">No robotic questions - dynamic follow-ups based on your answers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
                      <FiCheckCircle className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cyan-300">Voice Analysis</h4>
                      <p className="text-xs text-gray-400">Pace, clarity, filler words, and tone evaluation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-900/20 p-1 rounded-full mt-1 flex-shrink-0">
                      <FiCheckCircle className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cyan-300">Mobile Friendly</h4>
                      <p className="text-xs text-gray-400">Practice from your smartphone anytime</p>
                    </div>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
                  Try Phone Interview <FiArrowRight />
                </button>
              </div>
              <div className="flex-1 bg-gray-800/50 border-2 border-cyan-900/30 rounded-xl p-4 h-64 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-cyan-900/10 rounded-lg border border-cyan-800/20 flex items-center justify-center">
                    <div className="text-center">
                      <FiSmartphone className="mx-auto text-5xl text-cyan-400 mb-3" />
                      <div className="text-sm uppercase tracking-wider text-cyan-300">Call-Style Interface</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    POPULAR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-24 max-w-4xl w-full px-4"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Platform Manual
          </h2>

          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800 shadow-lg">
            <div className="space-y-8">
              {/* ATS Checker Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                  <FiCheckCircle /> ATS Score Checker
                </h3>
                <div className="space-y-4">
                  <p><strong>How to use the ATS Score Checker:</strong></p>
                  <ol className="ml-4 space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                      <span>Upload your resume (PDF or DOCX format)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                      <span>Paste the job description you&apos;re applying for</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                      <span>Get instant analysis with your ATS score (1-100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-emerald-900 text-emerald-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">4</span>
                      <span>Review detailed feedback on:
                        <ul className="ml-6 mt-2 space-y-1 text-gray-300">
                          <li>• Keyword matches/misses</li>
                          <li>• Skills alignment</li>
                          <li>• Resume structure</li>
                          <li>• Suggested improvements</li>
                        </ul>
                      </span>
                    </li>
                  </ol>
                  <p className="pt-2"><strong>Note:</strong> The ATS score predicts how well your resume will perform in automated screening systems used by most companies today.</p>
                </div>
              </div>

              {/* Candidate Flow */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                  <FiUser /> Candidate Flow
                </h3>
                <div className="space-y-4">
                  <p>1. <strong>Create Account</strong> - Sign up with basic details</p>
                  <p>2. <strong>Dashboard Access</strong> - Upload resume and check ATS scores</p>
                  <p>3. <strong>Interview Preparation</strong> - Practice with AI interviews</p>
                  <p>4. <strong>Application Process</strong> - Respond to interview pings</p>
                </div>
              </div>

              {/* Manager Flow */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                  <FiBriefcase /> Manager Flow
                </h3>
                <div className="space-y-4">
                  <p>1. <strong>Create Account</strong> - Company registration</p>
                  <p>2. <strong>Post Jobs</strong> - Add job descriptions</p>
                  <p>3. <strong>Candidate Screening</strong> - View ATS-ranked applicants</p>
                  <p>4. <strong>Interview Management</strong> - Schedule and review interviews</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Ready to Transform Your Hiring Journey?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/interview-platform/choosetype">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/20 hover:scale-105">
                <FiVideo /> Try 3D Interview
              </button>
            </Link>

            <Link href="/interview-platform/choosetype">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
                <FiSmartphone /> Try Phone Interview
              </button>
            </Link>

            <Link href="/ats-score-checker">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20 hover:scale-105">
                <FiCheckCircle /> Check ATS Score
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}