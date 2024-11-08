'use client';
import { useState, useEffect } from 'react';

import { TranslationWord } from '../../types/translation';
import TranslationHistoryRow from './TranslationHistoryRow';

interface Translation {
  id: string;
  created_at: string;
  input_text: string;
  translated_text: string;
  pinyin: string;
  word_breakdown: TranslationWord[];
}

interface PaginatedResponse {
  translations: Translation[];
  totalPages: number;
  currentPage: number;
}

interface TranslationHistoryProps {
  refreshTrigger?: number;
}

export default function TranslationHistory({ refreshTrigger = 0 }: TranslationHistoryProps) {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchTranslations(currentPage);
    // Reset to page 1 when page size changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, refreshTrigger, pageSize]);

  const fetchTranslations = async (page: number) => {
    try {
      const response = await fetch(`/api/translations?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch translations');
      
      const data: PaginatedResponse = await response.json();
      setTranslations(data.translations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="history-container">
      <h2 className="text-xl font-bold mb-4">Translation History</h2>
      <div className="history-table-container">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-4">English</th>
              <th className="text-left p-4">Chinese</th>
              <th className="text-left p-4">Word Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((translation) => (
              <TranslationHistoryRow key={translation.id} translation={translation} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        
        <span className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="pagination-select"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>per page</span>
        </span>

        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
