/**
 * Helper functions for parsing Gemini AI responses
 */

// Checks if a string is meant to be a standalone heading
export function checkHeading(str) {
  // Matches if it starts with '###'
  // OR starts with '**' and ends with one or more stars
  return /^###/m.test(str) || /^\*\*(.*)\*+$/m.test(str);
}


// THE MAIN PARSER: Handles Bold, Headers, Lists, and New Lines
export function formatGeminiResponse(text) {
  if (!text) return "";

  return text
    .trim()
    // 1. FIX for your specific issue: Handle **Sup?* or **Sup?**: 
    // This finds two stars at the start, text, and then one or two stars + optional colon.
    .replace(/^\*\*(.*?)\*+[:\s]*/gm, '<b class="block text-white text-[16px] mt-3">$1</b>')

    // 2. Handle standard inline bold: **word**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-100">$1</strong>')

    // 3. Handle Bullet Points: * Item
    .replace(/^\* (.*$)/gim, '<li class="ml-5 list-disc text-zinc-300 mb-1">$1</li>')

    // 4. Handle Headers: ### Title
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-zinc-100 mt-4 mb-2">$1</h3>')

    // 5. Convert New Lines to breaks
    .replace(/\n/g, '<br />');
}