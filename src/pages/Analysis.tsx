import { analyzeReportWithAI } from "../services/aiService";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import AnalysisResult from "../components/AnalysisResult";

function Analysis() {

  const [reports, setReports] = useState<any[]>([]);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {

      if (user) {
        loadReports(user.uid);
      }

    });

    return () => unsubscribe();

  }, []);



  const analyzeReport = async (report:any) => {

    if(!auth.currentUser){
      alert("Please login first");
      return;
    }

    try {

      const aiResponse = await analyzeReportWithAI({

        imageBase64: report.imageBase64 || undefined,

        rawText:
        `${report.reportName} ${report.reportType}`,

        sampleType:
        report.reportType,

      });


      await addDoc(
        collection(db,"analyses"),
        {
          reportId: report.id,
          userId: auth.currentUser.uid,
          result: aiResponse.analysis,
          createdAt:new Date(),
        }
      );


      await updateDoc(
        doc(db,"reports",report.id),
        {
          status:"Completed"
        }
      );


      alert("Analysis completed successfully 🤖");

      loadReports(auth.currentUser.uid);


    } catch(error){

      console.error(error);

      alert("Failed to analyze report");

    }

  };


  const loadReports = async (uid: string) => {

    const q = query(
      collection(db, "reports"),
      where("userId", "==", uid)
    );


    const snapshot = await getDocs(q);


    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    setReports(list);

  };



  return (
    <div className="space-y-6">


      <div className="bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-bold text-gray-800">
          🤖 AI Analysis
        </h1>

        <p className="text-gray-500 mt-2">
          Analyze your medical reports using AI.
        </p>

      </div>



      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          📄 Select Medical Report
        </h2>


        {reports.length === 0 ? (

          <p className="text-gray-500">
            No reports available.
          </p>

        ) : (

          reports.map((report) => (

            <div
              key={report.id}
              className="border rounded-xl p-4 mb-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  {report.reportName}
                </h3>


                <p className="text-sm text-gray-500">
                  {report.createdAt?.toDate().toLocaleString()}
                </p>

              </div>


<button
  onClick={() => {
    console.log("CLICKED", report);
    analyzeReport(report);
    setSelectedReportId(report.id);
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  🤖 Analyze
</button>


            </div>

          ))

        )}

      </div>


      {selectedReportId && (
        <AnalysisResult
          reportId={selectedReportId}
          onAnalysisLoaded={(data) => {
            console.log("Analysis Loaded:", data);
          }}
        />
      )}


    </div>
  );
}


export default Analysis;