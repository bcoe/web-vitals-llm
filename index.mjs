import {GoogleGenAI, createUserContent, createPartFromUri} from '@google/genai';
import path from 'node:path';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const html1 = await ai.files.upload({
  file: path.join('./llm-data/cls/ad-push-content', "0.html"),
  config: { mimeType: "text/html" },
});
console.log("Uploaded file:", html1);
const html2 = await ai.files.upload({
  file: path.join('./llm-data/cls/ad-push-content', "1.html"),
  config: { mimeType: "text/html" },
});
console.log("Uploaded file:", html2);
const html3 = await ai.files.upload({
  file: path.join('./llm-data/cls/ad-push-content', "2.html"),
  config: { mimeType: "text/html" },
});
console.log("Uploaded file:", html3);

const result = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    createPartFromUri(html1.uri, html1.mimeType),
    createPartFromUri(html2.uri, html1.mimeType),
    createPartFromUri(html3.uri, html1.mimeType),
    "\n\n",
    `Comparing the differences between ${html1.name}, ${html2.name}, and ${html3.name}, which element added after the initial page load most likley resulted in a high CLS score?
    Ignore elements that have no content below them in the document.`,
  ]),
  config: {systemInstruction: `You are a web crawler that traverses the Internet analyzing the Web Vitals
performance of web pages.

When landing on a page you save multiple HTML files, each representing changes that occur during the pages load cycle.

By comparing the differences in these pages you can determine the root cause of poor Web Vitals measurements, such as CLS and LCP.`},
});

console.log("result.text=", result.text);
