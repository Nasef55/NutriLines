import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

function Profile() {
const [userData, setUserData] = useState<any>(null);
const [reportsCount, setReportsCount] = useState(0);
const [editMode, setEditMode] = useState(false);

useEffect(() => {
    const saveProfile = async () => {

  if (!auth.currentUser) return;

  const userRef = doc(
    db,
    "users",
    auth.currentUser.uid
  );

  await updateDoc(userRef, {
    name: userData.name,
    age: userData.age,
    weight: userData.weight,
    height: userData.height
  });

  setEditMode(false);

};
  const loadProfile = async () => {

    if (!auth.currentUser) return;

    const userRef = doc(
      db,
      "users",
      auth.currentUser.uid
    );

    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      setUserData(snapshot.data());
    }

    const reportsQuery = query(
  collection(db, "reports"),
  where(
    "userId",
    "==",
    auth.currentUser.uid
  )
);


const reportsSnapshot = await getDocs(reportsQuery);


setReportsCount(reportsSnapshot.size);

  };

  loadProfile();

}, []);

const saveProfile = async () => {

  if (!auth.currentUser) return;

  const userRef = doc(
    db,
    "users",
    auth.currentUser.uid
  );

  await updateDoc(userRef, {
    name: userData.name,
    age: userData.age,
    weight: userData.weight,
    height: userData.height
  });

  setEditMode(false);

};

const handleLogout = async () => {

  await signOut(auth);

  window.location.href = "/login";

};

  return (
    <div className="space-y-6">


      <div className="bg-white rounded-2xl shadow p-6">

        <h1 className="text-2xl font-bold text-gray-800">
          👤 Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your personal information and health profile.
        </p>

      </div>



      <div className="bg-white rounded-2xl shadow p-6">


        <div className="flex items-center gap-5">

          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
            👨
          </div>


          <div>

            <h2 className="text-xl font-bold">
              {userData?.name || "User"}
            </h2>

            <p className="text-gray-500">
              {userData?.email}
            </p>

          </div>

<button
  onClick={() => setEditMode(!editMode)}
  className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-xl"
>
  {editMode ? "Cancel" : "✏️ Edit Profile"}
</button>


<button
  onClick={handleLogout}
  className="mt-3 bg-red-600 text-white px-5 py-2 rounded-xl"
>
  🚪 Logout
</button>


{editMode && (
  <div className="mt-5 space-y-3">

    <input
      className="w-full border p-3 rounded-xl"
      placeholder="Age"
      value={userData?.age || ""}
      onChange={(e)=>
        setUserData({
          ...userData,
          age:e.target.value
        })
      }
    />

    <input
      className="w-full border p-3 rounded-xl"
      placeholder="Weight"
      value={userData?.weight || ""}
      onChange={(e)=>
        setUserData({
          ...userData,
          weight:e.target.value
        })
      }
    />

    <input
      className="w-full border p-3 rounded-xl"
      placeholder="Height"
      value={userData?.height || ""}
      onChange={(e)=>
        setUserData({
          ...userData,
          height:e.target.value
        })
      }
    />

    <button
  onClick={saveProfile}
  className="w-full bg-green-600 text-white p-3 rounded-xl mt-3"
>
  💾 Save Changes
</button>

  </div>
)}

        </div>


      </div>




      <div className="grid md:grid-cols-4 gap-5">


        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="font-bold">
            🎂 Age
          </h3>

          <p className="text-blue-600 text-2xl font-bold mt-2">
            {userData?.age || "--"} Years
          </p>

        </div>



        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="font-bold">
            ⚖️ Weight
          </h3>

          <p className="text-green-600 text-2xl font-bold mt-2">
            {userData?.weight || "--"} Kg
          </p>

        </div>



        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="font-bold">
            📏 Height
          </h3>

          <p className="text-purple-600 text-2xl font-bold mt-2">
            {userData?.height || "--"} cm
          </p>

        </div>


<div className="bg-white rounded-2xl shadow p-5">

  <h3 className="font-bold">
    ⚖️ BMI
  </h3>

  <p className="text-orange-600 text-2xl font-bold mt-2">

    {
      userData?.weight && userData?.height
      ?
      (
        Number(userData.weight) /
        ((Number(userData.height) / 100) ** 2)
      ).toFixed(1)
      :
      "--"
    }

  </p>

</div>

      </div>




      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">
          🩺 Health Information
        </h2>


        <div className="space-y-3 text-gray-600">


<p>
  📄 Medical Reports: {reportsCount} Reports
</p>


          <p>
            🥗 Nutrition Plan: Active
          </p>


          <p>
            💊 Medication Tracking: Enabled
          </p>


        </div>


      </div>



    </div>
  );
}

export default Profile;