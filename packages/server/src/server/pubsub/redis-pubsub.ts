import { PubSubEngine } from './interfaces';

export class RedisPubSub implements PubSubEngine {
  publish<T>(payload: T): Promise<void> {
    throw new Error('Method not implemented.');
  }
  subscribe<T>(onMessage: (data: T) => void): Promise<number> {
    throw new Error('Method not implemented.');
  }
  unsubscribe(subId: number): void {
    throw new Error('Method not implemented.');
  }
  asyncIterator<T>(): AsyncIterable<T> {
    throw new Error('Method not implemented.');
  }
}
