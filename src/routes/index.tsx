import { createFileRoute } from "@tanstack/react-router";
import { WalletApp } from "@/wallet/WalletApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "telebirr Demo Wallet — Home" },
      { name: "description", content: "Educational telebirr-style mobile wallet demo with simulated send money flow." },
      { property: "og:title", content: "telebirr Demo Wallet — Home" },
      { property: "og:description", content: "Educational telebirr-style mobile wallet demo with simulated send money flow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletApp,
});
