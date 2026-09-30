import {
  Bell, Search, Eye, EyeOff, ChevronDown, User, Wallet, HandCoins, Gift, Landmark, ScanLine, MapPin,
  Home as HomeIc, CreditCard, LayoutGrid, MessageCircle, UserRound, ChevronRight, Contact, Users,
  Zap, Car, ParkingCircle, Smartphone, PlusCircle, Store,
} from "lucide-react";
import { useState } from "react";
import { BrandBar, Banner, StatusBar } from "./ui";
import { fmt, useWallet } from "./store";
import type { Nav } from "./WalletApp";

export function BottomNav({ nav, active }: { nav: Nav; active: string }) {
  const items = [
    { k: "home", l: "Home", I: HomeIc },
    { k: "payment", l: "Payment", I: CreditCard },
    { k: "apps", l: "Apps", I: LayoutGrid },
    { k: "engage", l: "Engage", I: MessageCircle },
    { k: "account", l: "Account", I: UserRound },
  ];
  return (
    <div className="relative flex h-[52px] shrink-0 items-stretch bg-tb-green">
      {items.map(({ k, l, I }) => (
        <button key={k} onClick={() => (k === "home" ? nav.root("home") : nav.root(k))} className={`tap relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${active === k ? "font-bold text-tb-surface" : "text-tb-surface/75"}`}>
          {active === k && <span className="absolute -top-1 h-2 w-2 rounded-full bg-tb-green ring-2 ring-tb-surface/0" />}
          <I size={17} />
          {l}
        </button>
      ))}
    </div>
  );
}

function Tile({ label, icon, badge, onClick }: { label: string; icon: React.ReactNode; badge?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="tap relative flex h-[82px] flex-col items-center justify-center gap-1.5 rounded-md bg-tb-surface px-1 text-center shadow-[0_1px_2px_rgb(0_0_0/.06)]">
      {badge && <span className="absolute -top-2 rounded-sm bg-tb-orange px-1 text-[8px] font-bold text-tb-surface">{badge}</span>}
      <div className="flex h-7 items-center text-tb-green">{icon}</div>
      <span className="text-[11px] leading-[13px] text-tb-text">{label}</span>
    </button>
  );
}

