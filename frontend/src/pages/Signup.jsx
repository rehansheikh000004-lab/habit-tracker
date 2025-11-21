import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, { username, password });
      if (res.data && res.data.user) {
        setMsg("Signup success — logging in...");
        // auto login
        const login = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
        localStorage.setItem("ht_token", login.data.token);
        localStorage.setItem("ht_user", JSON.stringify(login.data.user));
        nav("/dashboard");
      } else {
        setMsg(res.data.message || "Signup error");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Network error");
    }
  }

  return (
    <div className="page auth">
      <form className="card" onSubmit={submit}>
        <h2>Signup</h2>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" />
        <button className="btn">Create account</button>
        <p className="muted">{msg}</p>
        <p>Have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
