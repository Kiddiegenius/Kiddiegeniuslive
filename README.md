# Kiddie Genius World

Kiddie Genius World is a static, browser-based learning adventure prototype featuring Gray, Connor, and Maddy. The current free adventure contains four demonstration missions: early addition, phonics, a basic science observation, and shape recognition.

## Run locally

No framework or third-party package is required. Use Node.js 18 or newer for the included checks.

```bash
npm test
python -m http.server 4173
```

Then open `http://localhost:4173`.

You can also serve the repository root with any static hosting provider. The site entry point is `index.html`.

## Current functionality

- Four interactive demo missions with answer feedback and reward screens.
- Completed missions and Star Seeds saved in the current browser using `localStorage`.
- Repeated visits to completed missions do not award extra Star Seeds.
- The parent progress card is calculated from completed missions on the current device.
- Responsive visual layout, keyboard skip link, and visible keyboard focus styles.

## Important prototype limitations

This is still a **front-end prototype**, not a production learning platform.

- Progress is stored only in the current browser profile. It is not synced between devices and is not protected as a parent account.
- There is no authentication, child profile service, API, database, or server-side parent dashboard.
- The premium checkout control is intentionally disabled. No payment is collected. A production integration needs a server-created Stripe Checkout Session and a trusted server-side subscription/webhook flow. Never put a Stripe secret key in browser code.
- The curriculum shown here is a small demonstration, not a complete Florida-aligned Pre-K–5 curriculum.
- Before collecting information from children or launching publicly, implement an appropriate privacy and parental-consent process, data minimization, secure authentication, and a review of applicable child-privacy requirements.

## Recommended production sequence

1. Confirm grade bands and Florida standards for every lesson.
2. Move profiles and progress to a secure backend with parent authentication and role separation.
3. Add parent consent, privacy controls, retention/deletion workflows, and security testing before collecting child data.
4. Implement Stripe Checkout server-side, webhooks, subscription entitlement checks, and billing portal support.
5. Add automated browser-level tests, deployment previews, monitoring, and a documented release process.

## Project structure

```text
index.html
scripts/
  app.js
  smoke-test.mjs
styles/
  main.css
package.json
README.md
```
