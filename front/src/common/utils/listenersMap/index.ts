export type Event = {
  key: string;
  data: any[];
};

export type TypedKeyEvent<T> = {
  key: T;
  data: any[];
};

export type EventListener = (event: Event) => void;

export class ListenersMap<T> {
  private keyListeners = new Map<string, EventListener[]>();
  private fnKeys = new Map<EventListener, string[]>();
  private globalListeners: EventListener[] = [];

  public getListeners(key: T): EventListener[] {
    return [
      ...this.globalListeners,
      ...(this.keyListeners.get(key as any) || []),
    ];
  }

  public getListenerKeys(listener: EventListener): string[] {
    return [...(this.fnKeys.get(listener) || [])];
  }

  public addGlobalListener(listener: EventListener) {
    // skip duplicates
    if (!this.isGlobalListener(listener)) {
      this.globalListeners.push(listener);

      // clear old key links, because now listener became global
      this.getListenerKeys(listener).forEach((key) => {
        this.removeListenerForKey(key as any, listener);
      });
    }
  }

  public isGlobalListener(listener: EventListener) {
    return this.globalListeners.find((l) => l === listener);
  }

  public addListener(key: string, listener: EventListener) {
    // skip duplicate from global
    if (this.isGlobalListener(listener)) {
      return;
    }

    let list = this.keyListeners.get(key);

    // skip duplicate
    if (list && list.find((l) => l === listener)) {
      return;
    }
    if (!list) {
      list = [];
      this.keyListeners.set(key, list);
    }

    list.push(listener);

    let keys = this.fnKeys.get(listener);
    if (!keys) {
      keys = [];
      this.fnKeys.set(listener, keys);
    }

    if (!keys.find((k) => k === key)) {
      keys.push(key);
    }
  }

  public removeGlobalListener(listener: EventListener) {
    this.globalListeners = this.globalListeners.filter((l) => l !== listener);
  }

  public removeListener(listener: EventListener) {
    this.removeGlobalListener(listener);

    const keys = this.fnKeys.get(listener) || [];
    keys.forEach((key) => {
      this.removeListenerForKey(key as any, listener);
    });
  }

  public removeListenerForKey(key: T, listener: EventListener) {
    let list = this.keyListeners.get(key as any);
    if (list) {
      list = list.filter((l) => l !== listener);
      if (list.length > 0) {
        this.keyListeners.set(key as any, list);
      } else {
        this.keyListeners.delete(key as any);
      }
    }

    let keys = this.fnKeys.get(listener);
    if (keys) {
      keys = keys.filter((k) => k !== (key as any));
      if (keys.length > 0) {
        this.fnKeys.set(listener, keys);
      } else {
        this.fnKeys.delete(listener);
      }
    }
  }

  public removeListeners(key: T) {
    const listeners = this.keyListeners.get(key as any) || [];
    listeners.forEach((listener) => {
      this.removeListenerForKey(key, listener);
    });
  }

  public removeAllListeners() {
    this.globalListeners = [];
    this.keyListeners.clear();
    this.fnKeys.clear();
  }

  public fireEvent(key: T, ...args: any[]) {
    const event = ListenersMap.makeEvent(key, ...args);
    this.getListeners(key).forEach((l) => l(event));
  }

  public static makeEvent(key: any, ...args: any[]): Event {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      key: key,
      data: args,
    };
  }
}
