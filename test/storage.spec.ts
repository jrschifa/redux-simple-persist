import { loadStateFromStorage, saveStateToStorage, clearStateInStorage } from '../storage';
import { SimplePersistRule, SimplePersistOptions } from '../models';

describe('storage', () => {
  const mockRule = {
    key: 'mock',
    shouldPersist: jest.fn(() => true),
    mapToState: jest.fn((state) => state),
    mapToStorage: jest.fn((state) => state),
    storage: window.localStorage
  } as SimplePersistRule;

  const mockOptions = {
    rules: [ mockRule ]
  } as SimplePersistOptions;

  it('should saveStateToStorage', () => {
    const nextState = { 'foo': 'bar' };
    saveStateToStorage(mockOptions, nextState);
    const [state, thunk] = loadStateFromStorage(mockOptions);
    expect(state).toMatchObject(nextState);
  });

  it('should saveStateToStorage with default storage', () => {
    const nextState = { 'foo': 'bar' };
    saveStateToStorage({
      ...mockOptions,
      rules: [{
        ...mockRule,
        storage: undefined
      }]
    }, nextState);
    const [state, thunk] = loadStateFromStorage(mockOptions);
    expect(state).toMatchObject(nextState);
  });

  it('should clearStateInStorage', () => {
    clearStateInStorage(mockOptions);
    expect(window.localStorage.getItem('mock')).toBeNull();
  });

  it('should clearStateInStorage with default storage', () => {
    clearStateInStorage({
      ...mockOptions,
      rules: [{
        ...mockRule,
        storage: undefined
      }]
    });

    expect(window.localStorage.getItem('mock')).toBeNull();
  });
});
