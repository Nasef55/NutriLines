import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Medications() {
    const [medications, setMedications] = useState<any[]>([]);
    useEffect(() => {

  const loadMedications = async () => {

    if (!auth.currentUser) return;


    const q = query(
      collection(db, "medications"),
      where(
        "userId",
        "==",
        auth.currentUser.uid
      )
    );


    const snapshot = await getDocs(q);


    const data = snapshot.docs.map((doc)=>({
      id: doc.id,
      ...doc.data()
    }));


    setMedications(data);

  };


  loadMedications();


}, []);
  return (
    <div className="space-y-6">


      <div className="bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-bold text-gray-800">
          💊 Medications
        </h1>

        <p className="text-gray-500 mt-2">
          Track your medications and treatment schedule.
        </p>

      </div>



      <div className="grid md:grid-cols-3 gap-5">


        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="font-bold text-lg">
            📋 Total Medicines
          </h2>

<p className="text-blue-600 text-3xl font-bold mt-3">
  {medications.length}
</p>

        </div>



        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="font-bold text-lg">
            ⏰ Today's Doses
          </h2>

          <p className="text-green-600 text-3xl font-bold mt-3">
            2
          </p>

        </div>



        <div className="bg-white rounded-2xl shadow p-5">

          <h2 className="font-bold text-lg">
            ✅ Adherence
          </h2>

          <p className="text-purple-600 text-3xl font-bold mt-3">
            90%
          </p>

        </div>


      </div>




      <div className="bg-white rounded-2xl shadow p-6">


        <h2 className="text-xl font-bold mb-5">
          📅 Medication Schedule
        </h2>



<div className="space-y-4">

  {medications.length > 0 ? (

    medications.map((med) => (

      <div
        key={med.id}
        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
      >

        <div>

          <h3 className="font-bold">
            {med.medicineName}
          </h3>

          <p className="text-gray-500">
            {med.dosage}
          </p>

        </div>


        <span className="text-green-600 font-bold">
          {med.time}
        </span>


      </div>

    ))

  ) : (

    <p className="text-gray-500">
      No medications added yet.
    </p>

  )}

</div>


        </div>


  



    </div>
  );
}

export default Medications;