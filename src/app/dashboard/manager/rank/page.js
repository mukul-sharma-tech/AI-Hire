// 'use client';

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';

// export default function ManagerRankPage() {
//   const [jdText, setJdText] = useState('');
//   const [candidates, setCandidates] = useState([]);
//   const [selected, setSelected] = useState([]);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const { data, error } = await supabase
//         .from('candidates')
//         .select('*')
//         .not('resume_text', 'is', null);

//       if (!error) setCandidates(data);
//     };

//     fetchCandidates();
//   }, []);

//   const handleJDUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const json = await res.json();
//     setJdText(json.text);
//   };

//   const handleRank = async () => {
//     const selectedResumes = candidates
//       .filter((c) => selected.includes(c.id))
//       .map((c) => c.resume_text);

//     const res = await fetch('/api/rank', {
//       method: 'POST',
//       body: JSON.stringify({ jd: jdText, resumes: selectedResumes }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const result = await res.json();
//     alert('Ranking complete!');
//     console.log(result);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">📄 Resume Ranking</h1>

//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <label className="block mb-2 text-gray-700 font-medium">Upload JD (PDF)</label>
//         <input type="file" accept=".pdf" onChange={handleJDUpload} className="mb-4" />
//         <label className="block mb-2 text-gray-700 font-medium">Or Paste JD Text</label>
//         <textarea
//           className="w-full p-2 border rounded text-gray-900"
//           rows={6}
//           value={jdText}
//           onChange={(e) => setJdText(e.target.value)}
//           placeholder="Paste JD text here..."
//         ></textarea>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h2 className="text-lg font-semibold text-gray-700 mb-2">Select Candidates:</h2>
//         <ul className="divide-y">
//           {candidates.map((c) => (
//             <li key={c.id} className="flex justify-between py-2 items-center">
//               <div>
//                 <p className="font-medium text-gray-800">{c.name}</p>
//                 <p className="text-sm text-gray-500">{c.email}</p>
//               </div>
//               <button
//                 onClick={() =>
//                   setSelected((prev) =>
//                     prev.includes(c.id)
//                       ? prev.filter((id) => id !== c.id)
//                       : [...prev, c.id]
//                   )
//                 }
//                 className={`px-3 py-1 rounded ${
//                   selected.includes(c.id)
//                     ? 'bg-indigo-600 text-white'
//                     : 'border border-gray-300 text-gray-700'
//                 }`}
//               >
//                 {selected.includes(c.id) ? 'Selected' : 'Select'}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleRank}
//         disabled={!jdText || selected.length === 0}
//         className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//       >
//         ✨ Rank Resumes
//       </button>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';

// export default function ManagerRankPage() {
//   const [jdText, setJdText] = useState('');
//   const [candidates, setCandidates] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [rankings, setRankings] = useState([]);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const { data, error } = await supabase
//         .from('candidates')
//         .select('*')
//         .not('resume_text', 'is', null);

//       if (!error) setCandidates(data);
//     };

//     fetchCandidates();
//   }, []);

//   const handleJDUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const json = await res.json();
//     setJdText(json.text);
//   };

//   const handleRank = async () => {
//     const selectedResumes = candidates
//       .filter((c) => selected.includes(c.id))
//       .map((c) => ({
//         name: c.name,
//         email: c.email,
//         text: c.resume_text,
//       }));

//     const res = await fetch('/api/rank', {
//       method: 'POST',
//       body: JSON.stringify({ jd: jdText, resumes: selectedResumes }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const result = await res.json();
//     setRankings(result.rankings || []);
//     alert('✅ Ranking complete! See results below.');
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">📄 Resume Ranking</h1>

//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <label className="block mb-2 text-gray-700 font-medium">Upload JD (PDF)</label>
//         <input type="file" accept=".pdf" onChange={handleJDUpload} className="mb-4" />
//         <label className="block mb-2 text-gray-700 font-medium">Or Paste JD Text</label>
//         <textarea
//           className="w-full p-2 border rounded text-gray-900"
//           rows={6}
//           value={jdText}
//           onChange={(e) => setJdText(e.target.value)}
//           placeholder="Paste JD text here..."
//         ></textarea>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h2 className="text-lg font-semibold text-gray-700 mb-2">Select Candidates:</h2>
//         <ul className="divide-y">
//           {candidates.map((c) => (
//             <li key={c.id} className="flex justify-between py-2 items-center">
//               <div>
//                 <p className="font-medium text-gray-800">{c.name}</p>
//                 <p className="text-sm text-gray-500">{c.email}</p>
//               </div>
//               <button
//                 onClick={() =>
//                   setSelected((prev) =>
//                     prev.includes(c.id)
//                       ? prev.filter((id) => id !== c.id)
//                       : [...prev, c.id]
//                   )
//                 }
//                 className={`px-3 py-1 rounded ${
//                   selected.includes(c.id)
//                     ? 'bg-indigo-600 text-white'
//                     : 'border border-gray-300 text-gray-700'
//                 }`}
//               >
//                 {selected.includes(c.id) ? 'Selected' : 'Select'}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleRank}
//         disabled={!jdText || selected.length === 0}
//         className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//       >
//         ✨ Rank Resumes
//       </button>

