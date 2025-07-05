'use client';

import { useEffect, useState } from 'react';

export default function RankPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jd = localStorage.getItem('jd');
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');

    if (!jd || resumes.length === 0) return;

    const rankResumes = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/rank', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jd, resumes }),
        });

        const data = await response.json();
        setRankings(data.rankings);
      } catch (err) {
        console.error('Ranking error:', err);
      } finally {
        setLoading(false);
      }
    };

    rankResumes();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-100 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Ranked Résumés</h1>

        {loading ? (
          <p className="text-gray-700">Ranking resumes, please wait...</p>
        ) : (
          <div className="space-y-4">
            {rankings.map((res, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded border shadow-sm flex items-start justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Resume #{idx + 1}
                  </p>
                  <p className="text-sm text-gray-700 italic">{res.rationale}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-indigo-600 font-bold text-xl">{res.score}/100</span>
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                    onClick={() => alert(`Ping sent to Resume #${idx + 1}`)}
                  >
                    Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
