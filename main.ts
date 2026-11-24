// Warning Label for Humans: One Line, Big Laugh — make.fun entry.
//
// The entry is one single-line safety warning label that should come
// printed on every human being: 103 characters, one read, one laugh.
// The laugh lands in the last few words — the human denies the fire,
// then asks if anyone else smells the smoke. It is funny because it
// is true: people minimise obvious problems out loud ("I'm fine")
// while the evidence is burning right in front of everybody, and
// then, a beat too late, they notice what everyone else already saw.
//
// It sounds like a real printed label on purpose: "WARNING:" up
// front, "This human will..." in the flat voice of a product
// warning, one idea only, no filler, no second joke. The form is
// the joke's straight man; the denial is the punchline.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const label =
  "WARNING: This human will insist it is fine while visibly on fire, then ask if anyone else smells smoke.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–160 characters of UTF-8 text, not only
// whitespace, on a single line. Refuse to ship anything outside
// that: a second line would stop being one label, and padding
// past 160 characters would fail the gate outright.
if (label.length < 1 || label.length > 160) {
  throw new Error(`entry label is ${label.length} characters, outside the 1-160 limit`);
}
if (label.trim().length === 0 || /[\r\n]/.test(label)) {
  throw new Error("entry label must be one non-blank line");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, label, "utf8");

// Read it back and verify the file holds exactly the label, byte for
// byte, so a partial or corrupted write can never reach the judge.
if (readFileSync(dst, "utf8") !== label) {
  throw new Error("entry.txt does not hold exactly the entry label");
}
console.log(label);
