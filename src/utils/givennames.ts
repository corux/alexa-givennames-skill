import axios from "axios";
import * as cheerio from "cheerio";

function fixText(text: string): string {
  return text
    .replace(/ hl\. /gi, " heiligen ")
    .replace(/\d+\.\/\d+\. /g, (val) => val.replace("/", " / "));
}

function fixTextFromJson(text: string): string {
  const strippedHtml = (cheerio.load(text) as any).text();
  let result = fixText(strippedHtml);
  const adIndex = result.toLowerCase().indexOf("erfahre hier mehr zu ");
  if (adIndex > 0) {
    result = result.substring(0, adIndex);
  }

  return result;
}

const cache: { [name: string]: string } = {};

export async function getData(name: string): Promise<string> {
  if (!cache[name]) {
    cache[name] = await retrieveData(name);
  }

  return cache[name];
}

async function retrieveData(name: string): Promise<string> {
  const url = `https://www.vorname.com/name,${encodeURIComponent(name)}.html`;
  try {
    const body = (await axios.get(url, { timeout: 4000 })).data;
    const $ = cheerio.load(body);

    const { text, meanings } = parseFromJson($) || parseFromText($);

    if (meanings && meanings.length) {
      let meaningText: string;
      if (meanings.length > 1) {
        meaningText = `Es gibt ${meanings.length} Bedeutungen für ${name}: ${meanings.slice(0, -1).join(", ")}
          oder ${meanings[meanings.length - 1]}.`;
      } else {
        meaningText = `Hier ist die Bedeutung von ${name}: ${meanings[0]}.`;
      }
      return `${meaningText} ${text}`;
    }

    return `Hier ist die Bedeutung von ${name}: ${text}`;
  } catch (e) {
    return null;
  }
}

function parseFromJson($: CheerioStatic): { text: string, meanings: string[] } {
  try {
    const json = JSON.parse($("script[type='application/ld+json']").get(0).children[0].data.replace(/\n/g, ""));
    const answerWas = json.mainEntity
      .find((question) => question.name.toLowerCase().indexOf("was bedeutet der name") !== -1)
      .acceptedAnswer.text;
    const answerWoher = json.mainEntity
      .find((question) => question.name.toLowerCase().indexOf("woher kommt der name") !== -1)
      .acceptedAnswer.text;

    const answer = `${fixTextFromJson(answerWas)} ${fixTextFromJson(answerWoher)}`.trim();
    return { text: answer, meanings: null };
  } catch (e) {
    return;
  }
}

function parseFromText($: CheerioStatic): { text: string, meanings: string[] } {
  try {
    const textElement = $(":contains('Mehr zur Namensbedeutung')").length
      ? $(":contains('Mehr zur Namensbedeutung'):not(script)")
      : $(":contains('Was bedeutet der Name'):not(script)");
    const text = fixText(textElement.last().nextUntil("h2, :has(h2)")
      .map((i, elem) => $(elem).contents().map((j, e) => $(e).text().trim()).get()).get()
      .filter((elem) => !!elem)
      .join("\n").trim());
    const meaningElement = $(":contains('Bedeutung / Übersetzung'):not(script)").length
      ? $(":contains('Bedeutung / Übersetzung'):not(script)")
      : $(":contains('Woher kommt der Name'):not(script)");
    const meanings = meaningElement.last().nextUntil("h2, :has(h2)").find("li").get()
      .map((elem) => $(elem).text().trim())
      .filter((elem) => !!elem);

    if (text || (meanings && meanings.length)) {
      return { text, meanings };
    }
  } catch (e) {
    return;
  }
}
