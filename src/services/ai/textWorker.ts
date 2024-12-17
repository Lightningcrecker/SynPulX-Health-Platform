import { HealthNLP } from '../nlp/HealthNLP';

const nlp = new HealthNLP();

self.onmessage = async (e) => {
  const { text } = e.data;
  await nlp.initialize();
  const result = await nlp.processText(text);
  self.postMessage(result);
};