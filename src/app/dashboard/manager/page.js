// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function ManagerDashboard() {
//     const router = useRouter();
//     const [candidates, setCandidates] = useState([]);
//     const [selected, setSelected] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch candidates from Supabase
//     useEffect(() => {
//         const fetchCandidates = async () => {
//             const { data, error } = await supabase.from('candidates').select('*');
//             if (!error) {
//                 setCandidates(data);
//             }
//             setLoading(false);
//         };
//         fetchCandidates();
//     }, []);

//     const toggleSelect = (id) => {
//         setSelected((prev) =>
//             prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//         );
//     };

//     const handleRank = () => {
//         const selectedCandidates = candidates.filter((c) =>
//             selected.includes(c.id)
//         );
//         localStorage.setItem('selectedCandidates', JSON.stringify(selectedCandidates));
//         router.push('/upload'); // use upload flow to upload JD + selected resumes
//     };

//     return (
//         <div className="min-h-screen p-6 bg-gray-50">
//             <div className="max-w-4xl mx-auto">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍💼 Manager Dashboard</h1>

//                 {loading ? (
//                     <p className="text-gray-600">Loading candidates...</p>
//                 ) : (
//                     <>
//                         <h2 className="text-xl font-semibold text-gray-700 mb-2">Candidates</h2>
//                         <div className="bg-white rounded shadow p-4 mb-4">
//                             {candidates.length === 0 ? (
//                                 <p className="text-sm text-gray-500">No candidates found.</p>
//                             ) : (
//                                 <ul className="divide-y">
//                                     {candidates.map((candidate) => (
//                                         <li key={candidate.id} className="flex justify-between items-center py-2">
//                                             <div>
//                                                 <p className="font-medium text-gray-800">{candidate.name}</p>
//                                                 <p className="text-sm text-gray-500">{candidate.email}</p>
//                                             </div>
//                                             <div className="flex items-center gap-4">
//                                                 <button
//                                                     onClick={() => toggleSelect(candidate.id)}
//                                                     className={`px-3 py-1 rounded ${selected.includes(candidate.id)
//                                                             ? 'bg-indigo-600 text-white'
//                                                             : 'border border-gray-300 text-gray-700'
//                                                         }`}
//                                                 >
//                                                     {selected.includes(candidate.id) ? 'Selected' : 'Select'}
//                                                 </button>
//                                                 <button
//                                                     className="text-sm text-blue-600 hover:underline"
//                                                     onClick={() => alert('🔔 Ping sent to candidate (mock)')}
//                                                 >
//                                                     Ping
//                                                 </button>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                         {selected.length > 0 && (
//                             <button
//                                 onClick={handleRank}
//                                 className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
//                             >
//                                 Proceed to Ranking →
//                             </button>
//                         )}
//                     </>
//                 )}
//             </div>

//             <button
//                 onClick={() => router.push('/dashboard/manager/rank')}
//                 className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//             >
//                 🚀 Go to Resume Ranking
//             </button>

//         </div>
//     );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';
// import { FaUserTie, FaEnvelope } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// export default function ManagerDashboard() {
//   const router = useRouter();
//   const [candidates, setCandidates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCandidates = async () => {
//       const { data, error } = await supabase.from('candidates').select('*');
//       if (!error) setCandidates(data);
//       setLoading(false);
//     };
//     fetchCandidates();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-blue-700 py-6 shadow-md">
//         <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex items-center gap-3"
//           >
//             <FaUserTie className="text-white text-3xl" />
//             <h1 className="text-white text-3xl font-bold">Manager Dashboard</h1>
//           </motion.div>

//           {/* Rank Button (Top Right) */}
//           <motion.button
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             onClick={() => router.push('/dashboard/manager/rank')}
//             className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition"
//           >
//             Go to Resume Ranking
//           </motion.button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-5xl mx-auto px-6 py-10">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h2 className="text-2xl font-semibold text-blue-800 mb-6">
//             All Candidates
//           </h2>

//           {loading ? (
//             <p className="text-blue-600">Loading candidates...</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {candidates.length === 0 ? (
//                 <p className="text-gray-500">No candidates found.</p>
//               ) : (
//                 candidates.map((candidate) => (
//                   <div
//                     key={candidate.id}
//                     className="bg-white border border-blue-100 rounded-lg shadow-sm p-5 hover:shadow-lg transition"
//                   >
//                     <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                       {candidate.name}
//                     </h3>
//                     <p className="flex items-center text-sm text-gray-600">
//                       <FaEnvelope className="mr-2 text-blue-500" />
//                       {candidate.email}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { FaUserTie, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ManagerDashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase.from('candidates').select('*');
      if (!error) setCandidates(data);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <FaUserTie className="text-white text-3xl" />
            <h1 className="text-white text-3xl font-bold">Manager Dashboard</h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="mb-10"
>
  <p className="text-gray-700 text-lg mb-4">
    Use our AI-powered resume ranking tool to find the most suitable candidates for your job description.
  </p>

  <div className="flex flex-wrap gap-4">
    <button
      onClick={() => router.push('/dashboard/manager/rank')}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
    >
      Go to Resume Ranking
    </button>
    <button
      onClick={() => router.push('/ping')}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
    >
      Pings
    </button>
  </div>
</motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">
            All Candidates
          </h2>

          {loading ? (
            <p className="text-blue-600">Loading candidates...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.length === 0 ? (
                <p className="text-gray-500">No candidates found.</p>
              ) : (
                candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-white border border-blue-100 rounded-lg shadow-sm p-5 hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {candidate.name}
                    </h3>
                    <p className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      {candidate.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
