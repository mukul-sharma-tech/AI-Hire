// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

// export default function ResultPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [report, setReport] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [interviewType, setInterviewType] = useState("");
//   const [qaPairs, setQaPairs] = useState([]);

//   useEffect(() => {
//     const data = searchParams.get("data");
//     const type = searchParams.get("type") || "Technical";

//     if (!data) {
//       router.push("/");
//       return;
//     }

//     try {
//       const parsed = JSON.parse(decodeURIComponent(data));
//       setQaPairs(parsed);
//       setInterviewType(type);
//     } catch (err) {
//       console.error("Error parsing data from query:", err);
//       router.push("/");
//     }
//   }, [searchParams, router]);

//   useEffect(() => {
//     if (qaPairs.length === 0) return;

//     const generateReport = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/generate-report", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ qaPairs, interviewType }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Error from API");

//         setReport(data.report);
//       } catch (err) {
//         console.error("Client Error:", err);
//         setReport("❌ Error generating report. Please try again.");
//       }
//       setLoading(false);
//     };

//     generateReport();
//   }, [qaPairs, interviewType]);

//   const downloadAsPDF = async () => {
//     const reportElement = document.getElementById("report-content");
//     const canvas = await html2canvas(reportElement, {
//       scale: 2,
//       useCORS: true,
//       scrollY: -window.scrollY,
//     });

//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgData = canvas.toDataURL("image/png");

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft > 0) {
//       position -= pageHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save("interview_report.pdf");
//   };

//   return (
//     <div className="min-h-screen bg-white px-4 py-10">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold text-blue-800">Interview Report</h1>
//           <h2 className="text-xl text-blue-600 mt-2">Role: {interviewType}</h2>
//         </div>

//         {loading ? (
//           <div className="text-center py-20">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-blue-700 text-lg">Generating your detailed report...</p>
//           </div>
//         ) : (
//           <>
//             <div
//               id="report-content"
//               style={{
//                 backgroundColor: "#f0f4ff",
//                 padding: "24px",
//                 borderRadius: "12px",
//                 color: "#1e293b",
//                 fontFamily: "Arial, sans-serif",
//               }}
//             >
//               {report.split("\n").map((line, index) => {
//                 if (line.startsWith("##")) {
//                   return (
//                     <h2
//                       key={index}
//                       style={{ color: "#1d4ed8", marginTop: "1.5rem", marginBottom: "1rem", fontSize: "1.25rem" }}
//                     >
//                       {line.replace("##", "").trim()}
//                     </h2>
//                   );
//                 } else if (line.startsWith("Q")) {
//                   return (
//                     <p key={index} style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
//                       {line}
//                     </p>
//                   );
//                 } else {
//                   return (
//                     <p key={index} style={{ marginBottom: "0.75rem", color: "#334155" }}>
//                       {line}
//                     </p>
//                   );
//                 }
//               })}
//             </div>

//             <div className="mt-10 flex justify-center gap-4">
//               <button
//                 onClick={downloadAsPDF}
//                 className="px-6 py-2.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
//               >
//                 Download Report
//               </button>
//               <button
//                 onClick={() => router.push("/interview-platform")}
//                 className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//               >
//               Start New Interview
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [interviewType, setInterviewType] = useState("");
  const [qaPairs, setQaPairs] = useState([]);

  useEffect(() => {
    const data = searchParams.get("data");
    const type = searchParams.get("type") || "Technical";

    if (!data) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(data));
      setQaPairs(parsed);
      setInterviewType(type);
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
          body: JSON.stringify({ qaPairs, interviewType }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error from API");

        setReport(data.report);
      } catch (err) {
        console.error("Client Error:", err);
        setReport("❌ Error generating report. Please try again.");
      }
      setLoading(false);
    };

    generateReport();
  }, [qaPairs, interviewType]);

  const downloadAsPDF = async () => {
    const reportElement = document.getElementById("report-content");
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
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

    pdf.save("interview_report.pdf");
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800">Interview Report</h1>
          <h2 className="text-xl text-blue-600 mt-2">Role: {interviewType}</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-700 text-lg">Generating your detailed report...</p>
          </div>
        ) : (
          <>
            <div
              id="report-content"
              style={{
                backgroundColor: "#f0f4ff",
                padding: "24px",
                borderRadius: "12px",
                color: "#1e293b",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {report.split("\n").map((line, index) => {
                if (line.startsWith("##")) {
                  return (
                    <h2
                      key={index}
                      style={{ color: "#1d4ed8", marginTop: "1.5rem", marginBottom: "1rem", fontSize: "1.25rem" }}
                    >
                      {line.replace("##", "").trim()}
                    </h2>
                  );
                } else if (line.startsWith("Q")) {
                  return (
                    <p key={index} style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {line}
                    </p>
                  );
                } else {
                  return (
                    <p key={index} style={{ marginBottom: "0.75rem", color: "#334155" }}>
                      {line}
                    </p>
                  );
                }
              })}
            </div>

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={downloadAsPDF}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                Download Report
              </button>
              <button
                onClick={() => router.push("/interview-platform")}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Start New Interview
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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