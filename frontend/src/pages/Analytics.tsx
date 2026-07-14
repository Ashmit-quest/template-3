import { Globe, ArrowUp, DollarSign, FileText, Download } from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { toast } from "sonner";

const pieData = [
  { name: 'Organic Search', value: 42, color: '#0075FF' },
  { name: 'Paid Social', value: 28, color: '#21D4FD' },
  { name: 'Email', value: 18, color: '#01B574' },
  { name: 'Referral', value: 12, color: '#F6AD55' },
];

const deviceData = [
  { name: 'Mobile', value: 68 },
  { name: 'Desktop', value: 24 },
  { name: 'Tablet', value: 8 },
];

export default function Analytics() {
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");

  const generateData = (p: "7" | "30" | "90") => {
    const count = p === "7" ? 7 : p === "30" ? 30 : 90;
    return Array.from({ length: count }, (_, i) => {
      const label = p === "7" ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `D${i + 1}`;
      const base = 60 + i * (p === "7" ? 12 : p === "30" ? 2.4 : 0.8) + Math.sin(i / 3) * 18 + Math.random() * 10;
      return {
        name: label,
        v: Math.round(base * 80)
      };
    });
  };

  const currentChartData = generateData(period);

  const stat = (l: string, v: string, pct: string, up: boolean, Ic: any) => (
    <div className="card hover stat reveal in">
      <div>
        <div className="s-label">{l}</div>
        <div className="s-value text-left">
          <span>{v}</span>
          <span className={`pct ${up ? 'up' : 'down'}`}>{pct}</span>
        </div>
      </div>
      <div className="s-ico">
        <Ic size={22} color="#fff" />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Analytics</h1>
        <p>Traffic, conversion and channel performance across the funnel.</p>
      </div>

      <div className="grid g4">
        {stat('Sessions', '128,400', '+12%', true, Globe)}
        {stat('Conversion rate', '3.8%', '+0.4%', true, ArrowUp)}
        {stat('Avg. order value', '$142', '+6%', true, DollarSign)}
        {stat('Bounce rate', '38.2%', '-3%', false, FileText)}
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div className="text-left">
              <h3>Traffic overview</h3>
              <div className="grow">+18% <span>vs previous period</span></div>
            </div>
            <div className="seg">
              <button className={period === "7" ? "active" : ""} onClick={() => setPeriod("7")}>7D</button>
              <button className={period === "30" ? "active" : ""} onClick={() => setPeriod("30")}>30D</button>
              <button className={period === "90" ? "active" : ""} onClick={() => setPeriod("90")}>90D</button>
            </div>
          </div>
          <div className="chart-h h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21D4FD" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#21D4FD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--txt-faint)'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background: '#0B1437', borderColor: 'rgba(255,255,255,0.16)', borderRadius: 10}} formatter={(value: any) => [`${value.toLocaleString()} sessions`, "Traffic"]} />
                <Area type="monotone" dataKey="v" stroke="#21D4FD" strokeWidth={3} fillOpacity={1} fill="url(#colorAn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div className="text-left">
              <h3>Traffic by channel</h3>
              <div className="sub">Share of sessions</div>
            </div>
          </div>
          <div className="donut-wrap h-[160px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-extrabold text-white">42%</div>
              <div className="text-[10px] text-[var(--txt-faint)] font-bold">ORGANIC</div>
            </div>
          </div>
          <div className="legend mt-4 flex flex-col gap-2 text-left">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-[13px]">
                <span className="w-2 h-2 rounded-full" style={{background: d.color}}></span>
                <span className="text-[var(--txt-dim)]">{d.name}</span>
                <span className="ml-auto font-bold text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row3 text-left">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Conversion funnel</h3>
              <div className="sub">Visitor → customer</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              ['Visitors', 48210, 100, '#0075FF'],
              ['Sign-ups', 18940, 64, '#21D4FD'],
              ['Trials', 7120, 40, '#01B574'],
              ['Customers', 1847, 22, '#F6AD55']
            ].map((x: any) => (
              <div key={x[0]} className="flex items-center gap-3">
                <div className="w-[110px] shrink-0">
                  <div className="text-[13px] font-bold text-white">{x[0]}</div>
                  <div className="text-[11px] text-[var(--txt-faint)]">{x[1].toLocaleString()}</div>
                </div>
                <div className="flex-1 h-[36px] bg-[rgba(6,11,40,0.5)] rounded-[10px] overflow-hidden">
                  <div className="h-full rounded-[10px]" style={{width: `${x[2]}%`, background: `linear-gradient(90deg, ${x[3]}, ${x[3]}aa)`}}></div>
                </div>
                <div className="w-[44px] text-right font-bold text-[12px] text-[var(--green)]">{x[2]}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Sessions by device</h3>
              <div className="sub">Last 30 days</div>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={deviceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="dgrad" x1="0" y1="1" x2="0" y2="0">
                     <stop offset="0%" stopColor="#0075FF" />
                     <stop offset="100%" stopColor="#21D4FD" />
                   </linearGradient>
                 </defs>
                 <Bar dataKey="value" fill="url(#dgrad)" radius={[6, 6, 6, 6]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="legend flex flex-row gap-5 mt-[6px] justify-center">
            <div className="li flex items-center gap-2"><span className="dot w-[9px] h-[9px] rounded-full bg-[#0075FF]"></span><span className="nm text-[13px] text-[var(--txt-dim)]">Mobile 68%</span></div>
            <div className="li flex items-center gap-2"><span className="dot w-[9px] h-[9px] rounded-full bg-[#21D4FD]"></span><span className="nm text-[13px] text-[var(--txt-dim)]">Desktop 24%</span></div>
            <div className="li flex items-center gap-2"><span className="dot w-[9px] h-[9px] rounded-full bg-[#01B574]"></span><span className="nm text-[13px] text-[var(--txt-dim)]">Tablet 8%</span></div>
          </div>
        </div>
      </div>

      <div className="card panel reveal in text-left mt-[22px]">
        <div className="panel-h flex justify-between items-center">
          <div>
            <h3>Top landing pages</h3>
            <div className="sub">By conversions this month</div>
          </div>
          <button className="btn btn-g btn-sm flex items-center gap-2" onClick={() => toast.success("Preparing analytics CSV export...")}>
            <Download size={15} /> Export
          </button>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Page</th>
                <th>Views</th>
                <th>Conv. rate</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['/summer-launch', 24800, '5.2%', 48200, 80],
                ['/pricing', 18400, '4.1%', 31200, 64],
                ['/demo', 12100, '6.8%', 52900, 92],
                ['/blog/growth', 9800, '2.2%', 8400, 30],
                ['/free-trial', 7600, '7.4%', 38700, 74]
              ].map((r: any) => (
                <tr key={r[0]}>
                  <td style={{color: 'var(--cyan)'}} className="font-semibold">{r[0]}</td>
                  <td>{r[1].toLocaleString()}</td>
                  <td>{r[2]}</td>
                  <td>${r[3].toLocaleString()}</td>
                  <td>
                    <div className="comp-track" style={{width: 90}}>
                      <div className="comp-fill h-full rounded-full" style={{width: `${r[4]}%`, background: 'var(--brand-grad)'}}></div>
                    </div>
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
