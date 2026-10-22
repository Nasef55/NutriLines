import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { analyzeReportWithAI } from "../services/aiService";


function UploadReport({
  onViewAnalysis,
}: {
  onViewAnalysis: (reportId: string) => void;
}) {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [viewImage, setViewImage] = useState<string | null>(null);


  const loadReports = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "reports"),
      where("userId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

const data: any[] = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

data.sort((a, b) => {
  const ta = a.createdAt?.seconds || 0;
  const tb = b.createdAt?.seconds || 0;
  return tb - ta;
});

setReports(data);
};


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadReports();
      }
    });

    return () => unsubscribe();

  }, []);



  const handleImage = (e:any) => {

    const file = e.target.files[0];

    if (!file) return;


    const reader = new FileReader();


    reader.onload = () => {

      const base64 = reader.result as string;

      setImageBase64(base64);

      console.log(
        "Image loaded:",
        base64.length
      );

    };


    reader.readAsDataURL(file);

  };



  const analyzeReport = async (report:any)=>{

    if(!auth.currentUser){
      alert("Please login first");
      return;
    }


    try{

      setLoading(report.id);


      const aiResponse = await analyzeReportWithAI({

        imageBase64: report.imageBase64 || undefined,

        rawText:
        `${report.reportName} ${report.reportType}`,

        sampleType:
        report.reportType,

      });


      if (!aiResponse.success || !aiResponse.analysis) {
      alert(aiResponse.error || "فشل تحليل التقرير. حاول مرة أخرى.");
      return;
      }

      console.log("AI response:", aiResponse);
      console.log("AI success:", aiResponse.success);


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


      loadReports();


    }catch(error){

      console.error(error);

      alert("Failed to analyze report");


    }finally{

      setLoading(null);

    }

  };



  const deleteReport = async(reportId:string)=>{

    if(!auth.currentUser){
      alert("Please login first");
      return;
    }


    try{

      await deleteDoc(
        doc(db,"reports",reportId)
      );


      alert("Report deleted successfully");


      loadReports();


    }catch(error){

      console.error(error);

      alert("Delete failed");

    }

  };




  const saveReport = async()=>{


    if(!auth.currentUser){
      alert("Please login first");
      return;
    }


    console.log(
      "Saving image:",
      imageBase64.length
    );


    await addDoc(
      collection(db,"reports"),
      {

        userId:auth.currentUser.uid,

        reportName,

        reportType,

        imageBase64,

        status:"Pending",

        createdAt:new Date(),

      }
    );



    alert("Report added successfully");


    setReportName("");

    setReportType("");

    setImageBase64("");


    loadReports();

  };



  const inputStyle =
  "w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none";



  return (

    <div className="space-y-6">


      <div>

        <h3 className="text-lg font-semibold mb-3">
          📄 Your Reports
        </h3>


        <div className="space-y-3">


        {reports.map((report)=>(


          <div
          key={report.id}
          className="border rounded-xl p-4 shadow-sm bg-gray-50"
          >


            <h4 className="font-semibold">
              📄 {report.reportName}
            </h4>


            <p>
              Type: {report.reportType}
            </p>

            {report.imageBase64 && (
<button
  onClick={() => setViewImage(report.imageBase64)}
  className="mt-3 bg-gray-700 text-white px-4 py-2 rounded-xl"
>
  🖼️ View Image
</button>
)}


            <p className="text-sm text-gray-500 mt-1">
  📅        {report.createdAt?.toDate
            ? report.createdAt.toDate().toLocaleDateString()
            : ""}
            </p>

            <p
  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
    report.status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {report.status === "Completed" ? "🟢 Completed" : "🟡 Pending"}
</p> 



{report.status !== "Completed" && (
  <button
    onClick={() => analyzeReport(report)}
    className="mt-3 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
  >
    {loading === report.id
      ? "Analyzing..."
      : "Analyze Report 🤖"}
  </button>
)}

{report.status === "Completed" && (
  <button
    onClick={() => onViewAnalysis(report.id)}
    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
  >
    👁️ View Analysis
  </button>
)}



            <button
            onClick={()=>deleteReport(report.id)}
            className="mt-3 ml-2 bg-red-600 text-white px-4 py-2 rounded-xl"
            >

            Delete 🗑️

            </button>



          </div>


        ))}


        </div>

      </div>




      <div>


      <h3 className="text-lg font-semibold mb-3">
        ➕ Add New Report
      </h3>



      <div className="space-y-3">


      <input
      className={inputStyle}
      placeholder="Report Name"
      value={reportName}
      onChange={(e)=>setReportName(e.target.value)}
      />



      <input
      className={inputStyle}
      placeholder="Report Type"
      value={reportType}
      onChange={(e)=>setReportType(e.target.value)}
      />



      <label className="block border-2 border-dashed rounded-xl p-4 cursor-pointer text-center">

        📷 Choose Medical Report Image


        <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="hidden"
        />

      </label>



{
  imageBase64 &&
  <div className="space-y-2">
    <p className="text-green-600">
      ✅ Image selected successfully
    </p>

    <img
      src={imageBase64}
      alt="Report Preview"
      className="w-full max-h-64 object-contain rounded-xl border"
    />
  </div>
}

      <button
      onClick={saveReport}
      className="w-full bg-blue-600 text-white p-3 rounded-xl"
      >

      Add Report

      </button>


      </div>


      </div>


{viewImage && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="bg-white p-4 rounded-2xl max-w-4xl w-11/12">

      <button
        onClick={() => setViewImage(null)}
        className="mb-3 bg-red-600 text-white px-4 py-2 rounded-xl"
      >
        ✖ Close
      </button>

      <img
        src={viewImage}
        alt="Medical Report"
        className="max-h-[80vh] w-full object-contain rounded-xl"
      />

    </div>

  </div>
)}



    </div>

  );

}

export default UploadReport;




