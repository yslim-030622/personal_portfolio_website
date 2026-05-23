import fs from "node:fs";
import puppeteer from "puppeteer-core";

const baseUrl = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";
const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

fs.mkdirSync(".omx/logs/screenshots", {recursive: true});

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const failures = [];

async function withPage(name, fn) {
  const page = await browser.newPage();
  const messages = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    messages.push(`pageerror: ${error.message}`);
  });

  try {
    await fn(page);
    const serious = messages.filter(
      (message) =>
        !message.includes("Download the React DevTools") &&
        !message.includes("[Fast Refresh]")
    );
    if (serious.length > 0) {
      failures.push(`${name}: console issues\n${serious.join("\n")}`);
    }
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  } finally {
    await page.close();
  }
}

await withPage("desktop-en", async (page) => {
  await page.setViewport({width: 1440, height: 1100, deviceScaleFactor: 1});
  await page.goto(`${baseUrl}/`, {waitUntil: "domcontentloaded"});
  await page.waitForSelector("main");
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector("h1")).opacity === "1"
  );
  await page.screenshot({
    path: ".omx/logs/screenshots/en-desktop.png",
    fullPage: true
  });

  const result = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    theme: document.documentElement.dataset.theme,
    headline: document.querySelector("h1")?.textContent ?? "",
    notesButtons: document.querySelectorAll("[aria-expanded]").length
  }));

  if (result.lang !== "en") throw new Error(`expected en lang, got ${result.lang}`);
  if (result.theme !== "dark") throw new Error(`expected dark theme, got ${result.theme}`);
  if (!result.headline.includes("useful software")) {
    throw new Error("English headline missing expected phrase");
  }
  if (result.notesButtons !== 3) throw new Error("expected three note buttons");
});

await withPage("mobile-en", async (page) => {
  await page.setViewport({width: 320, height: 900, deviceScaleFactor: 2});
  await page.goto(`${baseUrl}/`, {waitUntil: "domcontentloaded"});
  await page.waitForSelector("main");
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector("h1")).opacity === "1"
  );
  await page.screenshot({
    path: ".omx/logs/screenshots/en-mobile.png"
  });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  if (overflow > 1) throw new Error(`mobile horizontal overflow ${overflow}`);
});

await withPage("ko", async (page) => {
  await page.setViewport({width: 390, height: 900, deviceScaleFactor: 2});
  await page.goto(`${baseUrl}/ko`, {waitUntil: "domcontentloaded"});
  await page.waitForSelector("main");
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector("h1")).opacity === "1"
  );
  await page.screenshot({
    path: ".omx/logs/screenshots/ko-mobile.png"
  });

  const result = await page.evaluate(() => {
    const paragraph = document.querySelector("p");
    const style = paragraph ? getComputedStyle(paragraph) : null;
    return {
      lang: document.documentElement.lang,
      headline: document.querySelector("h1")?.textContent ?? "",
      wordBreak: style?.wordBreak,
      overflowWrap: style?.overflowWrap
    };
  });

  if (result.lang !== "ko") throw new Error(`expected ko lang, got ${result.lang}`);
  if (!result.headline.includes("오래 쓰이는 소프트웨어")) {
    throw new Error("Korean headline missing expected phrase");
  }
  if (result.wordBreak !== "keep-all") {
    throw new Error(`expected keep-all word-break, got ${result.wordBreak}`);
  }
  if (result.overflowWrap !== "break-word") {
    throw new Error(`expected break-word overflow-wrap, got ${result.overflowWrap}`);
  }
});

await withPage("theme-and-locale", async (page) => {
  await page.setViewport({width: 1024, height: 900, deviceScaleFactor: 1});
  await page.goto(`${baseUrl}/`, {waitUntil: "domcontentloaded"});
  await page.evaluate(() => localStorage.removeItem("ysl-theme"));
  await page.reload({waitUntil: "domcontentloaded"});
  await page.waitForSelector('button[aria-label="Switch to light mode"]');
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click('button[aria-label="Switch to light mode"]');
  await page.waitForFunction(
    () =>
      localStorage.getItem("ysl-theme") === "light" &&
      document.documentElement.dataset.theme === "light"
  );
  await page.reload({waitUntil: "domcontentloaded"});
  const theme = await page.evaluate(() => ({
    stored: localStorage.getItem("ysl-theme"),
    attr: document.documentElement.dataset.theme
  }));
  if (theme.stored !== "light" || theme.attr !== "light") {
    throw new Error("theme did not persist after reload");
  }

  await page.waitForSelector('a[aria-label="Switch to Korean"]');
  await page.click('a[aria-label="Switch to Korean"]');
  await page.waitForFunction(() => location.pathname === "/ko");
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (lang !== "ko") throw new Error("locale switch did not reach Korean page");
});

await withPage("notes-accordion", async (page) => {
  await page.goto(`${baseUrl}/`, {waitUntil: "domcontentloaded"});
  await page.waitForSelector("[aria-expanded]");
  const buttons = await page.$$("[aria-expanded]");
  await buttons[1].click();
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll("[aria-expanded]")).filter(
        (button) => button.getAttribute("aria-expanded") === "true"
      ).length === 1
  );
});

await withPage("reduced-motion", async (page) => {
  await page.emulateMediaFeatures([
    {name: "prefers-reduced-motion", value: "reduce"}
  ]);
  await page.goto(`${baseUrl}/`, {waitUntil: "domcontentloaded"});
  await page.waitForSelector("main");
  await page.waitForNetworkIdle({idleTime: 500, timeout: 5000}).catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const transformed = await page.evaluate(() =>
    Array.from(document.querySelectorAll("body *")).filter((element) => {
      const transform = getComputedStyle(element).transform;
      return transform && transform !== "none";
    }).length
  );
  if (transformed > 0) {
    throw new Error(`reduced-motion page has ${transformed} transformed elements`);
  }
});

await browser.close();

if (failures.length > 0) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log("Browser verification passed");
