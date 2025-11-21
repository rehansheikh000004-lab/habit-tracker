import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

function HabitCard({ h, onToggle, onDelete }) {
  return (
    <div className={`habit ${h.doneToday ? "done" : ""}`}>
      <div>
        <div className="title">{h.title}</div>
        <div className="muted small">Streak: {h.streak || 0}</div>
      </div>
      <div className="actions">
        <button onClick={()=>onToggle(h._id)}>{h.doneToday ? "Undo" : "Done"}</button>
        <button onClick={()=>onDelete(h._id)}>Delete</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("ht_token");

  useEffect(()=> { load(); }, []);

  async function load() {
    try {
      const res = await axios.get(`${API_BASE}/api/habits`, { headers: { Authorization: `Bearer ${token}` }});
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function add() {
    if (!title.trim()) return;
    try {
      await axios.post(`${API_BASE}/api/habits`, { title }, { headers: { Authorization: `Bearer ${token}` }});
      setTitle("");
      load();
    } catch (err) { console.error(err); setMsg("Error adding"); }
  }

  async function toggle(id) {
    try {
      await axios.post(`${API_BASE}/api/habits/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` }});
      load();
    } catch (err) { console.error(err); }
  }

  async function remove(id) {
    try {
      await axios.delete(`${API_BASE}/api/habits/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      load();
    } catch (err) { console.error(err); }
  }

  function logout() {
    localStorage.removeItem("ht_token");
    localStorage.removeItem("ht_user");
    window.location.href = "/login";
  }

  return (
    <div className="page panel">
      <header className="card header">
        <div>
          <h2>My Habits</h2>
          <p className="muted">Track daily habits & streaks</p>
        </div>
        <div>
          <button className="ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="card">
        <div className="row">
          <input placeholder="New habit title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <button className="btn" onClick={add}>Add</button>
        </div>
        <p className="muted">{msg}</p>
      </div>

      <div className="card">
        {habits.length === 0 ? <p className="muted">No habits yet</p> : habits.map(h => (
          <HabitCard key={h._id} h={h} onToggle={toggle} onDelete={remove} />
        ))}
      </div>
    </div>
  );
}
