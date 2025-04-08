import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import type MarkdownIt from "markdown-it";
//import MarkdownItFootnote from "markdown-it-footnote";
import { include } from "@mdit/plugin-include";

const EMOJI_FAVICON = "🧮";


// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Actuarial Playground",
  style: "/layout-styles.css",
  globalStylesheets: [/*"https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"*/],

  //pages: [],
  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],
  head: ({path, title}) => 
    `<meta property="og:title" content=${JSON.stringify(title ?? "SITE_NAME")}>
  ${og_image(
    path
  )}<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${EMOJI_FAVICON}</text></svg>">
  <meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.css">
    `
  , // removes maximum-scale? , maximum-scale=1 to stop zoom?
  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: ``,// "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
   pager: false, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  // search: true, // activate search

  markdownIt: (md: MarkdownIt) => md/*.use(MarkdownItFootnote)*/.use(include, {
    currentPath: (env) => env.filePath,
    resolvePath: (path) => {
      if (path.startsWith("./src")) {
        return path.replace("./src", process.cwd() + "/src");
      }
      return path; // only handling specific cases that index.md uses
    }
    })

};

const HTTP_ROOT = "https://actuarialplayground.com/";


// from https://github.com/Fil/pangea/blob/main/observablehq.config.ts
// not being used TODO create a thumb for sharing?
function og_image(path) {
  try {
    // computes the same hash as framework 🌶
    const contents = readFileSync('thumb.png');
    const key = createHash("sha256").update(contents).digest("hex").slice(0, 8);
    const esc_img = JSON.stringify(`${HTTP_ROOT}_file/thumb.${key}.png`);
    return `<link href="/thumb.png">
<meta property="og:image" content=${esc_img} />
<meta property="twitter:image" content=${esc_img} />
`;
  } catch (error) {
    console.error(error)
    return "";
  }
}