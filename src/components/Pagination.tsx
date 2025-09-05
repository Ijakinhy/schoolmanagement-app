"use client";

import { ITEM_PER_PAGE } from "@/lib/setting";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SIBLING_COUNT = 1;
const DOTS = "...";

const generatePaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | string)[] => {
  const totalPageNumbersToShow = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbersToShow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);


  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  const pages: (number | string)[] = [];

  pages.push(firstPageIndex);

  if (shouldShowLeftDots) {
    pages.push(DOTS);
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i > firstPageIndex && i < lastPageIndex) {
      pages.push(i);
    }
  }

  if (shouldShowRightDots) {
    pages.push(DOTS);
  }

  if (totalPages > 1) {
    pages.push(lastPageIndex);
  }
  return pages;
};


const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageItems = generatePaginationRange(page, totalPages, SIBLING_COUNT);

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        type="button"
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        onClick={() => changePage(page - 1)}
        aria-label="Previous page"
      >
        Prev
      </button>

      <div className="flex items-center gap-1 sm:gap-2 text-sm"> {/* Reduced gap for smaller screens */}
        {pageItems.map((item, index) => {
          const key = typeof item === 'number' ? `page-${item}` : `dots-${index}`;

          if (item === DOTS) {
            return (
              <span
                key={key}
                className="px-2 py-1 text-xs font-medium text-slate-400"
                aria-hidden="true"
              >
                {DOTS}
              </span>
            );
          }

          return (
            <button
              type="button"
              key={key}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${page === item
                ? "bg-uiSky text-white" // Ensure uiSky is defined in your Tailwind config
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                } ${page === item ? 'cursor-default' : 'hover:bg-slate-300'}`}
              onClick={() => changePage(item as number)}
              disabled={page === item} // Disable current page button
              aria-label={`Go to page ${item}`}
              {...(page === item && { "aria-current": "page" })}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;