//       {rankings.length > 0 && (
//         <div className="mt-6 bg-white p-4 rounded shadow">
//           <h2 className="text-lg font-bold text-gray-800 mb-2">📊 Ranking Results</h2>
//           <ul className="space-y-3">
//             {rankings.map((r, idx) => (
//               <li key={idx} className="p-4 border rounded bg-gray-50">
//                 <p className="text-indigo-700 font-semibold">
//                   {r.name} ({r.email}) — Score: {r.score}/100
//                 </p>
//                 <p className="text-sm text-gray-600">Reason: {r.rationale}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';

// export default function ManagerRankPage() {
//   const [jdText, setJdText] = useState('');
//   const [candidates, setCandidates] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [rankings, setRankings] = useState([]);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const { data, error } = await supabase
//         .from('candidates')
//         .select('*')
//         .not('resume_text', 'is', null);

//       if (!error) setCandidates(data);
//     };

//     fetchCandidates();
//   }, []);

//   const handleJDUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const json = await res.json();
//     setJdText(json.text);
//   };

//   const handleRank = async () => {
//     const selectedResumes = candidates
//       .filter((c) => selected.includes(c.id))
//       .map((c) => ({
//         id: c.id,
//         name: c.name,
//         email: c.email,
//         text: c.resume_text,
//       }));

//     const res = await fetch('/api/rank', {
//       method: 'POST',
//       body: JSON.stringify({ jd: jdText, resumes: selectedResumes }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const result = await res.json();
//     setRankings(result.rankings || []);
//     alert('✅ Ranking complete! See results below.');
//   };

//   const handlePing = async (candidateId) => {
//     const { error } = await supabase
//       .from('pings')
//       .insert([{ candidate_id: candidateId }]);

//     if (error) {
//       console.error('Ping error:', error.message);
//       alert('❌ Failed to send ping.');
//     } else {
//       alert('✅ Ping sent!');
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">📄 Resume Ranking</h1>

//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <label className="block mb-2 text-gray-700 font-medium">Upload JD (PDF)</label>
//         <input type="file" accept=".pdf" onChange={handleJDUpload} className="mb-4" />
//         <label className="block mb-2 text-gray-700 font-medium">Or Paste JD Text</label>
//         <textarea
//           className="w-full p-2 border rounded text-gray-900"
//           rows={6}
//           value={jdText}
//           onChange={(e) => setJdText(e.target.value)}
//           placeholder="Paste JD text here..."
//         ></textarea>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-6">
//         <h2 className="text-lg font-semibold text-gray-700 mb-2">Select Candidates:</h2>
//         <ul className="divide-y">
//           {candidates.map((c) => (
//             <li key={c.id} className="flex justify-between py-2 items-center">
//               <div>
//                 <p className="font-medium text-gray-800">{c.name}</p>
//                 <p className="text-sm text-gray-500">{c.email}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() =>
//                     setSelected((prev) =>
//                       prev.includes(c.id)
//                         ? prev.filter((id) => id !== c.id)
//                         : [...prev, c.id]
//                     )
//                   }
//                   className={`px-3 py-1 rounded ${
//                     selected.includes(c.id)
//                       ? 'bg-indigo-600 text-white'
//                       : 'border border-gray-300 text-gray-700'
//                   }`}
//                 >
//                   {selected.includes(c.id) ? 'Selected' : 'Select'}
//                 </button>
//                 <button
//                   onClick={() => handlePing(c.id)}
//                   className="text-sm px-3 py-1 rounded border border-indigo-500 text-indigo-600 hover:bg-indigo-100"
//                 >
//                   🔔 Ping
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleRank}
//         disabled={!jdText || selected.length === 0}
//         className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//       >
//         ✨ Rank Resumes
//       </button>

//       {rankings.length > 0 && (
//         <div className="mt-6 bg-white p-4 rounded shadow">
//           <h2 className="text-lg font-bold text-gray-800 mb-2">📊 Ranking Results</h2>
//           <ul className="space-y-3">
//             {rankings.map((r, idx) => (
//               <li key={idx} className="p-4 border rounded bg-gray-50">
//                 <p className="text-indigo-700 font-semibold">
//                   {r.name} ({r.email}) — Score: {r.score}/100
//                 </p>
//                 <p className="text-sm text-gray-600">Reason: {r.rationale}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiUser, FiUserCheck, FiBell, FiAward, FiFileText, FiCheck, FiX } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

