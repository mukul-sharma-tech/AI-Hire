"use client";
import { useState, useRef } from 'react';
import { Sparkles, ClipboardCheck, ThumbsUp, ThumbsDown, User, FileText, Upload, Loader2 } from 'lucide-react';

// A component to render the analysis sections with proper formatting
const AnalysisSection = ({ title, content, icon, colorClass }) => {
    if (!content) return null;

    // Check if content is a list (starts with '*')
    const isList = content.trim().startsWith('*');
    const items = isList ? content.split('*').map(item => item.trim()).filter(Boolean) : [];

    return (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-2xl p-6 ${colorClass}`}>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            {isList ? (
                <ul className="space-y-2 list-inside">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start">
                             <span className="text-indigo-400 mr-2 mt-1">✓</span>
                             <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-300 leading-relaxed">{content}</p>
            )}
        </div>
    );
};

// Main App Component
export default function App() {
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [parsing, setParsing] = useState({ jd: false, resume: false });
    const [error, setError] = useState('');

    const jdFileInputRef = useRef(null);
    const resumeFileInputRef = useRef(null);

    const parseAnalysis = (text) => {
        const sections = {};
        const scoreMatch = text.match(/\*\*Match Score:\*\*.*?(\d+%)/);
        sections.score = scoreMatch ? scoreMatch[1] : 'N/A';

        const summaryMatch = text.match(/\*\*Summary:\*\*\s*([\s\S]*?)(?=\*\*Decision:\*\*)/);
        sections.summary = summaryMatch ? summaryMatch[1].trim() : '';
        
        const decisionMatch = text.match(/\*\*Decision:\*\*\s*([\s\S]*?)(?=\*\*Strengths:\*\*)/);
        sections.decision = decisionMatch ? decisionMatch[1].trim() : '';

        const strengthsMatch = text.match(/\*\*Strengths:\*\*\s*([\s\S]*?)(?=\*\*Weaknesses:\*\*)/);
        sections.strengths = strengthsMatch ? strengthsMatch[1].trim() : '';
        
        const weaknessesMatch = text.match(/\*\*Weaknesses:\*\*\s*([\s\S]*?)$/);
        sections.weaknesses = weaknessesMatch ? weaknessesMatch[1].trim() : '';

        return sections;
    };

    const getDecisionStyling = (decision) => {
        if (!decision) return { icon: <ClipboardCheck className="w-6 h-6" />, color: 'text-gray-300', bg: 'bg-gray-800/50' };
        const lowerDecision = decision.toLowerCase();
        if (lowerDecision.includes("recommended")) {
            return { icon: <ThumbsUp className="w-6 h-6" />, color: 'text-green-400', bg: 'bg-green-900/20' };
        } else if (lowerDecision.includes("not a good fit")) {
            return { icon: <ThumbsDown className="w-6 h-6" />, color: 'text-red-400', bg: 'bg-red-900/20' };
        }
        return { icon: <ClipboardCheck className="w-6 h-6" />, color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    };

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        setParsing(prev => ({ ...prev, [type]: true }));
        setError('');

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await fetch('/api/extract-text-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to extract text from PDF.');
            }

            const data = await response.json();
            if (type === 'jd') {
                setJobDescription(data.text);
            } else {
                setResume(data.text);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setParsing(prev => ({ ...prev, [type]: false }));
            // Reset file input value to allow re-uploading the same file
            event.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDescription || !resume) {
            setError('Please fill in both the job description and the resume.');
            return;
        }
        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription, resume }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Something went wrong on the server.');
            }

            const data = await response.json();
            setAnalysis(parseAnalysis(data.analysis));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const decisionStyling = analysis ? getDecisionStyling(analysis.decision) : getDecisionStyling(null);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto">
                <header className="text-center my-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                        AI Resume Analyzer
                    </h1>
                    <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                        Paste text or upload a PDF to get an instant, AI-powered analysis and hiring recommendation.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        {/* Job Description Column */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <label htmlFor="job-description" className="flex items-center text-lg font-semibold text-indigo-400"><FileText className="w-5 h-5 mr-2" />Job Description</label>
                                <input type="file" accept=".pdf" ref={jdFileInputRef} onChange={(e) => handleFileChange(e, 'jd')} style={{ display: 'none' }} />
                                <button type="button" onClick={() => jdFileInputRef.current.click()} disabled={parsing.jd} className="flex items-center bg-gray-700/50 hover:bg-gray-700 text-sm text-indigo-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50">
                                    {parsing.jd ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                    Upload PDF
                                </button>
                             </div>
                            <textarea
                                id="job-description"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="w-full h-80 bg-gray-900/50 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
                                placeholder="Paste the job description here or upload a PDF..."
                            />
                        </div>
                        {/* Resume Column */}
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <label htmlFor="resume" className="flex items-center text-lg font-semibold text-purple-400"><User className="w-5 h-5 mr-2" />Candidate`&apos;`s Resume</label>
                                <input type="file" accept=".pdf" ref={resumeFileInputRef} onChange={(e) => handleFileChange(e, 'resume')} style={{ display: 'none' }} />
                                <button type="button" onClick={() => resumeFileInputRef.current.click()} disabled={parsing.resume} className="flex items-center bg-gray-700/50 hover:bg-gray-700 text-sm text-purple-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50">
                                    {parsing.resume ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                    Upload PDF
                                </button>
                             </div>
                            <textarea
                                id="resume"
                                value={resume}
                                onChange={(e) => setResume(e.target.value)}
                                className="w-full h-80 bg-gray-900/50 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                                placeholder="Paste the candidate's resume here or upload a PDF..."
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading || parsing.jd || parsing.resume}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 flex items-center justify-center mx-auto"
                        >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                            {loading ? 'Analyzing...' : 'Analyze Now'}
                        </button>
                    </div>
                </form>

                {error && <div className="text-center bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-xl max-w-2xl mx-auto">{error}</div>}

                {/* Results Section */}
                {analysis && (
                    <div className="mt-12 animate-fade-in">
                        <h2 className="text-3xl font-bold text-center mb-8">Analysis Report</h2>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 flex flex-col gap-8">
                                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-300">Match Score</h3>
                                    <div className="text-6xl font-bold text-indigo-400">{analysis.score}</div>
                                </div>
                                <AnalysisSection title="Decision" content={analysis.decision} icon={decisionStyling.icon} colorClass={decisionStyling.bg} />
                            </div>
                            <div className="lg:col-span-2 flex flex-col gap-8">
                                <AnalysisSection title="Summary" content={analysis.summary} icon={<ClipboardCheck className="w-6 h-6" />} colorClass="" />
                                <AnalysisSection title="Strengths" content={analysis.strengths} icon={<ThumbsUp className="w-6 h-6 text-green-400" />} colorClass="" />
                                <AnalysisSection title="Weaknesses" content={analysis.weaknesses} icon={<ThumbsDown className="w-6 h-6 text-red-400" />} colorClass="" />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

