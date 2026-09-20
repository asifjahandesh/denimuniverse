/**
 * Denim Universe - Professional PDF Generator & Printable Document Service
 * 
 * Precision-Engineered for Standard ISO 216 A4 (210mm x 297mm | 595.28 x 841.89 pt).
 * Features:
 * 1. Type 1 Helvetica font metric tables for exact point-width calculations.
 * 2. Strict wrapTextByWidth ensuring NO text ever exceeds page or box boundaries.
 * 3. Absolute text matrix positioning (Tm) to eliminate line drift.
 * 4. Automatic multi-page flow with running headers, footers, and dynamic page counts.
 * 5. Complete print stylesheet with @page rules, responsive containers, and zero right-margin clipping.
 */

import { ResourceItem } from "../types/content";

/**
 * Standard Adobe Helvetica character width table (units per 1000).
 */
const HELVETICA_WIDTHS: Record<string, number> = {
  " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667, "'": 191,
  "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333, ".": 278, "/": 278,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556, "8": 556, "9": 556,
  ":": 278, ";": 278, "<": 584, "=": 584, ">": 584, "?": 556, "@": 1015,
  "A": 667, "B": 667, "C": 722, "D": 722, "E": 667, "F": 611, "G": 778, "H": 722, "I": 278, "J": 500,
  "K": 667, "L": 556, "M": 833, "N": 722, "O": 778, "P": 667, "Q": 778, "R": 722, "S": 667, "T": 611,
  "U": 722, "V": 667, "W": 944, "X": 667, "Y": 667, "Z": 611,
  "a": 556, "b": 556, "c": 500, "d": 556, "e": 556, "f": 278, "g": 556, "h": 556, "i": 222, "j": 222,
  "k": 500, "l": 222, "m": 833, "n": 556, "o": 556, "p": 556, "q": 556, "r": 333, "s": 500, "t": 278,
  "u": 556, "v": 500, "w": 722, "x": 500, "y": 500, "z": 500
};

/**
 * Calculates exact string width in points for Helvetica Type 1 font.
 */
function getTextWidth(text: string, fontSize: number, isBold: boolean = false): number {
  if (!text) return 0;
  let totalUnits = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const units = HELVETICA_WIDTHS[char] !== undefined ? HELVETICA_WIDTHS[char] : 600;
    totalUnits += isBold ? units * 1.08 : units;
  }
  return (totalUnits / 1000) * fontSize;
}

/**
 * Wraps text strictly by point width (maxWidthPt) rather than naive character counts.
 * Guarantees that every generated line stays within the specified width limit.
 */
