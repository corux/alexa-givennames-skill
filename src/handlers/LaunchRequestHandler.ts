import { BaseRequestHandler, IExtendedHandlerInput, Request } from "@corux/ask-extensions";
import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

@Request("LaunchRequest")
export class LaunchRequestHandler extends BaseRequestHandler {
  public canHandle(handlerInput: HandlerInput): boolean {
    const session = handlerInput.requestEnvelope.session;
    return super.canHandle(handlerInput) || (session && session.new);
  }

  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    return handlerInput.getResponseBuilder()
      .speak("Nenne einen Vornamen um dessen Bedeutung zu hören")
      .reprompt("Bitte nenne einen Vornamen.")
      .getResponse();
  }
}
