import { ChevronRight, Contact2, Download, Loader2, QrCode, ScanLine, Share2, Trash2, Wallet, X, CheckCircle2, Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Avatar, Banner, Keypad, StatusBar, TopBar } from "./ui";
import { CONTACTS, DEMO_PIN, fees, fmt, nowStamp, txNumber, useWallet, type Contact, type Tx } from "./store";
import type { Nav } from "./WalletApp";

export function IndividualScreen({ nav }: { nav: Nav }) {
  const [num, setNum] = useState("");
  const valid = /^9\d{8}$|^7\d{8}$/.test(num);
  const go = (c: Contact) => nav.push({ name: "amount", contact: c });
  return (
    <div className="flex h-full flex-col bg-tb-bg">
      <StatusBar />
      <TopBar title="Send Money to Individual" onBack={nav.back} />
      <div className="no-scrollbar flex-1 overflow-y-auto px-2.5 pb-4">
        <Banner />
        <div className="mt-5 rounded-lg bg-tb-surface p-3">
          <div className="text-[12px] text-tb-text">Please Enter Mobile Number</div>
          <div className="mt-3 flex h-10 items-center gap-3 rounded border-2 border-tb-green px-3">
            <span className="text-[13px] text-tb-text">+251</span>
            <input
              inputMode="numeric"
              value={num}
              autoFocus
              onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 9))}
              className="h-full flex-1 border-l border-tb-line bg-transparent pl-3 text-[14px] text-tb-text outline-none"
            />
            <ScanLine size={16} className="text-tb-green" />
            <Contact2 size={16} className="text-tb-green" />
          </div>
          <button
            disabled={!valid}
            onClick={() => go(CONTACTS.find((c) => c.phone === "+251" + num) ?? { name: "+251" + num, phone: "+251" + num, kind: "yellow" })}
            className={`tap mt-4 h-10 w-full rounded-md text-[14px] font-semibold text-tb-surface ${valid ? "bg-tb-blue" : "bg-tb-blue-soft"}`}
          >
            Next
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between px-0.5 text-[12px] text-tb-text">
          Recent <Trash2 size={14} className="text-tb-muted" />
        </div>
        <div className="mt-2 overflow-hidden rounded-lg bg-tb-surface">
          {CONTACTS.map((c) => (
            <button key={c.phone} onClick={() => go(c)} className="tap flex h-14 w-full items-center gap-3 border-b border-tb-line px-3 text-left last:border-0">
              <Avatar kind={c.kind} size={28} />
              <span className="flex-1 text-[13px] text-tb-text">{c.name}</span>
              <ChevronRight size={16} className="text-tb-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type Stage = "amount" | "fee" | "pin" | "processing";

export function AmountScreen({ nav, contact }: { nav: Nav; contact: Contact }) {
  const w = useWallet();
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("amount");
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const amount = parseFloat(amt) || 0;
  const f = fees(amount);
  const enough = w.balance >= f.total;

  const key = (k: string) => {
    setAmt((a) => {
      if (k === "del") return a.slice(0, -1);
      if (k === "." && a.includes(".")) return a;
      if (a.includes(".") && a.split(".")[1].length >= 2) return a;
      if (a === "0" && k !== ".") return k;
      if (a.replace(".", "").length >= 7) return a;
      return (a === "" && k === "." ? "0" : a) + k;
    });
  };
  const pinKey = (k: string) => {
    setPinErr(false);
    setPin((p) => (k === "del" ? p.slice(0, -1) : p.length < 6 ? p + k : p));
  };
  useEffect(() => {
    if (pin.length !== 6) return;
    if (pin !== DEMO_PIN) {
      const t = setTimeout(() => { setPinErr(true); setPin(""); }, 150);
      return () => clearTimeout(t);
    }
    setStage("processing");
    const t = setTimeout(() => {
      const tx: Tx = { id: txNumber(), type: "Transfer Money", to: contact.name, phone: contact.phone, amount, ...f, time: nowStamp(), note: note || undefined };
      w.addTx(tx);
      nav.replace({ name: "receipt", tx });
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  return (
    <div className="relative flex h-full flex-col bg-tb-bg">
      <StatusBar />
      <TopBar title="Send Money" onBack={nav.back} />
      <div className="flex items-center gap-3 px-3.5 pb-3">
        <Avatar kind="yellow" size={36} />
        <div>
          <div className="text-[14px] text-tb-text">{contact.name}</div>
          <div className="text-[10px] text-tb-muted">{contact.phone.replace("+", "")}</div>
        </div>
      </div>
      <div className="flex-1 rounded-t-xl bg-tb-surface px-3.5 pt-5">
        <div className="text-[11px] text-tb-text">Amount</div>
        <div className="mt-3 flex h-10 items-center border-b border-tb-line">
          <div className="flex h-full flex-1 items-center border-l-2 border-tb-green pl-1 text-[26px] font-semibold text-tb-text">{amt}</div>
          <span className="border-l border-tb-line pl-2 text-[10px] text-tb-muted">(ETB)</span>
        </div>
        {noteOpen ? (
          <input autoFocus value={note} maxLength={60} onChange={(e) => setNote(e.target.value)} placeholder="Add notes (optional)" className="mt-3 w-full border-b border-tb-line pb-1 text-[12px] text-tb-text outline-none" />
        ) : (
          <button onClick={() => setNoteOpen(true)} className="mt-3 text-[11px] text-tb-blue">{note || "Add notes(optional)"}</button>
        )}
      </div>
      <div className="bg-tb-bg">
        <div className="flex justify-center pt-1 text-tb-muted"><ChevronDown size={14} /></div>
        <Keypad onKey={key} okDisabled={amount <= 0} onOk={() => setStage("fee")} />
      </div>

      {stage === "fee" && (
        <div className="anim-fade absolute inset-0 z-20 bg-tb-overlay" onClick={() => setStage("amount")}>
          <div className="anim-up absolute inset-x-0 bottom-0 rounded-t-2xl bg-tb-bg px-2.5 pb-4 pt-4" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" onClick={() => setStage("amount")} className="tap ml-1"><X size={18} className="text-tb-text" /></button>
            <div className="mt-2 text-center text-[12px] text-tb-text">Send Money to {contact.name}</div>
            <div className="mt-1 text-center text-[28px] font-extrabold text-tb-text">{fmt(f.total)}<span className="text-[10px] font-normal">ETB</span></div>
            <div className="mt-4 space-y-4 rounded-lg bg-tb-surface p-3 text-[12px]">
              <Row l="Original Amount" v={`${fmt(amount)}ETB`} />
              <Row l="Service fee" v={`${fmt(f.serviceFee)}ETB`} />
              <Row l="Disaster fee" v={`${fmt(f.disasterFee)}ETB`} />
            </div>
            <div className="mt-2.5 rounded-lg bg-tb-surface p-3">
              <div className="text-[12px] text-tb-muted">Payment Method</div>
              <div className="mt-3 flex items-center gap-3">
                <Wallet size={20} className="text-tb-green" />
                <div className="flex-1">
                  <div className="text-[12px] text-tb-text">Balance</div>
                  <div className={`text-[10px] ${enough ? "text-tb-muted" : "text-tb-danger"}`}>({fmt(w.balance)}ETB {enough ? "Available" : "Not sufficient"})</div>
                </div>
                <CheckCircle2 size={18} className="fill-tb-green text-tb-surface" />
              </div>
            </div>
            <button disabled={!enough} onClick={() => { setPin(""); setStage("pin"); }} className={`tap mx-4 mt-5 h-10 w-[calc(100%-2rem)] rounded-md text-[14px] font-semibold text-tb-surface ${enough ? "bg-tb-green" : "bg-tb-green-soft"}`}>
              Send
            </button>
          </div>
        </div>
      )}

      {stage === "pin" && (
        <div className="anim-fade absolute inset-0 z-30 flex flex-col bg-tb-overlay">
          <div className="flex flex-1 items-center justify-center px-5">
            <div className={`anim-pop w-full rounded-lg bg-tb-surface p-4 ${pinErr ? "anim-shake" : ""}`}>
              <button aria-label="Close" onClick={() => setStage("fee")} className="tap"><X size={18} className="text-tb-muted" /></button>
              <div className="text-center text-[14px] text-tb-text">Enter PIN</div>
              <div className="mt-1 text-center text-[20px] font-bold text-tb-text">{fmt(f.total)} <span className="text-[10px] font-normal">ETB</span></div>
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`flex h-9 w-9 items-center justify-center rounded ${pinErr ? "bg-tb-danger/15" : "bg-tb-line"}`}>
                    {i < pin.length && <div className="h-2.5 w-2.5 rounded-full bg-tb-text" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 h-4 text-center text-[11px] text-tb-danger">{pinErr ? "Incorrect PIN. Please try again." : ""}</div>
              <div className="text-center text-[9px] text-tb-muted">Demo PIN: 123456</div>
            </div>
          </div>
          <div className="anim-up grid grid-cols-3 bg-tb-surface/95">
            {["1","2","3","4","5","6","7","8","9"].map((k) => (
              <button key={k} onClick={() => pinKey(k)} className="tap h-12 border border-tb-line/60 text-[20px] text-tb-text">{k}</button>
            ))}
            <div className="border border-tb-line/60" />
            <button onClick={() => pinKey("0")} className="tap h-12 border border-tb-line/60 text-[20px] text-tb-text">0</button>
            <button aria-label="Delete" onClick={() => pinKey("del")} className="tap flex h-12 items-center justify-center border border-tb-line/60 text-tb-text"><X size={18} /></button>
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="anim-fade absolute inset-0 z-40 flex items-center justify-center bg-tb-overlay">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-tb-surface px-10 py-6">
            <Loader2 size={32} className="animate-spin text-tb-green" />
            <div className="text-[13px] text-tb-text">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between"><span className="text-tb-muted">{l}</span><span className="text-tb-text">{v}</span></div>;
}

export function ReceiptScreen({ nav, tx, fromHistory }: { nav: Nav; tx: Tx; fromHistory?: boolean }) {
  const [qr, setQr] = useState(false);
  const [toast, setToast] = useState("");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1600); };
  return (
    <div className="relative flex h-full flex-col bg-tb-surface">
      <StatusBar />
      <div className="flex items-center justify-between px-3 pt-3 text-[11px] text-tb-green">
        <button onClick={() => flash("Receipt saved (demo)")} className="tap flex items-center gap-1"><Download size={13} /> Download</button>
        <button onClick={() => flash("Share sheet (demo)")} className="tap flex items-center gap-1"><Share2 size={13} /> Share</button>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-6">
        <div className="mt-2 flex flex-col items-center">
          <div className="anim-pop flex h-11 w-11 items-center justify-center rounded-full bg-tb-green"><Check size={26} strokeWidth={3} className="text-tb-surface" /></div>
          <div className="mt-2 text-[11px] text-tb-green">Successful</div>
        </div>
        <div className="mt-16 text-center text-[26px] font-semibold text-tb-text">-{fmt(tx.total)} <span className="text-[9px] font-normal">(ETB)</span></div>
        <div className="mt-10 space-y-4 border-t border-tb-line pt-3 text-[10px]">
          <Row l="Transaction Time:" v={tx.time} />
          <Row l="Transaction Type:" v={tx.type} />
          <Row l="Transaction To:" v={tx.to} />
          <Row l="Transaction Number:" v={tx.id} />
        </div>
        <button onClick={() => setQr(true)} className="tap ml-auto mt-3 flex items-center gap-1 text-[11px] text-tb-green"><QrCode size={16} /> QR Code</button>
        <Banner className="-mx-4 mt-3" />
        <div className="mt-2 flex justify-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full border border-tb-green" /><span className="h-1.5 w-1.5 rounded-full bg-tb-green" /><span className="h-1.5 w-1.5 rounded-full border border-tb-green" />
        </div>
      </div>
      <div className="flex justify-center pb-6 pt-3">
        <button onClick={() => (fromHistory ? nav.back() : nav.root("home"))} className="tap h-9 w-[140px] rounded-md bg-tb-green text-[14px] font-semibold text-tb-surface shadow">Finished</button>
      </div>
      {qr && (
        <div className="anim-fade absolute inset-0 z-20 flex items-center justify-center bg-tb-overlay" onClick={() => setQr(false)}>
          <div className="anim-pop rounded-xl bg-tb-surface p-5 text-center">
            <QRCodeSVG value={`DEMO-TX:${tx.id}:${tx.total}`} size={180} fgColor="currentColor" className="text-tb-text" />
            <div className="mt-2 text-[11px] text-tb-muted">{tx.id} · demo only</div>
          </div>
        </div>
      )}
      {toast && <div className="anim-fade absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-tb-text/85 px-4 py-2 text-[12px] text-tb-surface">{toast}</div>}
    </div>
  );
}
