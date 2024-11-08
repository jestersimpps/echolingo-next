'use client';
/** @jsxImportSource react */
import { useState } from 'react';
import { translateText } from '../../utils/translation';
import { TranslationResponse } from '../../types/translation';

interface TranslationInputProps {
  onTranslationComplete: (translation: TranslationResponse) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function TranslationInput({ onTranslationComplete, onLoadingChange }: TranslationInputProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="translation-panel">
      <h2 className="text-xl font-bold mb-4">English</h2>
      <textarea
        className="w-full h-32 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="flex gap-2 mt-4">
        <button 
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setInputText('')}
          disabled={loading}
        >
          Clear
        </button>
        <button 
          className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={async () => {
          if (!inputText.trim() || loading) return;
          
          setLoading(true);
          onLoadingChange(true);
          try {
            const result = await translateText(inputText);
            onTranslationComplete(result);
            
            // Save translation to database
            await fetch('/api/translations', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                prompt: inputText,
                translation: result.translation,
                pinyin: result.pinyin,
                words: result.words
              }),
            });
          } catch (error) {
            console.error('Translation error:', error);
          } finally {
            setLoading(false);
            onLoadingChange(false);
          }
        }}
        disabled={loading}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>
    </div>
  );
}
