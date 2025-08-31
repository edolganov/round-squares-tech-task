export interface TxListener {
  onStart?: () => Promise<void>;
  onEnd?: () => Promise<void>;
}

export function txWrap<T, O>(handler: (tx: T) => O, txListner?: TxListener): (tx: T) => Promise<O> {
  return async (tx: T) => {
    await txListner?.onStart?.();

    const out = await handler(tx);

    await txListner?.onEnd?.();

    return out;
  };
}
