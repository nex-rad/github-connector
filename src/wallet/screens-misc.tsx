import { ChevronRight, LogOut, RotateCcw, Settings, ShieldCheck, Globe, HelpCircle, ArrowUpRight, Info } from "lucide-react";
import { useState } from "react";
import { Avatar, BrandBar, StatusBar, TopBar } from "./ui";
import { fmt, useWallet, type Tx } from "./store";
import { BottomNav } from "./screens-home";
import type { Nav } from "./WalletApp";

export function LoginScreen() {
  const w = useWallet();
  const [num, setNum] = useState("929422660");
  return (
    <div className="flex h-full flex-col bg-tb-green-soft/40">
      <div className="bg-tb-surface"><StatusBar /></div>
      <BrandBar />
      <div className="flex justify-end px-5 pt-4 text-[12px] text-tb-text">English ▾</div>
      <div className="mt-24 text-center text-[13px] font-semibold text-tb-blue">All-in-One</div>
      <div className="mt-2 text-center text-[20px] font-bold text-tb-text">Login</div>
      <div className="mx-auto mt-1 h-0.5 w-12 bg-tb-green" />
      <div className="mt-10 px-6">
        <div className="text-[11px] text-tb-muted">Mobile Number</div>
        <div className="mt-1 flex h-10 items-center gap-3 rounded border border-tb-line bg-tb-surface/70 px-3 text-[13px]">
          +251
          <input inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 9))} className="flex-1 bg-transparent outline-none" />
        </div>
        <button onClick={() => w.set({ loggedIn: true })} disabled={num.length !== 9} className="tap mt-9 h-10 w-full rounded-md bg-tb-blue text-[14px] font-semibold text-tb-surface disabled:bg-tb-blue-soft">Next</button>
        <div className="mt-4 text-center text-[10px] text-tb-text">Don't have an account? <span className="text-tb-green">Create New Account</span></div>
        <div className="mt-6 flex justify-around text-[11px] text-tb-green"><span>teleHub</span><span>Help</span></div>
      </div>
      <div className="mt-auto pb-6 text-center text-[9px] text-tb-muted">
        <div className="text-tb-green">Terms and Conditions</div>
        Educational demo · not affiliated · no real money
      </div>
    </div>
  );
}

