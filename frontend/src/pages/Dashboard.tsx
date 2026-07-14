import { useState } from "react";
import { useStore } from "@/store/useStore";
import { DollarSign, Globe, FileText, Send, MoreHorizontal, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const salesDataFull = {
  year: [
    { name: 'Jan', v: 100, b: 60 },
    { name: 'Feb', v: 180, b: 120 },
    { name: 'Mar', v: 140, b: 90 },
    { name: 'Apr', v: 260, b: 170 },
    { name: 'May', v: 220, b: 150 },
    { name: 'Jun', v: 300, b: 210 },
    { name: 'Jul', v: 280, b: 190 },
    { name: 'Aug', v: 360, b: 260 },
    { name: 'Sep', v: 340, b: 240 },
    { name: 'Oct', v: 420, b: 300 },
    { name: 'Nov', v: 400, b: 290 },
    { name: 'Dec', v: 480, b: 350 },
  ],
  q: [
    { name: 'Q1', v: 220, b: 150 },
    { name: 'Q2', v: 340, b: 240 },
    { name: 'Q3', v: 300, b: 210 },
    { name: 'Q4', v: 420, b: 300 },
  ]
};

const barData = [
  { name: '1', uv: 300 },
  { name: '2', uv: 220 },
  { name: '3', uv: 450 },
  { name: '4', uv: 380 },
  { name: '5', uv: 120 },
  { name: '6', uv: 520 },
  { name: '7', uv: 340 },
  { name: '8', uv: 420 },
  { name: '9', uv: 290 },
];

export default function Dashboard() {
  const user = useStore(s => s.user);
  const campaigns = useStore(s => s.campaigns);
  const [salesPeriod, setSalesPeriod] = useState<"year" | "q">("year");

  const cards = [
    { l: "Today's Revenue", v: "$53,000", pct: "+55%", up: true, ic: DollarSign },
    { l: "Today's Users", v: "2,300", pct: "+5%", up: true, ic: Globe },
    { l: "New Leads", v: "+3,052", pct: "-14%", up: false, ic: FileText },
    { l: "Total Sales", v: "$173,000", pct: "+8%", up: true, ic: Send }
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid g4">
        {cards.map((c, i) => (
          <div key={i} className="card hover stat reveal in">
            <div>
              <div className="s-label">{c.l}</div>
              <div className="s-value">
                <span>{c.v}</span>
                <span className={`pct ${c.up ? 'up' : 'down'}`}>{c.pct}</span>
              </div>
            </div>
            <div className="s-ico">
              <c.ic size={22} color="#fff" />
            </div>
          </div>
        ))}
      </div>

      <div className="row2">
        <div className="card welcome reveal in">
          <div className="w-top">
            <small>Welcome back,</small>
            <h2>{user?.name?.split(' ')[0] || 'Mark'}</h2>
            <p>Glad to see you again! Your campaigns are performing well today.</p>
          </div>
          <div className="w-cta" style={{ cursor: "pointer" }} onClick={() => toast.success("Opening campaign creator")}>
            Launch a campaign <Send size={16} />
          </div>
        </div>

        <div className="card satis reveal in">
          <h3>Satisfaction Rate</h3>
          <div className="sub">From all campaigns</div>
          <div className="gauge-wrap flex-1 flex items-center justify-center py-4">
             <div className="relative w-[180px] h-[110px] flex items-end justify-center overflow-hidden">
                <div className="w-[180px] h-[180px] border-[10px] border-[rgba(255,255,255,0.08)] rounded-full absolute top-0"></div>
                <div className="w-[180px] h-[180px] border-[10px] border-t-transparent border-r-transparent border-[#0075FF] border-l-[#00C6FF] rounded-full absolute top-0 transform rotate-45 animate-pulse"></div>
                <div className="gauge-face relative z-10 w-11 h-11 bg-gradient-to-r from-[#0075FF] to-[#00C6FF] rounded-full flex items-center justify-center mb-[-22px] shadow-lg">
                   <span className="text-white text-md font-bold">:)</span>
                </div>
             </div>
          </div>
          <div className="satis-foot">
            <span className="end">0%</span>
            <div className="mid">
              <div className="big">95%</div>
              <div className="lbl">Based on likes</div>
            </div>
            <span className="end">100%</span>
          </div>
        </div>

        <div className="card ref reveal in">
          <div className="ref-left flex flex-col gap-3 flex-1 text-left">
            <div className="ref-head flex justify-between items-center">
              <h3>Referral Tracking</h3>
              <MoreHorizontal size={18} className="text-[var(--txt-dim)] cursor-pointer hover:text-white" onClick={() => toast.success("Ref settings opened")} />
            </div>
            <div className="ref-box">
              <div className="rl">Invited</div>
              <div className="rv">145 people</div>
            </div>
            <div className="ref-box">
              <div className="rl">Bonus</div>
              <div className="rv">1,465</div>
            </div>
          </div>
          <div className="ref-gauge relative flex items-center justify-center w-[150px] shrink-0">
             <div className="w-[120px] h-[120px] rounded-full border-[8px] border-[rgba(255,255,255,0.08)]"></div>
             <div className="absolute w-[120px] h-[120px] rounded-full border-[8px] border-t-[#01B574] border-r-[#4FD1C5] border-b-transparent border-l-transparent transform -rotate-45"></div>
            <div className="ref-score text-center absolute">
              <div className="rs">Safety</div>
              <div className="rn">9.3</div>
              <div className="rt">Total Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div className="text-left">
              <h3>Sales overview</h3>
              <div className="grow">(+5%) more <span>in 2026</span></div>
            </div>
            <div className="seg">
              <button className={salesPeriod === "year" ? "active" : ""} onClick={() => setSalesPeriod("year")}>Year</button>
              <button className={salesPeriod === "q" ? "active" : ""} onClick={() => setSalesPeriod("q")}>Quarter</button>
            </div>
          </div>
          <div className="chart-h h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesDataFull[salesPeriod]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--txt-faint)'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background: '#0B1437', borderColor: 'rgba(255,255,255,0.16)', borderRadius: 10}} />
                <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={3} fillOpacity={1} fill="url(#colorV)" />
                <Area type="monotone" dataKey="b" stroke="#21D4FD" strokeWidth={3} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bars-card reveal in">
          <div className="bars-inner h-[220px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <Bar dataKey="uv" fill="#fff" radius={[6, 6, 6, 6]} barSize={12} />
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="au-h text-left">
            <h3>Active Users</h3>
            <div className="grow">(+23%) <span>than last week</span></div>
          </div>
          <div className="au-grid">
            <div className="au-item">
              <div className="au-top"><Globe size={15}/>Users</div>
              <div className="au-v">32,984</div>
              <div className="au-track"><div className="au-fill" style={{width: '80%'}}></div></div>
            </div>
            <div className="au-item">
              <div className="au-top"><Send size={15}/>Clicks</div>
              <div className="au-v">2.42m</div>
              <div className="au-track"><div className="au-fill" style={{width: '90%'}}></div></div>
            </div>
            <div className="au-item">
              <div className="au-top"><DollarSign size={15}/>Sales</div>
              <div className="au-v">$2,400</div>
              <div className="au-track"><div className="au-fill" style={{width: '30%'}}></div></div>
            </div>
            <div className="au-item">
              <div className="au-top"><FileText size={15}/>Items</div>
              <div className="au-v">320</div>
              <div className="au-track"><div className="au-fill" style={{width: '50%'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row4">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div className="text-left">
              <h3>Campaigns</h3>
              <div className="grow"><span style={{color: 'var(--txt-dim)'}}>✓ {campaigns.length} running this month</span></div>
            </div>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 5).map(c => (
                  <tr key={c.id}>
                    <td className="text-left">
                      <div className="co">
                        <span className="co-ic" style={{background: c.bg}}>{c.ic}</span>
                        {c.name}
                      </div>
                    </td>
                    <td>
                      <span className={`pill ${c.status}`}><i></i>{c.status}</span>
                    </td>
                    <td>${c.budget.toLocaleString()}</td>
                    <td>
                      <div className="comp">
                        <span className="cp">{c.prog}%</span>
                        <div className="comp-track">
                          <div className="comp-fill" style={{width: `${c.prog}%`, background: `linear-gradient(90deg, ${c.c}, ${c.c}bb)`}}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div className="text-left">
              <h3>Orders overview</h3>
              <div className="grow">+30% <span>this month</span></div>
            </div>
          </div>
          <div className="tl text-left">
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
