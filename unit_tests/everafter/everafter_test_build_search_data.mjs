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

import { buildSearchData } from "../../extension/site/everafter/core/everafter_build_search_data.mjs";
import { runBuildSearchDataTests } from "../test_utils/test_build_search_utils.mjs";

const regressionData = [
  {
    // has no country but has cemetery name
    caseName: "eddie_smith_d_1858",
    inputPath: "everafter/generalized_data/ref/eddie_smith_d_1858",
  },
  {
    // has country and cemetery name
    caseName: "helen_hupp_d_1996",
    inputPath: "fg/generalized_data/ref/helen_hupp_d_1996",
  },
  {
    // has country but no cemetery name
    caseName: "frederick_dalrymple-hamilton_d_1974",
    inputPath: "fg/generalized_data/ref/frederick_dalrymple-hamilton_d_1974",
  },
  {
    // has cemetery name but no birth or death place
    caseName: "john_jack_smith_d_1938",
    inputPath: "fg/generalized_data/ref/john_jack_smith_d_1938",
  },
];

async function runTests(testManager) {
  await runBuildSearchDataTests("everafter", buildSearchData, regressionData, testManager);
}

export { runTests };