export default function ManagerRankPage() {
  const [jdText, setJdText] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [isRanking, setIsRanking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .not('resume_text', 'is', null);

        if (error) throw error;
        setCandidates(data);
      } catch (error) {
        toast.error('Failed to load candidates');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleJDUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Extracting text from PDF...');
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/extract-text-pdf', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      setJdText(json.text);
      toast.success('JD text extracted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to extract text', { id: toastId });
      console.error(error);
    }
  };

  const handleRank = async () => {
    setIsRanking(true);
    const toastId = toast.loading('Ranking candidates...');
    
    try {
      const selectedResumes = candidates
        .filter((c) => selected.includes(c.id))
        .map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          text: c.resume_text,
        }));

      const res = await fetch('/api/rank', {
        method: 'POST',
        body: JSON.stringify({ jd: jdText, resumes: selectedResumes }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      setRankings(result.rankings || []);
      toast.success('Ranking complete!', { id: toastId });
    } catch (error) {
      toast.error('Failed to rank candidates', { id: toastId });
      console.error(error);
    } finally {
      setIsRanking(false);
    }
  };

  // const handlePing = async (candidateId) => {
  //   // const candidate = candidates.find(c => c.id === candidateId);
  //   const candidate =
  // candidates.find(c => c.id === candidateId) ||
  // rankings.find(r => r.id === candidateId);

  //   const toastId = toast.loading(`Sending ping to ${candidate?.name}...`);
    
  //   try {
  //     const { error } = await supabase
  //       .from('pings')
  //       .insert([{ candidate_id: candidateId }]);

  //     if (error) throw error;
  //     toast.success(`Ping sent to ${candidate?.name}!`, { id: toastId });
  //   } catch (error) {
  //     toast.error(`Failed to send ping to ${candidate?.name}`, { id: toastId });
  //     console.error('Ping error:', error.message);
  //   }
  // };

  const handlePing = async (candidateId) => {
    const candidate =
      candidates.find(c => c.id === candidateId) ||
      rankings.find(r => r.id === candidateId);
  
    const toastId = toast.loading(`Sending ping to ${candidate?.name}...`);
    
    try {
      const { error } = await supabase
        .from('pings')
        .insert([{ 
          candidate_id: candidateId,
          job_description: jdText // Include the job description
        }]);
  
      if (error) throw error;
      toast.success(`Ping sent to ${candidate?.name}!`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to send ping to ${candidate?.name}`, { id: toastId });
      console.error('Ping error:', error.message);
    }
  };

  
  const toggleCandidate = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" richColors />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
            <FiAward className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resume Ranking</h1>
            <p className="text-gray-500">Find the best candidates for your position</p>
          </div>
        </div>

        {/* JD Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiFileText className="mr-2 text-blue-500" />
            Job Description
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload JD (PDF)</label>
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="text-center">
                <FiUpload className="mx-auto text-blue-500 text-2xl mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleJDUpload} 
                className="hidden" 
              />
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or paste JD text</label>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={6}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description text here..."
            />
          </div>
        </motion.div>

        {/* Candidates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              Candidates
            </h2>
            <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {selected.length} selected
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              <AnimatePresence>
                {candidates.map((c) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleCandidate(c.id)}
                          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                            selected.includes(c.id)
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:border-blue-500'
                          }`}
                        >
                          {selected.includes(c.id) ? (
                            <>
                              <FiUserCheck size={16} />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <FiUser size={16} />
                              <span>Select</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handlePing(c.id)}
                          className="p-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Ping candidate"
                        >
                          <FiBell size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        {/* Rank Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleRank}
            disabled={!jdText || selected.length === 0 || isRanking}
            className={`px-8 py-3 rounded-xl font-medium text-lg flex items-center space-x-2 transition-all ${
              !jdText || selected.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isRanking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Ranking...</span>
              </>
            ) : (
              <>
                <FiAward size={18} />
                <span>Rank Resumes</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {rankings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiAward className="mr-2 text-blue-500" />
                Ranking Results
              </h2>
              
              <div className="space-y-4">
                {rankings.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-5 rounded-lg border ${
                      idx === 0
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${
                        idx === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      } font-bold mr-4`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800">{r.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{r.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePing(r.id)}
                              className="p-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Ping candidate"
                            >
                              <FiBell size={16} />
                            </button>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                idx === 0
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              Score: {r.score}/100
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Match Rationale:</p>
                          <p className="text-sm text-gray-600">{r.rationale}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

