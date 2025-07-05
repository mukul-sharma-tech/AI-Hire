'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ATSChecker() {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const extractTextFromPdf = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    const res = await fetch('/api/extract-text-pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.text;
  };

  const handleSubmit = async () => {
    setLoading(true);

    let finalJdText = jdText;
    if (jdFile) finalJdText = await extractTextFromPdf(jdFile);
    if (!resumeFile) {
      alert('Upload a resume');
      setLoading(false);
      return;
    }

    const resumeText = await extractTextFromPdf(resumeFile);

    const res = await fetch('/api/ats-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jdText: finalJdText, resumeText }),
    });

    const data = await res.json();
    setReport(data.report);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-blue-100">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          🚀 ATS Resume Score Checker
        </h1>

        <div className="space-y-6">
          {/* JD input */}
          <div>
            <label className="block font-semibold text-blue-800 mb-2">
              📄 Paste Job Description (or upload PDF)
            </label>
            <textarea
              className="w-full p-4 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={6}
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              className="mt-2"
            />
          </div>

          {/* Resume input */}
          <div>
            <label className="block font-semibold text-blue-800 mb-2">
              📎 Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow transition-transform duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {loading ? '⏳ Checking...' : '✅ Check ATS Score'}
            </button>
          </div>
        </div>

        {/* Result display with animation */}
        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-4">📊 ATS Report</h2>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {report}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
