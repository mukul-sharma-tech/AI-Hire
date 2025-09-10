'use client';

import { useState, useMemo } from 'react';

// --- SVG Icons ---
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-3 text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const BrainCircuitIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-purple-400"><path d="M12 5a3 3 0 1 0-5.993.142"></path><path d="M18 12a3 3 0 1 0-4.027 2.41"></path><path d="M12 19a3 3 0 1 0-1.41-5.64"></path><path d="M6 12a3 3 0 1 0 .59 4.14"></path><path d="M15.65 6.35A3 3 0 1 0 14 5.23"></path><path d="M15.5 15.5a3 3 0 1 0 3.5 0"></path><path d="M9 6.86a3 3 0 1 0-1.14 4.04"></path><path d="M3 14a3 3 0 1 0 5.4 1.5"></path><path d="M15 17a3 3 0 1 0 2.2-4.5"></path></svg>
);

// --- Components ---

const Header = () => (
    <header className="text-center p-4 md:p-6 mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI Interview Prep Hub
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
            Get a personalized revision roadmap tailored to your upcoming interview.
        </p>
    </header>
);

const Footer = () => ( 
    <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by AI-Hire</p>
    </footer> 
);

const InterviewPrepForm = ({ setLoading, setResult, setError, loading }) => {
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({ 
        company: '', 
        position: '', 
        level: 'intern', 
        interviewType: 'technical', 
        interviewDate: '' 
    });

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setResult(null); 
        setError('');
        
        try {
            const response = await fetch('/api/interview-prep', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(formData) 
            });
            
            if (!response.ok) { 
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Server error.'); 
            }
            
            const data = await response.json(); 
            setResult(data.roadmap);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                            Company Name
                        </label>
                        <input 
                            type="text" 
                            id="company" 
                            name="company" 
                            value={formData.company} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="e.g., Google, Zomato" 
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                        />
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-2">
                            Position / Role
                        </label>
                        <input 
                            type="text" 
                            id="position" 
                            name="position" 
                            value={formData.position} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="e.g., SDE-1, Product Manager" 
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-2">
                            Level
                        </label>
                        <select 
                            id="level" 
                            name="level" 
                            value={formData.level} 
                            onChange={handleInputChange} 
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        >
                            <option value="intern">Intern</option>
                            <option value="entry">Entry-Level / New Grad</option>
                            <option value="junior">Junior (1-3 years)</option>
                            <option value="senior">Senior (4+ years)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="interviewType" className="block text-sm font-medium text-slate-300 mb-2">
                            Interview Type
                        </label>
                        <select 
                            id="interviewType" 
                            name="interviewType" 
                            value={formData.interviewType} 
                            onChange={handleInputChange} 
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        >
                            <option value="technical">Technical</option>
                            <option value="behavioral">Behavioral</option>
                            <option value="case">Case Study</option>
                            <option value="system-design">System Design</option>
                        </select>
                    </div>
                </div>
                
                <div>
                     <label htmlFor="interviewDate" className="block text-sm font-medium text-slate-300 mb-2">
                        Interview Date
                     </label>
                     <input 
                        type="date" 
                        id="interviewDate" 
                        name="interviewDate" 
                        value={formData.interviewDate} 
                        onChange={handleInputChange} 
                        min={getTodayString()} 
                        required 
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                     />
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-purple-400 disabled:cursor-not-allowed disabled:scale-100" 
                        disabled={!formData.company || !formData.position || !formData.interviewDate || loading}
                    >
                        {loading ? 'Generating...' : 'Generate Revision Roadmap'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const InterviewRoadmapDisplay = ({ result }) => {
    const parsedResult = useMemo(() => {
        if (!result) return null;
        try {
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch (e) { 
            console.error("Failed to parse interview roadmap", e); 
            return null; 
        }
    }, [result]);

    if (!parsedResult) return null;
    
    return (
        <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
             <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 mb-4">
                    {parsedResult.roadmapTitle}
                </h2>
                <div className="space-y-6 mt-6">
                    {parsedResult.keyFocusAreas?.map((area, index) => (
                        <div key={index} className="p-4 bg-slate-900/60 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-xl text-slate-200 flex items-center">
                                <BrainCircuitIcon />{area.areaTitle}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1 mb-4">{area.justification}</p>
                            <ul className="space-y-2">
                                {area.topics.map((topic, tIndex) => (
                                    <li key={tIndex} className="flex items-start p-2 rounded-md bg-slate-800/50">
                                        <CheckCircleIcon /> 
                                        <span className="text-slate-300">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );
};

const ResultContainer = ({ loading, error, result }) => {
     if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                <p className="text-slate-300 mt-4">AI is generating your interview roadmap... This may take a moment.</p>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                <h3 className="font-bold mb-2">An Error Occurred</h3>
                <p>{error}</p>
             </div>
        )
    }
    
    if (result) return <InterviewRoadmapDisplay result={result} />;
    
    return null;
}

// --- Main Page Component ---
export default function HomePage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    return (
        <main className="min-h-screen bg-slate-900 text-white font-sans p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_#1e293b,_#0f172a)] -z-10"></div>
            
            <Header />
            
            <InterviewPrepForm 
                setLoading={setLoading} 
                setResult={setResult} 
                setError={setError} 
                loading={loading}
            />
            
            <ResultContainer 
                loading={loading} 
                error={error} 
                result={result}
            />

            <Footer />
        </main>
    );
}