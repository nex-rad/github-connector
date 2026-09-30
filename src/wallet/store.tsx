import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// DEMO ONLY — all data is simulated and stored in localStorage. No real money moves.
export const START_BALANCE = 10000;
export const DEMO_PIN = "123456";
export const SERVICE_FEE = 1;
const KEY = "tb-demo-state-v1";

export type Tx = {
  id: string;
  type: string;
  to: string;
  phone: string;
  amount: number;
  serviceFee: number;
  disasterFee: number;
  total: number;
  time: string;
  note?: string | undefined;
};

export type Contact = { name: string; phone: string; kind: "yellow" | "ring" };

export const CONTACTS: Contact[] = [
  { name: "ABAYENESH", phone: "+251944917955", kind: "yellow" },
  { name: "Ibrahi", phone: "+251911000101", kind: "ring" },
  { name: "dawit", phone: "+251911000202", kind: "yellow" },
  { name: "Brook", phone: "+251911000303", kind: "yellow" },
  { name: "Admasu", phone: "+251911000404", kind: "yellow" },
];

export function fees(amount: number) {
  const serviceFee = amount > 0 ? SERVICE_FEE : 0;
  const disasterFee = Math.round((amount + serviceFee) * 0.01 * 100) / 100;
  const total = Math.round((amount + serviceFee + disasterFee) * 100) / 100;
  return { serviceFee, disasterFee, total };
}

export const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function nowStamp() {
  const d = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function txNumber() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let s = "DIT";
  for (let i = 0; i < 7; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

type State = { balance: number; txs: Tx[]; recent: string[]; loggedIn: boolean; hidden: boolean };
const initial: State = { balance: START_BALANCE, txs: [], recent: CONTACTS.map((c) => c.phone), loggedIn: false, hidden: true };

type Ctx = State & {
  addTx: (t: Tx) => void;
  set: (p: Partial<State>) => void;
  reset: () => void;
};
const WalletCtx = createContext<Ctx | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, ready]);
  const addTx = useCallback(
    (t: Tx) => setS((p) => ({ ...p, balance: Math.round((p.balance - t.total) * 100) / 100, txs: [t, ...p.txs] })),
    [],
  );
  const set = useCallback((p: Partial<State>) => setS((o) => ({ ...o, ...p })), []);
  const reset = useCallback(() => setS((o) => ({ ...initial, loggedIn: o.loggedIn })), []);
  return <WalletCtx.Provider value={{ ...s, addTx, set, reset }}>{children}</WalletCtx.Provider>;
}

export function useWallet() {
  const c = useContext(WalletCtx);
  if (!c) throw new Error("useWallet outside provider");
  return c;
}
