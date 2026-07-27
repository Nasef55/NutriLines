import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function Dashboard() {
  const [totalReports, setTotalReports] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [healthStatus, setHealthStatus] = useState("Good");
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const chartData = [
  {
    name: "Reports",
    value: totalReports,
  },
  {
    name: "Analyses",
    value: totalAnalyses,
  },
];

  useEffect(() => {
  const loadStats = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "reports"),
      where("userId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    setTotalReports(snapshot.size);
    const reports = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

reports.sort((a: any, b: any) => {
  const ta = a.createdAt?.seconds || 0;
  const tb = b.createdAt?.seconds || 0;
  return tb - ta;
});

setRecentReports(reports.slice(0, 5));
    const analysisQuery = query(
  collection(db, "analyses"),
  where("userId", "==", auth.currentUser.uid)
);

const analysisSnapshot = await getDocs(analysisQuery);

setTotalAnalyses(analysisSnapshot.size);
if (analysisSnapshot.size > 0) {

  const analysisDocs = analysisSnapshot.docs;

  analysisDocs.sort((a, b) => {
    const ta = a.data().createdAt?.seconds || 0;
    const tb = b.data().createdAt?.seconds || 0;
    return tb - ta;
  });

  const latestAnalysis = analysisDocs[0].data();

  const status =
    latestAnalysis.result?.results?.some(
      (item: any) => item.status !== "Normal"
    )
      ? "Needs Attention"
      : "Good";

  setHealthStatus(status);

}
  };

  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      loadStats();
    }
  });

  return () => unsubscribe();

}, []);

 return (

<div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-800">
            🏥 NutriLines AI
          </h1>

          <p className="text-gray-500 mt-2">
            AI Medical Report Assistant & Health Monitor
          </p>
        </div>

        {/* Statistics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500">
              📄 Total Reports
            </h3>
            <p className="text-3xl font-bold text-blue-600">
            {totalReports}
            </p>
          </div>


          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500">
              🤖 AI Analyses
            </h3>
            <p className="text-3xl font-bold text-green-600">
            {totalAnalyses}
            </p>
          </div>


          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500">
              🟢 Health Status
            </h3>
            <p
            className={`text-2xl font-bold ${
            healthStatus === "Good"
             ? "text-green-600"
           : "text-orange-600"
            }`}
            >
            {healthStatus === "Good"
            ? "🟢 Good"
            : "🟠 Needs Attention"}
          </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

  <h2 className="text-xl font-semibold mb-4">
    📊 Dashboard Overview
  </h2>

  <div className="w-full h-72">

    <ResponsiveContainer width="100%" height="100%">

      <BarChart data={chartData}>

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

<Bar
  dataKey="value"
  radius={[8, 8, 0, 0]}
  animationDuration={1200}
>
  <Cell fill="#2563eb" />
  <Cell fill="#16a34a" />
</Bar>

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>


<div className="bg-white rounded-2xl shadow p-6 mb-6">

  <h2 className="text-xl font-semibold mb-4">
    🕒 Recent Activity
  </h2>

  <div className="space-y-3">

    {recentReports.length === 0 ? (

      <p className="text-gray-500">
        No recent reports.
      </p>

    ) : (

      recentReports.map((report: any) => (

        <div
          key={report.id}
          className="flex justify-between items-center border-b pb-3"
        >

          <div>

            <p className="font-semibold">
              📄 {report.reportName}
            </p>

            <p className="text-sm text-gray-500">
              {report.reportType}
            </p>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              report.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {report.status}
          </span>

        </div>

      ))

    )}

  </div>

</div>

</div>

);
}

export default Dashboard;