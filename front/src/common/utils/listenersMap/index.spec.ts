/* eslint-disable */

import { Event, ListenersMap } from './index';

describe('ListenersMap', () => {
  const key1 = 'key1';
  const key2 = 'key2';
  const fn1 = () => {
    /**/
  };
  const fn2 = () => {
    /**/
  };
  const fn3 = () => {
    /**/
  };
  const globalFn = () => {
    /**/
  };

  describe('fireEvent', () => {
    test('should call every listener', () => {
      let calls: any[] = [];

      const fn1 = ({ key, data }: Event) => {
        calls.push('fn1');
        calls.push(key);
        if (data.length > 0) {
          calls.push([...data]);
        }
      };
      const fn2 = ({ key, data }: Event) => {
        calls.push('fn2');
        calls.push(key);
        if (data.length > 0) {
          calls.push([...data]);
        }
      };
      const globalFn = ({ key, data }: Event) => {
        calls.push('globalFn');
        calls.push(key);
        if (data.length > 0) {
          calls.push([...data]);
        }
      };

      const map = new ListenersMap();
      map.addListener(key1, fn1);
      map.addListener(key1, fn2);
      map.addListener(key2, fn1);
      map.addGlobalListener(globalFn);

      calls = [];
      map.fireEvent(key1);
      expect(calls).toEqual(['globalFn', key1, 'fn1', key1, 'fn2', key1]);

      calls = [];
      map.fireEvent(key1, 1, '2');
      expect(calls).toEqual([
        'globalFn',
        key1,
        [1, '2'],
        'fn1',
        key1,
        [1, '2'],
        'fn2',
        key1,
        [1, '2'],
      ]);

      calls = [];
      map.fireEvent(key2);
      expect(calls).toEqual(['globalFn', key2, 'fn1', key2]);
    });
  });

  describe('getListeners', () => {
    test('should return new collection', () => {
      const map = new ListenersMap();
      map.addListener(key1, fn1);
      map.addGlobalListener(globalFn);

      map.getListeners(key1).push(fn2);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
    });
  });

  describe('getListenerKeys', () => {
    test('should return new collection', () => {
      const map = new ListenersMap();
      map.addListener(key1, fn1);
      map.addGlobalListener(globalFn);

      map.getListenerKeys(fn1).push(key2);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
    });
  });

  describe('addListener', () => {
    test('should add by key with no duplicates', () => {
      const map = new ListenersMap();
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);

      map.addGlobalListener(globalFn);
      map.addListener(key1, fn1);
      map.addListener(key1, fn1);
      map.addListener(key1, fn2);
      map.addGlobalListener(globalFn);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1, fn2]);
      expect(map.getListeners(key2)).toEqual([globalFn]);

      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key1]);
    });

    test('should support multi keys', () => {
      const map = new ListenersMap();
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);

      map.addListener(key1, fn1);
      map.addListener(key2, fn1);

      expect(map.getListeners(key1)).toEqual([fn1]);
      expect(map.getListenerKeys(fn1)).toEqual([key1, key2]);
    });

    test('should skip keys for global', () => {
      const map = new ListenersMap();
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);

      map.addListener(key1, fn1);
      map.addListener(key2, fn1);
      map.addGlobalListener(fn1);
      map.addGlobalListener(fn1);

      expect(map.getListeners(key1)).toEqual([fn1]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
    });
  });

  describe('removeListenerForKey', () => {
    test('should remove by function', () => {
      const map = new ListenersMap();

      map.addListener(key1, fn1);
      map.addListener(key1, fn2);
      expect(map.getListeners(key1)).toEqual([fn1, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key1]);

      map.removeListenerForKey(key1, fn3);
      expect(map.getListeners(key1)).toEqual([fn1, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key1]);

      map.removeListenerForKey(key2, fn1);
      expect(map.getListeners(key1)).toEqual([fn1, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key1]);

      map.removeListenerForKey(key1, fn1);
      expect(map.getListeners(key1)).toEqual([fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([key1]);

      map.removeListenerForKey(key1, fn2);
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([]);
    });
  });

  describe('removeListener', () => {
    test('should remove by keys', () => {
      const map = new ListenersMap();

      map.addListener(key1, fn1);
      map.addListener(key2, fn2);
      map.addGlobalListener(globalFn);
      map.addListener(key2, fn1);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1]);
      expect(map.getListeners(key2)).toEqual([globalFn, fn2, fn1]);
      expect(map.getListenerKeys(fn1)).toEqual([key1, key2]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeListener(fn1);
      expect(map.getListeners(key1)).toEqual([globalFn]);
      expect(map.getListeners(key2)).toEqual([globalFn, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeGlobalListener(globalFn);
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListeners(key2)).toEqual([fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeListener(fn2);
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListeners(key2)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([]);
    });
  });

  describe('removeListeners', () => {
    test('should remove by key', () => {
      const map = new ListenersMap();

      map.addGlobalListener(globalFn);
      map.addListener(key1, fn1);
      map.addListener(key2, fn2);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1]);
      expect(map.getListeners(key2)).toEqual([globalFn, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeListeners(key1);
      expect(map.getListeners(key1)).toEqual([globalFn]);
      expect(map.getListeners(key2)).toEqual([globalFn, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeListeners(key2);
      expect(map.getListeners(key1)).toEqual([globalFn]);
      expect(map.getListeners(key2)).toEqual([globalFn]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([]);

      map.removeGlobalListener(globalFn);
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListeners(key2)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([]);
    });
  });

  describe('removeAllListeners', () => {
    test('should remove all', () => {
      const map = new ListenersMap();

      map.addListener(key1, fn1);
      map.addListener(key2, fn2);
      map.addGlobalListener(globalFn);

      expect(map.getListeners(key1)).toEqual([globalFn, fn1]);
      expect(map.getListeners(key2)).toEqual([globalFn, fn2]);
      expect(map.getListenerKeys(fn1)).toEqual([key1]);
      expect(map.getListenerKeys(fn2)).toEqual([key2]);

      map.removeAllListeners();
      expect(map.getListeners(key1)).toEqual([]);
      expect(map.getListeners(key2)).toEqual([]);
      expect(map.getListenerKeys(fn1)).toEqual([]);
      expect(map.getListenerKeys(fn2)).toEqual([]);
    });
  });
});
