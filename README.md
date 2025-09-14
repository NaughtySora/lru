# LRU Cache

```js
  const lru = new LRU(3);
  lru.set('a', 1);
  lru.set('b', 2);
  lru.set('c', 3);

  const c = lru.get('c');
```