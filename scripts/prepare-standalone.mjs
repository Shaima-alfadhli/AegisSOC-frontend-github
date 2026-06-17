import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

if (process.env.GITHUB_PAGES === "true") {
  console.log("Skipping standalone prep (GitHub Pages static export).");
  process.exit(0);
}

const standaloneDir = join(root, ".next/standalone");
const serverFile = join(standaloneDir, "server.js");

if (!existsSync(serverFile)) {
  console.error("Missing .next/standalone/server.js — run `npm run build` first.");
  process.exit(1);
}

cpSync(join(root, "public"), join(standaloneDir, "public"), { recursive: true });

mkdirSync(join(standaloneDir, ".next"), { recursive: true });
cpSync(join(root, ".next/static"), join(standaloneDir, ".next/static"), {
  recursive: true,
});

console.log("Standalone assets copied (public + .next/static).");
