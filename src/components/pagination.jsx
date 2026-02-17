import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const [jumpPage, setJumpPage] = useState('');

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= showPages; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - showPages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
              currentPage === page
                ? 'bg-green-200 border-gray-300 text-gray-900 font-medium'
                : 'bg-white/60 backdrop-blur-sm border-gray-300 hover:bg-white/80 text-gray-700'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-600">
            {page}
          </span>
        )
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-gray-300"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      <div className="flex items-center gap-2 ml-4">
        <span className="text-gray-700 text-sm">跳至</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => {
            const currentInput = e.target.value
            if(currentInput>totalPages)
            setJumpPage(totalPages)
            else setJumpPage(currentInput)
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleJumpToPage()}
          className="w-16 h-10 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder=""
        />
        <span className="text-gray-700 text-sm">页</span>
      </div>
    </div>
  );
}