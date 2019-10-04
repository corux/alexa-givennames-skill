import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("GivenNameIntent", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
  });

  it("should reprompt, if no slot value was given", async () => {
    const result: any = await alexa.utter("was bedeutet");
    expect(result.response.outputSpeech.ssml).toContain("Ich habe dich nicht verstanden");
    expect(result.response.shouldEndSession).toBe(false);
  });

  it("should reprompt, if a name was not found", async () => {
    const result: any = await alexa.utter("was bedeutet käsekuchen");
    expect(result.response.outputSpeech.ssml).toContain("Ich konnte die Bedeutung von käsekuchen nicht finden.");
    expect(result.response.shouldEndSession).toBe(false);
  });

  it("should answer with meaning of name", async () => {
    const result: any = await alexa.utter("was bedeutet elias");
    expect(result.response.outputSpeech.ssml).toContain("mein Gott ist Jahwe");
  });

  xit("should provide answer with HTML tags divided by newline", async () => {
    const result: any = await alexa.utter("was bedeutet Sofia");
    expect(result.response.outputSpeech.ssml).toContain("3. Jh.\nIn");
  });

  it("should find meaning for names with Umlaut", async () => {
    const result: any = await alexa.utter("was bedeutet Jürgen");
    expect(result.response.outputSpeech.ssml).toContain("Hier ist die Bedeutung von Jürgen");
  });

  it("should fix speak output for years", async () => {
    const result: any = await alexa.utter("was bedeutet Bernhard");
    expect(result.response.outputSpeech.ssml).toContain("(11. / 12. Jh.)");
  });
});