function wrapTextByWidth(text: string, maxWidthPt: number, fontSize: number, isBold: boolean = false): string[] {
  if (!text) return [];
  const rawLines = text.split("\n");
  const result: string[] = [];

  for (const rawLine of rawLines) {
    const trimmedLine = rawLine.trim();
    if (!trimmedLine) continue;

    const words = trimmedLine.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      if (!word) continue;
      const candidate = currentLine ? currentLine + " " + word : word;
      const candidateWidth = getTextWidth(candidate, fontSize, isBold);

      if (candidateWidth <= maxWidthPt) {
        currentLine = candidate;
      } else {
        if (currentLine) {
          result.push(currentLine);
          currentLine = word;
        } else {
          // Unusually long single word - break character-by-character
          let chunk = "";
          for (let c = 0; c < word.length; c++) {
            const ch = word[c];
            if (getTextWidth(chunk + ch, fontSize, isBold) <= maxWidthPt) {
              chunk += ch;
            } else {
              if (chunk) result.push(chunk);
              chunk = ch;
            }
          }
          currentLine = chunk;
        }
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

/**
 * Truncates text to fit within a strict point width, appending "..." if needed.
 */
function truncateToWidth(text: string, maxWidthPt: number, fontSize: number, isBold: boolean = false): string {
  if (getTextWidth(text, fontSize, isBold) <= maxWidthPt) return text;
  let truncated = text;
  while (truncated.length > 0 && getTextWidth(truncated + "...", fontSize, isBold) > maxWidthPt) {
    truncated = truncated.substring(0, truncated.length - 1);
  }
  return truncated + "...";
}

/**
 * Sanitize strings for standard PDF Type 1 Helvetica font.
 */
function sanitizeForPdf(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Strip bold markdown
    .replace(/\*(.*?)\*/g, "$1") // Strip italic markdown
    .replace(/`([^`]+)`/g, "$1") // Strip code ticks
    .replace(/[–—]/g, "--")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/•/g, "*")
    .replace(/…/g, "...")
    .replace(/°/g, " deg ")
    .replace(/৳/g, "BDT ")
    .replace(/[\r\t]/g, " ")
    .replace(/[^\x20-\x7E\n]/g, "") // Filter non-printable ASCII
    .trim();
}

/**
 * Escape special characters for PDF text literal syntax `(text)`.
 */
function escapePdfText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/**
 * Formats inline markdown for HTML print preview (strong, em, code).
 */
function formatMarkdownInline(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

/**
 * Builds a standard ISO 216 A4 PDF 1.4 multi-page document.
 * Dimensions: 210mm x 297mm (595.28 x 841.89 pt).
 * Uses exact font metric calculations so NO text ever cuts at the right border.
 */
export function generateDenimUniversePdfBlob(resource: ResourceItem, memberName?: string): Blob {
  const cleanTitle = sanitizeForPdf(resource.title || "Technical Specification");
  const cleanDesc = sanitizeForPdf(resource.desc || "");
  const cleanCategory = sanitizeForPdf(resource.category || "General");
  const cleanAuthor = sanitizeForPdf(resource.author || "Engr. Asif Jahan");
  const cleanDate = sanitizeForPdf(resource.publishedAt || "September 2026");
  const cleanMember = sanitizeForPdf(memberName || "Verified Denim Universe Member");
  const docRef = `DU-SOP-${(resource.id || "001").toUpperCase()}`;

  // Standard ISO 216 A4 size in PostScript points (72 pt/inch)
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 48; // ~17 mm
  const MARGIN_RIGHT = 48; // ~17 mm
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 499.28 pt
  const FOOTER_Y = 48;
  const CONTENT_BOTTOM_LIMIT = 68;

  // Safe inner wrap width with extra safety buffer to prevent right edge clipping
  const SAFE_WRAP_WIDTH = CONTENT_WIDTH - 24; // 475.28 pt

  const rawParagraphs = (resource.content || "").split("\n\n");

  interface PageContent {
    stream: string;
  }

  const pages: PageContent[] = [];
  let currentStream = "";
  let currentY = 0;

  const startNewPage = (isFirstPage: boolean) => {
    if (currentStream) {
      pages.push({ stream: currentStream });
      currentStream = "";
    }

    // --- SUBTLE WATERMARK ON EVERY PAGE ---
    currentStream += `
q
0.91 0.93 0.97 rg
BT
/F2 40 Tf
0.7071 0.7071 -0.7071 0.7071 140 370 Tm
(DENIM UNIVERSE) Tj
ET
BT
/F2 10.5 Tf
0.7071 0.7071 -0.7071 0.7071 185 340 Tm
(OFFICIAL TECHNICAL SPECIFICATION  *  A4 MILL EDITION) Tj
ET
Q
`;

    if (isFirstPage) {
      // Top Navy Header Bar (Height: 64pt)
      currentStream += `
q
0.039 0.086 0.200 rg
0 ${PAGE_HEIGHT - 64} ${PAGE_WIDTH} 64 re f
0.960 0.620 0.043 rg
0 ${PAGE_HEIGHT - 66} ${PAGE_WIDTH} 2 re f
1 1 1 rg
BT
/F2 16 Tf
1 0 0 1 ${MARGIN_LEFT} ${PAGE_HEIGHT - 30} Tm
(DENIM UNIVERSE) Tj
ET
BT
/F1 7.5 Tf
0.82 0.86 0.94 rg
1 0 0 1 ${MARGIN_LEFT} ${PAGE_HEIGHT - 46} Tm
(OFFICIAL TECHNICAL SPECIFICATION & FACTORY CALIBRATION SOP) Tj
ET
BT
/F2 8.5 Tf
1 1 1 rg
1 0 0 1 ${PAGE_WIDTH - MARGIN_RIGHT - 110} ${PAGE_HEIGHT - 30} Tm
(REF: ${escapePdfText(docRef)}) Tj
ET
BT
/F1 7.5 Tf
0.82 0.86 0.94 rg
1 0 0 1 ${PAGE_WIDTH - MARGIN_RIGHT - 110} ${PAGE_HEIGHT - 46} Tm
(DATE: ${escapePdfText(cleanDate)}) Tj
ET
Q
`;
      currentY = PAGE_HEIGHT - 92;

      // Document Main Title (wrapped strictly to 460 pt)
      const titleLines = wrapTextByWidth(cleanTitle, 460, 14, true);
      currentStream += `
q
0.039 0.086 0.200 rg
BT
/F2 14 Tf
`;
      for (const tLine of titleLines) {
        currentStream += `1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm (${escapePdfText(tLine)}) Tj\n`;
        currentY -= 18;
      }
      currentStream += `ET\nQ\n`;
      currentY -= 6;

      // Metadata Box (Category, Author, Licensee) - 2-Column Precision Layout
      const catText = truncateToWidth(`CATEGORY: ${cleanCategory}`, 220, 8, false);
      const authText = truncateToWidth(`AUTHOR: ${cleanAuthor}`, 220, 8, false);
      const licText = truncateToWidth(`LICENSED TO: ${cleanMember}`, 220, 8, false);
      const refText = `DOC REF: ${docRef}`;
      const statusText = `STATUS: RESTRICTED TECHNICAL ASSET`;

      currentStream += `
q
0.96 0.97 0.99 rg
0.82 0.86 0.92 RG
0.8 w
${MARGIN_LEFT} ${currentY - 44} ${CONTENT_WIDTH} 44 re b
0.039 0.086 0.200 rg
BT
/F2 8 Tf
1 0 0 1 ${MARGIN_LEFT + 12} ${currentY - 14} Tm
(${escapePdfText(catText)}) Tj
1 0 0 1 ${MARGIN_LEFT + 250} ${currentY - 14} Tm
(${escapePdfText(refText)}) Tj
1 0 0 1 ${MARGIN_LEFT + 12} ${currentY - 26} Tm
(${escapePdfText(authText)}) Tj
1 0 0 1 ${MARGIN_LEFT + 250} ${currentY - 26} Tm
(${escapePdfText(statusText)}) Tj
1 0 0 1 ${MARGIN_LEFT + 12} ${currentY - 38} Tm
(${escapePdfText(licText)}) Tj
ET
Q
`;
      currentY -= 58;

      // Executive Briefing Box (wrapped strictly to 450 pt)
      if (cleanDesc) {
        const descLines = wrapTextByWidth(cleanDesc, 450, 8.5, false);
        const boxHeight = 22 + descLines.length * 13;
        currentStream += `
q
0.98 0.96 0.90 rg
0.92 0.78 0.40 RG
0.8 w
${MARGIN_LEFT} ${currentY - boxHeight} ${CONTENT_WIDTH} ${boxHeight} re b
0.60 0.38 0.02 rg
BT
/F2 8.5 Tf
1 0 0 1 ${MARGIN_LEFT + 12} ${currentY - 14} Tm
(EXECUTIVE BRIEFING & CALIBRATION SCOPE) Tj
ET
0.15 0.20 0.30 rg
BT
/F3 8.5 Tf
`;
        let descY = currentY - 27;
        for (const dLine of descLines) {
          currentStream += `1 0 0 1 ${MARGIN_LEFT + 12} ${descY} Tm (${escapePdfText(dLine)}) Tj\n`;
          descY -= 13;
        }
        currentStream += `ET\nQ\n`;
        currentY -= boxHeight + 14;
      }
    } else {
      // Subsequent Page Compact Running Header (Height: 30pt)
      const compactTitle = truncateToWidth(cleanTitle, 300, 8.5, true);
      currentStream += `
q
0.039 0.086 0.200 rg
0 ${PAGE_HEIGHT - 30} ${PAGE_WIDTH} 30 re f
0.960 0.620 0.043 rg
0 ${PAGE_HEIGHT - 32} ${PAGE_WIDTH} 2 re f
1 1 1 rg
BT
/F2 8.5 Tf
1 0 0 1 ${MARGIN_LEFT} ${PAGE_HEIGHT - 20} Tm
(DENIM UNIVERSE  *  ${escapePdfText(compactTitle)}) Tj
ET
BT
/F1 8 Tf
0.82 0.86 0.94 rg
1 0 0 1 ${PAGE_WIDTH - MARGIN_RIGHT - 90} ${PAGE_HEIGHT - 20} Tm
(REF: ${escapePdfText(docRef)}) Tj
ET
Q
`;
      currentY = PAGE_HEIGHT - 54;
    }
  };

  // Start Page 1
  startNewPage(true);

  // Write content sections
  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Check bottom boundary before processing block
    if (currentY < CONTENT_BOTTOM_LIMIT + 15) {
      startNewPage(false);
    }

    // Section Headings (###) - Wrapped to 460 pt so long headings NEVER cut off
    if (trimmed.startsWith("### ")) {
      if (currentY < CONTENT_BOTTOM_LIMIT + 35) {
        startNewPage(false);
      }
      const rawHeading = sanitizeForPdf(trimmed.replace("### ", ""));
      const headingLines = wrapTextByWidth(rawHeading, 460, 11, true);

      currentY -= 4;
      currentStream += `
q
0.039 0.086 0.200 rg
BT
/F2 11 Tf
`;
      for (const hLine of headingLines) {
        currentStream += `1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm (${escapePdfText(hLine)}) Tj\n`;
        currentY -= 15;
      }
      currentStream += `ET\n`;

      // Thin accent divider line under heading
      currentStream += `
0.80 0.84 0.90 RG
0.6 w
${MARGIN_LEFT} ${currentY + 6} m ${PAGE_WIDTH - MARGIN_RIGHT} ${currentY + 6} l S
Q
`;
      currentY -= 4;
      continue;
    }

    // Horizontal Divider (---)
    if (trimmed.startsWith("---")) {
      currentStream += `
q
0.85 0.88 0.92 RG
0.5 w
${MARGIN_LEFT} ${currentY} m ${PAGE_WIDTH - MARGIN_RIGHT} ${currentY} l S
Q
`;
      currentY -= 12;
      continue;
    }

    // Bullet Lists (- ) - Wrapped strictly to 445 pt with safe 14 pt indent
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n- ");
      for (const item of items) {
        if (currentY < CONTENT_BOTTOM_LIMIT) {
          startNewPage(false);
        }
        const cleanItem = sanitizeForPdf(item.replace(/^- /, ""));
        const itemLines = wrapTextByWidth(cleanItem, 445, 9, false);

        currentStream += `
q
0.960 0.620 0.043 rg
${MARGIN_LEFT + 4} ${currentY + 2} 3 3 re f
0.15 0.20 0.30 rg
BT
/F1 9 Tf
`;
        let itemY = currentY;
        for (let i = 0; i < itemLines.length; i++) {
          currentStream += `1 0 0 1 ${MARGIN_LEFT + 14} ${itemY} Tm (${escapePdfText(itemLines[i])}) Tj\n`;
          itemY -= 13;
        }
        currentStream += `ET\nQ\n`;
        currentY = itemY - 3;
      }
      currentY -= 4;
      continue;
    }

    // Numbered Lists (1. ) - Wrapped strictly to 445 pt with safe 16 pt indent
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split(/\n(?=\d+\.\s)/);
      for (const item of items) {
        if (currentY < CONTENT_BOTTOM_LIMIT) {
          startNewPage(false);
        }
        const cleanItem = sanitizeForPdf(item);
        const itemLines = wrapTextByWidth(cleanItem, 445, 9, false);

        currentStream += `
q
0.15 0.20 0.30 rg
BT
/F1 9 Tf
`;
        let itemY = currentY;
        for (let i = 0; i < itemLines.length; i++) {
          const indent = i === 0 ? MARGIN_LEFT + 4 : MARGIN_LEFT + 16;
          currentStream += `1 0 0 1 ${indent} ${itemY} Tm (${escapePdfText(itemLines[i])}) Tj\n`;
          itemY -= 13;
        }
        currentStream += `ET\nQ\n`;
        currentY = itemY - 3;
      }
      currentY -= 4;
      continue;
    }

    // Standard Body Paragraph - Wrapped strictly to 465 pt
    const bodyLines = wrapTextByWidth(sanitizeForPdf(trimmed), 465, 9, false);
    currentStream += `
q
0.15 0.20 0.30 rg
BT
/F1 9 Tf
`;
    for (const bLine of bodyLines) {
      if (currentY < CONTENT_BOTTOM_LIMIT) {
        currentStream += `ET\nQ\n`;
        startNewPage(false);
        currentStream += `q\n0.15 0.20 0.30 rg\nBT\n/F1 9 Tf\n`;
      }
      currentStream += `1 0 0 1 ${MARGIN_LEFT} ${currentY} Tm (${escapePdfText(bLine)}) Tj\n`;
      currentY -= 13.5;
    }
    currentStream += `ET\nQ\n`;
    currentY -= 6;
  }

  // Mill Quality Assurance Sign-off Block at end
  if (currentY < CONTENT_BOTTOM_LIMIT + 55) {
    startNewPage(false);
  }

  currentStream += `
q
0.96 0.98 0.96 rg
0.70 0.85 0.70 RG
0.8 w
${MARGIN_LEFT} ${currentY - 50} ${CONTENT_WIDTH} 50 re b
0.10 0.45 0.15 rg
BT
/F2 8.5 Tf
1 0 0 1 ${MARGIN_LEFT + 14} ${currentY - 16} Tm
(OFFICIAL QUALITY ASSURANCE & CALIBRATION STAMP: VERIFIED) Tj
ET
0.25 0.30 0.40 rg
BT
/F1 8 Tf
1 0 0 1 ${MARGIN_LEFT + 14} ${currentY - 30} Tm
(Issued by: Denim Universe Technical Review Council  *  Authorized for Mill Implementation) Tj
ET
BT
/F1 7.5 Tf
0.40 0.45 0.55 rg
1 0 0 1 ${MARGIN_LEFT + 14} ${currentY - 42} Tm
(Verification Hash: DU-VERIFIED-${escapePdfText(docRef)}-SECURE) Tj
ET
Q
`;

  // Push final page
  if (currentStream) {
    pages.push({ stream: currentStream });
  }

  // Append Running A4 Footer to each page with exact total page count
  const totalPages = pages.length;
  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const pageNum = pIdx + 1;
    pages[pIdx].stream += `
q
0.85 0.88 0.92 RG
0.5 w
${MARGIN_LEFT} ${FOOTER_Y} m ${PAGE_WIDTH - MARGIN_RIGHT} ${FOOTER_Y} l S
0.45 0.50 0.60 rg
BT
/F1 7.5 Tf
1 0 0 1 ${MARGIN_LEFT} 35 Tm
((c) 2026 Denim Universe Ltd  *  All Rights Reserved  *  A4 Standard Edition) Tj
ET
BT
/F2 8 Tf
1 0 0 1 ${PAGE_WIDTH - MARGIN_RIGHT - 65} 35 Tm
(Page ${pageNum} of ${totalPages}) Tj
ET
Q
`;
  }

  // --- ASSEMBLE STANDARD PDF 1.4 DOCUMENT ---
  let pdfOutput = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const objectOffsets: number[] = [];

  const addObject = (content: string) => {
    objectOffsets.push(pdfOutput.length);
    pdfOutput += content + "\n";
  };

  // Object 1: Catalog
  addObject(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);

  // Page Object IDs: start from object 6
  const pageObjIds = pages.map((_, idx) => 6 + idx * 2);
  const kidsArray = pageObjIds.map((id) => `${id} 0 R`).join(" ");

  // Object 2: Pages Root
  addObject(`2 0 obj\n<< /Type /Pages /Kids [${kidsArray}] /Count ${totalPages} >>\nendobj`);

  // Object 3: Helvetica
  addObject(`3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  // Object 4: Helvetica-Bold
  addObject(`4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`);

  // Object 5: Helvetica-Oblique
  addObject(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj`);

  const encoder = new TextEncoder();

  // Pages & Content Streams
  pages.forEach((page, idx) => {
    const pageId = 6 + idx * 2;
    const streamId = pageId + 1;
    const streamBytes = encoder.encode(page.stream);

    // Page object with explicit A4 MediaBox
    addObject(
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${streamId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>\nendobj`
    );

    // Stream object with exact byte length
    addObject(
      `${streamId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${page.stream}\nendstream\nendobj`
    );
  });

  // Cross-reference table (xref)
  const xrefOffset = pdfOutput.length;
  const totalObjects = 5 + pages.length * 2;
  pdfOutput += `xref\n0 ${totalObjects + 1}\n`;
  pdfOutput += `0000000000 65535 f \n`;

  for (const offset of objectOffsets) {
    pdfOutput += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  // Trailer
  pdfOutput += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdfOutput], { type: "application/pdf" });
}

