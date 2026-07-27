import { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


function Login() {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [register,setRegister] = useState(false);


  const handleSubmit = async () => {

    try {

      if(register){

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );


        await setDoc(
          doc(
            db,
            "users",
            userCredential.user.uid
          ),
          {
            name,
            email,
            age:"",
            weight:"",
            height:"",
            diseases:"None",
            createdAt:new Date()
          }
        );

        navigate("/");

      }else{

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        navigate("/");

      }


    } catch(error:any){

      alert(error.message);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow w-96">


        <h1 className="text-2xl font-bold mb-5 text-center">
          🩺 NutriLines
        </h1>


        {
          register && (

          <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          />

          )
        }


        <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
        />


        <input
        className="w-full border p-3 rounded mb-3"
        placeholder="Password"
        type="password"
        onChange={(e)=>setPassword(e.target.value)}
        />


        <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-3 rounded"
        >
          {register ? "Create Account" : "Login"}
        </button>


        <p
        className="text-center mt-4 text-blue-600 cursor-pointer"
        onClick={()=>setRegister(!register)}
        >

          {
            register
            ?
            "Already have account? Login"
            :
            "Create new account"
          }

        </p>


      </div>


    </div>

  );

}


export default Login;