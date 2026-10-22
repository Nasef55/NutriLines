import Pharmacy from "./pages/Pharmacy";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Medications from "./pages/Medications";
import Nutrition from "./pages/Nutrition";
import Analysis from "./pages/Analysis";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {

  const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);


useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

    setUser(currentUser);
    setLoading(false);

  });

  return () => unsubscribe();

}, []);


if(loading){
  return <div>Loading...</div>;
}

  return (

    <BrowserRouter>

      <Layout>

        <Routes>

<Route
  path="/login"
  element={<Login />}
/>

<Route
 path="/"
 element={user ? <Dashboard /> : <Login />}
/>

<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>

<Route
  path="/analysis"
  element={
    <ProtectedRoute>
      <Analysis />
    </ProtectedRoute>
  }
/>


<Route
  path="/nutrition"
  element={
    <ProtectedRoute>
      <Nutrition />
    </ProtectedRoute>
  }
/>

<Route
  path="/medications"
  element={
    <ProtectedRoute>
      <Medications />
    </ProtectedRoute>
  }
/>

<Route
  path="/doctors"
  element={
    <ProtectedRoute>
      <Doctors />
    </ProtectedRoute>
  }
/>

<Route
  path="/pharmacy"
  element={
    <ProtectedRoute>
      <Pharmacy />
    </ProtectedRoute>
  }
/>


<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        </Routes>

      </Layout>

    </BrowserRouter>

  );

}

export default App;