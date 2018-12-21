import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.HelpIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should provide help message", async () => {
    const result: any = await alexa.utter("help");
    expect(result.response.outputSpeech.ssml).toContain("Du kannst nach der Bedeutung von Vornamen fragen");
    expect(result.response.shouldEndSession).toBe(false);
  });
});