export function HomeScreen({ nav }: { nav: Nav }) {
  const w = useWallet();
  const [menu, setMenu] = useState(false);
  const stars = "******";
  const svc = (t: string) => () => nav.push({ name: "service", title: t });
  return (
    <div className="relative flex h-full flex-col bg-tb-bg">
      <div className="bg-tb-surface"><StatusBar /></div>
      <BrandBar />
      <div className="tb-waves relative shrink-0 bg-tb-green pb-5 text-tb-surface">
        <div className="flex items-center gap-2 px-4 pt-2">
          <User size={22} className="rounded-full" />
          <span className="flex-1 text-[13px]">Selam, nesredn</span>
          <Search size={16} />
          <button aria-label="Notifications" onClick={svc("Notifications")} className="tap"><Bell size={16} /></button>
          <span className="flex items-center text-[12px]">Eng<ChevronDown size={12} /></span>
        </div>
        <button onClick={() => w.set({ hidden: !w.hidden })} className="tap mx-auto mt-3 flex items-center gap-1.5 text-[15px] font-semibold">
          Balance (ETB) {w.hidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <div className="mt-1 text-center text-[26px] font-extrabold tracking-wider">{w.hidden ? stars : fmt(w.balance)}</div>
        <div className="mt-2 flex px-3 text-[12px]">
          <div className="flex-1"><div className="flex items-center gap-1">Endekise (ETB) <Eye size={11} /></div><div className="font-bold">{w.hidden ? stars : "0.00"}</div></div>
          <div className="flex-1 pl-4"><div className="flex items-center gap-1">Reward (ETB) <Eye size={11} /></div><div className="font-bold">{w.hidden ? stars : "0.00"}</div></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 rounded-tr-[40px] bg-tb-orange pl-2 text-[8px] font-bold italic leading-3">ONE APP FOR ALL YOUR NEEDS!</div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-24 pt-4">
        <div className="grid grid-cols-4 gap-2.5">
          <Tile label="Send Money" icon={<Wallet size={22} />} onClick={() => setMenu(true)} />
          <Tile label="Cash In/ Out" icon={<HandCoins size={22} />} onClick={svc("Cash In / Out")} />
          <Tile label="Airtime/Buy Package" badge="Up to 35%" icon={<Gift size={22} />} onClick={svc("Airtime / Buy Package")} />
          <Tile label="Zemen GEBEYA" icon={<div className="h-7 w-7 rounded-full bg-tb-banner" />} onClick={svc("Zemen GEBEYA")} />
          <Tile label="Financial Service With Dashen" icon={<Landmark size={20} className="text-tb-blue" />} onClick={svc("Dashen Bank")} />
          <Tile label="Financial Service With CBE" icon={<Landmark size={20} className="text-tb-orange" />} onClick={svc("CBE")} />
          <Tile label="Financial Service with Siinqee" icon={<span className="text-[10px] font-bold text-tb-green-dark">Siinqee</span>} onClick={svc("Siinqee Bank")} />
          <Tile label="Transfer to Bank" icon={<Landmark size={22} />} onClick={svc("Transfer to Bank")} />
        </div>
        <Banner className="mt-3" />
        <button onClick={() => nav.push({ name: "history" })} className="tap mt-3 flex w-full items-center justify-end gap-1 text-[12px] font-semibold text-tb-blue">
          Transaction Details <ChevronRight size={16} />
        </button>
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          <Tile label="Financial Service with Awash" icon={<Landmark size={20} className="text-tb-orange" />} onClick={svc("Awash Bank")} />
          <Tile label="Pay for Merchant" icon={<Store size={22} />} onClick={svc("Pay for Merchant")} />
          <Tile label="teleEV Charging" icon={<Zap size={22} />} onClick={svc("teleEV Charging")} />
          <Tile label="TOLO Payment" icon={<Car size={22} className="text-tb-orange" />} onClick={svc("TOLO Payment")} />
          <Tile label="AA Traffic Penalty Payment" icon={<Car size={22} className="text-tb-blue" />} onClick={svc("AA Traffic Penalty")} />
          <Tile label="AATMA Parking Payment" icon={<ParkingCircle size={22} className="text-tb-blue" />} onClick={svc("AATMA Parking")} />
          <Tile label="tele Device Financing" icon={<Smartphone size={22} />} onClick={svc("tele Device Financing")} />
          <Tile label="More" icon={<PlusCircle size={22} />} onClick={() => nav.root("apps")} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[60px] flex justify-center">
        <button onClick={svc("Scan QR")} className="tap pointer-events-auto flex h-9 w-[250px] items-center justify-center gap-2 rounded-md bg-tb-blue text-[14px] font-semibold text-tb-surface shadow-md">
          <ScanLine size={18} /> Scan QR
        </button>
      </div>
      <button aria-label="Nearby agents" onClick={svc("Nearby Agents")} className="tap absolute bottom-[56px] right-2 flex h-9 w-9 items-center justify-center rounded-full border border-tb-line bg-tb-surface text-tb-green shadow">
        <MapPin size={18} />
      </button>
      <BottomNav nav={nav} active="home" />

      {menu && (
        <div className="anim-fade absolute inset-0 z-20 bg-tb-overlay" onClick={() => setMenu(false)}>
          <div className="anim-pop absolute left-[14px] top-[340px] w-[128px] overflow-hidden rounded-md bg-tb-surface shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setMenu(false); nav.push({ name: "individual" }); }} className="tap flex w-full items-center gap-3 border-b border-tb-line px-3 py-3 text-left text-[12px] text-tb-text">
              <Contact size={20} className="text-tb-green" /> To Individual
            </button>
            <button onClick={() => { setMenu(false); nav.push({ name: "service", title: "Send Money to Group" }); }} className="tap flex w-full items-center gap-3 px-3 py-3 text-left text-[12px] text-tb-text">
              <Users size={20} className="text-tb-green" /> To Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
