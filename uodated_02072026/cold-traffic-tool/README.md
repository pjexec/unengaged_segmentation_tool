# Cold Traffic Tool

## ⚠️ DEPLOYMENT — READ BEFORE DEPLOYING

**This tool is a SUBFOLDER inside a larger repo.** You MUST use `--path-as-root` to deploy only this folder:

```bash
# From the parent directory (uodated_02072026/):
railway up cold-traffic-tool --path-as-root --service cold-traffic-tool
```

**DO NOT** run `railway up` from the parent directory without `--path-as-root` — it will deploy the main project's files and break this tool.

## Status
**Currently deployed** as part of the main Railway service at `/cold-traffic-tool/` path.

## Deployment Notes (Feb 14, 2026)

### Current State
- Lives inside the main `unengaged_segmentation_tool` project
- Deployed to Railway as part of the same service (project ID: `1c8577f8-7b91-4974-b5a8-daaac5e84e70`)
- Accessible at: `https://<railway-domain>/cold-traffic-tool/`

### TODO: Separate Railway Service Needed
This tool needs its **own Railway service** so it can have a clean custom subdomain (no `/cold-traffic-tool/` in the URL). Railway maps one custom domain per service, so to get something like `tool.expert.email` or similar, this folder needs to be deployed independently.

**To set up as a separate service:**
1. Create a new Railway project/service for this tool
2. The folder already has its own `index.html`, `styles.css`, and `script.js`
3. Will need its own `server.js` and `package.json` (copy and adapt from parent)
4. Point a custom subdomain via DNS to the new Railway service

### Files
- `index.html` — Main page (hero + form + results, all in one)
- `styles.css` — All styling including guided walkthrough, coaching text, footer
- `script.js` — Form logic, guided mode, result generation, email gate
- `assets/` — Images (venn diagram)

### Key Features
- **Guided walkthrough mode** — Questions glow/advance one at a time after "Prove It"
- **Coaching text** — Teal prompts above each question, fade in/out with active state
- **Email gate modal** — Captures name + email before showing results
- **Footer** — Single-line: `Chuck Mullaney © 2026 | Email Deliverability Expert | Expert.Email`
