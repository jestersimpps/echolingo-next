import { NextResponse } from "next/server";
import OpenAI from "openai";
import * as deepl from "deepl-node";
import { CharacterType, TranslationResponse } from "@/types/translation";
import { SourceLanguageCode, TextResult } from "deepl-node";

import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY!,
});

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export async function POST(request: Request) {
 const session = await getServerSession();
 try {
  const {
   text,
   inputLanguage = "en",
   characters = CharacterType.Simplified,
  } = await request.json();

  // First translate the text to Chinese using DeepL
  const deeplResult = await translator.translateText(
   text,
   inputLanguage as SourceLanguageCode,
   "zh"
  );
  const chineseText = (deeplResult as TextResult).text;

  // Then use OpenAI to break down the translation
  const prompt = `
       Create a JSON object from the following Chinese text: ${chineseText}
       The "prompt" field should contain: ${text}
       The "translation" field should contain the following translation, but written in
       ${
        characters === CharacterType.Simplified ? "simplified" : "traditional"
       } Chinese characters: ${chineseText}
       Important: Always write numbers in full Chinese characters (e.g., 一百二十三 instead of 123).
       The "pinyin" field should contain the correct pinyin for ${chineseText}
       In the "words" section, break down "${chineseText}" into individual words or meaningful word combinations.
         -  The "chars" field for each word should be a word or character from "${chineseText}", but written in
         ${
          characters === CharacterType.Simplified ? "simplified" : "traditional"
         } Chinese characters
         -  Ensure that all numbers are written in full Chinese characters in the "chars" field
         -  The "pinyin" field for each word should be the correct pinyin for the word
         -  The "phonetic" field for each word should be an approximate phonetic pronunciation in the prompt language (${inputLanguage})
         -  The "meaning" field for each word should be the translation in the prompt language (${inputLanguage})
     `;

  const completion = await openai.chat.completions.create({
   messages: [{ role: "user", content: prompt }],
   model: "gpt-4o-mini",
   response_format: { type: "json_object" },
  });

  const response = JSON.parse(
   completion.choices[0].message.content!
  ) as TranslationResponse;
  // Store translation in Supabase if user is authenticated
  if (session?.user?.email) {
   await supabase.from("translations").insert({
    user_email: session.user.email,
    prompt: text,
    translation: response.translation,
    pinyin: response.pinyin,
    words: response.words,
    created_at: new Date().toISOString(),
   });
  }

  return NextResponse.json(response);
 } catch (error) {
  console.error("Translation error:", error);
  return NextResponse.json(
   { error: "Failed to process translation" },
   { status: 500 }
  );
 }
}
