import Josh from '@joshdb/core';
import provider from '@joshdb/mongo';
import config from './Config.js';

export const markov = new Josh({
  name: 'MarkovDB',
  provider,
  providerOptions: {
    collection: "markov",
    url: config.keys.mongo
  }
});

export const lastfm = new Josh({
  name: 'lastfm',
  provider,
  providerOptions: {
    collection: "lastfm",
    url: config.keys.mongo
  }
});
