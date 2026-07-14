import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DollarSign, Globe, Send } from "lucide-react";

export default function Profile() {
  const user = useStore(s => s.user);
  const updateUser = useStore(s => s.updateUser);
  const [form, setForm] = useState({
    name: "", email: "", role: "", company: "", location: "", bio: ""
  });

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleSave = async () => {
    await updateUser(form);
    toast.success("Profile updated");
  };

  if (!user) return null;
  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0,2);

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Profile</h1>
        <p>Your account details and public information.</p>
      </div>

      <div className="card prof-hero reveal in">
        <div className="pa">{initials}</div>
        <div className="ph-info">
          <h2>{user.name}</h2>
          <p>{user.role} · {user.company} · {user.location}</p>
        </div>
        <div className="ph-stats">
          <div className="ps">
            <div className="n">24</div>
            <div className="l">Campaigns</div>
          </div>
          <div className="ps">
            <div className="n">$284K</div>
            <div className="l">Revenue</div>
          </div>
          <div className="ps">
            <div className="n">9.3</div>
            <div className="l">Score</div>
          </div>
        </div>
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Edit profile</h3>
              <div className="sub">Changes apply across the app</div>
            </div>
          </div>
          <div className="frow">
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>
          <div className="frow">
            <div className="field">
              <label>Role</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            </div>
            <div className="field">
              <label>Company</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
            </div>
          </div>
          <div className="field">
            <label>Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          </div>
          <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
            <button className="btn btn-g">Reset</button>
            <button className="btn btn-p" onClick={handleSave}>Save changes</button>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Recent activity</h3>
              <div className="sub">Last 7 days</div>
            </div>
          </div>
          <div className="tl">
            <div className="tl-item">
               <span className="tl-dot bg-[#01B574]"><DollarSign size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt">$2,400 — Ad spend added</div><div className="td">22 DEC 7:20 PM</div></div>
            </div>
            <div className="tl-item">
               <span className="tl-dot bg-[#E53E3E]"><Globe size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt">New lead #4219423</div><div className="td">21 DEC 11:00 PM</div></div>
            </div>
            <div className="tl-item">
               <span className="tl-dot bg-[#0075FF]"><Send size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt">Campaign "Summer" published</div><div className="td">21 DEC 9:34 PM</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
