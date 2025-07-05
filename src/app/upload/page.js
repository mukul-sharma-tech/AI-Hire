// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function UploadPage() {
//   const router = useRouter();
//   const [jdText, setJdText] = useState('');
//   const [resumes, setResumes] = useState([]);

//   const extractTextFromFile = async (file) => {
//     // PDF case – use backend API
//     if (file.type === 'application/pdf') {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const res = await fetch('/api/extract-text-pdf', {
//         method: 'POST',
//         body: formData,
//       });

//       const json = await res.json();
//       return json.text;
//     }

//     // Text case – client-side
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsText(file);
//     });
//   };

//   const handleJdUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const text = await extractTextFromFile(file);
//       setJdText(text);
//     }
//   };

//   const handleResumeUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     const allTexts = [];

//     for (const file of files) {
//       const text = await extractTextFromFile(file);
//       allTexts.push(text);
//     }

//     setResumes(allTexts);
//   };

//   const handleNext = () => {
//     if (jdText && resumes.length) {
//       localStorage.setItem('jd', jdText);
//       localStorage.setItem('resumes', JSON.stringify(resumes));
//       router.push('/rank');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-8">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900">Upload Job Description</h1>
//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={handleJdUpload}
//           className="mb-6 w-full p-2 border rounded text-gray-900 bg-white"
//         />
  
//         <h2 className="text-2xl font-bold mb-4 text-gray-900">Upload 20 Résumés</h2>
//         <input
//           type="file"
//           accept=".pdf,.txt"
//           multiple
//           onChange={handleResumeUpload}
//           className="mb-6 w-full p-2 border rounded text-gray-900 bg-white"
//         />
  
//         <button
//           disabled={!jdText || resumes.length === 0}
//           onClick={handleNext}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
//         >
//           Continue to Ranking →
//         </button>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function UploadPage() {
//   const router = useRouter();
//   const [jdText, setJdText] = useState('');
//   const [resumes, setResumes] = useState([]);
//   const [resumeLimit, setResumeLimit] = useState(5);

//   const extractTextFromFile = async (file) => {
//     if (file.type === 'application/pdf') {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const res = await fetch('/api/extract-text-pdf', {
//         method: 'POST',
//         body: formData,
//       });

//       const json = await res.json();
//       return json.text;
//     }

//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsText(file);
//     });
//   };

//   const handleJdUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const text = await extractTextFromFile(file);
//       setJdText(text);
//     }
//   };

//   const handleResumeUpload = async (e) => {
//     const files = Array.from(e.target.files).slice(0, resumeLimit);
//     const uploads = [];

//     for (const file of files) {
//       const text = await extractTextFromFile(file);
//       uploads.push({ name: file.name, text });
//     }

//     setResumes(uploads);
//   };

//   const handleNext = () => {
//     if (jdText && resumes.length) {
//       localStorage.setItem('jd', jdText);
//       localStorage.setItem('resumes', JSON.stringify(resumes));
//       router.push('/rank');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-8">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900">Upload Job Description</h1>
//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={handleJdUpload}
//           className="mb-6 w-full p-2 border rounded text-gray-900 bg-white"
//         />

//         <h2 className="text-2xl font-bold mb-2 text-gray-900">Upload Résumés</h2>
//         <label className="block mb-2 text-sm text-gray-700">Select number of resumes for testing:</label>
//         <select
//           value={resumeLimit}
//           onChange={(e) => setResumeLimit(parseInt(e.target.value))}
//           className="mb-4 p-2 border rounded bg-white text-gray-900 w-full"
//         >
//           {[1, 2, 5, 10, 20].map((num) => (
//             <option key={num} value={num}>{num}</option>
//           ))}
//         </select>

//         <input
//           type="file"
//           accept=".pdf,.txt"
//           multiple
//           onChange={handleResumeUpload}
//           className="mb-4 w-full p-2 border rounded text-gray-900 bg-white"
//         />

//         {/* Résumé List Display */}
//         {resumes.length > 0 && (
//           <div className="bg-white p-4 rounded-lg border mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Résumés:</h3>
//             <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
//               {resumes.map((res, idx) => (
//                 <li key={idx}>{res.name}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <button
//           disabled={!jdText || resumes.length === 0}
//           onClick={handleNext}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
//         >
//           Continue to Ranking →
//         </button>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function UploadPage() {
//   const router = useRouter();
//   const [jdText, setJdText] = useState('');
//   const [resumes, setResumes] = useState([]);
//   const [resumeLimit, setResumeLimit] = useState(5);

//   const extractTextFromFile = async (file) => {
//     if (file.type === 'application/pdf') {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const res = await fetch('/api/extract-text-pdf', {
//         method: 'POST',
//         body: formData,
//       });

//       const json = await res.json();
//       return json.text;
//     }

//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsText(file);
//     });
//   };

