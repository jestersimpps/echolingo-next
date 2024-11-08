'use client';
import { TranslationWord } from '../../types/translation';
import WordBreakdown from './WordBreakdown';

interface TranslationHistoryRowProps {
  translation: {
    id: string;
    created_at: string;
    input_text: string;
    translated_text: string;
    pinyin: string;
    word_breakdown: TranslationWord[];
  };
}

export default function TranslationHistoryRow({ translation }: TranslationHistoryRowProps) {
  return (
    <tr className="hover:bg-black/5 dark:hover:bg-black/30 transition-colors">
      <td className="p-4 border-b dark:border-gray-700">
        <div>
          {translation.input_text}
          <div className="text-xs text-gray-400 mt-1">
            {new Date(translation.created_at).toLocaleString()}
          </div>
        </div>
      </td>
      <td className="p-4 border-b dark:border-gray-700">
        <div>
          <div>{translation.translated_text}</div>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            {translation.pinyin}
          </div>
        </div>
      </td>
      <td className="p-4 border-b dark:border-gray-700">
        <WordBreakdown words={translation.word_breakdown} />
      </td>
    </tr>
  );
}
