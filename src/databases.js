import Josh from '@joshdb/core';
import provider from '@joshdb/sqlite';

export const markov = new Josh({
  name: 'MarkovDB',
  provider,
});

export const lastfm = new Josh({
  name: 'lastfm',
  provider,
});
