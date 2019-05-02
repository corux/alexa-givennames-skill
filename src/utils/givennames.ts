import axios from "axios";
import * as cheerio from "cheerio";

function fixText(text: string): string {
  return text
    .replace(/ hl\. /gi, " heiligen ")
    .replace(/\d+\.\/\d+\. /g, (val) => val.replace("/", " / "));
}

export async function getData(name: string): Promise<string> {
  const url = `https://www.vorname.com/name,${encodeURIComponent(name)}.html`;
  try {
    const body = (await axios.get(url, { timeout: 2000 })).data;
    const $ = cheerio.load(body);

    const text = fixText($(":contains('Mehr zur Namensbedeutung')").last().siblings()
      .map((i, elem) => $(elem).contents().map((j, e) => $(e).text().trim()).get()).get()
      .filter((elem) => !!elem)
      .join("\n").trim());
    const meanings = $(":contains('Bedeutung / Übersetzung')").last().siblings().find("li").get()
      .map((elem) => $(elem).text().trim())
      .filter((elem) => !!elem);

    if (meanings.length) {
      let meaningText: string;
      if (meanings.length > 1) {
        meaningText = `Es gibt ${meanings.length} Bedeutungen für ${name}: ${meanings.slice(0, -1).join(", ")}
          oder ${meanings[meanings.length - 1]}.`;
      } else {
        meaningText = `Die Bedeutung von ${name} ist: ${meanings[0]}.`;
      }
      return `${meaningText} ${text}`;
    }

    return `Hier ist die Bedeutung von ${name}: ${text}`;
  } catch (e) {
    return null;
  }
}
