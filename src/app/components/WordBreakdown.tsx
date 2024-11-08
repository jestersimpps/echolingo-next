'use client';
import { TranslationWord } from '../../types/translation';

interface WordBreakdownProps {
  words: TranslationWord[];
  knownWords?: string[];
}

export default function WordBreakdown({ words, knownWords = [] }: WordBreakdownProps) {
  return (
    <div className="word-breakdown">
      <h3 className="font-bold mb-2">Word Breakdown:</h3>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <div 
            key={index}
            className="group relative inline-block"
          >
            <span 
              className={`px-2 py-1 rounded ${knownWords.includes(word.chars) ? 'known-word' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              {word.chars}
            </span>
            <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="font-bold">{word.meaning}</p>
              <p className="text-gray-600 dark:text-gray-400">{word.pinyin}</p>
              <p className="text-gray-500 dark:text-gray-500 text-xs">{word.phonetic}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
