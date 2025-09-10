'use client';

import { useState, useMemo } from 'react';

// --- SVG Icons (for better visual appeal) ---

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-indigo-400">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const CodeBracketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-sky-400">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"></path>
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-emerald-400">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

// --- Components ---

const Header = () => (
    <header className="text-center p-4 md:p-6 mb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Personalized Career Planner
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
            Describe your current situation to generate a tailored career roadmap for any field, at any stage of life.
        </p>
    </header>
);

const Footer = () => (
    <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Powered by Next.js, LangChain, and Gemini</p>
    </footer>
);

const CareerForm = ({ setLoading, setResult, setError, loading }) => {
    const [formData, setFormData] = useState({
        stage: '',
        institution: '',
        field: '',
        background: '',
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
            const response = await fetch('/api/generate-career-path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong on the server.');
            }

            const data = await response.json();
            setResult(data.careerPath);

        } catch (err) {
            console.error("API call failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="stage" className="block text-sm font-medium text-slate-300 mb-2">
                            Current Stage
                        </label>
                        <input
                            type="text"
                            id="stage"
                            name="stage"
                            value={formData.stage}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., 2nd Year B.Tech, Working Professional"
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-slate-300 mb-2">
                            Institution / Company
                        </label>
                        <input
                            type="text"
                            id="institution"
                            name="institution"
                            value={formData.institution}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., IIT Delhi, Google"
                            className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="field" className="block text-sm font-medium text-slate-300 mb-2">
                        Field of Study / Profession
                    </label>
                    <input
                        type="text"
                        id="field"
                        name="field"
                        value={formData.field}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Computer Science, Product Management"
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>

                <div>
                     <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-2">
                        Your Background & Goals
                    </label>
                    <textarea
                        id="background"
                        name="background"
                        value={formData.background}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Briefly describe your background, skills, interests, and what you want to achieve. The more detail, the better the plan!"
                        className="w-full bg-slate-700 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    ></textarea>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
                        disabled={!formData.stage || !formData.institution || !formData.field || !formData.background || loading}
                    >
                        {loading ? 'Generating...' : 'Generate My Career Plan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ResultDisplay = ({ result, loading, error }) => {
    const parsedResult = useMemo(() => {
        if (!result) return null;
        try {
            // The AI's response can sometimes include markdown fences (```json ... ```) or other text.
            // This regex finds the first '{' and the last '}' to extract the core JSON object.
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) {
                return JSON.parse(jsonMatch[0]);
            }
            // Fallback for cases where the response is just the plain JSON string.
            return JSON.parse(result);
        } catch (e) {
            console.error("Failed to parse JSON response. Raw response:", result, "Error:", e);
            return null; // This will trigger the error display below
        }
    }, [result]);

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
                <p className="text-slate-300 mt-4">Generating your personalized roadmap... This may take a moment.</p>
            </div>
        );
    }

    if (error || (result && !parsedResult)) {
        return (
             <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                <h3 className="font-bold mb-2">An Error Occurred</h3>
                <p>{error || "The career plan could not be displayed. The format from the AI may be invalid."}</p>
             </div>
        )
    }

    if (!parsedResult) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 space-y-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">Your Generated Career Plan</h2>
            {parsedResult.trajectories?.map((trajectory, tIndex) => (
                <div key={tIndex} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-slate-100">{trajectory.title}</h3>
                        <p className="text-slate-400 mt-2">{trajectory.summary}</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 space-y-6">
                        {trajectory.phases?.map((phase, pIndex) => (
                            <div key={pIndex} className="border-l-4 border-indigo-500 pl-4">
                                <h4 className="font-semibold text-lg text-slate-200">{phase.phaseTitle}</h4>
                                <p className="text-sm font-medium text-indigo-400 mb-3">{phase.timeline}</p>
                                <div className="space-y-4">
                                    {phase.details.upskilling?.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-slate-300 flex items-center"><BookOpenIcon />Upskilling</h5>
                                            <ul className="list-disc list-inside text-slate-400 mt-2 ml-2 space-y-1">
                                                {phase.details.upskilling.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                     {phase.details.projects?.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-slate-300 flex items-center"><CodeBracketIcon />Projects & Experience</h5>
                                            <ul className="list-disc list-inside text-slate-400 mt-2 ml-2 space-y-1">
                                                {phase.details.projects.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                     {phase.details.networking?.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-slate-300 flex items-center"><UsersIcon />Networking</h5>
                                            <ul className="list-disc list-inside text-slate-400 mt-2 ml-2 space-y-1">
                                                {phase.details.networking.map((item, i) => <li key={i}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Main Page Component ---
export default function HomePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    return (
        <main className="min-h-screen bg-slate-900 text-white font-sans p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_#1e29b,_#0f172a)] -z-10"></div>
            <Header />
<CareerForm setLoading={setLoading} setResult={setResult} setError={setError} loading={loading} />
            <ResultDisplay result={result} loading={loading} error={error} />
            <Footer />
        </main>
    );
}

