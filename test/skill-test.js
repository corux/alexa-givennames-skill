import test from 'ava';
import { handler as Skill } from '../build/skill';
import Request from 'alexa-request';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

test('LaunchRequest', async () => {
  const event = Request.launchRequest().build();

  const response = await Skill(event);
  expect(response.response.outputSpeech.text).to.contain('Vorname');
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false,
      outputSpeech: { type: 'PlainText' }
    }
  });
});

test('AMAZON.StopIntent', async () => {
  const event = Request.intent('AMAZON.StopIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('AMAZON.CancelIntent', async () => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Bis bald!' }
    }
  });
});

test('Name', async () => {
  const event = Request.intent('GivenNameIntent', { name: 'Elias' }).build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: true
    }
  });
  expect(response.response.outputSpeech.text).to.contain('Griechische Form von Elijah');
});

test('Invalid Name', async () => {
  const event = Request.intent('GivenNameIntent', { name: 'InvalidName' }).build();

  const response = await Skill(event);
  expect(response).to.containSubset({
    response: {
      shouldEndSession: false
    }
  });
  expect(response.response.outputSpeech.text).to.contain('Bitte nenne einen anderen Namen');
});

test('SessionEndedRequest', async () => {
  const event = Request.sessionEndedRequest().build();
  const response = await Skill(event);
  expect(response).to.deep.equal({});
});
