import { LogInterceptor, SessionEndedHandler } from "@corux/ask-extensions";
import { SkillBuilders } from "ask-sdk-core";
import {
  AmazonHelpIntentHandler,
  AmazonStopIntentHandler,
  CustomErrorHandler,
  GivenNameIntentHandler,
  LaunchRequestHandler,
} from "./handlers";

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    new AmazonStopIntentHandler(),
    new AmazonHelpIntentHandler(),
    new SessionEndedHandler(),
    new GivenNameIntentHandler(),
    new LaunchRequestHandler(),
  )
  .addErrorHandlers(
    new CustomErrorHandler(),
  )
  .addRequestInterceptors(
    new LogInterceptor(),
  )
  .addResponseInterceptors(
    new LogInterceptor(),
  )
  .lambda();
