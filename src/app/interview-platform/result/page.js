"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ReactMarkdown from 'react-markdown'; // <--- 1. IMPORT THE LIBRARY

// This component remains the same
function BehavioralSummary({ metrics }) {
  if (!metrics) {
    return <p className="text-sm text-gray-500 italic mt-2">No behavioral data available for this question.</p>;
  }

  const confidence = 100 - (metrics.nervousnessScore || 0);
  const confusionText = metrics.confusionStatus?.isConfused ? 'Detected' : 'Not Detected';
  const confusionColor = metrics.confusionStatus?.isConfused ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-3 text-base">Behavioral Analysis</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Emotion</span>
          <span className="font-bold text-gray-800 capitalize">{metrics.emotion || 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Eye Contact</span>
          <span className="font-bold text-gray-800">{metrics.eyeContactScore !== undefined ? `${metrics.eyeContactScore}%` : 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Confidence</span>
          <span className="font-bold text-gray-800">{confidence}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Confusion</span>
          <span className={`font-bold ${confusionColor}`}>{confusionText}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Blinks</span>
          <span className="font-bold text-gray-800">{metrics.blinkCount || 0}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Gaze</span>
          <span className="font-bold text-gray-800 capitalize">{metrics.gazeDirection || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}


function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [interviewType, setInterviewType] = useState("");
  const [level, setLevel] = useState("");
  const [qaPairs, setQaPairs] = useState([]);

  useEffect(() => {
    const data = searchParams.get("data");
    const type = searchParams.get("type") || "Technical";
    const levelParam = searchParams.get("level") || "Unspecified";
    
    if (!data) {
      router.push("/");
      return;
    }
    
    try {
      const parsed = JSON.parse(decodeURIComponent(data));
      setQaPairs(parsed);
      setInterviewType(type);
      setLevel(levelParam);
    } catch (err) {
      console.error("Error parsing data from query:", err);
      router.push("/");
    }
  }, [searchParams, router]);
  
  useEffect(() => {
    if (qaPairs.length === 0) return;

    const generateReport = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qaPairs, interviewType, level }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error from API");

        setReport(data.report);
      } catch (err) {
        console.error("Client Error:", err);
        setReport("❌ Error generating overall summary. Detailed analysis is still available below.");
      }
      setLoading(false);
    };

    generateReport();
  }, [qaPairs, interviewType, level]);

  const downloadAsPDF = async () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("AI-Hire_Interview_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div id="report-content" className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-10 border-b pb-6">
          <h1 className="text-4xl font-bold text-blue-800">Interview Report</h1>
          <h2 className="text-xl text-blue-600 mt-2">Role: {interviewType} ({level} Level)</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-700 text-lg">Generating your detailed report...</p>
          </div>
        ) : (
          <>
            {/* Section 1: Overall Summary from API */}
            <div className="mb-12">
               <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Overall Summary</h2>
               {/* --- 2. THIS IS THE FIX --- */}
               <div className="prose prose-blue max-w-none">
                  <ReactMarkdown>{report}</ReactMarkdown>
               </div>
            </div>

            {/* Section 2: Detailed Question-by-Question Analysis */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2 mb-6">Detailed Analysis</h2>
              <div className="space-y-8">
                {qaPairs.map((pair, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700">
                      Question {index + 1}: <span className="font-normal">{pair.question}</span>
                    </h3>
                    <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-md">
                      {/* 3. Corrected apostrophe */}
                      <span className="font-semibold">Candidate`&apos;`s Answer:</span> {pair.answer || <span className="italic text-gray-400">No answer provided.</span>}
                    </p>
                    <BehavioralSummary metrics={pair.behaviorMetrics} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {!loading && (
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={downloadAsPDF}
            className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Download Report (PDF)
          </button>
          <button
            onClick={() => router.push("/interview-platform")}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Start New Interview
          </button>
        </div>
      )}
    </div>
  );
}

// The Suspense wrapper remains the same
export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg">Loading interview results...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}