import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

function Profile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [diseases, setDiseases] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userDoc = await getDoc(
        doc(db, "users", user.uid)
      );

      if (userDoc.exists()) {
        const data = userDoc.data();

        setName(data.name || "");
        setAge(data.age || "");
        setWeight(data.weight || "");
        setHeight(data.height || "");
        setDiseases(data.diseases || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const saveProfile = async () => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        name,
        age,
        weight,
        height,
        diseases,
      },
      { merge: true }
    );

    alert("Profile saved successfully");
  };


  const inputStyle =
    "w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400";


  return (
    <div className="space-y-4">

      <div>
        <label className="text-sm text-gray-600">
          Name
        </label>

        <input
          className={inputStyle}
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      </div>


      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-gray-600">
            Age
          </label>

          <input
            className={inputStyle}
            placeholder="Age"
            value={age}
            onChange={(e)=>setAge(e.target.value)}
          />
        </div>


        <div>
          <label className="text-sm text-gray-600">
            Weight (kg)
          </label>

          <input
            className={inputStyle}
            placeholder="Weight"
            value={weight}
            onChange={(e)=>setWeight(e.target.value)}
          />
        </div>

      </div>


      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="text-sm text-gray-600">
            Height (cm)
          </label>

          <input
            className={inputStyle}
            placeholder="Height"
            value={height}
            onChange={(e)=>setHeight(e.target.value)}
          />
        </div>


        <div>
          <label className="text-sm text-gray-600">
            Chronic Diseases
          </label>

          <input
            className={inputStyle}
            placeholder="None"
            value={diseases}
            onChange={(e)=>setDiseases(e.target.value)}
          />
        </div>

      </div>


      <button
        onClick={saveProfile}
        className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
      >
        Save Profile
      </button>


    </div>
  );
}

export default Profile;