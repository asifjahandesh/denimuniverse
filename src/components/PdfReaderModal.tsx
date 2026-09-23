import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Shield,
  Lock,
  BookOpen,
  FileText,
  Award,
  AlertCircle,
  Loader2,
  RotateCcw,
  Layers,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { getPdfFromIndexedDb, base64ToUint8Array } from "../lib/pdfStorage";
import logoImg from "../assets/logo.png";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

interface ParsedBlock {
  type: "heading" | "subheading" | "divider" | "table" | "bullet_list" | "numbered_list" | "paragraph";
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

/**
 * Converts a base64 data URI (data:application/pdf;base64,...) into a same-origin Blob URL.
 */
function base64ToBlobUrl(dataUrl: string): string {
  try {
    const bytes = base64ToUint8Array(dataUrl);
    const blob = new Blob([bytes], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Error converting base64 to blob URL:", err);
    return dataUrl;
  }
}

/**
 * Ensures PDF.js library is loaded and configured with same-origin worker.
 */
function loadPdfJsLibrary(): Promise<any> {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
    return Promise.resolve(window.pdfjsLib);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="pdf."]') as HTMLScriptElement;
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
          resolve(window.pdfjsLib);
        } else {
          reject(new Error("pdfjsLib not defined after load"));
        }
      });
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "/pdfjs/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib failed to initialize"));
      }
    };
    script.onerror = () => {
      // Fallback to CDN if local script fails
      const cdnScript = document.createElement("script");
      cdnScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      cdnScript.async = true;
      cdnScript.onload = () => {
        if (window.pdfjsLib) {
          try {
            const workerBlob = new Blob(
              [`importScripts('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');`],
              { type: "application/javascript" }
            );
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);
          } catch {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
          }
          resolve(window.pdfjsLib);
        } else {
          reject(new Error("PDF.js library could not be loaded"));
        }
      };
      cdnScript.onerror = reject;
      document.head.appendChild(cdnScript);
    };
    document.head.appendChild(script);
  });
}

/**
 * Single Canvas Page renderer using Mozilla PDF.js
 */
