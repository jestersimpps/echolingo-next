export enum CharacterType {
  Simplified = 'simplified',
  Traditional = 'traditional'
}

export interface TranslationWord {
  chars: string;
  pinyin: string;
  phonetic: string;
  meaning: string;
}

export interface TranslationResponse {
  prompt: string;
  translation: string;
  pinyin: string;
  words: TranslationWord[];
}
