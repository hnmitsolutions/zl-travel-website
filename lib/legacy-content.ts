import { readFileSync } from "node:fs";
import { join } from "node:path";

function rewriteLinks(html: string) {
  return html
    .replace(/href="index\.html([^"]*)"/g, 'href="/$1"')
    .replace(/href="(about|services|destinations|specials|faqs|blog|contact)\.html([^"]*)"/g, 'href="/$1$2"')
    .replace(/\sstyle=""/g, "");
}

export function legacyBody(fileName: string) {
  const source = readFileSync(join(process.cwd(), "legacy", fileName), "utf8");
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "";
  const withoutHeader = body.replace(/<header class="header">[\s\S]*?<\/header>/i, "");
  const withoutFooter = withoutHeader.replace(/<footer class="footer">[\s\S]*?<\/footer>/i, "");
  return rewriteLinks(
    withoutFooter
      .replace(/<button class="totop"[\s\S]*?<\/button>/i, "")
      .replace(/<div class="hero__scroll">[\s\S]*?<\/div>/i, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, ""),
  );
}

export function legacyHomeSections() {
  const html = legacyBody("index.html");
  const quizStart = html.indexOf('<section class="section bg-dark-1" id="quiz">');
  const dealsStart = html.indexOf('<section class="section bg-dark" id="deals">');
  const leadStart = html.indexOf('<section class="section bg-dark" id="contact">');
  const popupStart = html.indexOf('<div class="scroll-popup"');
  return {
    beforeQuiz: html.slice(0, quizStart),
    afterQuiz: html.slice(dealsStart, leadStart),
    leadSection: html.slice(leadStart, popupStart > leadStart ? popupStart : undefined),
  };
}
