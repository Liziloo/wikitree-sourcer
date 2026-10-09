/*
MIT License

Copyright (c) 2020 Robert M Pavey

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

import { simpleBuildCitationWrapper } from "../../../base/core/citation_builder.mjs";

function buildCoreCitation(data, gd, builder) {
  let options = builder.getOptions();
  let target = options.citation_general_target;

  builder.sourceTitle = "EverAfter";

  if (target == "wikitree") {
    builder.recordLinkOrTemplate = data.url ? "[" + data.url + " EverAfter Memorial]" : "";
  } else if (data.url) {
    builder.recordLinkOrTemplate = "EverAfter Memorial: " + data.url;
  }

  let dataString = "Memorial page for " + data.name;

  if (data.deathDate && data.birthDate) {
    dataString += " (" + data.birthDate + "-" + data.deathDate + ")";
  } else if (data.deathDate) {
    dataString += " (d. " + data.deathDate + ")";
  }

  if (data.cemeteryName && data.cemeteryFullAddress) {
    dataString += ", citing " + data.cemeteryName + ", " + data.cemeteryCity + ", " + data.cemeteryState;
  }

  dataString += ".";

  builder.dataString = dataString;
}

function buildCitation(input) {
  return simpleBuildCitationWrapper(input, buildCoreCitation);
}

export { buildCitation };
