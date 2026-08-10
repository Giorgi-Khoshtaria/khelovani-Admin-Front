import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(t => localStorage.setItem("adminToken", t), process.env.TOK);
await page.goto("http://localhost:5173/reviews", { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  const btn = document.querySelector(".review-row .review-row__btn");
  if (!btn) return { error: "no button" };
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const atPoint = document.elementFromPoint(cx, cy);
  const stack = document.elementsFromPoint(cx, cy).slice(0, 5).map(e => e.className || e.tagName);

  const row = btn.closest(".review-row");
  const rowRect = row.getBoundingClientRect();
  const cs = getComputedStyle(row);
  const actions = btn.closest(".col-actions");
  const aRect = actions.getBoundingClientRect();
  const list = document.querySelector(".reviews-list");
  const lRect = list.getBoundingClientRect();

  return {
    buttonRect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
    elementAtButtonCenter: atPoint?.className || atPoint?.tagName,
    stackAtPoint: stack,
    rowRect: { x: Math.round(rowRect.left), w: Math.round(rowRect.width), h: Math.round(rowRect.height) },
    rowGridTemplate: cs.gridTemplateColumns,
    rowDisplay: cs.display,
    actionsRect: { x: Math.round(aRect.left), w: Math.round(aRect.width) },
    listRect: { x: Math.round(lRect.left), w: Math.round(lRect.width) },
    buttonOverflowsList: r.right > lRect.right,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
