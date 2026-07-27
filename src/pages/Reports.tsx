import UploadReport from "../components/UploadReport";
import ReportHistory from "../components/ReportHistory";
import { useState } from "react";
import AnalysisModal from "../components/AnalysisModal";

function Reports() {

  const [openModal, setOpenModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);


  return (
    <div className="space-y-6">


      <div className="bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-bold text-gray-800">
          📄 Medical Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Upload and manage your medical reports.
        </p>

      </div>



      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          📤 Upload Medical Report
        </h2>


        <UploadReport
          onViewAnalysis={(reportId) => {
            setSelectedReportId(reportId);
            setOpenModal(true);
          }}
        />


      </div>



      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          🕒 Report History
        </h2>


        <ReportHistory />


      </div>



      <AnalysisModal
        open={openModal}
        reportId={selectedReportId}
        onClose={() => setOpenModal(false)}
      />


    </div>
  );
}


export default Reports;