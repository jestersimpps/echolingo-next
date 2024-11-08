'use client';
import { TranslationResponse } from '../../types/translation';
import WordBreakdown from './WordBreakdown';

interface TranslationOutputProps {
  translation: TranslationResponse | null;
  loading: boolean;
  knownWords: string[];
}

export default function TranslationOutput({ translation, loading, knownWords }: TranslationOutputProps) {
  return (
    <div className="translation-panel p-6">
      <h2 className="text-xl font-bold mb-4">Chinese</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : translation ? (
        <>
          {/* Chinese Characters */}
          <div className="chinese-text text-2xl mb-2">
            {translation.translation}
          </div>

          {/* Pinyin */}
          <div className="pinyin-text text-gray-600 dark:text-gray-400 mb-4">
            {translation.pinyin}
          </div>

          {/* Word Breakdown */}
          <WordBreakdown 
            words={translation.words}
            knownWords={knownWords}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-500">
          Enter text to see translation
        </div>
      )}
    </div>
  );
}
