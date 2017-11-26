import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import cheerio from 'cheerio';
import request from 'request-promise-native';

@Skill
export default class AlexaGivenNamesSkill {

  _fixText(text) {
    return text
      .replace(/ hl\. /gi, ' heiligen ')
      .replace(/\d\.\/\d\. /g, val => val.replace('/', ' / '));
  }

  async _getData(name) {
    const url = `https://www.vorname.com/name,${encodeURIComponent(name)}.html`;
    try {
      const body = await request(url);
      const $ = cheerio.load(body);
      const items = $(':contains("Mehr zur Namensbedeutung")').last().siblings()
        .map((i, elem) => $(elem).text()).get();

      const text = items.join('\n').trim();
      const fixedText = this._fixText(text);

      if (text !== fixedText) {
        console.log(`${name} before fix: ${text}`);
        console.log(`${name} after fix: ${fixedText}`);
      }

      return fixedText;
    } catch(e) {
      return null;
    }
  }

  @Launch
  launch() {
    return ask('Nenne einen Vornamen um dessen Bedeutung zu hören.');
  }

  @Intent('GivenNameIntent')
  async givenNameIntent({ name }) {
    if (!name) {
      return ask('Bitte nenne einen Vornamen.');
    }

    const data = await this._getData(name);
    if (!data) {
      return ask(`Ich konnte die Bedeutung von ${name} nicht finden. Bitte nenne einen anderen Namen.`);
    }

    return say(`Hier ist die Bedeutung von ${name}: ${data}`);
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('Du kannst nach der Bedeutung von Vornamen fragen. Nenne dazu den gewünschten Vornamen.');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Bis bald!');
  }

  @SessionEnded
  sessionEnded() {
    // need to handle session ended event to circumvent error
    return {};
  }

}
