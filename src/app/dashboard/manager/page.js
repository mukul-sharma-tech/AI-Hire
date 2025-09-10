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
