import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WalletProvider, useWallet, type Contact, type Tx } from "./store";
import { HomeScreen } from "./screens-home";
import { AmountScreen, IndividualScreen, ReceiptScreen } from "./screens-send";
import { AccountScreen, HistoryScreen, LoginScreen, ServiceScreen, SettingsScreen, TabPlaceholder } from "./screens-misc";

export type Screen =
  | { name: "home" | "payment" | "apps" | "engage" | "account" | "individual" | "history" | "settings" }
  | { name: "amount"; contact: Contact }
  | { name: "receipt"; tx: Tx }
  | { name: "txdetail"; tx: Tx }
  | { name: "service"; title: string };

export type Nav = {
  push: (s: Screen) => void;
  replace: (s: Screen) => void;
  back: () => void;
  root: (name: string) => void;
};

function Router() {
  const w = useWallet();
  const [stack, setStack] = useState<Screen[]>([{ name: "home" }]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  // Android hardware back → pop stack
  useEffect(() => {
    const onPop = () => {
      if (stackRef.current.length > 1) setStack((s) => s.slice(0, -1));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const nav = useMemo<Nav>(
    () => ({
      push: (s) => { history.pushState(null, ""); setStack((st) => [...st, s]); },
      replace: (s) => setStack((st) => [...st.slice(0, -1), s]),
      back: () => { if (stackRef.current.length > 1) history.back(); },
      root: (name) => setStack([{ name } as Screen]),
    }),
    [],
  );
  const cur = stack[stack.length - 1] as Screen;
  const render = useCallback(() => {
    switch (cur.name) {
      case "home": return <HomeScreen nav={nav} />;
      case "individual": return <IndividualScreen nav={nav} />;
      case "amount": return <AmountScreen nav={nav} contact={cur.contact} />;
      case "receipt": return <ReceiptScreen nav={nav} tx={cur.tx} />;
      case "txdetail": return <ReceiptScreen nav={nav} tx={cur.tx} fromHistory />;
      case "history": return <HistoryScreen nav={nav} />;
      case "account": return <AccountScreen nav={nav} />;
      case "settings": return <SettingsScreen nav={nav} />;
      case "service": return <ServiceScreen nav={nav} title={cur.title} />;
      case "payment": return <TabPlaceholder nav={nav} tab="payment" title="Payment" />;
      case "apps": return <TabPlaceholder nav={nav} tab="apps" title="Apps" />;
      case "engage": return <TabPlaceholder nav={nav} tab="engage" title="Engage" />;
    }
  }, [cur, nav]);

  if (!w.loggedIn) return <LoginScreen />;
  return <div key={stack.length + cur.name} className="anim-in h-full">{render()}</div>;
}

export function WalletApp() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-tb-frame font-app sm:py-6">
      <div className="relative h-[100dvh] w-full overflow-hidden bg-tb-surface sm:h-[844px] sm:w-[390px] sm:rounded-[36px] sm:ring-[10px] sm:ring-tb-text">
        <WalletProvider>
          <Router />
        </WalletProvider>
      </div>
    </div>
  );
}
