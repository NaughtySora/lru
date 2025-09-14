
export class LRU {
  constructor(size: number);
  set(key: any, value: any): void;
  get(key: any): null | any;
  clear(): void;
  delete(key: any): boolean;
  has(key: any): boolean;
  peek(key: any): null | any;
  resize(size: number): this;
  evict(count?: number): void;
  keys(): Iterator<any>;
  values(): Iterator<any>;
  entries(): this;
  [Symbol.iterator](): Iterator<any, any>;
  size: number;
  max: number;
}
