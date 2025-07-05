// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function CandidateDashboard() {
//   const router = useRouter();
//   const [candidate, setCandidate] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchCandidate = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         router.push('/auth/login');
//         return;
//       }

//       const { data, error } = await supabase
//         .from('candidates')
//         .select('*')
//         .eq('email', user.email)
//         .single();

//       if (!error) setCandidate(data);
//     };

//     fetchCandidate();
//   }, [router]);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const { text } = await res.json();

//     const { error } = await supabase
//       .from('candidates')
//       .update({ resume_text: text })
//       .eq('id', candidate.id);

//     if (!error) {
//       alert('✅ Resume uploaded successfully!');
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">🎓 Candidate Dashboard</h1>

//         {candidate ? (
//           <>
//             <div className="mb-6">
//               <p className="text-lg text-gray-700 font-semibold">{candidate.name}</p>
//               <p className="text-sm text-gray-500">{candidate.email}</p>
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2 text-sm text-gray-600">
//                 Upload your résumé:
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.txt"
//                 onChange={handleResumeUpload}
//                 className="border p-2 rounded w-full"
//               />
//               {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
//             </div>

//             <div className="bg-gray-50 p-4 rounded border">
//               <h2 className="text-md font-semibold text-gray-700 mb-2">Status</h2>
//               <p className="text-sm text-gray-600">
//                 {candidate.resume_text
//                   ? '✅ Resume uploaded and saved to database.'
//                   : '❌ Resume not uploaded yet.'}
//               </p>
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-500">Loading profile...</p>
//         )}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function CandidateDashboard() {
//   const router = useRouter();
//   const [candidate, setCandidate] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [pings, setPings] = useState([]);

//   useEffect(() => {
//     const fetchCandidateAndPings = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         router.push('/auth/login');
//         return;
//       }

//       const { data: candidateData, error } = await supabase
//         .from('candidates')
//         .select('*')
//         .eq('email', user.email)
//         .single();

//       if (!error && candidateData) {
//         setCandidate(candidateData);

//         // Fetch pings for this candidate
//         const { data: pingData } = await supabase
//           .from('pings')
//           .select('*')
//           .eq('candidate_id', candidateData.id)
//           .order('created_at', { ascending: false });

//         setPings(pingData || []);
//       }
//     };

//     fetchCandidateAndPings();
//   }, [router]);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const { text } = await res.json();

//     const { error } = await supabase
//       .from('candidates')
//       .update({ resume_text: text })
//       .eq('id', candidate.id);

//     if (!error) {
//       alert('✅ Resume uploaded successfully!');
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">🎓 Candidate Dashboard</h1>

//         {candidate ? (
//           <>
//             <div className="mb-6">
//               <p className="text-lg text-gray-700 font-semibold">{candidate.name}</p>
//               <p className="text-sm text-gray-500">{candidate.email}</p>
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2 text-sm text-gray-600">
//                 Upload your résumé:
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.txt"
//                 onChange={handleResumeUpload}
//                 className="border p-2 rounded w-full"
//               />
//               {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
//             </div>

//             <div className="bg-gray-50 p-4 rounded border mb-6">
//               <h2 className="text-md font-semibold text-gray-700 mb-2">📌 Status</h2>
//               <p className="text-sm text-gray-600">
//                 {candidate.resume_text
//                   ? '✅ Resume uploaded and saved to database.'
//                   : '❌ Resume not uploaded yet.'}
//               </p>
//             </div>

//             {pings.length > 0 && (
//               <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
//                 <h2 className="text-md font-semibold text-indigo-700 mb-2">🔔 Notifications</h2>
//                 <ul className="text-sm text-indigo-800 list-disc ml-5 space-y-1">
//                   {pings.map((ping) => (
//                     <li key={ping.id}>
//                       You have been pinged regarding a job opportunity! ({new Date(ping.created_at).toLocaleString()})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-gray-500">Loading profile...</p>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function CandidateDashboard() {
//   const router = useRouter();
//   const [candidate, setCandidate] = useState(null);
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [pings, setPings] = useState([]);

//   useEffect(() => {
//     const fetchCandidateAndPings = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         router.push('/auth/login');
//         return;
//       }

//       const { data: candidateData } = await supabase
//         .from('candidates')
//         .select('*')
//         .eq('email', user.email)
//         .single();

//       if (candidateData) {
//         setCandidate(candidateData);

//         const { data: pingData } = await supabase
//           .from('pings')
//           .select('*')
//           .eq('candidate_id', candidateData.id)
//           .order('created_at', { ascending: false });

//         setPings(pingData || []);
//       }
//     };

//     fetchCandidateAndPings();
//   }, [router]);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const { text } = await res.json();

//     const { error } = await supabase
//       .from('candidates')
//       .update({ resume_text: text })
//       .eq('id', candidate.id);