export function HistoryScreen({ nav }: { nav: Nav }) {
  const w = useWallet();
  return (
    <div className="flex h-full flex-col bg-tb-bg">
      <StatusBar />
      <TopBar title="Transaction Details" onBack={nav.back} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-2.5 pb-4">
        {w.txs.length === 0 ? (
          <div className="mt-24 text-center text-[13px] text-tb-muted">No transactions yet</div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-tb-surface">
            {w.txs.map((t) => (
              <button key={t.id} onClick={() => nav.push({ name: "txdetail", tx: t })} className="tap flex w-full items-center gap-3 border-b border-tb-line px-3 py-3 text-left last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tb-green-soft text-tb-green-dark"><ArrowUpRight size={16} /></div>
                <div className="flex-1">
                  <div className="text-[13px] text-tb-text">{t.type}</div>
                  <div className="text-[11px] text-tb-muted">{t.to} · {t.time}</div>
                </div>
                <div className="text-[13px] font-semibold text-tb-danger">-{fmt(t.total)} ETB</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountScreen({ nav }: { nav: Nav }) {
  const w = useWallet();
  const item = (I: typeof Settings, l: string, fn: () => void) => (
    <button onClick={fn} className="tap flex h-12 w-full items-center gap-3 border-b border-tb-line px-3 text-left text-[13px] text-tb-text last:border-0">
      <I size={18} className="text-tb-green" /><span className="flex-1">{l}</span><ChevronRight size={16} className="text-tb-muted" />
    </button>
  );
  return (
    <div className="flex h-full flex-col bg-tb-bg">
      <div className="bg-tb-green text-tb-surface"><StatusBar dark /></div>
      <div className="tb-waves flex items-center gap-3 bg-tb-green px-4 pb-6 pt-3 text-tb-surface">
        <Avatar size={44} />
        <div><div className="text-[15px] font-bold">nesredn</div><div className="text-[11px]">+251 929422660</div></div>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto p-2.5">
        <div className="overflow-hidden rounded-lg bg-tb-surface">
          {item(ArrowUpRight, "Transaction History", () => nav.push({ name: "history" }))}
          {item(Settings, "Settings", () => nav.push({ name: "settings" }))}
          {item(ShieldCheck, "Security", () => nav.push({ name: "service", title: "Security" }))}
          {item(Globe, "Language", () => nav.push({ name: "service", title: "Language" }))}
          {item(HelpCircle, "Help & Support", () => nav.push({ name: "service", title: "Help & Support" }))}
          {item(LogOut, "Log out", () => w.set({ loggedIn: false }))}
        </div>
      </div>
      <BottomNav nav={nav} active="account" />
    </div>
  );
}

export function SettingsScreen({ nav }: { nav: Nav }) {
  const w = useWallet();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="relative flex h-full flex-col bg-tb-bg">
      <StatusBar />
      <TopBar title="Settings" onBack={nav.back} />
      <div className="p-2.5">
        <div className="rounded-lg bg-tb-surface p-3 text-[12px] text-tb-muted">
          Demo balance: <b className="text-tb-text">{fmt(w.balance)} ETB</b> · {w.txs.length} transactions
        </div>
        <button onClick={() => setConfirm(true)} className="tap mt-2.5 flex h-12 w-full items-center gap-3 rounded-lg bg-tb-surface px-3 text-[13px] text-tb-danger">
          <RotateCcw size={18} /> Reset Demo Data
        </button>
        {done && <div className="mt-3 text-center text-[12px] text-tb-green-dark">Demo data reset to 10,000.00 ETB</div>}
      </div>
      {confirm && (
        <div className="anim-fade absolute inset-0 z-20 flex items-center justify-center bg-tb-overlay px-8">
          <div className="anim-pop w-full rounded-xl bg-tb-surface p-5">
            <div className="text-[15px] font-semibold text-tb-text">Reset demo data?</div>
            <div className="mt-2 text-[12px] text-tb-muted">Balance returns to 10,000.00 ETB and all demo transactions are cleared.</div>
            <div className="mt-5 flex justify-end gap-5 text-[13px] font-semibold">
              <button className="tap text-tb-muted" onClick={() => setConfirm(false)}>Cancel</button>
              <button className="tap text-tb-danger" onClick={() => { w.reset(); setConfirm(false); setDone(true); }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceScreen({ nav, title }: { nav: Nav; title: string }) {
  return (
    <div className="flex h-full flex-col bg-tb-bg">
      <StatusBar />
      <TopBar title={title} onBack={nav.back} />
      <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tb-green-soft text-tb-green-dark"><Info size={26} /></div>
        <div className="mt-4 text-[15px] font-semibold text-tb-text">{title}</div>
        <div className="mt-2 text-[12px] text-tb-muted">This service is simulated in the demo app. No real transactions are made.</div>
        <button onClick={nav.back} className="tap mt-6 h-10 w-40 rounded-md bg-tb-green text-[13px] font-semibold text-tb-surface">Back</button>
      </div>
    </div>
  );
}

export function TabPlaceholder({ nav, tab, title }: { nav: Nav; tab: string; title: string }) {
  return (
    <div className="flex h-full flex-col bg-tb-bg">
      <div className="bg-tb-green"><StatusBar dark /></div>
      <div className="bg-tb-green px-4 pb-3 pt-1 text-[16px] font-bold text-tb-surface">{title}</div>
      <div className="grid grid-cols-4 gap-2.5 p-3">
        {["Airtime", "Internet", "Bank", "Utility", "Merchant", "Fuel", "School", "Tickets"].map((l) => (
          <button key={l} onClick={() => nav.push({ name: "service", title: l })} className="tap flex h-[72px] flex-col items-center justify-center gap-1 rounded-md bg-tb-surface text-[11px] text-tb-text">
            <div className="h-6 w-6 rounded-full bg-tb-green-soft" />{l}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <BottomNav nav={nav} active={tab} />
    </div>
  );
}

export type { Tx };
