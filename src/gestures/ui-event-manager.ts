import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { Platform, EventListenerOptions } from '../platform/platform';


/**
 * @private
 */
export class UIEventManager {
  private evts: Function[] = [];

  constructor(public platform: Platform) {}

  pointerEvents(config: PointerEventsConfig): PointerEvents {
    if (!config.element || !config.pointerDown) {
      console.error('PointerEvents config is invalid');
      return;
    }

    const eventListnerOpts: EventListenerOptions = {
      capture: config.capture,
      passive: config.passive,
      zone: config.zone
    };

    const pointerEvents = new PointerEvents(
      this.platform,
      config.element,
      config.pointerDown,
      config.pointerMove,
      config.pointerUp,
      eventListnerOpts);

    const removeFunc = () => pointerEvents.destroy();
    this.evts.push(removeFunc);
    return pointerEvents;
  }

  listen(ele: any, eventName: string, callback: any, opts: EventListenerOptions): Function {
    if (ele) {
      var removeFunc = this.platform.addListener(ele, eventName, callback, opts);
      this.evts.push(removeFunc);
      return removeFunc;
    }
  }

  destroy() {
    this.evts.forEach(unRegEvent => {
      unRegEvent();
    });
    this.evts.length = 0;
  }
}