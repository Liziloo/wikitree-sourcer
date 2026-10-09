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

import { GeneralizedData } from "../../../base/core/generalize_data_utils.mjs";
import { RT } from "../../../base/core/record_type.mjs";

function extractNicknames(name, nameObj) {
  if (!name) {
    return name;
  }

  // change non-standard "smart" quotes to quotes
  name = name.replace(/[“”]/g, '"');

  if (!name.includes('"')) {
    return name;
  }

  let didExtract = false;
  let startQuoteIndex = name.indexOf('"');
  if (startQuoteIndex != -1) {
    let endQuoteIndex = name.indexOf('"', startQuoteIndex + 1);
    if (endQuoteIndex != -1) {
      let nicknames = name.substring(startQuoteIndex + 1, endQuoteIndex);
      if (nicknames) {
        if (nameObj.nicknames) {
          nameObj.nicknames += " ";
          nameObj.nicknames += nicknames;
        } else {
          nameObj.nicknames = nicknames;
        }
      }
      name = name.substring(0, startQuoteIndex) + name.substring(endQuoteIndex + 1);
      didExtract = true;
    }
  }

  if (didExtract) {
    // call recursively in case there are multiple nicknames (not sure that this can ever happen)
    return extractNicknames(name, nameObj);
  }

  return name;
}

function setNames(ed, result) {
  let everafterName = ed.name;
  let fullName = everafterName;

  result.createNameIfNeeded();
  let nameObj = result.name;

  // Handle nicknames
  fullName = extractNicknames(fullName, nameObj);

  nameObj.setFullName(fullName);
}

function generalizeData(input) {
  let ed = input.extractedData;

  let result = new GeneralizedData();

  result.sourceOfData = "everafter";

  if (!ed.success) {
    return result; //the extract failed
  }

  result.sourceType = "record";

  result.recordType = RT.Memorial;

  result.setEventDate(ed.deathDate);
  result.setEventPlace(ed.cemeteryFullAddress);

  if (result.eventPlace) {
    result.eventPlace.streetAddress = ed.cemeteryName;
  }

  setNames(ed, result);

  result.setDeathDate(ed.deathDate);
  result.setDeathPlace(ed.deathPlace);

  if (ed.ageAtDeath) {
    result.ageAtDeath = ed.ageAtDeath;
  }

  result.setBirthDate(ed.birthDate);
  result.setBirthPlace(ed.birthPlace);

  result.hasValidData = true;

  return result;
}

export { generalizeData };
