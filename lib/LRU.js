'use strict';

const DLL = require('./DLL.js');

function* take(seq, key) {
  for (const item of seq) {
    yield item.value[key];
  }
}

class LRU {
  #max = 0;
  #store = new Map();
  #list = new DLL();

  constructor(size) {
    this.resize(size);
  }

  set(key, value) {
    const node = this.#store.get(key);
    if (node !== undefined) {
      node.value.value = value;
      this.#list.makeFirst(node);
    } else {
      if (this.size === this.#max) {
        this.#store.delete(this.#list.pop().key);
      }
      this.#store.set(key, this.#list.unshift({ key, value }));
    }
  }

  get(key) {
    const node = this.#store.get(key);
    if (node === undefined) return null;
    this.#list.makeFirst(node);
    return node.value.value;
  }

  clear() {
    this.#list.reset();
    this.#store.clear();
    this.#max = 0;
  }

  delete(key) {
    const node = this.#store.get(key);
    if (node === undefined) return false;
    this.#list.delete(node);
    this.#store.delete(key);
    return true;
  }

  has(key) {
    return this.#store.has(key);
  }

  peek(key) {
    const node = this.#store.get(key);
    if (node === undefined) return null;
    return node.value.value;
  }

  resize(size) {
    if ((size | 0) < 0) return this;
    this.#max = size;
    while (this.size > this.#max) {
      this.#store.delete(this.#list.pop().key);
    }
    return this;
  }

  evict(count = 1) {
    while (count-- !== 0 || this.#store.size === 0) {
      this.#store.delete(this.#list.pop().key);
    }
  }

  keys() {
    return this.#store.keys();
  }

  values() {
    return take(this.#store.values(), 'value');
  }

  entries() {
    return this;
  }

  [Symbol.iterator]() {
    const entries = this.#store.entries();
    return {
      next() {
        const next = entries.next();
        if (next.done) return { done: true };
        return {
          value: [next.value[0], next.value[1].value.value],
          done: next.done,
        };
      }
    }
  }

  get size() {
    return this.#store.size;
  }

  get max() {
    return this.#max;
  }
}

module.exports = LRU;
