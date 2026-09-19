import React, { useState, useEffect } from "react";
import { Lock, X, KeyRound, AlertCircle, ArrowRight } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function AdminLoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useData();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoginModalOpen) {
      setPin("");
      setError(false);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = login(pin);
    if (!success) {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2500);
    } else {
      setError(false);
      setPin("");
    }
  };

  const handleKeypad = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        const success = login(nextPin);
        if (!success) {
          setError(true);
          setTimeout(() => {
            setError(false);
            setPin("");
          }, 1000);
        } else {
          setPin("");
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#060d22]/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsLoginModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-b from-[#0a1633] via-[#0d1c42] to-[#060d22] p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)] sm:p-8">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a1633] shadow-lg shadow-amber-500/30">
            <Lock size={30} />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-900 text-white ring-2 ring-white/30">
              <KeyRound size={12} />
            </span>
          </div>

          <h3 className="font-display mt-5 text-2xl font-black tracking-tight text-white">
            Admin Access Portal
          </h3>
          <p className="mt-1.5 text-[13px] text-indigo-200/70">
            Enter the 4-digit security PIN to manage content
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 w-full">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPin(val);
                  if (val.length === 4) {
                    const success = login(val);
                    if (!success) {
                      setError(true);
                      setTimeout(() => {
                        setError(false);
                        setPin("");
                      }, 1000);
                    }
                  }
                }}
                placeholder="••••"
                className={`w-full rounded-2xl border bg-black/30 px-4 py-4 text-center font-mono2 text-3xl font-bold tracking-[0.6em] text-white transition focus:outline-none ${
                  error
                    ? "border-rose-500 bg-rose-950/30 text-rose-300 ring-2 ring-rose-500/50"
                    : "border-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
                }`}
              />
            </div>

            {error && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-400">
                <AlertCircle size={14} /> Incorrect PIN. Please try again.
              </div>
            )}

            {/* Quick numeric touch-keypad */}
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypad(num)}
                  className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-display text-lg font-bold text-white transition hover:bg-white/15 active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono2 text-xs uppercase tracking-wider text-indigo-200/80 transition hover:bg-white/15 active:scale-95"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypad("0")}
                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-display text-lg font-bold text-white transition hover:bg-white/15 active:scale-95"
              >
                0
              </button>
              <button
                type="submit"
                className="flex h-12 items-center justify-center rounded-xl bg-amber-400 font-display text-sm font-black text-[#0a1633] shadow-md transition hover:bg-amber-300 active:scale-95"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <p className="mt-5 text-[11px] text-indigo-300/50">
            Protected area for authorized Denim Universe managers only.
          </p>
        </div>
      </div>
    </div>
  );
}