import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, Intents } from "../utils";

@Intents("AMAZON.HelpIntent")
export class AmazonHelpIntentHandler extends BaseIntentHandler {
  public handle(handlerInput: HandlerInput): Response {
    return handlerInput.responseBuilder
      .speak("Du kannst nach der Bedeutung von Vornamen fragen. Nenne dazu den gewünschten Vornamen.")
      .reprompt("Bitte nenne einen Vornamen.")
      .getResponse();
  }
}