//   const handleJdUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const text = await extractTextFromFile(file);
//       setJdText(text);
//     }
//   };

//   const handleResumeUpload = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const currentCount = resumes.length;
//     const remainingLimit = resumeLimit - currentCount;

//     if (remainingLimit <= 0) return;

//     const files = selectedFiles.slice(0, remainingLimit);
//     const uploads = [];

//     for (const file of files) {
//       const text = await extractTextFromFile(file);
//       uploads.push({ name: file.name, text });
//     }

//     setResumes((prev) => [...prev, ...uploads]);
//   };

//   const handleNext = () => {
//     if (jdText && resumes.length) {
//       localStorage.setItem('jd', jdText);
//       localStorage.setItem('resumes', JSON.stringify(resumes));
//       router.push('/rank');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white p-6">
//       <div className="max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-8">
//         <h1 className="text-2xl font-bold mb-4 text-gray-900">Upload Job Description</h1>
//         <input
//           type="file"
//           accept=".pdf,.txt"
//           onChange={handleJdUpload}
//           className="mb-6 w-full p-2 border rounded text-gray-900 bg-white"
//         />

//         <h2 className="text-2xl font-bold mb-2 text-gray-900">Upload Résumés</h2>
//         <label className="block mb-2 text-sm text-gray-700">Select number of resumes for testing:</label>
//         <select
//           value={resumeLimit}
//           onChange={(e) => {
//             setResumeLimit(parseInt(e.target.value));
//             setResumes([]); // reset resumes if limit changes
//           }}
//           className="mb-4 p-2 border rounded bg-white text-gray-900 w-full"
//         >
//           {[1, 2, 5, 10, 20].map((num) => (
//             <option key={num} value={num}>{num}</option>
//           ))}
//         </select>

//         <input
//           type="file"
//           accept=".pdf,.txt"
//           multiple
//           onChange={handleResumeUpload}
//           className="mb-4 w-full p-2 border rounded text-gray-900 bg-white"
//         />

//         {/* Résumé List Display */}
//         {resumes.length > 0 && (
//           <div className="bg-white p-4 rounded-lg border mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Résumés ({resumes.length}/{resumeLimit}):</h3>
//             <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
//               {resumes.map((res, idx) => (
//                 <li key={idx}>{res.name}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <button
//           disabled={!jdText || resumes.length === 0}
//           onClick={handleNext}
//           className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
//         >
//           Continue to Ranking →
//         </button>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [jdText, setJdText] = useState('');
  const [resumes, setResumes] = useState([]);
  const [resumeLimit, setResumeLimit] = useState(5);

  const extractTextFromFile = async (file) => {
    if (file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/extract-text-pdf', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      return json.text;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(file);
    });
  };

  const handleJdUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await extractTextFromFile(file);
      setJdText(text);
    }
  };

  const handleResumeUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const currentCount = resumes.length;
    const remainingLimit = resumeLimit - currentCount;

    if (remainingLimit <= 0) return;

    const files = selectedFiles.slice(0, remainingLimit);
    const uploads = [];

    for (const file of files) {
      const text = await extractTextFromFile(file);
      uploads.push({ name: file.name, text });
    }

    setResumes((prev) => [...prev, ...uploads]);
  };

  const handleRemoveResume = (index) => {
    setResumes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (jdText && resumes.length) {
      localStorage.setItem('jd', jdText);
      localStorage.setItem('resumes', JSON.stringify(resumes));
      router.push('/rank');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto bg-gray-100 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Upload Job Description</h1>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleJdUpload}
          className="mb-6 w-full p-2 border rounded text-gray-900 bg-white"
        />

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Upload Résumés</h2>
        <label className="block mb-2 text-sm text-gray-700">
          Select number of resumes for testing:
        </label>
        <select
          value={resumeLimit}
          onChange={(e) => {
            setResumeLimit(parseInt(e.target.value));
            setResumes([]); // Clear resumes when limit changes
          }}
          className="mb-4 p-2 border rounded bg-white text-gray-900 w-full"
        >
          {[1, 2, 5, 10, 20].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>

        <input
          type="file"
          accept=".pdf,.txt"
          multiple
          onChange={handleResumeUpload}
          className="mb-4 w-full p-2 border rounded text-gray-900 bg-white"
        />

        {resumes.length > 0 && (
          <div className="bg-white p-4 rounded-lg border mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Uploaded Résumés ({resumes.length}/{resumeLimit}):
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {resumes.map((res, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between pr-2 hover:bg-gray-50 rounded"
                >
                  <span className="truncate max-w-xs">{res.name}</span>
                  <button
                    onClick={() => handleRemoveResume(idx)}
                    className="ml-4 text-red-500 hover:text-red-700 text-lg font-bold"
                    aria-label="Remove resume"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          disabled={!jdText || resumes.length === 0}
          onClick={handleNext}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          Continue to Ranking →
        </button>
      </div>
    </div>
  );
}
