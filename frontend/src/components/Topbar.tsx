import { useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Search, Bell, Settings, Menu } from "lucide-react";

export default function Topbar() {
  const location = useLocation();
  const user = useStore((s) => s.user);

  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/campaigns": "Campaigns",
    "/analytics": "Analytics",
    "/audience": "Audience",
    "/billing": "Billing",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const title = titleMap[location.pathname] || "Dashboard";

  return (
    <div className="topbar">
      <button className="menu-btn" id="menuBtn">
        <Menu size={20} />
      </button>
      <div className="crumb">
        Pages / <b>{title}</b>
        <h1>{title}</h1>
      </div>
      <div className="top-actions">
        <div className="search">
          <Search size={15} />
          <span>Type here…</span>
          <kbd>⌘K</kbd>
        </div>
        <button className="t-btn" id="signBtn">
          <span id="signName">{user?.name ? user.name.split(" ")[0] : "Mark"}</span>
        </button>
        <button className="t-btn" id="gearBtn">
          <Settings size={17} />
        </button>
        <button className="t-btn" id="bellBtn">
          <span className="dot"></span>
          <Bell size={17} />
        </button>
      </div>
    </div>
  );
}