function PdfCanvasPage({
  pdfDoc,
  pageNumber,
  zoom,
}: {
  pdfDoc: any;
  pageNumber: number;
  zoom: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        setPageLoading(true);
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled || !canvasRef.current) return;

        // Base 1.5 scale for Retina crispness multiplied by user zoom
        const scale = (zoom / 100) * 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / 1.5}px`;
        canvas.style.height = `${viewport.height / 1.5}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        renderTask = page.render({
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;
        if (!isCancelled) {
          setPageLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn(`Error rendering page ${pageNumber}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, zoom]);

  return (
    <div className="relative mb-6 rounded-2xl bg-white shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col items-center max-w-full">
      {/* Top Header Watermark */}
      <div className="w-full bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] font-mono2 text-slate-500 select-none">
        <span className="font-bold text-[#0a1633] flex items-center gap-1.5">
          <Shield size={12} className="text-amber-600" />
          DENIM UNIVERSE · TECHNICAL SOP
        </span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
          Page {pageNumber}
        </span>
      </div>

      {pageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/85 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2 text-xs font-mono2 text-indigo-900 font-bold">
            <Loader2 size={16} className="animate-spin text-amber-500" />
            <span>Rendering Page {pageNumber}...</span>
          </div>
        </div>
      )}

      {/* Rendered Canvas */}
      <div className="overflow-x-auto max-w-full p-2 sm:p-4 bg-white flex justify-center">
        <canvas ref={canvasRef} className="block select-none pointer-events-none" />
      </div>

      {/* Bottom Footer Watermark */}
      <div className="w-full bg-slate-50 border-t border-slate-200 px-4 py-1.5 text-center text-[10px] font-mono2 text-slate-400 select-none">
        CONFIDENTIAL TECHNICAL SPECIFICATION · UNAUTHORIZED DOWNLOADING OR DUPLICATION STRICTLY PROHIBITED
      </div>
    </div>
  );
}

/**
 * Parses markdown inline formatting (**bold**, *italic*, `code`) into safe React elements.
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const tokens = text.split(regex);

  return (
    <>
      {tokens.map((token, idx) => {
        if (!token) return null;
        if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
          return (
            <strong key={idx} className="font-bold text-slate-950">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
          return (
            <em key={idx} className="italic text-slate-700">
              {token.slice(1, -1)}
            </em>
          );
        }
        if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
          return (
            <code
              key={idx}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-amber-800 border border-slate-200"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return <span key={idx}>{token}</span>;
      })}
    </>
  );
}

/**
 * Parses multi-line markdown content into structured blocks (headings, paragraphs, lists, tables, dividers).
 */
function parseMarkdownBlocks(rawContent: string): ParsedBlock[] {
  if (!rawContent) return [];
  const normalized = rawContent.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  const blocks: ParsedBlock[] = [];
  let currentListType: "bullet" | "numbered" | null = null;
  let currentListItems: string[] = [];
  let currentTableLines: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushList = () => {
    if (currentListType && currentListItems.length > 0) {
      blocks.push({
        type: currentListType === "bullet" ? "bullet_list" : "numbered_list",
        items: [...currentListItems],
      });
      currentListType = null;
      currentListItems = [];
    }
  };

  const flushTable = () => {
    if (currentTableLines.length > 0) {
      const headerLine = currentTableLines[0];
      const headers = headerLine
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      const dataLines = currentTableLines.slice(
        currentTableLines.length > 1 && currentTableLines[1].includes("---") ? 2 : 1
      );
      const rows = dataLines
        .map((line) =>
          line
            .split("|")
            .map((c) => c.trim())
            .filter((_, idx, arr) => idx > 0 || arr.length === 1)
            .filter(Boolean)
        )
        .filter((r) => r.length > 0);

      blocks.push({
        type: "table",
        headers,
        rows,
      });
      currentTableLines = [];
    }
  };

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(" ").trim();
      if (text) {
        blocks.push({
          type: "paragraph",
          text,
        });
      }
      currentParagraphLines = [];
    }
  };

  const flushAll = () => {
    flushList();
    flushTable();
    flushParagraph();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushAll();
      continue;
    }

    if (line === "---" || line === "***" || line === "___") {
      flushAll();
      blocks.push({ type: "divider" });
      continue;
    }

    if (line.startsWith("#### ")) {
      flushAll();
      blocks.push({
        type: "subheading",
        text: line.slice(5).trim(),
      });
      continue;
    }

    if (line.startsWith("### ")) {
      flushAll();
      blocks.push({
        type: "heading",
        text: line.slice(4).trim(),
      });
      continue;
    }

    if (line.startsWith("## ")) {
      flushAll();
      blocks.push({
        type: "heading",
        text: line.slice(3).trim(),
      });
      continue;
    }

    if (line.startsWith("# ")) {
      flushAll();
      blocks.push({
        type: "heading",
        text: line.slice(2).trim(),
      });
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      flushList();
      flushParagraph();
      currentTableLines.push(line);
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      flushTable();
      flushParagraph();
      if (currentListType && currentListType !== "bullet") {
        flushList();
      }
      currentListType = "bullet";
      currentListItems.push(bulletMatch[1]);
      continue;
    }

    const numberMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numberMatch) {
      flushTable();
      flushParagraph();
      if (currentListType && currentListType !== "numbered") {
        flushList();
      }
      currentListType = "numbered";
      currentListItems.push(numberMatch[2]);
      continue;
    }

    flushList();
    flushTable();
    currentParagraphLines.push(line);
  }

  flushAll();
  return blocks;
}

export default function PdfReaderModal() {
  const { readingPdfResource, closePdfReader, currentMember } = useData();
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"pdf" | "article">("pdf");
  const [pdfEngine, setPdfEngine] = useState<"canvas" | "native">("canvas");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // PDF.js State
  const [activeBlobUrl, setActiveBlobUrl] = useState<string>("");
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [docLoading, setDocLoading] = useState<boolean>(true);
  const [docError, setDocError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const showSecurityNotice = (
    msg: string = "Saving, downloading, and printing are disabled on this protected manual."
  ) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Keyboard shortcut protection (Ctrl+S, Ctrl+P, Cmd+S, Cmd+P, Ctrl+U, etc.)
  useEffect(() => {
    if (!readingPdfResource) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePdfReader();
        return;
      }

      // Prevent Print (Ctrl+P / Cmd+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice("Printing is prohibited. Please read the document directly on Denim Universe.");
        return;
      }

      // Prevent Save (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice("Saving or downloading this protected PDF manual is restricted.");
        return;
      }

      // Prevent View Source (Ctrl+U)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = origOverflow;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [readingPdfResource, closePdfReader]);

  const rawPdfUrl = readingPdfResource?.pdfUrl ? readingPdfResource.pdfUrl.trim() : "";
  const hasUploadedPdf = rawPdfUrl.length > 0;

  // Load and decode PDF document via IndexedDB / Uint8Array / URL
  useEffect(() => {
    if (!readingPdfResource) {
      setPdfDoc(null);
      setNumPages(0);
      setDocLoading(false);
      setDocError(null);
      setActiveBlobUrl("");
      return;
    }

    let isMounted = true;
    let localBlobUrlToRevoke = "";
    setDocLoading(true);
    setDocError(null);

    const loadAndRenderPdf = async () => {
      try {
        let rawUrl = (readingPdfResource.pdfUrl || "").trim();
        let binaryPayload: Uint8Array | ArrayBuffer | string | null = null;

        // 1. Try to fetch from IndexedDB using resource id or indexeddb: ref
        const localBlob = await getPdfFromIndexedDb(readingPdfResource.id);
        if (localBlob && isMounted) {
          const buffer = await localBlob.arrayBuffer();
          binaryPayload = new Uint8Array(buffer);
          localBlobUrlToRevoke = URL.createObjectURL(localBlob);
          setActiveBlobUrl(localBlobUrlToRevoke);
        } else if (rawUrl.startsWith("indexeddb:")) {
          const key = rawUrl.replace(/^indexeddb:/, "");
          const storedBlob = await getPdfFromIndexedDb(key);
          if (storedBlob && isMounted) {
            const buffer = await storedBlob.arrayBuffer();
            binaryPayload = new Uint8Array(buffer);
            localBlobUrlToRevoke = URL.createObjectURL(storedBlob);
            setActiveBlobUrl(localBlobUrlToRevoke);
          }
        }

        // 2. Base64 Data URL decoding directly to Uint8Array in memory
        if (!binaryPayload && rawUrl.startsWith("data:")) {
          try {
            binaryPayload = base64ToUint8Array(rawUrl);
            const b = new Blob([binaryPayload], { type: "application/pdf" });
            localBlobUrlToRevoke = URL.createObjectURL(b);
            setActiveBlobUrl(localBlobUrlToRevoke);
          } catch (b64Err) {
            console.warn("Failed to decode base64 PDF directly:", b64Err);
          }
        }

        // 3. Fallback to /sample-sop.pdf if URL was empty or points to broken external test file
        if (!binaryPayload) {
          if (!rawUrl || rawUrl.includes("dummy.pdf") || rawUrl.includes("w3.org")) {
            rawUrl = "/sample-sop.pdf";
          }

          // Fetch array buffer to prevent iframe cross-origin blocks
          try {
            const resp = await fetch(rawUrl);
            if (resp.ok) {
              const buffer = await resp.arrayBuffer();
              binaryPayload = new Uint8Array(buffer);
              const b = new Blob([binaryPayload], { type: "application/pdf" });
              localBlobUrlToRevoke = URL.createObjectURL(b);
              setActiveBlobUrl(localBlobUrlToRevoke);
            } else {
              binaryPayload = rawUrl;
              setActiveBlobUrl(rawUrl);
            }
          } catch (fetchErr) {
            console.warn("Fetch failed, passing URL directly to PDF.js:", fetchErr);
            binaryPayload = rawUrl;
            setActiveBlobUrl(rawUrl);
          }
        }

        if (!isMounted) return;

        // Ensure PDF.js engine is initialized
        const pdfjs = await loadPdfJsLibrary();
        if (!isMounted) return;

        const loadingParams: any = typeof binaryPayload === "string"
          ? { url: binaryPayload }
          : { data: binaryPayload };

        const loadingTask = pdfjs.getDocument(loadingParams);
        const doc = await loadingTask.promise;

        if (!isMounted) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setDocLoading(false);
      } catch (err: any) {
        console.error("PDF.js loading error:", err);
        if (isMounted) {
          setDocError(err?.message || "Failed to parse PDF document");
          setDocLoading(false);
        }
      }
    };

    loadAndRenderPdf();

    return () => {
      isMounted = false;
      if (localBlobUrlToRevoke && localBlobUrlToRevoke.startsWith("blob:")) {
        URL.revokeObjectURL(localBlobUrlToRevoke);
      }
    };
  }, [readingPdfResource, reloadTrigger]);

  // Reset zoom & view mode on document change
  useEffect(() => {
    if (readingPdfResource) {
      setZoom(100);
      if (hasUploadedPdf) {
        setViewMode("pdf");
      } else {
        setViewMode("article");
      }
    }
  }, [readingPdfResource, hasUploadedPdf]);

  const blocks = useMemo(() => {
    if (!readingPdfResource?.content) return [];
    return parseMarkdownBlocks(readingPdfResource.content);
  }, [readingPdfResource?.content]);

  if (!readingPdfResource) return null;

  const resource = readingPdfResource;
  const memberName = currentMember?.name || currentMember?.email || "Verified Paid Member";
  const docRef = `DU-SOP-${(resource.id || "001").toUpperCase()}`;

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 60));
  const handleResetZoom = () => setZoom(100);

  // Native iframe fallback URL
  const nativeIframeUrl = activeBlobUrl.startsWith("blob:")
    ? `${activeBlobUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : activeBlobUrl;

  return (
    <div
      ref={modalContainerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        showSecurityNotice("Right-click & saving are restricted on protected technical manuals.");
      }}
      className="fixed inset-0 z-[120] flex flex-col bg-[#050b18]/95 backdrop-blur-xl select-none"
    >
      {/* Hidden print blocker style */}
      <style>
        {`
          @media print {
            body * {
              display: none !important;
              visibility: hidden !important;
            }
            body::after {
              content: "Protected Denim Universe Technical Manual. Printing and offline saving are strictly prohibited.";
              display: block !important;
              visibility: visible !important;
              font-family: sans-serif;
              font-size: 20pt;
              color: #dc2626;
              text-align: center;
              padding-top: 60mm;
            }
          }
        `}
      </style>

      {/* Top Security & Reader Control Bar */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-white/10 bg-[#071126] px-3.5 py-2.5 sm:px-6 sm:py-3 shadow-lg">
        {/* Left: Document Title & Reference */}
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
            <BookOpen size={17} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-400/20 px-2 py-0.5 font-mono2 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30 shrink-0">
                {resource.category}
              </span>
              <span className="font-mono2 text-[11px] text-indigo-300/70 truncate hidden sm:inline">
                REF: {docRef}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono2 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                <Shield size={10} /> View-Only Protected
              </span>
            </div>
            <h2 className="font-display text-xs sm:text-sm font-extrabold text-white truncate mt-0.5" title={resource.title}>
              {resource.title}
            </h2>
          </div>
        </div>

        {/* Center: Mode Switcher (PDF Manual vs Article Notes) */}
        {hasUploadedPdf && resource.content && (
          <div className="hidden lg:flex items-center rounded-xl border border-white/15 bg-white/5 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("pdf")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === "pdf"
                  ? "bg-amber-400 text-[#0a1633] shadow"
                  : "text-indigo-200 hover:text-white"
              }`}
            >
              <FileText size={13} />
              <span>Uploaded PDF ({numPages > 0 ? `${numPages} Pages` : "Document"})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("article")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                viewMode === "article"
                  ? "bg-amber-400 text-[#0a1633] shadow"
                  : "text-indigo-200 hover:text-white"
              }`}
            >
              <BookOpen size={13} />
              <span>Article Notes</span>
            </button>
          </div>
        )}

        {/* Right Toolbar: Zoom, Fullscreen & Close */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 60}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 font-mono2 text-[11px] font-bold text-amber-300 hover:underline cursor-pointer"
              title="Reset Zoom (100%)"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={closePdfReader}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 transition hover:bg-rose-500/30 hover:text-white border border-rose-500/40 cursor-pointer active:scale-95"
            title="Close Protected Reader"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Security Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-amber-400/50 bg-[#0a1633] px-4 py-2.5 text-xs font-bold text-amber-300 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <Lock size={14} className="text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Reader View Container */}
      {viewMode === "pdf" ? (
        /* ==================================================================== */
        /* MODE A: PROTECTED UPLOADED PDF VIEWER (CANVAS + NATIVE HYBRID)      */
        /* ==================================================================== */
        <div className="relative flex-1 w-full h-[calc(100vh-105px)] flex flex-col bg-[#070e1c] overflow-hidden">
          {/* Top Control Subbar: Engine Switcher & Watermark Notice */}
          <div className="w-full bg-[#0a1633] border-b border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono2 text-indigo-200/80 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Shield size={13} className="text-emerald-400 shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider hidden sm:inline">PROTECTED SOP:</span>
              <span className="text-amber-300 font-semibold truncate max-w-xs sm:max-w-md">
                {resource.pdfTitle || "Industrial_SOP_Document.pdf"}
              </span>
              {numPages > 0 && (
                <span className="bg-white/10 text-white px-2 py-0.5 rounded font-bold">
                  {numPages} {numPages === 1 ? "Page" : "Pages"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Fallback Engine Switcher */}
              {hasUploadedPdf && (
                <div className="flex items-center rounded-lg bg-white/5 border border-white/10 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPdfEngine("canvas")}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition cursor-pointer ${
                      pdfEngine === "canvas" ? "bg-amber-400 text-[#0a1633]" : "text-slate-300 hover:text-white"
                    }`}
                    title="Protected Continuous Canvas Reader"
                  >
                    Canvas
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfEngine("native")}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition cursor-pointer ${
                      pdfEngine === "native" ? "bg-amber-400 text-[#0a1633]" : "text-slate-300 hover:text-white"
                    }`}
                    title="Native Browser Frame (Safe Blob)"
                  >
                    Native
                  </button>
                </div>
              )}

              <span className="text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/25 text-[10px] font-bold hidden sm:inline">
                DOWNLOADING DISABLED
              </span>

              {resource.content && (
                <button
                  type="button"
                  onClick={() => setViewMode("article")}
                  className="lg:hidden text-amber-300 underline font-bold text-[11px] cursor-pointer"
                >
                  View Notes
                </button>
              )}
            </div>
          </div>

          {/* PDF Content Area */}
          <div className="flex-1 w-full overflow-y-auto overscroll-contain bg-[#060c18] p-3 sm:p-6 flex justify-center items-start">
            {docLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <Loader2 size={36} className="animate-spin text-amber-400 mb-3" />
                <p className="font-display text-base font-bold text-white">Loading Protected PDF Manual...</p>
                <p className="text-xs font-mono2 text-indigo-200/70 mt-1">Decoding pages with Canvas Engine</p>
              </div>
            ) : docError ? (
              <div className="my-16 flex flex-col items-center justify-center text-center max-w-lg mx-auto p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 text-white shadow-2xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Unable to Display Uploaded PDF
                </h3>
                <p className="text-xs text-rose-200/80 mb-5 leading-relaxed font-mono2">
                  {docError}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setReloadTrigger((prev) => prev + 1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-[#0a1633] transition hover:bg-amber-300 cursor-pointer shadow-lg"
                  >
                    <RotateCcw size={14} />
                    <span>Retry PDF Reader</span>
                  </button>
                  {resource.content && (
                    <button
                      type="button"
                      onClick={() => setViewMode("article")}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Article Notes</span>
                    </button>
                  )}
                </div>
              </div>
            ) : hasUploadedPdf ? (
              pdfEngine === "canvas" ? (
                /* 1. PDF.js Canvas Continuous Scroll Renderer */
                <div className="w-full flex flex-col items-center">
                  {Array.from({ length: numPages }, (_, idx) => (
                    <PdfCanvasPage
                      key={idx + 1}
                      pdfDoc={pdfDoc}
                      pageNumber={idx + 1}
                      zoom={zoom}
                    />
                  ))}
                </div>
              ) : (
                /* 2. Native Safe Blob Frame Renderer */
                <div className="w-full h-full min-h-[75vh] flex flex-col items-center justify-center">
                  <iframe
                    src={nativeIframeUrl}
                    title={resource.title || "PDF Document"}
                    className="w-full h-full min-h-[75vh] rounded-2xl border border-white/15 bg-white shadow-2xl"
                  />
                </div>
              )
            ) : (
              /* Fallback if no PDF was attached during creation */
              <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  No PDF Uploaded For This Resource
                </h3>
                <p className="text-xs text-indigo-200/70 mb-5 leading-relaxed">
                  A PDF document was not attached to this resource during creation. You can upload the PDF anytime via the Admin Panel.
                </p>
                {resource.content && (
                  <button
                    type="button"
                    onClick={() => setViewMode("article")}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-[#0a1633] transition hover:bg-amber-300 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <BookOpen size={15} />
                    <span>Read Article Content Instead</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* MODE B: EDUCATIONAL ARTICLE NOTES (MARKDOWN)                         */
        /* ==================================================================== */
        <div className="flex-1 overflow-y-auto overscroll-contain bg-[#070e1c]">
          <div className="min-h-full w-full py-6 sm:py-10 px-2 sm:px-6 flex justify-center items-start">
            <div
              style={{
                zoom: zoom !== 100 ? `${zoom}%` : undefined,
              }}
              className="relative w-full max-w-[850px] bg-white text-slate-900 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.7)] border border-slate-200 p-6 sm:p-12 lg:p-16 shrink-0 transition-all"
            >
              {/* Security Watermark Pattern */}
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0 opacity-[0.035] rounded-2xl"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='440' height='300'><text x='50%' y='45%' fill='%230a1633' font-size='16' font-weight='800' font-family='sans-serif' text-anchor='middle' transform='rotate(-28 220 150)'>DENIM UNIVERSE · PROTECTED SOP</text><text x='50%' y='60%' fill='%230a1633' font-size='11' font-weight='700' font-family='sans-serif' text-anchor='middle' transform='rotate(-28 220 150)'>OFFICIAL TECHNICAL MANUAL · VIEW ONLY</text></svg>")`,
                  backgroundRepeat: "repeat",
                }}
              />

              <div className="relative z-10">
                {/* Document Header Bar */}
                <div className="border-b-2 border-[#0a1633] pb-5 mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={logoImg}
                      alt="Denim Universe Official Logo"
                      className="h-12 w-12 rounded-full object-cover shadow ring-1 ring-slate-300"
                    />
                    <div>
                      <h1 className="font-display text-xl sm:text-2xl font-black text-[#0a1633] tracking-tight">
                        DENIM <span className="text-amber-600">UNIVERSE</span>
                      </h1>
                      <p className="font-mono2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Educational Article Notes · {resource.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block rounded-lg bg-amber-50/80 px-3 py-1.5 border border-amber-300/80 text-left font-mono2 text-[10.5px] text-amber-950 leading-relaxed shadow-sm">
                      <div><strong>REF:</strong> {docRef}</div>
                      <div><strong>ACCESS:</strong> CONTROLLED VIEW-ONLY</div>
                      <div><strong>READER:</strong> {memberName}</div>
                    </div>
                  </div>
                </div>

                {/* Title & Executive Summary Box */}
                <div className="mb-7 rounded-xl bg-slate-50 p-5 sm:p-6 border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded bg-indigo-100 px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold uppercase tracking-wider text-indigo-800">
                      Full Educational Article Content
                    </span>
                    {hasUploadedPdf && (
                      <button
                        type="button"
                        onClick={() => setViewMode("pdf")}
                        className="font-mono2 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                      >
                        Switch to Uploaded PDF Manual →
                      </button>
                    )}
                  </div>

                  <h2 className="font-display mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#0a1633] leading-tight">
                    {resource.title}
                  </h2>

                  {resource.desc && (
                    <p className="mt-2.5 text-sm text-slate-700 leading-relaxed font-medium">
                      {renderInlineMarkdown(resource.desc)}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono2">
                    <span>AUTHOR: {resource.author || "Engr. Asif Jahan · Wet Process Specialist"}</span>
                    <span>PUBLISHED: {resource.publishedAt || "September 2026"}</span>
                  </div>
                </div>

                {/* Formatted Technical Document Body */}
                <div className="space-y-4 text-[14.5px] leading-relaxed text-slate-800">
                  {blocks.map((block, bIdx) => {
                    if (block.type === "heading") {
                      return (
                        <h3
                          key={bIdx}
                          className="font-display mt-8 mb-3 text-lg sm:text-xl font-extrabold text-[#0a1633] border-b-2 border-slate-100 pb-2.5 flex items-center gap-2.5"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-slate-950 font-mono2 shadow-sm">
                            §
                          </span>
                          <span>{renderInlineMarkdown(block.text || "")}</span>
                        </h3>
                      );
                    }

                    if (block.type === "subheading") {
                      return (
                        <h4
                          key={bIdx}
                          className="font-display mt-5 mb-2 text-base font-bold text-slate-800"
                        >
                          {renderInlineMarkdown(block.text || "")}
                        </h4>
                      );
                    }

                    if (block.type === "divider") {
                      return <hr key={bIdx} className="my-7 border-t border-slate-200" />;
                    }

                    if (block.type === "table" && block.headers && block.rows) {
                      return (
                        <div
                          key={bIdx}
                          className="my-5 overflow-x-auto rounded-xl border border-slate-200 shadow-sm"
                        >
                          <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead className="bg-[#0a1633] text-white font-mono2 text-[11px] uppercase tracking-wider">
                              <tr>
                                {block.headers.map((h, hIdx) => (
                                  <th
                                    key={hIdx}
                                    className="p-3 border-r border-white/10 last:border-r-0 font-bold"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {block.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="p-3 text-slate-700 border-r border-slate-100 last:border-r-0 font-medium"
                                    >
                                      {renderInlineMarkdown(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }

                    if (block.type === "bullet_list" && block.items) {
                      return (
                        <ul key={bIdx} className="my-3.5 space-y-2.5 pl-1 sm:pl-2">
                          {block.items.map((item, iIdx) => (
                            <li
                              key={iIdx}
                              className="flex items-start gap-2.5 text-[14px] leading-relaxed text-slate-700"
                            >
                              <span className="text-amber-600 font-bold mt-0.5 shrink-0 text-sm">
                                ▸
                              </span>
                              <span className="flex-1">{renderInlineMarkdown(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "numbered_list" && block.items) {
                      return (
                        <ol key={bIdx} className="my-3.5 space-y-2.5 pl-1 sm:pl-2">
                          {block.items.map((item, iIdx) => (
                            <li
                              key={iIdx}
                              className="flex items-start gap-3 text-[14px] leading-relaxed text-slate-700"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 font-mono2 text-[11px] font-bold text-amber-900 mt-0.5 border border-amber-200">
                                {iIdx + 1}
                              </span>
                              <span className="flex-1">{renderInlineMarkdown(item)}</span>
                            </li>
                          ))}
                        </ol>
                      );
                    }

                    return (
                      <p key={bIdx} className="text-slate-700 leading-relaxed my-2.5">
                        {renderInlineMarkdown(block.text || "")}
                      </p>
                    );
                  })}
                </div>

                {/* Official Accreditation Box */}
                <div className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 text-emerald-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-xs sm:text-sm text-emerald-950">
                        OFFICIAL TECHNICAL SPECIFICATION
                      </p>
                      <p className="text-[11px] text-emerald-800/80">
                        Denim Universe Technical Advisory Board · Standard Operating Procedure
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right font-mono2 text-[10px] text-emerald-800">
                    <div><strong>LICENSE:</strong> LICENSED-COPY-DU</div>
                    <div><strong>SECURITY:</strong> DIGITAL WATERMARKED</div>
                  </div>
                </div>

                {/* Document Footer End Bar */}
                <div className="mt-8 pt-5 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono2">
                  <div>
                    <strong>DENIM UNIVERSE SOP LIBRARY</strong> · END OF NOTES
                  </div>
                  <div className="text-amber-800 font-bold">
                    PROTECTED VIEW-ONLY · DOWNLOADING & PRINTING RESTRICTED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Security Notice Footer */}
      <footer className="sticky bottom-0 z-30 flex shrink-0 items-center justify-between border-t border-white/10 bg-[#071126] px-4 py-2 text-[11.5px] text-indigo-200/80">
        <div className="flex items-center gap-2">
          <Lock size={13} className="text-amber-400 shrink-0" />
          <span>
            <strong>Protected Digital Reader:</strong> Saving, exporting, or printing this manual is disabled to protect proprietary manufacturing formulas.
          </span>
        </div>
        <button
          type="button"
          onClick={closePdfReader}
          className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1 font-bold text-white transition cursor-pointer active:scale-95"
        >
          Exit Reader
        </button>
      </footer>
    </div>
  );
}
