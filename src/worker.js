importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd");

let model;
cocoSsd.load().then((loadedModel) => {
  model = loadedModel;
  postMessage({ loaded: true });
});

onmessage = async (event) => {
  const { imageData } = event.data;
  const img = tf.browser.fromPixels(imageData, 3);

  const predictions = await model.detect(img);
  img.dispose();

  postMessage({ predictions });
};
