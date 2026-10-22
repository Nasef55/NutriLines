import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
function Nutrition() {
    const [analysis, setAnalysis] = useState<any>(null);
const [userData, setUserData] = useState<any>(null);

const bmi =
  userData
    ? (
        Number(userData.weight) /
        ((Number(userData.height) / 100) ** 2)
      ).toFixed(1)
    : "--";


const bmiStatus =
  bmi === "--"
    ? ""
    : Number(bmi) < 18.5
    ? "Underweight"
    : Number(bmi) < 25
    ? "Normal Weight"
    : Number(bmi) < 30
    ? "Overweight"
    : "Obesity";
  userData
    ? (
        Number(userData.weight) /
        ((Number(userData.height) / 100) ** 2)
      ).toFixed(1)
    : "--";
    const [advice, setAdvice] = useState<string[]>([]);

useEffect(() => {

  const loadNutritionData = async () => {

    if (!auth.currentUser) return;

    const userRef = doc(
  db,
  "users",
  auth.currentUser.uid
);

const userSnap = await getDoc(userRef);


if (userSnap.exists()) {
  setUserData(userSnap.data());
}
    const q = query(
      collection(db, "analyses"),
      where(
        "userId",
        "==",
        auth.currentUser.uid
      )
    );

    const snapshot = await getDocs(q);

console.log("Current UID:", auth.currentUser.uid);

console.log("Number of analyses:", snapshot.size);


if (!snapshot.empty) {

const analyses: any[] = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data()
}));


const latestAnalysis = analyses
  .filter((item:any) => item.result)
  .sort((a:any, b:any) => {
    return b.createdAt.seconds - a.createdAt.seconds;
  })[0];


console.log("Latest Analysis:", latestAnalysis);


  console.log("Latest Analysis:", latestAnalysis);


  setAnalysis(latestAnalysis.result);
  setAdvice(latestAnalysis.result.actionableAdvice || []);


} else {

  console.log("No analysis found");

}

  };

  loadNutritionData();

}, []);
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🥗 Nutrition Plan
        </h1>

        <p className="text-gray-500 mt-2">
          Personalized nutrition recommendations based on your health data.
        </p>

        {analysis && (
  <div className="mt-5 bg-green-50 rounded-xl p-4">

    <h2 className="font-bold text-lg text-green-700">
      🤖 AI Health Summary
    </h2>

    <p className="text-gray-700 mt-2">
      {analysis.arabicSummary}
    </p>

  </div>
)}

      </div>


      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-lg">
            🎯 Health Goal
          </h2>

          <p className="text-gray-500 mt-2">
            Maintain a healthy lifestyle
          </p>
        </div>


        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-lg">
            📊 Nutrition Score
          </h2>

          <p className="text-green-600 text-3xl font-bold mt-2">
            85%
          </p>
        </div>


<div className="bg-white rounded-2xl shadow p-5">

  <h2 className="font-bold text-lg">
    ⚖️ BMI
  </h2>

  <p className="text-purple-600 text-3xl font-bold mt-2">
    {bmi}
  </p>

  <p className="text-gray-500 mt-2">
    Normal Weight
  </p>

</div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-lg">
            💡 AI Medical Advice
          </h2>

<p className="text-gray-500 mt-2">
  {advice.length > 0
    ? advice[0]
    : "Balanced meals recommended"}
</p>
        </div>

      </div>



      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-white rounded-2xl shadow p-6">

<h2 className="text-xl font-bold text-green-600">
  💡 AI Recommendations
</h2>

<ul className="mt-4 space-y-2 text-gray-600">

  {advice.length > 0 ? (

    advice.map((item, index) => (
      <li key={index}>
        🍎 {item}
      </li>
    ))

  ) : (

    <>
      <li>🥗 Vegetables</li>
      <li>🍎 Fruits</li>
      <li>🥩 Protein sources</li>
      <li>🌾 Whole grains</li>
    </>

  )}

</ul>

        </div>



        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold text-red-600">
            ⚠️ Foods To Avoid
          </h2>

          <ul className="mt-4 space-y-2 text-gray-600">
            <li>🍟 Fast food</li>
            <li>🥤 Sugary drinks</li>
            <li>🍬 Excess sugar</li>
          </ul>

        </div>

      </div>


<div className="bg-white rounded-2xl shadow p-6">

  <h2 className="text-xl font-bold text-blue-600">
    🩺 Medical Findings
  </h2>


  <div className="mt-4 space-y-4">

    {analysis?.results
?.filter((item:any) => item.status !== "Normal")
.map((item:any, index:number) => (

      <div
        key={index}
        className="bg-gray-50 rounded-xl p-4"
      >

        <div className="flex justify-between">

          <h3 className="font-bold">
            {item.testName}
          </h3>


          <span
            className={
              item.status === "Normal"
                ? "text-green-600"
                : item.status === "High"
                ? "text-red-600"
                : "text-orange-600"
            }
          >
            {item.status}
          </span>

        </div>


        <p className="text-gray-600 mt-2">
          Value: {item.value} {item.unit}
        </p>


        <p className="text-gray-500 mt-2">
          {item.arabicExplanation}
        </p>


      </div>

    ))}

  </div>

</div>

    </div>
  );
}

export default Nutrition;