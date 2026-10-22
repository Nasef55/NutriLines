
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function AnalysisResult({
  reportId,
  onAnalysisLoaded,
}: {
  reportId: string;
  onAnalysisLoaded: (data: any) => void;
}) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setAnalysis(null);
    setError("");
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        setError("سجّل الدخول لعرض نتيجة التحليل.");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "analyses"),
          where("userId", "==", user.uid),
          where("reportId", "==", reportId)
        );

        const snapshot = await getDocs(q);

        if (!active) return;

        if (snapshot.empty) {
          setError(
            "ملقيناش نتيجة محفوظة للتقرير ده. ارجع للتقارير وحاول تعمل التحليل مرة تانية."
          );
          setLoading(false);
          return;
        }

        const docs = snapshot.docs.sort((a, b) => {
          const ta = a.data().createdAt?.seconds || 0;
          const tb = b.data().createdAt?.seconds || 0;
          return tb - ta;
        });

        const result = docs[0].data().result;

        if (!result || typeof result !== "object") {
          setError("النتيجة المحفوظة غير صالحة. أعد تحليل التقرير.");
          setLoading(false);
          return;
        }

        setAnalysis(result);
        onAnalysisLoaded(result);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load analysis:", err);

        if (active) {
          setError(
            "حصل خطأ أثناء تحميل النتيجة. تحقق من الإنترنت وحاول مرة أخرى."
          );
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [reportId, onAnalysisLoaded]);

  if (loading) {
    return (
      <div>
        <h2>🤖 AI Analysis</h2>
        <p>جاري تحميل نتيجة التحليل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <h2 className="font-bold">تعذر عرض التحليل</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return <p>لا توجد نتيجة لعرضها.</p>;
  }

  return (
    <div id="analysis-section">
      <h2>🤖 AI Medical Analysis</h2>

      <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
        <h3 className="text-xl font-bold text-blue-700">
          {analysis.reportTitle}
        </h3>
        <p className="font-semibold mt-3">📌 Summary</p>
        <p className="text-gray-700 mt-2">{analysis.arabicSummary}</p>
      </div>

      <hr />

      <h3>Results</h3>

      {analysis.results?.map((item: any, index: number) => (
        <div
          key={index}
          className="bg-gray-50 rounded-xl p-4 mb-3 shadow-sm border"
        >
          <h4 className="font-bold text-lg">{item.testName}</h4>
          <p className="mt-2">
            {item.value} {item.unit}
          </p>
          <p
            className={`font-semibold mt-2 ${
              item.status === "Normal"
                ? "text-green-600"
                : item.status === "High"
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            {item.status === "Normal" && "🟢 "}
            {item.status === "High" && "🔴 "}
            {item.status === "Low" && "🟠 "}
            Status: {item.status}
          </p>
          <p className="text-gray-600 mt-2">{item.arabicExplanation}</p>
        </div>
      ))}

      <h3>Recommendations</h3>

      <div className="space-y-2">
        {analysis.actionableAdvice?.map((tip: string, index: number) => (
          <div
            key={index}
            className="bg-green-50 border border-green-100 rounded-xl p-3"
          >
            ✅ {tip}
          </div>
        ))}
      </div>

      {analysis.disclaimer && (
        <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          ⚠️ {analysis.disclaimer}
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;
