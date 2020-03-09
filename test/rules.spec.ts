import configureMockStore from '@jedmao/redux-mock-store';
import { AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

import { persistMiddleware } from '@/middlewares';
import { SimplePersistOptions, SimplePersistRule } from '@/models';
import { createRuleEngine } from '@/rules';

export interface CreateMockStoreOptions {
  rules: Array<SimplePersistRule<any>>;
}

export function createMockStore(opts?: CreateMockStoreOptions) {
  const rules = opts ? opts.rules : [];
  const mockMiddlewares = [thunk, persistMiddleware({ rules })];
  const mockStore: any = configureMockStore<any, AnyAction, ThunkDispatch<any, any, AnyAction>>(mockMiddlewares);
  return mockStore;
}

describe('rules', () => {
  let store: any;

  const mockRule = {
    key: 'mock',
    shouldPersist: jest.fn(() => true),
    mapToState: jest.fn((state) => state),
    mapToStorage: jest.fn((state) => state),
    storage: window.localStorage,
  } as SimplePersistRule;

  const mockOptions = {
    rules: [ mockRule ],
    defer: 500,
  } as SimplePersistOptions;

  const mockStore = createMockStore(mockOptions);

  it('should persist and save state', (done) => {
    store = mockStore({ });
    const spy = jest.spyOn(mockRule, 'shouldPersist');
    const mockPersistenceRules = createRuleEngine(store, mockOptions);
    const mockPreviousState = {};
    const mockNextState = {};

    mockPersistenceRules(mockPreviousState, mockNextState);

    expect(spy).toBeCalled();

    const expectedActions = [
      { type: '@@redux-simple-persist/SAVE_STATE_REQUEST', rules: [mockRule] },
      { type: '@@redux-simple-persist/SAVE_STATE_SUCCESS' },
    ];

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, mockOptions.defer as number * 2);
  });
});
