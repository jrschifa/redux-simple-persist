import { isPlainObject, mergeState, assertUniqueKeysOnRules } from '../utils';
import { SimplePersistRule } from '../models';

describe('utils', () => {
  it('isPlainObject should return true', () => {
    expect(isPlainObject({})).toBe(true);
  });

  it('isPlainObject should return false', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(void 0)).toBe(false);
  });

  it('mergeState should return a new merged state', () => {
    const emptyState = null;
    const prevState = { 'key1': { 'innerKey1': 'innerValue1' } } as any;
    const nextState = { 'key1': { 'innerKey2': 'innerValue2' }, 'key2': 'value2', 'key3': 'value3' } as any;

    expect(mergeState<any>(emptyState, nextState)).toEqual(nextState);
    expect(mergeState<any>(prevState, nextState)).toEqual({
      ...prevState,
      ...nextState,
      'key1': {
        ...prevState.key1,
        ...nextState.key1
      }
    });
  });

  it('assertUniqueKeysOnRules should not throw an error for unique keys', () => {
    const rule1 = { key: 'rule1' } as SimplePersistRule;
    const rule2 = { key: 'rule2' } as SimplePersistRule;

    expect(() => {
      assertUniqueKeysOnRules([rule1, rule2]);
    }).not.toThrow();
  });

  it('assertUniqueKeysOnRules should throw error for duplicate keys', () => {
    const rule1 = { key: 'duplicateRule' } as SimplePersistRule;
    const rule2 = { key: 'duplicateRule' } as SimplePersistRule;

    expect(() => {
      assertUniqueKeysOnRules([rule1, rule2]);
    }).toThrow();
  });
});
