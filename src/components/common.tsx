import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/* Scroll reveal wrapper */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Section eyebrow + heading */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignCls}`}>
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.22em] ${
          dark ? "border-white/20 bg-white/10 text-amber-300" : "border-indigo-900/15 bg-indigo-900/[0.04] text-indigo-800"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-amber-400" : "bg-amber-500"} animate-pulse`} />
        {eyebrow}
      </span>
      <h2
        className={`font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.9rem] ${
          dark ? "text-white" : "text-[#0a1633]"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p className={`max-w-2xl text-[15px] leading-relaxed ${dark ? "text-indigo-100/80" : "text-slate-600"}`}>{desc}</p>
      )}
      <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : "justify-start"}`}>
        <span className="h-[3px] w-14 rounded-full bg-amber-500" />
        <span className="h-[3px] w-4 rounded-full bg-indigo-800/30" />
        <span className="h-[3px] w-2 rounded-full bg-indigo-800/20" />
      </div>
    </div>
  );
}

/* Generic modal shell */
export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", fn);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#060d22]/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="sticky top-4 z-10 ml-auto mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0a1633] text-white shadow-lg transition hover:rotate-90 hover:bg-indigo-700"
          style={{ position: "sticky", float: "right" }}
        >
          <X size={18} />
        </button>
        <div className="clear-both">{children}</div>
      </div>
    </div>
  );
}

/* Animated counter */
export function Counter({ value, suffix = "", duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(value * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, suffix, duration]);
  return <span ref={ref}>0{suffix}</span>;
}
