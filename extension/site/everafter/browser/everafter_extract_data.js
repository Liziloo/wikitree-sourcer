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

// Returns a heading's value, or null if missing, empty, or "Unknown".
function getValueByHeading(parent, headingText) {
  const heading = [...parent.querySelectorAll("h3")].find((el) => el.textContent.trim() === headingText);

  const value = heading?.nextElementSibling?.textContent.trim();

  if (!value || value === "Unknown") {
    return null;
  }

  return value;
}

// Assigns a heading's value to the result only if it is meaningful.
function setValueByHeading(result, parent, headingText, fieldName) {
  const value = getValueByHeading(parent, headingText);

  if (value !== null) {
    result[fieldName] = value;
  }
}

// Extracts cemetery info such as address
function extractCemeteryInfo(result, document) {
  const heading = [...document.querySelectorAll("h3")].find((el) => el.textContent.trim() === "Location");

  const location = heading?.parentElement;

  if (!location) return;

  const plot = location.querySelector("div.mt-sm.text-base.lh-base span");
  if (plot?.textContent.trim()) {
    result.plot = cleanText(plot.textContent);
  }

  const cemeteryLink = location.querySelector('a[href*="/cemetery/"]');
  if (cemeteryLink?.textContent.trim()) {
    result.cemeteryName = cleanText(cemeteryLink.textContent);
  }

  const addressDivs = location.querySelectorAll('a[href*="/cemetery/"] + div > div');

  if (addressDivs.length) {
    const addressLines = [...addressDivs].map((div) => cleanText(div.textContent)).filter(Boolean);

    if (addressLines.length) {
      result.cemeteryFullAddress = addressLines.join(", ").replace(/, (\d{4,})$/, " $1");
    }

    // Extract city and state for US addresses.
    const locality = addressLines[1] ?? "";
    const match = locality.match(/^(.+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);

    if (match) {
      result.cemeteryCity = cleanText(match[1]);
      result.cemeteryState = match[2];
    }
  }
}

function extractData(document, url) {
  var result = {};
  result.success = false;

  if (url) {
    result.url = url;
  }

  // check to see if there is an image
  result.hasImage = /plotImages\.push\(/.test(document.documentElement.innerHTML);

  const memorialId = url.match(/\/(\d+)\/?$/);

  if (memorialId) {
    result.memorialId = memorialId[1];
  }

  const titleNode = document.querySelector("title");
  if (titleNode) {
    result.name = cleanText(titleNode.textContent.replace(/\s*\|\s*EverAfter$/, "").replace(/\s*\([^)]*\)/g, ""));
  }

  const memorialInfo = [...document.querySelectorAll("h2")].find(
    (el) => el.textContent.trim() === "Memorial Information"
  )?.parentElement;

  if (memorialInfo) {
    setValueByHeading(result, memorialInfo, "Date of Birth", "birthDate");
    setValueByHeading(result, memorialInfo, "Age", "ageAtDeath");
    setValueByHeading(result, memorialInfo, "Date of Death", "deathDate");
  }

  extractCemeteryInfo(result, document);

  result.success = true;
  return result;
}

// No exports allowed. See docs/dev_notes/extract_data_design
