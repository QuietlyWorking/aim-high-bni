// Build: copy the one-file worker into dist/ (Cloudflare Pages advanced mode serves dist/_worker.js for every request).
import { mkdirSync, copyFileSync } from "node:fs";
mkdirSync("dist", { recursive: true });
copyFileSync("site/_worker.js", "dist/_worker.js");
console.log("built dist/_worker.js");
