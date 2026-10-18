// Compila el motor (TypeScript puro) con esbuild y ejecuta el test con node.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const esbuild = join(root, "node_modules", ".bin", "esbuild");

execFileSync(
  esbuild,
  [
    "src/game/engine.ts",
    "--bundle",
    "--platform=node",
    "--format=cjs",
    "--outfile=test/.engine.bundle.cjs",
    "--log-level=error",
  ],
  { cwd: root, stdio: "inherit" },
);
execFileSync("node", ["test/engine.test.mjs"], { cwd: root, stdio: "inherit" });
