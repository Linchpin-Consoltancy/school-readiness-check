import path from "node:path";
import { Font } from "@react-pdf/renderer";

/**
 * The brand typefaces, embedded into the PDF so the report looks identical
 * on every machine that opens it. Both families are licensed under the SIL
 * Open Font License, which permits embedding.
 */
const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

let registered = false;

export function registerReportFonts(): void {
  if (registered) return;

  Font.register({
    family: "Cormorant Garamond",
    fonts: [
      {
        src: path.join(FONT_DIR, "CormorantGaramond-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: path.join(FONT_DIR, "CormorantGaramond-SemiBold.ttf"),
        fontWeight: 600,
      },
    ],
  });

  Font.register({
    family: "Jost",
    fonts: [
      { src: path.join(FONT_DIR, "Jost-Regular.ttf"), fontWeight: 400 },
      { src: path.join(FONT_DIR, "Jost-Medium.ttf"), fontWeight: 500 },
      { src: path.join(FONT_DIR, "Jost-SemiBold.ttf"), fontWeight: 600 },
    ],
  });

  // Hyphenated line breaks read badly in a formal document, so words are kept
  // whole and the ragged right edge is accepted instead.
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
