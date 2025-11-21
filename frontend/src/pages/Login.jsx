import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      const data = res.data;
      if (data.token) {
        localStorage.setItem("ht_token", data.token);
        localStorage.setItem("ht_user", JSON.stringify(data.user));
        nav("/dashboard");
      } else {
        setErr(data.message || "Login failed");
      }
    } catch (err) {
      setErr(err.response?.data?.message || "Network error");
    }
  }

  return (
    <div className="page auth">
      <form className="card" onSubmit={submit}>
        <h2>Login</h2>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" />
        <button className="btn">Login</button>
        <p className="muted">{err}</p>
        <p>New? <Link to="/signup">Signup</Link></p>
      </form>
    </div>
  );
}
