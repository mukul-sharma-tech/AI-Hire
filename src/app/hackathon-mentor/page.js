'use client';

import { useState, useMemo } from 'react';

// --- SVG Icons ---
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-amber-400">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
);

const BrainCircuitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-orange-400">
        <path d="M12 5a3 3 0 1 0-5.993.142"></path>
        <path d="M18 12a3 3 0 1 0-4.027 2.41"></path>
        <path d="M12 19a3 3 0 1 0-1.41-5.64"></path>
        <path d="M6 12a3 3 0 1 0 .59 4.14"></path>
        <path d="M15.65 6.35A3 3 0 1 0 14 5.23"></path>
        <path d="M15.5 15.5a3 3 0 1 0 3.5 0"></path>
        <path d="M9 6.86a3 3 0 1 0-1.14 4.04"></path>
        <path d="M3 14a3 3 0 1 0 5.4 1.5"></path>
        <path d="M15 17a3 3 0 1 0 2.2-4.5"></path>
    </svg>
);

// --- Components ---

const Header = () => (
    <header className="text-center p-4 md:p-6 mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            AI Hackathon Mentor
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
            Turn your hackathon idea into a winning project with AI-powered strategy and planning.
        </p>
    </header>
);

const Footer = () => (
    <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Next.js, LangChain, and Gemini</p>
    </footer>
);

const HackathonForm = ({ setLoading, setResult, setError, loading }) => {
    const [formData, setFormData] = useState({ 
        theme: '', 
        problemStatement: '' 
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
            const response = await fetch('/api/generate-hackathon-plan', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(formData) 
            });
            
            if (!response.ok) { 
                const errorData = await response.json(); 
                throw new Error(errorData.error || 'Server error.'); 
            }
            
            const data = await response.json(); 
            setResult(data.plan);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-2">
                        Hackathon Theme
                    </label>
                    <input 
                        type="text" 
                        id="theme" 
                        name="theme" 
                        value={formData.theme} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="e.g., Sustainable Urban Mobility, Healthcare Innovation, FinTech Solutions" 
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" 
                    />
                </div>
                
                <div>
                    <label htmlFor="problemStatement" className="block text-sm font-medium text-slate-300 mb-2">
                        Problem Statement
                    </label>
                    <textarea 
                        id="problemStatement" 
                        name="problemStatement" 
                        value={formData.problemStatement} 
                        onChange={handleInputChange} 
                        required 
                        rows="4" 
                        placeholder="Describe the specific problem you want to solve. Be as detailed as possible - this helps generate better project concepts. Example: How can we reduce traffic congestion and carbon emissions in metropolitan cities using smart technology and data analytics?" 
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    ></textarea>
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-amber-400 disabled:cursor-not-allowed disabled:scale-100" 
                        disabled={!formData.theme || !formData.problemStatement || loading}
                    >
                        {loading ? 'Generating...' : 'Generate Hackathon Game Plan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const HackathonPlanDisplay = ({ result }) => {
    const parsedResult = useMemo(() => {
        if (!result) return null;
        try { 
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) return JSON.parse(jsonMatch[0]);
            return JSON.parse(result);
        } catch (e) { 
            console.error("Failed to parse hackathon plan", e); 
            return null; 
        }
    }, [result]);

    if (!parsedResult) return null;
    
    return (
        <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in space-y-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Your Hackathon Game Plan
            </h2>
            
            {parsedResult.projectConcepts?.map((concept, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="p-6 bg-slate-900/50">
                        <h3 className="text-2xl font-bold text-amber-400 flex items-center">
                            <TrophyIcon /> {concept.conceptTitle}
                        </h3>
                        <p className="text-slate-400 mt-2">
                            <strong className="text-amber-300">Unique Value Proposition:</strong> {concept.uvp}
                        </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {concept.mspBlueprint && (
                            <>
                                <Section 
                                    title="Core Features (MVP)" 
                                    items={concept.mspBlueprint.features} 
                                    icon={<BrainCircuitIcon />}
                                />
                                <Section 
                                    title="Recommended Tech Stack" 
                                    items={concept.mspBlueprint.techStack} 
                                />
                            </>
                        )}
                        
                        {concept.businessModel && (
                            <Section 
                                title="Revenue Model" 
                                items={concept.businessModel.revenueStreams} 
                            />
                        )}
                        
                        {concept.marketPotential && (
                            <Section 
                                title="Market Analysis" 
                                items={[
                                    `Target Users: ${concept.marketPotential.targetUsers}`,
                                    `Market Size: ${concept.marketPotential.marketSize}`
                                ]} 
                            />
                        )}
                        
                        {concept.competitorAnalysis && concept.competitorAnalysis.competitors && (
                            <Section 
                                title="Competitive Advantage" 
                                items={concept.competitorAnalysis.competitors.map(c => 
                                    `vs ${c.name}: ${c.advantage}`
                                )} 
                            />
                        )}
                        
                        {concept.scalability && (
                            <Section 
                                title="Long-Term Vision" 
                                items={[concept.scalability.vision]} 
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Section = ({ title, items, icon }) => (
    <div>
        <h4 className="font-semibold text-lg text-slate-200 mb-3 flex items-center">
            {icon}
            {title}
        </h4>
        <ul className="list-disc list-inside text-slate-400 ml-2 space-y-1">
            {items?.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
            ))}
        </ul>
    </div>
);

const ResultContainer = ({ loading, error, result }) => {
    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
                <p className="text-slate-300 mt-4">
                    AI is crafting your winning hackathon strategy... This may take a moment.
                </p>
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
    
    if (result) return <HackathonPlanDisplay result={result} />;
    
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
            
            <HackathonForm 
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