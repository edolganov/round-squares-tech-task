export class SingleTimeout {
  public timeout;
  private timerId: any;

  constructor(timeout?: number) {
    this.timeout = timeout;
  }

  public setTimeout(task: () => void, newTimeout?: number) {
    // cancel old timer
    this.clearTimeout();

    if (newTimeout !== undefined) {
      this.timeout = newTimeout;
    }

    // create new one
    this.timerId = setTimeout(task, this.timeout || 0);
  }

  public clearTimeout() {
    clearTimeout(this.timerId);
  }
}