//     if (!error) {
//       alert('✅ Resume uploaded successfully!');
//     }

//     setUploading(false);
//   };

//   const handleAcceptPing = async (pingId) => {
//     await supabase
//       .from('pings')
//       .update({ status: 'accepted' })
//       .eq('id', pingId);

//     router.push(`/interview/${pingId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">🎓 Candidate Dashboard</h1>

//         {candidate ? (
//           <>
//             <div className="mb-6">
//               <p className="text-lg text-gray-700 font-semibold">{candidate.name}</p>
//               <p className="text-sm text-gray-500">{candidate.email}</p>
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2 text-sm text-gray-600">
//                 Upload your résumé:
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.txt"
//                 onChange={handleResumeUpload}
//                 className="border p-2 rounded w-full"
//               />
//               {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
//             </div>

//             <div className="bg-gray-50 p-4 rounded border mb-6">
//               <h2 className="text-md font-semibold text-gray-700 mb-2">📌 Status</h2>
//               <p className="text-sm text-gray-600">
//                 {candidate.resume_text
//                   ? '✅ Resume uploaded and saved to database.'
//                   : '❌ Resume not uploaded yet.'}
//               </p>
//             </div>

//             {pings.length > 0 && (
//               <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
//                 <h2 className="text-md font-semibold text-indigo-700 mb-2">🔔 Interview Pings</h2>
//                 <ul className="text-sm text-indigo-800 space-y-3">
//                   {pings.map((ping) => (
//                     <li key={ping.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
//                       <div>
//                         <p className="font-medium">
//                           {new Date(ping.created_at).toLocaleString()}
//                         </p>
//                         <p>Status: <span className="italic">{ping.status}</span></p>
//                       </div>
//                       {ping.status === 'pending' && (
//                         <button
//                           onClick={() => handleAcceptPing(ping.id)}
//                           className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
//                         >
//                           Accept & Start
//                         </button>
//                       )}
//                       {ping.status === 'accepted' && (
//                         <button
//                           onClick={() => router.push(`/interview/${ping.id}`)}
//                           className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
//                         >
//                           Resume Interview
//                         </button>
//                       )}
//                       {ping.status === 'completed' && (
//                         <span className="text-green-700 font-semibold">✅ Completed</span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </>
//         ) : (
//           <p className="text-gray-500">Loading profile...</p>
//         )}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import supabase from '@/lib/supabaseClient';

// export default function CandidateDashboard() {
//   const router = useRouter();
//   const [candidate, setCandidate] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [pings, setPings] = useState([]);

//   useEffect(() => {
//     const fetchCandidateAndPings = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         router.push('/auth/login');
//         return;
//       }

//       const { data: candidateData } = await supabase
//         .from('candidates')
//         .select('*')
//         .eq('email', user.email)
//         .single();

//       if (candidateData) {
//         setCandidate(candidateData);

//         const { data: pingData } = await supabase
//           .from('pings')
//           .select('*')
//           .eq('candidate_id', candidateData.id)
//           .order('created_at', { ascending: false });

//         setPings(pingData || []);
//       }
//     };

//     fetchCandidateAndPings();
//   }, [router]);

//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('pdf', file);

//     const res = await fetch('/api/extract-text-pdf', {
//       method: 'POST',
//       body: formData,
//     });

//     const { text } = await res.json();

//     const { error } = await supabase
//       .from('candidates')
//       .update({ resume_text: text })
//       .eq('id', candidate.id);

//     if (!error) {
//       alert('Resume uploaded successfully.');
//     }

//     setUploading(false);
//   };

//   const handleAcceptPing = async (pingId) => {
//     await supabase.from('pings').update({ status: 'accepted' }).eq('id', pingId);
//     router.push(`/interview/${pingId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-3xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">Candidate Dashboard</h1>

//           {candidate ? (
//             <>
//               {/* Profile Section */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile</h2>
//                 <div className="bg-gray-50 p-4 rounded-lg border text-gray-700">
//                   <p className="text-lg font-medium">{candidate.name}</p>
//                   <p className="text-sm text-gray-500">{candidate.email}</p>
//                 </div>
//               </div>

//               {/* Resume Upload Section */}
//               <div className="mb-8">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">Résumé Upload</h2>
//                 <div className="bg-gray-50 p-4 rounded-lg border">
//                   <input
//                     type="file"
//                     accept=".pdf,.txt"
//                     onChange={handleResumeUpload}
//                     className="w-full mb-3 p-2 border border-gray-300 rounded text-sm"
//                   />
//                   {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
//                   <p className="text-sm mt-2">
//                     {candidate.resume_text
//                       ? <span className="text-green-600 font-medium">Uploaded</span>
//                       : <span className="text-red-500">No résumé uploaded</span>}
//                   </p>
//                 </div>
//               </div>

