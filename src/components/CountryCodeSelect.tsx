import { cn } from "@/lib/utils";

/** Odaboo accepts Swiss mobile numbers only, so the dial code is fixed to +41. */
export const SWISS_DIAL_CODE = "+41";

function SwissFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden>
      <rect width="32" height="32" fill="#D52B1E" />
      <rect x="13" y="6" width="6" height="20" fill="#fff" />
      <rect x="6" y="13" width="20" height="6" fill="#fff" />
    </svg>
  );
}

export function SwissDialCode({ variant = "compact" }: { variant?: "compact" | "field" }) {
  return (
    <div
      aria-label="Switzerland +41"
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 font-bold text-slate-800",
        variant === "field" ? "bg-slate-50/70 px-3 py-3 text-xs sm:text-sm" : "bg-white px-3 py-2 text-xs"
      )}
    >
      <span className="flex h-4 w-5 items-center justify-center overflow-hidden rounded-[3px] border border-black/10">
        <SwissFlag />
      </span>
      <span>{SWISS_DIAL_CODE}</span>
    </div>
  );
}
