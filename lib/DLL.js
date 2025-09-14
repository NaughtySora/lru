'use strict';

class SentinelCircularDLL {
  #head;
  #tail;
  #size = 0;

  constructor() {
    this.reset();
  }

  push(value) {
    const node = { value, prev: null, next: this.#tail };
    const tail = node.next = this.#tail;
    node.prev = tail.prev;
    tail.prev.next = node;
    tail.prev = node;
    this.#size++;
    return node;
  }

  pop() {
    if (this.#head === this.#head.next) return null;
    const node = this.#tail.prev;
    node.next.prev = node.prev;
    node.prev.next = node.next;
    this.#size--;
    node.next = null;
    node.prev = null;
    return node.value;
  }

  unshift(value) {
    const node = { value, prev: this.#head, next: null };
    const next = this.#head.next;
    node.next = next;
    this.#head.next = node;
    next.prev = node;
    this.#size++;
    return node;
  }

  shift() {
    if (this.#head === this.#head.next) return null;
    const node = this.#head.next;
    const next = node.next;
    this.#head.next = next;
    next.prev = this.#head;
    this.#size--;
    node.next = null;
    node.prev = null;
    return node.value;
  }

  before(node, value) {
    if (!this.#validAction(node)) return null;
    const prev = { value, prev: node.prev, next: node };
    node.prev.next = prev;
    node.prev = prev;
    this.#size++;
    return prev;
  }

  after(node, value) {
    if (!this.#validAction(node)) return null;
    const next = { value, prev: node, next: node.next };
    node.next.prev = next;
    node.next = next;
    this.#size++;
    return next;
  }

  delete(node) {
    if (!this.#validAction(node)) return false;
    const { next, prev } = node;
    prev.next = next;
    next.prev = prev;
    node.next = null;
    node.prev = null;
    this.#size--;
    return true;
  }

  search(value) {
    let node = this.#head.next;
    while (node !== this.#head) {
      if (node.value === value) return node;
      node = node.next;
    }
    return null;
  }

  forward(callback) {
    let node = this.#head.next;
    while (node !== this.#head) {
      callback(node.value);
      node = node.next;
    }
  }

  backward(callback) {
    let node = this.#head.prev;
    while (node !== this.#head) {
      callback(node.value);
      node = node.prev;
    }
  }

  makeFirst(node) {
    if (!this.#validAction(node)) return;
    if (this.#head.next === node) return;
    const next = node.next;
    const prev = node.prev;
    prev.next = next;
    next.prev = prev;
    const first = this.#head.next;
    first.prev = node;
    node.next = first;
    node.prev = this.#head;
    this.#head.next = node;
  }

  makeLast(node) {
    if (!this.#validAction(node)) return;
    if (this.#tail.prev === node) return;
    const next = node.next;
    const prev = node.prev;
    prev.next = next;
    next.prev = prev;
    const last = this.#tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.#tail;
    this.#tail.prev = node;
  }

  reset() {
    const sentinel = { prev: null, next: null, value: null };
    sentinel.prev = sentinel.next = sentinel;
    this.#head = this.#tail = sentinel;
    this.#size = 0;
  }

  #validAction(node) {
    if (this.#head === this.#head.next) return false;
    if (typeof node !== "object") return false;
    if (node.prev === null || node.next === null) return false;
    return true;
  }

  [Symbol.iterator]() {
    const head = this.#head;
    let slow = head.next;
    return {
      next() {
        if (slow === head) return { done: true };
        const data = { value: slow.value, done: false };
        slow = slow.next;
        return data;
      }
    }
  }

  get size() {
    return this.#size;
  }
}

module.exports = SentinelCircularDLL;
