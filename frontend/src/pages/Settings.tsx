import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: false,
    weeklyReport: true,
    liveActivity: true,
    twoFactor: false,
    publicProfile: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(s => {
      const v = !s[key];
      toast.success(`${key} ${v ? 'enabled' : 'disabled'}`);
      return { ...s, [key]: v };
    });
  };

  const row = (key: keyof typeof settings, t: string, d: string) => (
    <div className="setrow">
      <div className="st-body">
        <div className="st-t">{t}</div>
        <div className="st-d">{d}</div>
      </div>
      <div className={`tgl ${settings[key] ? 'on' : ''}`} onClick={() => toggle(key)}></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Settings</h1>
        <p>Control notifications, privacy and account preferences.</p>
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Notifications</h3>
              <div className="sub">How we reach you</div>
            </div>
          </div>
          {row('emailNotif', 'Email notifications', 'Get campaign alerts and reports by email')}
          {row('pushNotif', 'Push notifications', 'Real-time alerts on your devices')}
          {row('weeklyReport', 'Weekly summary', 'A digest of performance every Monday')}
          {row('liveActivity', 'Live activity feed', 'Show streaming events on the dashboard')}
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Privacy & security</h3>
              <div className="sub">Keep your account safe</div>
            </div>
          </div>
          {row('twoFactor', 'Two-factor authentication', 'Require a code at sign-in')}
          {row('publicProfile', 'Public profile', 'Let teammates view your profile')}
          <div className="setrow">
            <div className="st-body">
              <div className="st-t">Change password</div>
              <div className="st-d">Last changed 3 months ago</div>
            </div>
            <button className="btn btn-g btn-sm">Update</button>
          </div>
          <div className="setrow">
            <div className="st-body">
              <div className="st-t">Active sessions</div>
              <div className="st-d">2 devices signed in</div>
            </div>
            <button className="btn btn-g btn-sm">Sign out all</button>
          </div>
        </div>
      </div>

      <div className="card panel reveal in">
        <div className="panel-h">
          <div>
            <h3 style={{color: '#ff6b6b'}}>Danger zone</h3>
            <div className="sub">Irreversible actions</div>
          </div>
        </div>
        <div className="setrow">
          <div className="st-body">
            <div className="st-t">Delete account</div>
            <div className="st-d">Permanently remove your account and all data</div>
          </div>
          <button className="btn btn-g btn-sm" style={{borderColor: 'rgba(227,26,26,.4)', color: '#ff6b6b'}}>Delete</button>
        </div>
      </div>
    </div>
  );
}
