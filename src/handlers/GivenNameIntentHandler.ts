import { HandlerInput } from "ask-sdk-core";
import { IntentRequest, Response } from "ask-sdk-model";
import { BaseIntentHandler, getData, Intents } from "../utils";

@Intents("GivenNameIntent")
export class GivenNameIntentHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const nameSlot = (handlerInput.requestEnvelope.request as IntentRequest).intent.slots.name;
    const name = nameSlot && nameSlot.value;
    if (!name) {
      return handlerInput.responseBuilder
        .speak("Ich habe dich nicht verstanden. Bitte nenne einen Vornamen.")
        .reprompt("Bitte nenne einen Vornamen.")
        .getResponse();
    }

    const data = await getData(name);
    if (!data) {
      return handlerInput.responseBuilder
        .speak(`Ich konnte die Bedeutung von ${name} nicht finden. Bitte nenne einen anderen Namen.`)
        .reprompt("Bitte nenne einen Vornamen.")
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(`Hier ist die Bedeutung von ${name}: ${data}`)
      .getResponse();
  }
}
