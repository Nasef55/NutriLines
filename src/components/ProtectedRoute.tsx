import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }: any) {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {

      setUser(currentUser);
      setLoading(false);

    });


    return unsubscribe;

  }, []);



  if (loading) {
    return <p>Loading...</p>;
  }


  if (!user) {
    return <Navigate to="/login" />;
  }


  return children;

}

export default ProtectedRoute;