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
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        company: user.company || "",
        location: user.location || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(form);
      toast.success("Profile updated cleanly");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const handleReset = () => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        company: user.company || "",
        location: user.location || "",
        bio: user.bio || ""
      });
      toast.info("Form reset to saved profile");
    }
  };

  if (!user) return null;
  const initials = user.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <div className="animate-fade-in">
      <div className="page-title text-left">
        <h1>Profile</h1>
        <p>Your account details and public information.</p>
      </div>

      <div className="card prof-hero reveal in text-left mb-6">
        <div className="pa">{initials}</div>
        <div className="ph-info">
          <h2>{user.name}</h2>
          <p>{user.role || "Role"} · {user.company || "Company"} · {user.location || "Location"}</p>
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

      <div className="row3 text-left">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Edit profile</h3>
              <div className="sub">Changes apply across the app</div>
            </div>
          </div>
          <div className="frow flex gap-4 mb-4">
            <div className="field flex-1">
              <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Full name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm" />
            </div>
            <div className="field flex-1">
              <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm" />
            </div>
          </div>
          <div className="frow flex gap-4 mb-4">
            <div className="field flex-1">
              <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Role</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm" />
            </div>
            <div className="field flex-1">
              <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Company</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm" />
            </div>
          </div>
          <div className="field mb-4">
            <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm" />
          </div>
          <div className="field mb-4">
            <label className="text-xs text-[var(--txt-dim)] mb-1 block font-semibold">Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full bg-[#0B1437] border border-[var(--border)] rounded-lg p-2 text-white text-sm resize-none" />
          </div>
          <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
            <button className="btn btn-g" onClick={handleReset}>Reset</button>
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
          <div className="tl space-y-4">
            <div className="tl-item flex gap-4 items-start">
               <span className="tl-dot bg-[#01B574] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"><DollarSign size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt text-sm font-semibold text-white">$2,400 — Ad spend added</div><div className="td text-xs text-[var(--txt-dim)] mt-1">22 DEC 7:20 PM</div></div>
            </div>
            <div className="tl-item flex gap-4 items-start">
               <span className="tl-dot bg-[#E53E3E] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Globe size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt text-sm font-semibold text-white">New lead #4219423</div><div className="td text-xs text-[var(--txt-dim)] mt-1">21 DEC 11:00 PM</div></div>
            </div>
            <div className="tl-item flex gap-4 items-start">
               <span className="tl-dot bg-[#0075FF] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Send size={11} color="#fff"/></span>
               <div className="tl-body"><div className="tt text-sm font-semibold text-white">Campaign "Summer" published</div><div className="td text-xs text-[var(--txt-dim)] mt-1">21 DEC 9:34 PM</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
