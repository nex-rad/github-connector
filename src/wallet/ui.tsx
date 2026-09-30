import { ArrowLeft, BatteryFull, Delete, Signal, Wifi } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ethioLogo from "@/assets/ethio-ref.png.asset.json";
import telebirrLogo from "@/assets/telebirr-ref.png.asset.json";
import zemenBanner from "@/assets/zemen-success-banner.jpg.asset.json";

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => {
      const d = new Date();
      setT(`${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    f();
    const i = setInterval(f, 10000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className={`flex h-6 shrink-0 items-center justify-between px-5 text-[12px] font-semibold ${dark ? "text-tb-surface" : "text-tb-text"}`}>
      <span>{t}</span>
      <span className="flex items-center gap-1">
        <Wifi size={12} /> <Signal size={12} /> <BatteryFull size={14} />
      </span>
    </div>
  );
}

export function BrandBar() {
  return (
    <div className="flex h-[42px] shrink-0 items-center justify-between bg-tb-surface px-3">
      <img src={ethioLogo.url} alt="ethio telecom" className="h-[28px] w-auto object-contain" />
      <img src={telebirrLogo.url} alt="telebirr" className="h-[26px] w-auto object-contain" />
    </div>
  );
}

export function TopBar({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-4 px-4">
      <button aria-label="Back" onClick={onBack} className="tap -ml-1 p-1 text-tb-text">
        <ArrowLeft size={20} />
      </button>
      <h1 className="flex-1 text-[15px] font-semibold text-tb-text">{title}</h1>
      {right}
    </div>
  );
}

export function Banner({ className = "" }: { className?: string }) {
  return (
    <img src={zemenBanner.url} alt="Zemen Gebeya — Where Ethiopia Shops Digitally" className={`block aspect-[560/165] w-full rounded-[8px] object-cover ${className}`} />
  );
}

export function Keypad({ onKey, onOk, okDisabled, withDot = true }: { onKey: (k: string) => void; onOk?: () => void; okDisabled?: boolean; withDot?: boolean }) {
  const K = ({ k, children, cls = "" }: { k: string; children?: ReactNode; cls?: string }) => (
    <button onClick={() => onKey(k)} className={`tap flex h-10 items-center justify-center rounded bg-tb-surface text-[18px] text-tb-text ${cls}`}>
      {children ?? k}
    </button>
  );
  return (
    <div className="grid grid-cols-4 gap-1.5 bg-tb-bg p-1.5 pb-3">
      <K k="1" /><K k="2" /><K k="3" />
      <K k="del"><Delete size={18} /></K>
      <K k="4" /><K k="5" /><K k="6" />
      <button
        disabled={okDisabled}
        onClick={onOk}
        className={`tap row-span-3 rounded text-[16px] font-semibold ${okDisabled ? "bg-tb-green-soft text-tb-surface" : "bg-tb-green text-tb-surface"}`}
      >
        OK
      </button>
      <K k="7" /><K k="8" /><K k="9" />
      <K k="0" cls={withDot ? "col-span-2" : "col-span-3"} />
      {withDot && <K k="." />}
    </div>
  );
}

export function Avatar({ kind = "yellow", size = 32 }: { kind?: "yellow" | "ring"; size?: number }) {
  if (kind === "ring") return <div style={{ width: size, height: size }} className="rounded-full border-[3px] border-tb-blue" />;
  return (
    <div style={{ width: size, height: size }} className="flex items-end justify-center overflow-hidden rounded bg-tb-yellow">
      <div className="mb-[-30%] flex flex-col items-center">
        <div style={{ width: size * 0.36, height: size * 0.36 }} className="rounded-full bg-tb-surface" />
        <div style={{ width: size * 0.7, height: size * 0.4 }} className="mt-0.5 rounded-t-full bg-tb-surface" />
      </div>
    </div>
  );
}