//               {/* Pings Section */}
//               {pings.length > 0 && (
//                 <div className="mb-4">
//                   <h2 className="text-xl font-semibold text-gray-800 mb-4">Interview Pings</h2>
//                   <div className="space-y-4">
//                     {pings.map((ping) => (
//                       <div
//                         key={ping.id}
//                         className="bg-white border border-gray-200 rounded-xl p-4 shadow flex items-center justify-between"
//                       >
//                         <div>
//                           <p className="text-sm text-gray-800 font-medium">
//                             {new Date(ping.created_at).toLocaleString()}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Status:{' '}
//                             <span
//                               className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
//                                 ping.status === 'pending'
//                                   ? 'bg-yellow-100 text-yellow-800'
//                                   : ping.status === 'accepted'
//                                   ? 'bg-blue-100 text-blue-800'
//                                   : 'bg-green-100 text-green-800'
//                               }`}
//                             >
//                               {ping.status}
//                             </span>
//                           </p>
//                         </div>

//                         {ping.status === 'pending' && (
//                           <button
//                             onClick={() => handleAcceptPing(ping.id)}
//                             className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded transition"
//                           >
//                             Accept & Start
//                           </button>
//                         )}

//                         {ping.status === 'accepted' && (
//                           <button
//                             onClick={() => router.push(`/interview/${ping.id}`)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded transition"
//                           >
//                             Resume Interview
//                           </button>
//                         )}

//                         {ping.status === 'completed' && (
//                           <span className="text-sm text-green-700 font-semibold">Completed</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <p className="text-gray-500 text-center">Loading profile...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiUser, FiBell, FiAward, FiFileText, FiCheck, FiChevronRight } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';

export default function CandidateDashboard() {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pings, setPings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateAndPings = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/auth/login');
          return;
        }

        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('*')
          .eq('email', user.email)
          .single();

        if (candidateError) throw candidateError;

        if (candidateData) {
          setCandidate(candidateData);

          const { data: pingData, error: pingError } = await supabase
            .from('pings')
            .select('*')
            .eq('candidate_id', candidateData.id)
            .order('created_at', { ascending: false });

          if (pingError) throw pingError;
          setPings(pingData || []);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateAndPings();
  }, [router]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading('Uploading and processing resume...');
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/extract-text-pdf', {
        method: 'POST',
        body: formData,
      });

      const { text } = await res.json();

      const { error } = await supabase
        .from('candidates')
        .update({ resume_text: text })
        .eq('id', candidate.id);

      if (error) throw error;
      toast.success('Resume uploaded successfully!', { id: toastId });
      setCandidate(prev => ({ ...prev, resume_text: text }));
    } catch (error) {
      toast.error('Failed to upload resume', { id: toastId });
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAcceptPing = async (pingId) => {
    const toastId = toast.loading('Accepting interview ping...');
    try {
      const { error } = await supabase
        .from('pings')
        .update({ status: 'accepted' })
        .eq('id', pingId);

      if (error) throw error;
      toast.success('Interview accepted!', { id: toastId });
      router.push(`/interview/${pingId}`);
    } catch (error) {
      toast.error('Failed to accept ping', { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="p-3 rounded-xl bg-white shadow-sm border border-blue-100 mr-4">
            <FiUser className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
            <p className="text-gray-500">Manage your profile and interviews</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : candidate ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                Profile Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{candidate.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{candidate.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resume Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiFileText className="mr-2 text-blue-500" />
                Résumé Upload
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors">
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
                    onChange={handleResumeUpload} 
                    className="hidden" 
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    <span className="text-sm text-blue-600">Processing resume...</span>
                  </div>
                )}
                <div className={`px-4 py-2 rounded-lg ${
                  candidate.resume_text 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <p className="text-sm font-medium">
                    {candidate.resume_text 
                      ? '✓ Your resume is uploaded and ready' 
                      : 'No resume uploaded yet'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Pings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiBell className="mr-2 text-blue-500" />
                Interview Pings
              </h2>
              
              {pings.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {pings.map((ping) => (
                      <motion.div
                        key={ping.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg border ${
                          ping.status === 'completed'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">
                              {new Date(ping.created_at).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                ping.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : ping.status === 'accepted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {ping.status}
                              </span>
                            </div>
                          </div>
                          
                          {ping.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptPing(ping.id)}
                              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              Accept <FiChevronRight className="ml-1" />
                            </button>
                          )}

                          {ping.status === 'accepted' && (
                            <button
                              onClick={() => router.push(`/interview/${ping.id}`)}
                              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              Continue <FiChevronRight className="ml-1" />
                            </button>
                          )}

                          {ping.status === 'completed' && (
                            <div className="flex items-center text-green-600">
                              <FiCheck className="mr-1" /> Completed
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-6 text-center bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-600">No interview pings yet</p>
                  <p className="text-sm text-gray-500 mt-1">You&apos;ll be notified here when you receive interview requests</p>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600">No candidate profile found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
