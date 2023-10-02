import { Message } from '@gaia-project/api';
import { EventEmitter } from 'events';

import { PubSubService } from './interfaces';

function nextTick(): Promise<void> {
  return new Promise((resolve) => process.nextTick(resolve));
}

// TODO: How to do I subscribe to the shared message stream?

export class RedisPubSubService implements PubSubService {
  private readonly events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  async send(message: Message): Promise<void> {
    await nextTick();
  }

  async on(e: 'message', cb: (msg: Message) => void): Promise<void> {
    await nextTick();
    // TODO: Publish event to all subscribers.
  }

  async close(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