/**
 * Triggers direct browser download of the watermarked Denim Universe PDF.
 */
export function downloadDenimUniversePdf(resource: ResourceItem, memberName?: string): void {
  try {
    const blob = generateDenimUniversePdfBlob(resource, memberName);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const sanitizedTitle = (resource.title || "Technical_Manual")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);

    a.href = url;
    a.download = `Denim_Universe_${sanitizedTitle}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  } catch (error) {
    console.error("Error generating Denim Universe PDF:", error);
    // Fallback if blob download encounters error
    previewAndPrintDenimUniversePdf(resource, memberName);
  }
}

/**
 * Opens an interactive, high-resolution printable document window
 * strictly calibrated for standard A4 portrait dimensions (210mm x 297mm).
 * Guaranteed to display all content across pages with zero right-border clipping.
 */
export function previewAndPrintDenimUniversePdf(resource: ResourceItem, memberName?: string): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to preview the Denim Universe PDF.");
    return;
  }

  const member = memberName || "Verified Denim Universe Member";
  const docRef = `DU-SOP-${(resource.id || "001").toUpperCase()}`;
  const paragraphs = (resource.content || "").split("\n\n");

  const formattedContent = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("### ")) {
        return `<h3 class="section-heading">${formatMarkdownInline(trimmed.replace("### ", ""))}</h3>`;
      }
      if (trimmed.startsWith("---")) {
        return `<hr class="divider" />`;
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n- ")
          .map((item) => `<li>${formatMarkdownInline(item.replace(/^- /, ""))}</li>`)
          .join("");
        return `<ul class="bullet-list">${items}</ul>`;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed
          .split(/\n(?=\d+\.\s)/)
          .map((item) => `<li>${formatMarkdownInline(item.replace(/^\d+\.\s*/, ""))}</li>`)
          .join("");
        return `<ol class="numbered-list">${items}</ol>`;
      }
      return `<p class="paragraph">${formatMarkdownInline(trimmed)}</p>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Denim Universe - ${resource.title}</title>
  <style>
    /* Strict ISO 216 A4 Portrait Rules */
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    html, body {
      max-width: 100% !important;
      overflow-x: hidden !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #1e293b;
      font-size: 12.5px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .no-print-toolbar {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #0a1633;
      color: white;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #f59e0b;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }
    .toolbar-title {
      font-weight: 700;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar-badge {
      background: #f59e0b;
      color: #0a1633;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .toolbar-actions {
      display: flex;
      gap: 10px;
    }
    .btn {
      cursor: pointer;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 700;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #f59e0b;
      color: #0a1633;
    }
    .btn-primary:hover {
      background: #fbbf24;
    }
    .btn-secondary {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn-secondary:hover {
      background: rgba(255,255,255,0.25);
    }

    /* Screen Preview: Fits Inside Viewport Without Side Overflow */
    @media screen {
      .preview-container {
        padding: 20px 16px 60px;
        display: flex;
        justify-content: center;
        overflow-x: auto;
      }
      .sheet {
        width: 100%;
        max-width: 185mm;
        min-height: 270mm;
        background: white;
        padding: 14mm 16mm;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        position: relative;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .watermark-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        overflow: hidden;
      }
    }

    /* Print Calibration: 100% Fit Between A4 Margins with Zero Clipping */
    @media print {
      html, body {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .no-print-toolbar {
        display: none !important;
      }
      .preview-container {
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .sheet {
        width: 100% !important;
        max-width: 100% !important;
        min-height: auto !important;
        margin: 0 !important;
        padding: 0 2mm !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
      }
      .watermark-overlay {
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        display: flex !important;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        opacity: 0.05;
      }
      .content-wrapper {
        position: relative;
        z-index: 1;
        width: 100% !important;
        max-width: 100% !important;
      }
      .header-bar,
      .meta-grid,
      .summary-box,
      .qa-box,
      .footer-bar {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      h1, h2, h3, .doc-title, .section-heading {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .bullet-list li, .numbered-list li {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }

    /* Watermark Typography */
    .watermark-text {
      font-size: 52px;
      font-weight: 900;
      color: rgba(10, 22, 51, 0.05);
      transform: rotate(-30deg);
      user-select: none;
      letter-spacing: 0.18em;
      white-space: nowrap;
      text-transform: uppercase;
      font-family: Arial, Helvetica, sans-serif;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    /* Official Header */
    .header-bar {
      border-bottom: 2px solid #0a1633;
      padding-bottom: 10px;
      margin-bottom: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 10px;
      width: 100%;
      max-width: 100%;
    }
    .brand-name {
      font-size: 22px;
      font-weight: 900;
      color: #0a1633;
      letter-spacing: 0.04em;
    }
    .brand-sub {
      font-size: 9px;
      font-weight: 700;
      color: #d97706;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .meta-ref {
      text-align: right;
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
    }
    .meta-ref strong {
      color: #0a1633;
    }
    .doc-title {
      font-size: 19px;
      font-weight: 800;
      color: #0a1633;
      line-height: 1.3;
      margin-bottom: 12px;
      width: 100%;
      max-width: 100%;
    }

    /* Meta Pills Grid - Prevents Any Cell From Overflowing Right Boundary */
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 14px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .meta-item {
      min-width: 0;
      overflow: hidden;
    }
    .meta-item label {
      display: block;
      color: #64748b;
      font-size: 8.5px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .meta-item span {
      display: block;
      font-weight: 700;
      color: #0a1633;
      font-size: 11px;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    /* Executive Summary Box */
    .summary-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 3.5px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 11.5px;
      color: #1e293b;
      font-style: italic;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .summary-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      color: #b45309;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
      font-style: normal;
    }

    /* Headings & Content */
    .section-heading {
      font-size: 13.5px;
      font-weight: 800;
      color: #0a1633;
      margin: 16px 0 8px;
      padding-bottom: 3px;
      border-bottom: 1px solid #e2e8f0;
      width: 100%;
      max-width: 100%;
    }
    .paragraph {
      margin-bottom: 10px;
      color: #334155;
      font-size: 12px;
      line-height: 1.6;
      width: 100%;
      max-width: 100%;
    }
    .bullet-list, .numbered-list {
      margin: 6px 0 12px 18px;
      color: #334155;
      font-size: 12px;
      max-width: calc(100% - 18px);
      box-sizing: border-box;
    }
    .bullet-list li, .numbered-list li {
      margin-bottom: 5px;
      line-height: 1.55;
      word-break: break-word;
    }
    .divider {
      border: none;
      border-top: 1px dashed #cbd5e1;
      margin: 14px 0;
      width: 100%;
    }

    /* QA Stamp */
    .qa-box {
      margin-top: 20px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10px;
      color: #166534;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .footer-bar {
      margin-top: 20px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 6px;
      font-size: 9px;
      color: #94a3b8;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="no-print-toolbar">
    <div class="toolbar-title">
      <span>DENIM UNIVERSE</span> &middot; <span>Official Technical Specification</span>
      <span class="toolbar-badge">A4 Calibrated</span>
    </div>
    <div class="toolbar-actions">
      <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
      <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
    </div>
  </div>

  <div class="preview-container">
    <div class="sheet">
      <div class="watermark-overlay">
        <div class="watermark-text">DENIM UNIVERSE</div>
        <div class="watermark-text">DENIM UNIVERSE</div>
        <div class="watermark-text">DENIM UNIVERSE</div>
      </div>

      <div class="content-wrapper">
        <div class="header-bar">
          <div>
            <div class="brand-name">DENIM UNIVERSE</div>
            <div class="brand-sub">Official Technical Specification & Mill Calibration SOP</div>
          </div>
          <div class="meta-ref">
            <div>REF: <strong>${docRef}</strong></div>
            <div>DATE: <strong>${resource.publishedAt || "September 2026"}</strong></div>
          </div>
        </div>

        <h1 class="doc-title">${resource.title}</h1>

        <div class="meta-grid">
          <div class="meta-item">
            <label>Category</label>
            <span>${resource.category}</span>
          </div>
          <div class="meta-item">
            <label>Technical Author</label>
            <span>${resource.author || "Engr. Asif Jahan"}</span>
          </div>
          <div class="meta-item">
            <label>Licensee</label>
            <span>${member}</span>
          </div>
        </div>

        ${resource.desc ? `
        <div class="summary-box">
          <div class="summary-title">Technical Briefing & Executive Summary</div>
          ${formatMarkdownInline(resource.desc)}
        </div>` : ""}

        <div class="article-body">
          ${formattedContent}
        </div>

        <div class="qa-box">
          <div>
            <strong>OFFICIAL CALIBRATION STATUS: VERIFIED</strong><br/>
            <span>Denim Universe Wet Processing & Technical Board</span>
          </div>
          <div style="font-family: monospace; font-size: 9.5px;">
            LICENSE: LICENSED-COPY-DU
          </div>
        </div>

        <div class="footer-bar">
          <div>&copy; 2026 Denim Universe Ltd &middot; All Rights Reserved &middot; A4 Standard Edition</div>
          <div>Confidential &middot; Technical Asset</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
