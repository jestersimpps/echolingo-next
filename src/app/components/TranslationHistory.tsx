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

  useEffect(() => {
    fetchTranslations(currentPage);
  }, [currentPage, refreshTrigger]);

  const fetchTranslations = async (page: number) => {
    try {
      const response = await fetch(`/api/translations?page=${page}`);
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
    <div>
      <h2 className="text-xl font-bold mb-4">Translation History</h2>
      <div className="overflow-x-auto">
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

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border dark:border-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
