import { Users, ArrowUp, UserPlus, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import CountUp from "@/components/CountUp";

const audData = [
  { name: 'Jan', v: 42 }, { name: 'Feb', v: 45 }, { name: 'Mar', v: 48 },
  { name: 'Apr', v: 52 }, { name: 'May', v: 55 }, { name: 'Jun', v: 58 },
  { name: 'Jul', v: 63 }, { name: 'Aug', v: 66 }, { name: 'Sep', v: 70 },
  { name: 'Oct', v: 74 }, { name: 'Nov', v: 79 }, { name: 'Dec', v: 84 },
];

const genderData = [
  { name: 'Female', value: 54, color: '#0075FF' },
  { name: 'Male', value: 42, color: '#21D4FD' },
  { name: 'Other', value: 4, color: '#01B574' },
];

export default function Audience() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const stat = (l: string, v: string, pct: string, up: boolean, Ic: any) => (
    <div className="card hover stat reveal in text-left">
      <div>
        <div className="s-label">{l}</div>
        <div className="s-value text-left">
          <span><CountUp value={v} /></span>
          <span className={`pct ${up ? 'up' : 'down'}`}>{pct}</span>
        </div>
      </div>
      <div className="s-ico">
        <Ic size={22} color="#fff" />
      </div>
    </div>
  );

  const hbar = (name: string, val: string, pct: number, c: string) => (
    <div className="mb-4 text-left">
      <div className="flex justify-between mb-2 text-[13px]">
        <span className="font-semibold text-white">{name}</span>
        <span className="text-[var(--txt-dim)]"><CountUp value={val} /></span>
      </div>
      <div className="comp-track h-[9px]">
        <div 
          className="comp-fill h-full rounded-full transition-all duration-1000 ease-out" 
          style={{
            width: animated ? `${pct}%` : '0%', 
            background: `linear-gradient(90deg, ${c}, ${c}aa)`
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-title text-left">
        <h1>Audience</h1>
        <p>Who your customers are and how your community is growing.</p>
      </div>

      <div className="grid g4">
        {stat('Total audience', '84,200', '+9%', true, Users)}
        {stat('New this month', '6,120', '+14%', true, ArrowUp)}
        {stat('Active subscribers', '52,800', '+4%', true, UserPlus)}
        {stat('Unsubscribes', '312', '-8%', false, UserMinus)}
      </div>

      <div className="row3 text-left">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Audience growth</h3>
              <div className="grow">+9% <span>over 12 months</span></div>
            </div>
          </div>
          <div className="chart-h h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={audData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0075FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0075FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 10, fill: 'var(--txt-faint)'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background: '#0B1437', borderColor: 'rgba(255,255,255,0.16)', borderRadius: 10}} formatter={(value: any) => [`${(value * 1000).toLocaleString()} people`, "Audience"]} />
                <Area type="monotone" dataKey="v" stroke="#0075FF" strokeWidth={3} fillOpacity={1} fill="url(#colorAud)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h text-left">
            <div>
              <h3>Gender</h3>
              <div className="sub">Of total audience</div>
            </div>
          </div>
          <div className="donut-wrap h-[160px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-extrabold text-white"><CountUp value="54%" /></div>
              <div className="text-[10px] text-[var(--txt-faint)] font-bold">FEMALE</div>
            </div>
          </div>
          <div className="legend mt-4 flex flex-col gap-2">
            {genderData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-[13px]">
                <span className="w-2 h-2 rounded-full" style={{background: d.color}}></span>
                <span className="text-[var(--txt-dim)]">{d.name}</span>
                <span className="ml-auto font-bold text-white"><CountUp value={`${d.value}%`} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h text-left">
            <div>
              <h3>Age distribution</h3>
              <div className="sub">By share of audience</div>
            </div>
          </div>
          <div>
            {hbar('18-24', '22%', 22, '#0075FF')}
            {hbar('25-34', '38%', 38, '#0075FF')}
            {hbar('35-44', '24%', 24, '#0075FF')}
            {hbar('45-54', '11%', 11, '#0075FF')}
            {hbar('55+', '5%', 5, '#0075FF')}
          </div>
        </div>
        <div className="card panel reveal in">
          <div className="panel-h text-left">
            <div>
              <h3>Top locations</h3>
              <div className="sub">By audience size</div>
            </div>
          </div>
          <div>
            {hbar('🇺🇸 United States', '42%', 42, '#21D4FD')}
            {hbar('🇬🇧 United Kingdom', '18%', 18, '#21D4FD')}
            {hbar('🇮🇳 India', '14%', 14, '#21D4FD')}
            {hbar('🇩🇪 Germany', '9%', 9, '#21D4FD')}
            {hbar('🇨🇦 Canada', '7%', 7, '#21D4FD')}
          </div>
        </div>
      </div>
    </div>
  );
}
