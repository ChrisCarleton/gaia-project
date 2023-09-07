import { Mock } from 'moq.ts';

import { Player } from '../../../src';
import { EventType, Observer, ResourcesEventArgs } from '../../../src/events';

describe('Observer class', () => {
  let observer: Observer;

  beforeEach(() => {
    observer = new Observer();
  });

  it('will respond to publish requests if no listeners are subscribed', () => {
    const player = new Mock<Player>().object();
    const e: ResourcesEventArgs = {
      type: EventType.ResourcesGained,
      player,
      resources: {
        ore: 2,
      },
    };
    expect(() => observer.publish(e)).not.toThrowError();
  });
});
