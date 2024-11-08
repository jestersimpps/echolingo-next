'use client';
import { useState } from 'react';
import { TranslationResponse } from '../types/translation';
import TranslationHistory from './components/TranslationHistory';
import TranslationInput from './components/TranslationInput';
import TranslationOutput from './components/TranslationOutput';
import ClientLayout from './components/ClientLayout';

export default function Home() {
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  
  // Words the user already knows
  const knownWords = ['下雨'];

  return (
    <ClientLayout>
      <div className="flex-1">
        <div className="flex">
          {/* Left Panel - Input */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-800">
            <TranslationInput 
              onTranslationComplete={(translation) => {
                setTranslation(translation);
                setHistoryRefreshTrigger(prev => prev + 1);
              }}
              onLoadingChange={setTranslationLoading}
            />
          </div>

          {/* Right Panel - Translation */}
          <div className="w-1/2">
            <TranslationOutput 
              translation={translation}
              loading={translationLoading}
              knownWords={knownWords}
            />
          </div>
        </div>

        {/* Translation History */}
        <div className="w-full p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <TranslationHistory refreshTrigger={historyRefreshTrigger} />
        </div>
      </div>
    </ClientLayout>
  );
}
