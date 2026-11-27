// Captures the scenes for the AI Academy product tour from the running app.
// Usage: node capture.mjs <baseUrl> <outDir> <logoPath>
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3100", out = "frames", logo] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const logoData = logo ? "data:image/png;base64," + fs.readFileSync(logo).toString("base64") : "";

const users = {
  student: { name: "Nadia Karim", email: "nadia.k@example.com", role: "student", plan: "professional", org: "Karim Traders" },
  admin: { name: "Academy Admin", email: "admin@example.com", role: "admin", plan: "firm", org: "Tradevics AI" },
};

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5, reducedMotion: "reduce" });
const page = await ctx.newPage();

async function state(user, lang = "en") {
  await page.goto(base + "/login");
  await page.evaluate(([u, l]) => localStorage.setItem("ai-academy-demo-v1", JSON.stringify({ user: u, lang: l })), [user, lang]);
}
async function go(url, wait = 1500) {
  await page.goto(base + url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(wait);
}
async function shot(name) {
  await page.screenshot({ path: path.join(out, name + ".png") });
  console.log("captured", name);
}

function card(title, sub, foot) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    html,body{margin:0;height:100%;background:#0f1433;color:#fff;font-family:Inter,sans-serif}
    .wrap{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:22px}
    img{width:120px;height:120px}
    h1{font-size:64px;letter-spacing:-0.03em;margin:0;font-weight:700}
    p{font-size:26px;margin:0;color:rgba(255,255,255,.72);max-width:880px;line-height:1.4}
    small{font-size:18px;color:rgba(255,255,255,.5)}
    .d{position:absolute;width:26px;height:26px;border-radius:6px;transform:rotate(45deg)}
  </style></head><body>
  <div class="d" style="background:#35e0f0;left:160px;top:140px"></div>
  <div class="d" style="background:#4646e8;right:200px;bottom:150px;width:40px;height:40px"></div>
  <div class="d" style="background:#d84bf5;right:260px;top:120px;width:16px;height:16px"></div>
  <div class="wrap">${logoData ? `<img src="${logoData}">` : ""}<h1>${title}</h1><p>${sub}</p>${foot ? `<small>${foot}</small>` : ""}</div>
  </body></html>`;
}

// 1 title
await page.setContent(card("AI Academy", "Customs and trade training, rehearsed with AI", "A Tradevics AI company"), { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("01-title");

await state(users.student);
// 2 landing
await go("/", 1800);
await shot("02-landing");
// 3 catalog
await go("/courses");
await shot("03-courses");
// 4 lesson player
await go("/app/learn/hs-classification", 1800);
await shot("04-lesson");
// 5-6 lab
await go("/app/lab/laptops-ctg", 1800);
await shot("05-lab-question");
await page.locator('button:has-text("under GIR 2(a)")').click();
await page.waitForTimeout(2400);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await shot("06-lab-scored");
// 7 case study exam
await go("/app/exams/case-ceramics");
await page.locator('button:has-text("Begin")').click();
await page.waitForTimeout(600);
await page.locator('button[role="radio"]').nth(1).click();
await page.waitForTimeout(500);
await shot("07-exam");
// 8 dashboard
await go("/app", 1800);
await page.mouse.wheel(0, 420);
await page.waitForTimeout(700);
await shot("08-dashboard");
// 9 live
await go("/app/live/budget-2026", 9000);
await shot("09-live");
// 10 community
await go("/app/community");
await shot("10-community");
// 11 mentor
await go("/app/mentor");
await shot("11-mentor");
// 12 certificate verify
await go("/verify");
await page.fill('input[placeholder="AIA-2026-04187"]', "AIA-2026-04187");
await page.locator('button:has-text("Check certificate")').click();
await page.waitForTimeout(800);
await shot("12-verify");
// 13 admin
await state(users.admin);
await go("/admin/ai");
await shot("13-admin");
// 14 bangla
await state(users.student, "bn");
await go("/", 1800);
await shot("14-bangla");
// 15 end card
await page.setContent(card("Start learning", "Courses, practical lab, exams, mentors and live classes in one subscription", "AI Academy by Tradevics AI"), { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await shot("15-end");

await browser.close();
