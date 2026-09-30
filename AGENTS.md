<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Wallet app is one route (`/`) with an in-memory screen stack in `src/wallet/WalletApp.tsx` — feels native, overlays keep the previous screen visible.
- All demo state lives in `src/wallet/store.tsx` via React context + localStorage — no backend, no real money.
- Fees: service fee 1.00 ETB, disaster fee = 1% of (amount + service fee), rounded to cents — matches reference screenshots (12 → 13.13).
- Colors come from `--tb-*` tokens in `src/styles.css` — keep telebirr green/blue consistent.
