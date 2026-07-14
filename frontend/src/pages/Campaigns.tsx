import { useStore } from "@/store/useStore";
import { Megaphone, Play, DollarSign, ArrowUp, Plus, MoreHorizontal, Edit, Copy, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import CountUp from "@/components/CountUp";

export default function Campaigns() {
  const campaigns = useStore(s => s.campaigns);
  const fetchCampaigns = useStore(s => s.fetchCampaigns);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<any>(null);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("Paid Social");
  const [budget, setBudget] = useState(5000);
  const [objective, setObjective] = useState("Conversions");
  const [notes, setNotes] = useState("");

  const totSpend = campaigns.reduce((a, c) => a + c.spend, 0);
  const activeCount = campaigns.filter(c => c.roas > 0).length;
  const avgRoas = activeCount ? (campaigns.reduce((a, c) => a + c.roas, 0) / activeCount).toFixed(1) : '0';

  const summary = [
    { l: 'Total campaigns', v: String(campaigns.length), ic: Megaphone },
    { l: 'Active now', v: String(campaigns.filter(c => c.status === 'active').length), ic: Play },
    { l: 'Total spend', v: `$${totSpend.toLocaleString()}`, ic: DollarSign },
    { l: 'Avg. ROAS', v: `${avgRoas}x`, ic: ArrowUp }
  ];

  const filtered = campaigns.filter(c => 
    (filter === 'all' || c.status === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNewModal = () => {
    setEditingCamp(null);
    setName("");
    setChannel("Paid Social");
    setBudget(5000);
    setObjective("Conversions");
    setNotes("");
    setModalOpen(true);
  };

  const openEditModal = (camp: any) => {
    setEditingCamp(camp);
    setName(camp.name);
    setChannel(camp.channel);
    setBudget(camp.budget);
    setObjective("Conversions");
    setNotes("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "Untitled campaign";
    const finalBudget = Number(budget) || 5000;

    const pal: Record<string, string> = {
      'Paid Social': '#0075FF',
      'Search': '#21D4FD',
      'Email': '#01B574',
      'Display': '#F6AD55'
    };

    const bgMap: Record<string, string> = {
      'Paid Social': 'rgba(0,117,255,.18)',
      'Search': 'rgba(33,212,253,.18)',
      'Email': 'rgba(1,181,116,.18)',
      'Display': 'rgba(246,173,85,.18)'
    };

    const icMap: Record<string, string> = {
      'Paid Social': '🚀',
      'Search': '🔍',
      'Email': '📧',
      'Display': '🎯'
    };

    try {
      if (editingCamp) {
        const payload = {
          ...editingCamp,
          name: finalName,
          channel,
          budget: finalBudget,
          c: pal[channel] || '#0075FF',
          bg: bgMap[channel] || 'rgba(0,117,255,.18)',
          ic: icMap[channel] || '✨'
        };
        const res = await fetch(`/api/campaigns/${editingCamp.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success(`${finalName} updated`);
        }
      } else {
        const payload = {
          name: finalName,
          channel,
          status: 'active',
          spend: 0,
          roas: 0,
          budget: finalBudget,
          prog: 5,
          ic: icMap[channel] || '✨',
          bg: bgMap[channel] || 'rgba(0,117,255,.18)',
          c: pal[channel] || '#0075FF'
        };
        const res = await fetch(`/api/campaigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success(`Campaign launched 🚀: ${finalName}`);
        }
      }
      setModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save campaign");
    }
  };

  const setStatus = async (camp: any, nextStatus: string) => {
    try {
      const payload = { ...camp, status: nextStatus };
      if (nextStatus === 'active' && camp.prog === 0) payload.prog = 5;
      const res = await fetch(`/api/campaigns/${camp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(nextStatus === 'active' ? "Campaign activated" : "Campaign paused");
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const duplicateCampaign = async (camp: any) => {
    try {
      const payload = {
        ...camp,
        id: undefined,
        name: camp.name + " (copy)",
        status: 'draft',
        spend: 0,
        roas: 0,
        prog: 0
      };
      const res = await fetch(`/api/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Duplicated campaign as draft");
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Campaign deleted");
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-title text-left">
        <h1>Campaigns</h1>
        <p>Create, monitor and optimise every campaign in one place.</p>
      </div>

      <div className="grid g4 text-left">
        {summary.map((c, i) => (
          <div key={i} className="card hover stat reveal in">
            <div>
              <div className="s-label">{c.l}</div>
              <div className="s-value"><CountUp value={c.v} /></div>
            </div>
            <div className="s-ico">
              <c.ic size={22} color="#fff" />
            </div>
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="seg">
          {['all', 'active', 'paused', 'ended', 'draft'].map(t => (
            <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="finput">
          <input placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-p ml-auto" onClick={openNewModal}>
          <Plus size={16} /> New campaign
        </button>
      </div>

      <div className="card panel reveal in text-left">
        <div style={{overflowX: 'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Spend</th>
                <th>ROAS</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="text-left">
                    <div className="co">
                      <span className="co-ic" style={{background: c.bg}}>{c.ic}</span>
                      {c.name}
                    </div>
                  </td>
                  <td style={{color: 'var(--txt-dim)'}}>{c.channel}</td>
                  <td>
                    <span className={`pill ${c.status}`}><i></i>{c.status}</span>
                  </td>
                  <td>$<CountUp value={c.spend} /></td>
                  <td style={{color: 'var(--green)'}}>{c.roas ? <span><CountUp value={c.roas} />x</span> : '—'}</td>
                  <td>
                    <div className="comp">
                      <span className="cp"><CountUp value={c.prog} />%</span>
                      <div className="comp-track">
                        <div className="comp-fill" style={{width: `${c.prog}%`, background: `linear-gradient(90deg, ${c.c}, ${c.c}bb)`}}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rowmenu-btn"><MoreHorizontal size={18}/></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0B1437] border-[var(--border-hi)] text-white">
                        {c.status === "active" ? (
                          <DropdownMenuItem onClick={() => setStatus(c, 'paused')} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                            <Play size={14} /> Pause
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setStatus(c, 'active')} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                            <Play size={14} /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openEditModal(c)} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                          <Edit size={14} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateCampaign(c)} className="hover:bg-white/5 cursor-pointer flex items-center gap-2">
                          <Copy size={14} /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCampaign(c.id)} className="hover:bg-white/5 text-[#ff6b6b] hover:text-[#ff6b6b] cursor-pointer flex items-center gap-2">
                          <Trash size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0B1437] border-[var(--border-hi)] text-white max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-left">{editingCamp ? "Edit campaign" : "Launch a campaign"}</DialogTitle>
            <DialogDescription className="text-sm text-[var(--txt-dim)] text-left">
              {editingCamp ? "Update your campaign settings." : "Set up your next campaign in seconds."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="field text-left">
              <label className="text-xs font-semibold text-[var(--txt-dim)]">Campaign name</label>
              <input
                className="w-full bg-[rgba(6,11,40,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white outline-none focus:border-[#0075FF]"
                placeholder="e.g. Summer Launch — Retargeting"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="field text-left">
              <label className="text-xs font-semibold text-[var(--txt-dim)]">Channel</label>
              <div className="chan flex gap-2 overflow-x-auto py-1">
                {['Paid Social', 'Search', 'Email', 'Display'].map(ch => (
                  <div
                    key={ch}
                    className={`c flex-1 text-center p-3 rounded-xl border border-[rgba(255,255,255,0.08)] cursor-pointer text-sm font-semibold transition ${channel === ch ? "bg-gradient-to-r from-[#0075FF] to-[#00C6FF] border-transparent text-white" : "bg-[rgba(6,11,40,0.6)] hover:border-[rgba(255,255,255,0.16)]"}`}
                    onClick={() => setChannel(ch)}
                  >
                    {ch}
                  </div>
                ))}
              </div>
            </div>

            <div className="frow grid grid-cols-2 gap-4 text-left">
              <div className="field">
                <label className="text-xs font-semibold text-[var(--txt-dim)]">Budget</label>
                <input
                  type="number"
                  className="w-full bg-[rgba(6,11,40,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white outline-none focus:border-[#0075FF]"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label className="text-xs font-semibold text-[var(--txt-dim)]">Objective</label>
                <select
                  className="w-full bg-[rgba(6,11,40,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white outline-none focus:border-[#0075FF] appearance-none"
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="Conversions" style={{ background: '#0B1437' }}>Conversions</option>
                  <option value="Awareness" style={{ background: '#0B1437' }}>Awareness</option>
                  <option value="Traffic" style={{ background: '#0B1437' }}>Traffic</option>
                  <option value="Leads" style={{ background: '#0B1437' }}>Leads</option>
                </select>
              </div>
            </div>

            <div className="field text-left">
              <label className="text-xs font-semibold text-[var(--txt-dim)]">Notes</label>
              <textarea
                rows={2}
                className="w-full bg-[rgba(6,11,40,0.6)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 text-white outline-none focus:border-[#0075FF]"
                placeholder="Optional brief…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn btn-g" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-p">{editingCamp ? "Save changes" : "Launch campaign"}</button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
