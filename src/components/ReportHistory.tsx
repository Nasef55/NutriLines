import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

function ReportHistory() {
  const [reports, setReports] = useState<any[]>([]);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      loadReports(user.uid);
    }
  });

  return () => unsubscribe();
}, []);

const loadReports = async (uid: string) => {
  const q = query(
    collection(db, "reports"),
    where("userId", "==", uid)
  );

    const snapshot = await getDocs(q);
    console.log(snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
})));
    console.log("Current User:", auth.currentUser?.uid);
    console.log("Reports Found:", snapshot.size);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
console.log(JSON.stringify(list, null, 2));

    setReports(list);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold mb-5">
        📂 Report History
      </h2>

    {console.log("Rendering Reports:", reports)}
      {reports.length === 0 ? (
        <p className="text-gray-500">
          No reports yet.
        </p>
      ) : (
        reports.map((report: any) => (
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              View
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default ReportHistory;