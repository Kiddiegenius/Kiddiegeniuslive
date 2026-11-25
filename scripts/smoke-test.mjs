import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const htmlPath = new URL("../index.html", import.meta.url);
const scriptPath = new URL("./app.js", import.meta.url);
const cssPath = new URL("../styles/main.css", import.meta.url);

assert.ok(existsSync(htmlPath), "index.html must exist");
assert.ok(existsSync(scriptPath), "scripts/app.js must exist");
assert.ok(existsSync(cssPath), "styles/main.css must exist");

const html = readFileSync(htmlPath, "utf8");
const app = readFileSync(scriptPath, "utf8");
const css = readFileSync(cssPath, "utf8");

for (const id of [
  "questProgress", "questFill", "questCount", "stars",
  "missionLabel", "skillPill", "missionTitle", "missionPrompt",
  "answers", "hint", "feedback", "stepText", "reward",
  "rewardText", "rewardStars", "rewardProgress", "nextBtn",
  "startBtn", "checkoutBtn"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `HTML must include #${id}`);
}

assert.match(html, /href=["']styles\/main\.css["']/, "HTML must load the main stylesheet");
assert.match(html, /src=["']scripts\/app\.js["']/, "HTML must load the application script");
assert.match(html, /id=["']checkoutBtn["'][^>]*disabled/, "Checkout must remain disabled until real payment is configured");
assert.match(html, /local demo, not a synced or secure parent account/i, "Parent report must disclose local-only demo status");
assert.doesNotMatch(html, /87%|82%|72%|58%/, "Dashboard must not ship fabricated progress percentages");

assert.match(app, /localStorage\.getItem\(STORAGE_KEY\)/, "Progress must be restored from local storage");
assert.match(app, /localStorage\.setItem\(STORAGE_KEY/, "Progress must be saved to local storage");
assert.match(app, /completed\.has\(current\)/, "Completed missions must not award repeat rewards");
assert.match(app, /aria-valuenow/, "Mission progress must update its accessible value");
assert.match(css, /\.skip-link:focus/, "Keyboard users must have a visible skip link");
assert.match(css, /:focus-visible/, "Keyboard focus must be visible");

console.log("Kiddie Genius World smoke tests passed.");
