import { CharacterType, TranslationResponse } from '../types/translation';

export async function translateText(
  text: string,
  inputLanguage: string = 'en',
  characters: CharacterType = CharacterType.Simplified
): Promise<TranslationResponse> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      inputLanguage,
      characters,
    }),
  });

  if (!response.ok) {
    throw new Error('Translation failed');
  }

  return response.json();
}