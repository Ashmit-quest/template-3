import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUp, Award, ShieldCheck, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const loginStore = useStore(s => s.login);
  const signupStore = useStore(s => s.signup);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const ok = await loginStore(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Welcome back! Signing you in...");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!agree) {
      toast.error("Please agree to the Terms of Service");
      return;
    }
    setLoading(true);
    const ok = await signupStore(name, email, password);
    setLoading(false);
    if (ok) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error("Signup failed. Email may already be registered.");
    }
  };

  // Password strength logic
  const getStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strength = getStrength();
  const strengthColors = ["#E31A1A", "#F6AD55", "#21D4FD", "#01B574"];
  const strengthTexts = ["Weak password", "Fair password", "Good password", "Strong password"];

  return (
    <div className="min-height-screen w-full flex items-center justify-center p-6 relative">
      <div className="aurora"></div>
      <div className="aurora two"></div>
      <div className="glow a"></div>
      <div className="glow b"></div>
      <div className="vig"></div>

      <div className="auth">
        {/* BRAND SIDE */}
        <div className="brand-side">
          <div className="lockup">
            <div className="mark">
              <svg viewBox="0 0 24 24" fill="none">
                <path className="ln" d="M3 15l4-5 3 3 5-7 4 4 2-3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="wordmark">
              <span className="shine">VISION</span>
              <br />
              <b>MARKETING</b>
            </div>
          </div>
          <div className="brand-copy">
            <h1>Grow smarter with <span>every signal.</span></h1>
            <p>Your campaigns, audience and revenue — all in one immersive command center built for modern marketing teams.</p>
            <div className="feats">
              <div className="feat">
                <span className="fi"><ArrowUp size={15} color="var(--cyan)" /></span>
                Real-time analytics across every channel
              </div>
              <div className="feat">
                <span className="fi"><Award size={15} color="var(--cyan)" /></span>
                AI-assisted campaign optimization
              </div>
              <div className="feat">
                <span className="fi"><ShieldCheck size={15} color="var(--cyan)" /></span>
                Attribution you can actually trust
              </div>
            </div>
          </div>
            <div className="brand-stat">
              <div className="bs"><div className="n">12k+</div><div className="l">Marketing teams</div></div>
              <div className="bs"><div className="n">$2.4B</div><div className="l">Revenue tracked</div></div>
              <div className="bs"><div className="n">4.9★</div><div className="l">Avg. rating</div></div>
            </div>
        </div>

        {/* FORM SIDE */}
        <div className="form-side">
          <div className={`tabs ${mode === "signup" ? "signup" : ""}`} id="tabs">
            <div className="ind"></div>
            <button className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>Sign in</button>
            <button className={mode === "signup" ? "on" : ""} onClick={() => setMode("signup")}>Sign up</button>
          </div>

          {/* LOGIN */}
          {mode === "login" ? (
            <form className="fform on" onSubmit={handleLogin}>
              <div className="f-head">
                <h2>Welcome back</h2>
                <p>Sign in to your Vision workspace.</p>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="input">
                  <Mail size={17} />
                  <input
                    type="email"
                    placeholder="mark@vision.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="input">
                  <Lock size={17} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--txt-faint)] hover:text-white" onClick={() => setShowShowPass(!showPass)}>
                    {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                  </span>
                </div>
              </div>
              <div className="row-between">
                <div className="check on">
                  <span className="box">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Remember me
                </div>
                <span className="link" onClick={() => toast.success("Reset link sent! Check your inbox.")}>Forgot password?</span>
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? <span className="spin"></span> : <span className="lbl">Sign in</span>}
              </button>
              <div className="divider">or continue with</div>
              <div className="social">
                <div className="soc" onClick={() => toast.success("Continuing with Google")}><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3.1-4.4 3.1-7.5z"/><path fill="#34A853" d="M12 23c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.7-1.7-5.5-4.1H3.1v2.6C4.7 20.7 8.1 23 12 23z"/><path fill="#FBBC05" d="M6.5 14.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V8.5H3.1C2.4 9.9 2 11.4 2 13s.4 3.1 1.1 4.5l3.4-2.6z"/><path fill="#EA4335" d="M12 6.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.9 14.7 3 12 3 8.1 3 4.7 5.3 3.1 8.5l3.4 2.6C7.3 8.6 9.4 6.9 12 6.9z"/></svg>Google</div>
                <div className="soc" onClick={() => toast.success("Continuing with GitHub")}><svg className="w-[18px] h-[18px]" fill="#fff" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z"/></svg>GitHub</div>
              </div>
              <div className="switch">Don't have an account? <b onClick={() => setMode("signup")}>Sign up free</b></div>
            </form>
          ) : (
            <form className="fform on" onSubmit={handleSignup}>
              <div className="f-head">
                <h2>Create account</h2>
                <p>Start your free 14-day trial. No card needed.</p>
              </div>
              <div className="field">
                <label>Full name</label>
                <div className="input">
                  <UserIcon size={17} />
                  <input
                    type="text"
                    placeholder="Mark Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="input">
                  <Mail size={17} />
                  <input
                    type="email"
                    placeholder="mark@vision.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="field animate-slide-in">
                <label>Password</label>
                <div className="input">
                  <Lock size={17} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--txt-faint)] hover:text-white" onClick={() => setShowShowPass(!showPass)}>
                    {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                  </span>
                </div>
                {password && (
                  <>
                    <div className="strength">
                      {[0, 1, 2, 3].map((idx) => (
                        <i
                          key={idx}
                          style={{
                            background: idx < strength ? strengthColors[strength - 1] : "rgba(255,255,255,.1)"
                          }}
                        ></i>
                      ))}
                    </div>
                    <div className="strength-txt" style={{ color: strengthColors[strength - 1] }}>
                      {strengthTexts[strength - 1]}
                    </div>
                  </>
                )}
              </div>
              <div className="row-between">
                <div className={`check ${agree ? "on" : ""}`} onClick={() => setAgree(!agree)}>
                  <span className="box">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                  I agree to the Terms
                </div>
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? <span className="spin"></span> : <span className="lbl">Create account</span>}
              </button>
              <div className="divider">or sign up with</div>
              <div className="social">
                <div className="soc" onClick={() => toast.success("Continuing with Google")}><svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3.1-4.4 3.1-7.5z"/><path fill="#34A853" d="M12 23c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1-2.6 0-4.7-1.7-5.5-4.1H3.1v2.6C4.7 20.7 8.1 23 12 23z"/><path fill="#FBBC05" d="M6.5 14.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V8.5H3.1C2.4 9.9 2 11.4 2 13s.4 3.1 1.1 4.5l3.4-2.6z"/><path fill="#EA4335" d="M12 6.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.9 14.7 3 12 3 8.1 3 4.7 5.3 3.1 8.5l3.4 2.6C7.3 8.6 9.4 6.9 12 6.9z"/></svg>Google</div>
                <div className="soc" onClick={() => toast.success("Continuing with GitHub")}><svg className="w-[18px] h-[18px]" fill="#fff" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 3.9-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z"/></svg>GitHub</div>
              </div>
              <div className="switch">Already have an account? <b onClick={() => setMode("login")}>Sign in</b></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
