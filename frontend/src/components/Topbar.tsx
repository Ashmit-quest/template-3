import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Search, Bell, Settings, Menu, LogOut, CreditCard, User, AlertTriangle, ArrowUp, UserPlus, CheckCircle } from "lucide-react";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [cmdActive, setCmdActive] = useState(0);

  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const searchBtnRef = useRef<HTMLDivElement>(null);

  const [notifs, setNotifs] = useState([
    { id: 1, ic: "up", t: "Summer Launch crossed <b>$100K</b> revenue", m: "2 min ago", u: true },
    { id: 2, ic: "warn", t: "Retargeting Q3 is at <b>90% budget</b>", m: "18 min ago", u: true },
    { id: 3, ic: "user", t: "<b>+312 new leads</b> in the last hour", m: "1 hr ago", u: true },
    { id: 4, ic: "check", t: "Weekly report is ready", m: "3 hrs ago", u: false }
  ]);

  const hasUnread = notifs.some(n => n.u);

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

  const commands = [
    { cat: "Navigate", i: "dashboard", t: "Go to Dashboard", fn: () => navigate("/dashboard") },
    { cat: "Navigate", i: "campaigns", t: "Go to Campaigns", fn: () => navigate("/campaigns") },
    { cat: "Navigate", i: "analytics", t: "Go to Analytics", fn: () => navigate("/analytics") },
    { cat: "Navigate", i: "audience", t: "Go to Audience", fn: () => navigate("/audience") },
    { cat: "Navigate", i: "billing", t: "Go to Billing", fn: () => navigate("/billing") },
    { cat: "Navigate", i: "profile", t: "Go to Profile", fn: () => navigate("/profile") },
    { cat: "Navigate", i: "settings", t: "Go to Settings", fn: () => navigate("/settings") },
  ];

  const filteredCommands = commands.filter(c => c.t.toLowerCase().includes(cmdQuery.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
      if (cmdOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setCmdActive(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setCmdActive(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (filteredCommands[cmdActive]) {
            filteredCommands[cmdActive].fn();
            setCmdOpen(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cmdOpen, filteredCommands, cmdActive]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".pop") && !target.closest(".t-btn")) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, u: false })));
  };

  const getNotifIcon = (ic: string) => {
    if (ic === "up") return <ArrowUp size={16} color="#fff" />;
    if (ic === "warn") return <AlertTriangle size={16} color="#fff" />;
    if (ic === "user") return <UserPlus size={16} color="#fff" />;
    return <CheckCircle size={16} color="#fff" />;
  };

  const popPosition = (btnRef: React.RefObject<HTMLButtonElement>) => {
    if (!btnRef.current) return {};
    const r = btnRef.current.getBoundingClientRect();
    return {
      top: `${r.bottom + window.scrollY + 12}px`,
      right: `${Math.max(12, window.innerWidth - r.right)}px`,
    };
  };

  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2) : "MJ";

  return (
    <>
      <div className="topbar">
        <button className="menu-btn" id="menuBtn">
          <Menu size={20} />
        </button>
        <div className="crumb">
          Pages / <b>{title}</b>
          <h1>{title}</h1>
        </div>
        <div className="top-actions">
          <div className="search" ref={searchBtnRef} onClick={() => setCmdOpen(true)}>
            <Search size={15} />
            <span>Type here…</span>
            <kbd>⌘K</kbd>
          </div>
          <button className="t-btn" id="signBtn" ref={profileBtnRef} onClick={() => { setProfileOpen(prev => !prev); setNotifOpen(false); }}>
            <span id="signName">{user?.name ? user.name.split(" ")[0] : "Mark"}</span>
          </button>
          <button className="t-btn" id="gearBtn" onClick={() => { setProfileOpen(prev => !prev); setNotifOpen(false); }}>
            <Settings size={17} />
          </button>
          <button className="t-btn" id="bellBtn" ref={notifBtnRef} onClick={() => { setNotifOpen(prev => !prev); setProfileOpen(false); }}>
            {hasUnread && <span className="dot"></span>}
            <Bell size={17} />
          </button>
        </div>
      </div>

      {notifOpen && (
        <div className="pop open" id="notifPop" style={popPosition(notifBtnRef)}>
          <div className="pop-head">
            <h4>Notifications</h4>
            <a onClick={markAllRead}>Mark all read</a>
          </div>
          <div className="nlist">
            {notifs.map(n => (
              <div key={n.id} className={`nrow ${n.u ? "unread" : ""}`} onClick={() => {
                setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, u: false } : item));
              }}>
                <span className="nic">
                  {getNotifIcon(n.ic)}
                </span>
                <div>
                  <div className="ntx" dangerouslySetInnerHTML={{ __html: n.t }} />
                  <div className="ntm">{n.m}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="pop open" id="profPop" style={popPosition(profileBtnRef)}>
          <div className="pph">
            <div className="pav">{initials}</div>
            <div>
              <div className="pn">{user?.name || "Mark Johnson"}</div>
              <div className="pe">{user?.email || "mark@vision.io"}</div>
            </div>
          </div>
          <div className="pmenu">
            <a onClick={() => { navigate("/profile"); setProfileOpen(false); }}>
              <User size={16} /> My profile
            </a>
            <a onClick={() => { navigate("/billing"); setProfileOpen(false); }}>
              <CreditCard size={16} /> Billing
            </a>
            <a onClick={() => { navigate("/settings"); setProfileOpen(false); }}>
              <Settings size={16} /> Settings
            </a>
            <hr />
            <a className="danger" onClick={() => { alert("Signed out"); setProfileOpen(false); }}>
              <LogOut size={16} /> Sign out
            </a>
          </div>
        </div>
      )}

      {cmdOpen && (
        <div className="cmdo open" onClick={(e) => { if (e.target === e.currentTarget) setCmdOpen(false); }}>
          <div className="cmd">
            <div className="cmd-in">
              <Search size={19} />
              <input
                id="cmdInput"
                placeholder="Type a command or search…"
                value={cmdQuery}
                onChange={e => { setCmdQuery(e.target.value); setCmdActive(0); }}
                autoFocus
              />
              <kbd>ESC</kbd>
            </div>
            <div className="cmd-list">
              {filteredCommands.length === 0 ? (
                <div className="cmd-cat">No results</div>
              ) : (
                <>
                  <div className="cmd-cat">Navigate</div>
                  {filteredCommands.map((c, i) => (
                    <div
                      key={c.t}
                      className={`cmd-i ${i === cmdActive ? "active" : ""}`}
                      onClick={() => { c.fn(); setCmdOpen(false); }}
                      onMouseEnter={() => setCmdActive(i)}
                    >
                      <Search size={17} />
                      {c.t}
                      <span className="arr">↵</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
