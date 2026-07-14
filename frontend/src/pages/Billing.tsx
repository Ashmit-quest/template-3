import { CreditCard, Check, Download } from "lucide-react";

export default function Billing() {
  const plans = [
    {n:'Starter', p:0, cur:false, f:['1 workspace','5 campaigns','Community support']},
    {n:'Pro', p:49, cur:true, f:['Unlimited campaigns','Advanced analytics','AI insights','Priority support']},
    {n:'Enterprise', p:199, cur:false, f:['Everything in Pro','SSO & SAML','Dedicated manager','Custom SLAs']}
  ];

  const invoices = [
    ['INV-2026-014','Jul 1, 2026','$49.00','Paid'],
    ['INV-2026-013','Jun 1, 2026','$49.00','Paid'],
    ['INV-2026-012','May 1, 2026','$49.00','Paid'],
    ['INV-2026-011','Apr 1, 2026','$49.00','Paid']
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-title">
        <h1>Billing</h1>
        <p>Manage your plan, payment method and invoices.</p>
      </div>

      <div className="row3">
        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Current plan</h3>
              <div className="sub">You're on the <b style={{color: '#fff'}}>Pro</b> plan</div>
            </div>
            <button className="btn btn-p btn-sm">Change plan</button>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Campaigns</span><span className="uv">18 / Unlimited</span></div>
            <div className="meter"><span style={{width: '45%'}}></span></div>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Monthly emails</span><span className="uv">84,200 / 100,000</span></div>
            <div className="meter"><span style={{width: '84%'}}></span></div>
          </div>
          <div className="usage-row">
            <div className="usage-top"><span className="ul">Team seats</span><span className="uv">4 / 10</span></div>
            <div className="meter"><span style={{width: '40%'}}></span></div>
          </div>
        </div>

        <div className="card panel reveal in">
          <div className="panel-h">
            <div>
              <h3>Payment method</h3>
              <div className="sub">Next charge Aug 1, 2026</div>
            </div>
          </div>
          <div style={{background: 'linear-gradient(127deg,#0075FF,#00C6FF)', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden', minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(160px 120px at 90% 10%,rgba(255,255,255,.3),transparent 60%)'}}></div>
            <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontWeight: 700}}>Vision Inc.</span>
              <CreditCard color="#fff" />
            </div>
            <div style={{position: 'relative', fontSize: 19, letterSpacing: 3, fontWeight: 700}}>•••• •••• •••• 4219</div>
            <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: 12}}>
              <span>Mark Johnson</span>
              <span>08 / 28</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card panel reveal in">
        <div className="panel-h">
          <div>
            <h3>Invoices</h3>
            <div className="sub">Download your billing history</div>
          </div>
        </div>
        <div style={{overflowX: 'auto'}}>
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
                  <td style={{color: 'var(--txt-dim)'}}>{iv[1]}</td>
                  <td>{iv[2]}</td>
                  <td><span className="pill active"><i></i>{iv[3]}</span></td>
                  <td style={{textAlign: 'right'}}>
                    <button className="btn btn-g btn-sm"><Download size={15}/> PDF</button>
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
