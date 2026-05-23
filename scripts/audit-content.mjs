import fs from "node:fs";
import path from "node:path";

const roots = ["src", "content", "messages", "README.md"];
const allowedSymbols = new Set(["☼", "☾"]);
const emojiPattern = /[\p{Extended_Pictographic}\u{2600}-\u{27BF}]/gu;
const forbiddenFonts = /\b(Inter|Poppins|Roboto|Montserrat)\b/;
const hype =
  /passionate|innovative|cutting-edge|seamless|beautiful|stunning|crafting digital experiences|turning ideas into reality|AI-powered portfolio|full-stack developer passionate|I build scalable solutions|Let's build|Get in touch|Hire me/i;

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target).flatMap((entry) => walk(path.join(target, entry)));
  }

  return /\.(tsx?|jsx?|json|md|css|svg)$/.test(target) ? [target] : [];
}

let failed = false;

for (const file of roots.flatMap(walk)) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    if (forbiddenFonts.test(line)) {
      console.error(`${file}:${index + 1}: forbidden font reference`);
      failed = true;
    }

    if (hype.test(line)) {
      console.error(`${file}:${index + 1}: forbidden generic portfolio phrase`);
      failed = true;
    }
  });

  for (const match of text.matchAll(emojiPattern)) {
    if (!allowedSymbols.has(match[0])) {
      const line = text.slice(0, match.index).split("\n").length;
      console.error(`${file}:${line}: disallowed emoji or symbol ${match[0]}`);
      failed = true;
    }
  }
}

process.exit(failed ? 1 : 0);
