export interface PubSubEngine {
  publish<T>(payload: T): Promise<void>;
  subscribe<T>(onMessage: (data: T) => void): Promise<number>;
  unsubscribe(subId: number): void;
  asyncIterator<T>(): AsyncIterable<T>;
}
