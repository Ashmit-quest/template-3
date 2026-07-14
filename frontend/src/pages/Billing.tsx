import { CreditCard, Check, Download, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [modalOpen, setModalOpen] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const plans = [
    { n: 'Starter', p: 0, f: ['1 workspace', '5 campaigns', 'Community support'] },
    { n: 'Pro', p: 49, f: ['Unlimited campaigns', 'Advanced analytics', 'AI insights', 'Priority support'] },
    { n: 'Enterprise', p: 199, f: ['Everything in Pro', 'SSO & SAML', 'Dedicated manager', 'Custom SLAs'] }
  ];

  const invoices = [
    ['INV-2026-014', 'Jul 1, 2026', '$49.00', 'Paid'],
    ['INV-2026-013', 'Jun 1, 2026', '$49.00', 'Paid'],
    ['INV-2026-012', 'May 1, 2026', '$49.00', 'Paid'],
    ['INV-2026-011', 'Apr 1, 2026', '$49.00', 'Paid']
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(false);
    toast.success(`Plan updated: You are now on ${planName}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Billing</h1>
        <p>Manage your plan, payment method and invoices.</p>
      </div>

      <div className="row3 text-left">
        <div className="card panel reveal in">
          <div className="panel-h flex justify-between items-start">
            <div>
              <h3>Current plan</h3>
              <div className="sub">You're on the <b style={{ color: '#fff' }}>{selectedPlan}</b> plan</div>
            </div>
            <button className="btn btn-p btn-sm" onClick={() => setModalOpen(true)}>Change plan</button>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Campaigns</span><span className="uv">18 / Unlimited</span></div>
            <div className="meter"><span style={{ width: animated ? '45%' : '0%', transition: 'width 1.2s cubic-bezier(.22,1,.36,1)' }}></span></div>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Monthly emails</span><span className="uv">84,200 / 100,000</span></div>
            <div className="meter"><span style={{ width: animated ? '84%' : '0%', transition: 'width 1.2s cubic-bezier(.22,1,.36,1)' }}></span></div>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Team seats</span><span className="uv">4 / 10</span></div>
            <div className="meter"><span style={{ width: animated ? '40%' : '0%', transition: 'width 1.2s cubic-bezier(.22,1,.36,1)' }}></span></div>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">API calls</span><span className="uv">312K / 500K</span></div>
            <div className="meter"><span style={{ width: animated ? '62%' : '0%', transition: 'width 1.2s cubic-bezier(.22,1,.36,1)' }}></span></div>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Payment method</h3>
              <div className="sub">Next charge Aug 1, 2026</div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(127deg,#0075FF,#00C6FF)', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(160px 120px at 90% 10%,rgba(255,255,255,.3),transparent 60%)' }}></div>
            <div style={{ position: 'relative', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }} className="text-white">Vision Inc.</span>
              <CreditCard color="#fff" />
            </div>
            <div style={{ position: 'relative', fontSize: 19, letterSpacing: 3, fontWeight: 700 }} className="text-white text-center py-2">•••• •••• •••• 4219</div>
            <div style={{ position: 'relative', display: 'flex', justifyBetween: 'space-between', fontSize: 12, justifyContent: 'space-between' }} className="text-white">
              <span>Mark Johnson</span>
              <span>08 / 28</span>
            </div>
          </div>
          <button className="btn btn-g w-full mt-4 flex justify-center gap-2" onClick={() => toast.success("Opening card editor...")}>
            <Edit size={16} /> Update card
          </button>
        </div>
      </div>

      <div className="card panel reveal in text-left mt-[22px]">
        <div className="panel-h">
          <div>
            <h3>Invoices</h3>
            <div className="sub">Download your billing history</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((iv, i) => (
                <tr key={i}>
                  <td>{iv[0]}</td>
                  <td style={{ color: 'var(--txt-dim)' }}>{iv[1]}</td>
                  <td>{iv[2]}</td>
                  <td><span className="pill active"><i></i>{iv[3]}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-g btn-sm flex items-center gap-2 ml-auto" onClick={() => toast.success(`Downloading ${iv[0]}.pdf`)}>
                      <Download size={15} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0B1437] border-[var(--border-hi)] text-white max-w-[500px] rounded-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-white text-left">Choose your plan</DialogTitle>
            <DialogDescription className="text-sm text-[var(--txt-dim)] text-left">
              Upgrade or downgrade anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plans.map(pl => (
                <div key={pl.n} className={`plan ${selectedPlan === pl.n ? 'cur' : ''} p-5 rounded-xl border relative text-left`}>
                  {selectedPlan === pl.n && <span className="cur-tag absolute top-4 right-4 text-[10px] font-bold bg-gradient-to-r from-[#0075FF] to-[#00C6FF] px-2 py-1 rounded-full text-white">CURRENT</span>}
                  <div className="pn text-sm font-bold text-[var(--txt-dim)]">{pl.n}</div>
                  <div className="pp text-2xl font-extrabold text-white my-2">${pl.p}<span className="text-xs font-semibold text-[var(--txt-dim)]">/mo</span></div>
                  <ul className="space-y-1 my-2">
                    {pl.f.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[var(--txt-dim)]">
                        <Check size={12} className="text-[#01B574]" /> {f}
                      </li>
                    ))}
                  </ul>
                  {selectedPlan !== pl.n && (
                    <button className="btn btn-p btn-sm w-full flex justify-center mt-2 font-bold text-white" onClick={() => handleSelectPlan(pl.n)}>
                      Select {pl.n}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
