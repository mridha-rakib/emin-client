"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaginationControls({
  page,
  pages,
  onPageChange,
  isDe = false,
}: {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  isDe?: boolean;
}) {
  if (pages <= 1) return null;

  const visiblePages = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === pages || Math.abs(number - page) <= 1,
  );

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={isDe ? "Seitennavigation" : "Pagination"}>
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        {isDe ? "Zurück" : "Previous"}
      </button>

      {visiblePages.map((number, index) => {
        const previous = visiblePages[index - 1];
        return (
          <span key={number} className="contents">
            {previous && number - previous > 1 && <span className="px-1 text-slate-400">…</span>}
            <button
              type="button"
              aria-current={number === page ? "page" : undefined}
              onClick={() => onPageChange(number)}
              className={cn(
                "h-10 min-w-10 rounded-xl border px-3 text-xs font-black transition-colors",
                number === page
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              )}
            >
              {number}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isDe ? "Weiter" : "Next"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
