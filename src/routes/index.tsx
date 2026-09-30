import { createFileRoute } from "@tanstack/react-router";
import { WalletApp } from "@/wallet/WalletApp";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Telebirr Wallet Demo" },
    { name: "description", content: "Explore a simulated Telebirr mobile wallet, send money, and review transaction receipts." },
    { property: "og:title", content: "Telebirr Wallet Demo" },
    { property: "og:description", content: "Explore a simulated Telebirr mobile wallet and its transaction flows." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <WalletApp />;
}
