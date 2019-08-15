import { BaseRequestHandler, IExtendedHandlerInput, Intents } from "@corux/ask-extensions";
import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { getData } from "../utils";

@Intents("GivenNameIntent")
export class GivenNameIntentHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const nameSlot = (handlerInput.requestEnvelope.request as IntentRequest).intent.slots.name;
    const name = nameSlot && nameSlot.value;
    if (!name) {
      return handlerInput.getResponseBuilder()
        .speak("Ich habe dich nicht verstanden. Bitte nenne einen Vornamen.")
        .reprompt("Bitte nenne einen Vornamen.")
        .getResponse();
    }

    const data = await getData(name);
    if (!data) {
      return handlerInput.getResponseBuilder()
        .speak(`Ich konnte die Bedeutung von ${name} nicht finden. Bitte nenne einen anderen Namen.`)
        .reprompt("Bitte nenne einen Vornamen.")
        .getResponse();
    }

    return handlerInput.getResponseBuilder()
      .speak(data)
      .getResponse();
  }
}
