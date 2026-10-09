/*
MIT License

Copyright (c) 2020-2025 Robert M Pavey and the wikitree-sourcer contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// No imports or requires allowed. See docs/dev_notes/extract_data_design

function cleanText(inputText) {
  let text = inputText;
  if (text) {
    text = text.trim();
    text = text.replace(/\s+/g, " ");
    text = text.replace(/\s([,;.])/g, "$1");
    text = text.replace(/\u2013/gu, "-"); // En dash
  }
  return text;
}

function getValueByHeading(parent, headingText) {
  const heading = [...parent.querySelectorAll("h3")].find((el) => el.textContent.trim() === headingText);

  return heading?.nextElementSibling?.textContent.trim() ?? "";
}

function extractData(document, url) {
  var result = {};
  result.success = false;

  if (url) {
    result.url = url;
  }

  result.deathDate = "";
  result.ageAtDeath = "";
  result.cemeteryFullAddress = "";
  result.memorialId = "";
  result.hasImage = false;

  const titleNode = document.querySelector("title");
  if (titleNode) {
    result.name = cleanText(titleNode.textContent.replace(/\s*\|\s*EverAfter$/, "").replace(/\s*\([^)]*\)/g, ""));
  }

  const memorialInfo = [...document.querySelectorAll("h2")].find(
    (el) => el.textContent.trim() === "Memorial Information"
  )?.parentElement;

  if (memorialInfo) {
    result.birthDate = getValueByHeading(memorialInfo, "Date of Birth");
    result.ageAtDeath = getValueByHeading(memorialInfo, "Age");
    result.deathDate = getValueByHeading(memorialInfo, "Date of Death");
  }

  result.success = true;
  return result;
}

// No exports allowed. See docs/dev_notes/extract_data_design
