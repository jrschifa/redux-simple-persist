import configureMockStore from '@jedmao/redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import * as PersistActions from '../actions';
import { persistMiddleware } from '../middlewares';
import { SimplePersistRule, SimplePersistOptions } from '../models';

export interface CreateMockStoreOptions {
  rules: SimplePersistRule<any>[];
}

export function createMockStore(opts?: CreateMockStoreOptions) {
  const rules = opts ? opts.rules : [];
  const mockMiddlewares = [thunk, persistMiddleware({ rules })];
  const mockStore: any = configureMockStore<any, AnyAction, ThunkDispatch<any, any, AnyAction>>(mockMiddlewares);
  return mockStore;
}

export default createMockStore;

describe('actions', () => {
  let store: any;

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

  const mockStore = createMockStore(mockOptions);

  beforeEach(() => {
    store = mockStore({ });
  });

  it('should load state from stoarge', (done) => {
    const expectedActions = [
      { type: PersistActions.LOAD_STATE_REQUEST } as PersistActions.LoadStateRequest,
      { type: PersistActions.LOAD_STATE_SUCCESS, state: {} } as PersistActions.LoadStateSuccess
    ];

    return store.dispatch(PersistActions.loadState())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to load state from stoarge', (done) => {
    const mockError = new Error();
    const expectedActions = [
      { type: PersistActions.LOAD_STATE_REQUEST } as PersistActions.LoadStateRequest,
      { type: PersistActions.LOAD_STATE_FAILURE, err: mockError } as PersistActions.LoadStateFailure
    ];

    Storage.prototype.getItem = jest.fn(() => { throw mockError; });

    return store.dispatch(PersistActions.loadState())
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should save state to storage', (done) => {
    const expectedActions = [
      { type: PersistActions.SAVE_STATE_REQUEST, rules: [] } as PersistActions.SaveStateRequest,
      { type: PersistActions.SAVE_STATE_SUCCESS } as PersistActions.SaveStateSuccess
    ];

    return store.dispatch(PersistActions.saveState([]))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to save state to storage', (done) => {
    const mockError = new Error();
    const expectedActions = [
      { type: PersistActions.SAVE_STATE_REQUEST } as PersistActions.SaveStateRequest,
      { type: PersistActions.SAVE_STATE_FAILURE, err: mockError } as PersistActions.SaveStateFailure
    ];

    Storage.prototype.setItem = jest.fn(() => { throw mockError; });

    return store.dispatch(PersistActions.saveState())
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should clear storage', (done) => {
    const expectedActions = [
      { type: PersistActions.CLEAR_STATE_REQUEST } as PersistActions.ClearStateRequest,
      { type: PersistActions.CLEAR_STATE_SUCCESS } as PersistActions.ClearStateSuccess
    ];

    return store.dispatch(PersistActions.clearState())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to clear storage', (done) => {
    const mockError = new Error();
    const expectedActions = [
      { type: PersistActions.CLEAR_STATE_REQUEST } as PersistActions.ClearStateRequest,
      { type: PersistActions.CLEAR_STATE_FAILURE, err: mockError } as PersistActions.ClearStateFailure
    ];

    Storage.prototype.removeItem = jest.fn(() => { throw mockError; });

    return store.dispatch(PersistActions.clearState())
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});
