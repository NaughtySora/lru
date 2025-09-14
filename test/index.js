'use strict';

const LRU = require('../lib/LRU.js');
const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('LRU', () => {
  it('should insert/retrieve', () => {
    const lru = new LRU(3);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    assert.strictEqual(lru.get('a'), 1);
    assert.strictEqual(lru.get('b'), 2);
    assert.strictEqual(lru.get('c'), 3);
  });

  it('remove least recently used when limit reached', () => {
    const lru = new LRU(2);
    lru.set('x', 10);
    lru.set('y', 20);
    assert.strictEqual(lru.get('x'), 10);
    assert.strictEqual(lru.get('y'), 20);
    lru.set('z', 30);
    assert.strictEqual(lru.get('x'), null);
    assert.strictEqual(lru.get('y'), 20);
    assert.strictEqual(lru.get('z'), 30);
  });

  it('update key, move to the head', () => {
    const lru = new LRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('a', 10);
    lru.set('c', 3);
    assert.strictEqual(lru.get('b'), null);
    assert.strictEqual(lru.get('a'), 10);
    assert.strictEqual(lru.get('c'), 3);
  });

  it('repeated access', () => {
    const lru = new LRU(3);
    lru.set('p', 1);
    lru.set('q', 2);
    lru.set('r', 3);
    lru.get('p');
    lru.set('s', 4);
    assert.strictEqual(lru.get('q'), null);
    assert.strictEqual(lru.get('p'), 1);
    assert.strictEqual(lru.get('r'), 3);
    assert.strictEqual(lru.get('s'), 4);
  });

  it('null for missing keys', () => {
    const lru = new LRU(2);
    assert.strictEqual(lru.get('missing'), null);
    lru.set('a', 1);
    assert.strictEqual(lru.get('b'), null);
  });

  it('single-element', () => {
    const lru = new LRU(1);
    lru.set('a', 100);
    assert.strictEqual(lru.get('a'), 100);
    lru.set('b', 200);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), 200);
  });

  it('correct order after multiple insertions and accesses', () => {
    const lru = new LRU(3);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    lru.get('b');
    lru.set('d', 4);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), 2);
    assert.strictEqual(lru.get('c'), 3);
    assert.strictEqual(lru.get('d'), 4);
  });

  it('peek should return value without changing cache', () => {
    const lru = new LRU(3);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    assert.strictEqual(lru.peek('b'), 2);
    lru.set('d', 4);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), 2);
  });

  it('should check existence without moving cache', () => {
    const lru = new LRU(2);
    lru.set('x', 10);
    lru.set('y', 20);
    assert.strictEqual(lru.has('x'), true);
    assert.strictEqual(lru.has('y'), true);
    assert.strictEqual(lru.has('z'), false);
    lru.set('z', 30);
    assert.strictEqual(lru.has('x'), false);
    assert.strictEqual(lru.has('y'), true);
    assert.strictEqual(lru.has('z'), true);
  });

  it('delete should remove a key', () => {
    const lru = new LRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    assert.strictEqual(lru.delete('a'), true);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.delete('x'), false);
  });

  it('clear should remove all entries', () => {
    const lru = new LRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.clear();
    assert.strictEqual(lru.size, 0);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), null);
  });

  it('resize should adjust max capacity and remove rest of the items', () => {
    const lru = new LRU(3);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    lru.resize(2);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), 2);
    assert.strictEqual(lru.get('c'), 3);
  });

  it('evict should remove the correct number of items', () => {
    const lru = new LRU(5);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    lru.set('d', 4);
    lru.evict(2);
    assert.strictEqual(lru.get('a'), null);
    assert.strictEqual(lru.get('b'), null);
    assert.strictEqual(lru.get('c'), 3);
    assert.strictEqual(lru.get('d'), 4);
  });

  it('keys', () => {
    const cache = new LRU(5);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    assert.deepStrictEqual([...cache.keys()], ['a', 'b', 'c', 'd']);
  });

  it('values', () => {
    const cache = new LRU(5);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    assert.deepStrictEqual([...cache.values()], [1, 2, 3, 4]);
  });

  it('entries', () => {
    const cache = new LRU(5);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    assert.deepStrictEqual(
      [...cache.entries()],
      [['a', 1,], ['b', 2], ['c', 3], ['d', 4]]
    );
  });

  it('iterator', () => {
    const cache = new LRU(5);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    assert.deepStrictEqual([...cache], [['a', 1,], ['b', 2], ['c', 3], ['d', 4]]);
  });
});
