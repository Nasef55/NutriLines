import React from "react";
import jsPDF from "jspdf";
import AnalysisResult from "./AnalysisResult";

type AnalysisModalProps = {
  open: boolean;
  reportId: string | null;
  onClose: () => void;
};

function AnalysisModal({ open, reportId, onClose }: AnalysisModalProps) {
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const downloadPDF = () => {
  if (!analysisData) {
    alert("Analysis not ready yet");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("NutriLines AI Medical Analysis", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Report: ${analysisData.reportTitle || "Medical Report"}`,
    20,
    40
  );

  doc.text(
    "Summary:",
    20,
    55
  );

  doc.text(
    analysisData.arabicSummary || "",
    20,
    65,
    { maxWidth: 170 }
  );


  let y = 90;

  doc.text("Results:", 20, y);

  y += 10;


  analysisData.results?.forEach((item:any)=>{

    doc.text(
      `${item.testName}: ${item.value} ${item.unit}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Status: ${item.status}`,
      20,
      y
    );

    y += 12;

  });


  doc.save("NutriLines-Analysis.pdf");
};
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-3xl max-h-[85vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-300">
        <button
  onClick={onClose}
  className="absolute top-4 right-4 bg-gray-100 w-10 h-10 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-600 text-xl transition"
>
  ✖
</button>

<h2 className="text-2xl font-bold mb-5 text-blue-700 border-b pb-3">
  🤖 AI Medical Analysis
</h2>

<button
  onClick={downloadPDF}
  className="mb-4 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
>
  📄 Download Analysis PDF
</button>

<AnalysisResult
  reportId={reportId || ""}
  onAnalysisLoaded={setAnalysisData}
/>

      </div>
    </div>
  );
}

export default AnalysisModal;