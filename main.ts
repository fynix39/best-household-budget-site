// HomeLedger — hand-in program (Node 22, standard library only).
// The site is the static files in app/ beside this file: plain HTML, CSS and
// JavaScript a browser opens at app/index.html, with no build step and no
// network request. This program copies app/ and screenshots/ into /output
// and writes /output/dossier.json — the summary the judge reads (the
// screenshots, the first load's files and bytes, and the source outline) —
// with the vendored make.fun library. vendor/makefun-frontend.ts is the
// kit's copy, unchanged: the scorer rebuilds the dossier with its own copy
// and requires the two to match byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots, each at most 256 KiB; app/ at
// most 993 files and directories and 16 MiB in all; dossier.json at most
// 1.5 MiB of text (text_max_bytes shapes the bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
