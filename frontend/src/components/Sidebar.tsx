import { NavLink } from "react-router-dom";
import { useStore } from "@/store/useStore";
import {
  LayoutDashboard,
  Megaphone,
  BarChart2,
  Users,
  CreditCard,
  User,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const campaigns = useStore((s) => s.campaigns);
  const activeCampCount = campaigns.filter((c) => c.status === "active").length;

  const NAV_MAIN = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/campaigns", label: "Campaigns", icon: Megaphone, badge: activeCampCount },
    { to: "/analytics", label: "Analytics", icon: BarChart2 },
    { to: "/audience", label: "Audience", icon: Users },
    { to: "/billing", label: "Billing", icon: CreditCard },
  ];

  const NAV_ACC = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar" id="sidebar">
      <div className="brand">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 14l4-4 3 3 5-6 4 4"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="brand-name">
          VISION <b>MARKETING</b>
        </div>
      </div>
      <div className="hr-glow"></div>
      
      <div id="navMain">
        {NAV_MAIN.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="ni-ico">
              <item.icon size={16} />
            </span>
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="nav-cap">Account Pages</div>
      <div id="navAccount">
        {NAV_ACC.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="ni-ico">
              <item.icon size={16} />
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="help-card">
        <div className="help-ball">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9.5 9a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1" fill="#fff" />
          </svg>
        </div>
        <h4>Need help?</h4>
        <p>Please check our docs.</p>
        <button onClick={() => alert("Docs")}>DOCUMENTATION</button>
      </div>
    </aside>
  );
}
