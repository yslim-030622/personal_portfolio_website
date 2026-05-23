import {execFileSync} from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import {join} from "node:path";

const roots = [
  "content",
  "messages",
  "src/app/[locale]/not-found.tsx",
  "src/app/not-found.tsx"
];

const seed =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  ".,;:!?()[]{}<>/\\\\-_–—·→'\"@#$%&*+=^~`| \n";

function collect(filePath) {
  if (!existsSync(filePath)) {
    return "";
  }

  const stat = statSync(filePath);
  if (stat.isDirectory()) {
    return readdirSync(filePath)
      .map((entry) => collect(join(filePath, entry)))
      .join("\n");
  }

  return /\.(?:ts|tsx|json|md)$/.test(filePath)
    ? readFileSync(filePath, "utf8")
    : "";
}

const text = Array.from(
  new Set([...seed, ...roots.map((root) => collect(root)).join("\n")])
).join("");

writeFileSync(".omx/logs/font-subset-text.txt", text);

mkdirSync(".omx/cache", {recursive: true});

const notoSource = ".omx/cache/NotoSerifKR-500.ttf";

if (!existsSync(notoSource)) {
  execFileSync(
    "curl",
    [
      "-L",
      "-A",
      "Mozilla/5.0",
      "https://fonts.gstatic.com/s/notoserifkr/v31/3JnoSDn90Gmq2mr3blnHaTZXbOtLJDvui3JOncjUeM52.ttf",
      "-o",
      notoSource
    ],
    {stdio: "inherit"}
  );
}

execFileSync(
  "pyftsubset",
  [
    "src/app/fonts/PretendardVariable.woff2",
    "--text-file=.omx/logs/font-subset-text.txt",
    "--output-file=src/app/fonts/PretendardPortfolio.woff2",
    "--flavor=woff2",
    "--layout-features=*",
    "--desubroutinize"
  ],
  {stdio: "inherit"}
);

execFileSync(
  "pyftsubset",
  [
    notoSource,
    "--text-file=.omx/logs/font-subset-text.txt",
    "--output-file=src/app/fonts/NotoSerifKRPortfolio.woff2",
    "--flavor=woff2",
    "--layout-features=*",
    "--desubroutinize"
  ],
  {stdio: "inherit"}
);
