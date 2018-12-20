import * as cheerio from "cheerio";
import * as request from "request-promise-native";

function fixText(text): string {
  return text
    .replace(/ hl\. /gi, " heiligen ")
    .replace(/\d\.\/\d\. /g, (val) => val.replace("/", " / "));
}

export async function getData(name: string): Promise<string> {
  const url = `https://www.vorname.com/name,${encodeURIComponent(name)}.html`;
  try {
    const body = await request(url, { timeout: 2000 });
    const $ = cheerio.load(body);
    const items = $(":contains('Mehr zur Namensbedeutung')").last().siblings()
      .map((i, elem) => $(elem).contents().map((j, e) => $(e).text().trim()).get()).get()
      .filter((elem) => !!elem);

    const text = items.join("\n").trim();
    const fixedText = fixText(text);

    if (text !== fixedText) {
      console.log(`${name} before fix: ${text}`);
      console.log(`${name} after fix: ${fixedText}`);
    }

    return fixedText;
  } catch (e) {
    return null;
  }
}
