import { useStore } from "@/store/useStore";
import { Megaphone, Play, DollarSign, ArrowUp, Plus, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function Campaigns() {
  const campaigns = useStore(s => s.campaigns);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const totSpend = campaigns.reduce((a, c) => a + c.spend, 0);
  const activeCount = campaigns.filter(c => c.roas > 0).length;
  const avgRoas = activeCount ? (campaigns.reduce((a, c) => a + c.roas, 0) / activeCount).toFixed(1) : '0';

  const summary = [
    { l: 'Total campaigns', v: campaigns.length, ic: Megaphone },
    { l: 'Active now', v: campaigns.filter(c => c.status === 'active').length, ic: Play },
    { l: 'Total spend', v: `$${totSpend.toLocaleString()}`, ic: DollarSign },
    { l: 'Avg. ROAS', v: `${avgRoas}x`, ic: ArrowUp }
  ];

  const filtered = campaigns.filter(c => 
    (filter === 'all' || c.status === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Campaigns</h1>
        <p>Create, monitor and optimise every campaign in one place.</p>
      </div>

      <div className="grid g4">
        {summary.map((c, i) => (
          <div key={i} className="card hover stat reveal in">
            <div>
              <div className="s-label">{c.l}</div>
              <div className="s-value">{c.v}</div>
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
        <button className="btn btn-p ml-auto">
          <Plus size={16} /> New campaign
        </button>
      </div>

      <div className="card panel reveal in">
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
                  <td>
                    <div className="co">
                      <span className="co-ic" style={{background: c.bg}}>{c.ic}</span>
                      {c.name}
                    </div>
                  </td>
                  <td style={{color: 'var(--txt-dim)'}}>{c.channel}</td>
                  <td>
                    <span className={`pill ${c.status}`}><i></i>{c.status}</span>
                  </td>
                  <td>${c.spend.toLocaleString()}</td>
                  <td style={{color: 'var(--green)'}}>{c.roas ? `${c.roas}x` : '—'}</td>
                  <td>
                    <div className="comp">
                      <span className="cp">{c.prog}%</span>
                      <div className="comp-track">
                        <div className="comp-fill" style={{width: `${c.prog}%`, background: `linear-gradient(90deg, ${c.c}, ${c.c}bb)`}}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button className="rowmenu-btn"><MoreHorizontal size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
