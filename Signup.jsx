import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Signup(){
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [otp,setOtp]=useState("");

  const signup=async()=>{
    await axios.post("http://localhost:5000/api/auth/signup",form);
    alert("OTP sent to email");
  };

  const verify=async()=>{
    await axios.post("http://localhost:5000/api/auth/verify",{email:form.email,otp});
    alert("Verified! Now login.");
  };

  return(
    <div className="dark" style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="glass" style={{width:"350px"}}>
        <h2>Signup</h2>
        <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" onChange={e=>setForm({...form,password:e.target.value})}/>
        <button onClick={signup}>Send OTP</button>

        <input placeholder="Enter OTP" onChange={e=>setOtp(e.target.value)}/>
        <button onClick={verify}>Verify</button>

        <p><Link to="/">Back to Login</Link></p>
      </div>
    </div>
  )
}