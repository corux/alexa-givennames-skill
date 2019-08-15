import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseRequestHandler {
  public handle(handlerInput: IExtendedHandlerInput): Response {
    return handlerInput.getResponseBuilder()
      .speak("Du kannst nach der Bedeutung von Vornamen fragen. Nenne dazu den gewünschten Vornamen.")
      .reprompt("Bitte nenne einen Vornamen.")
      .getResponse();
  }
}
