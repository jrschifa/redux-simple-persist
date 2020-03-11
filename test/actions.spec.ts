import localForage from 'localforage';

import { actions } from '@/actions';
import { SimplePersistRule } from '@/models';
import { getMockStore } from './utils';

describe('actions', () => {
  const mockRule = {
    key: 'mock',
    shouldPersist: jest.fn(() => true),
    mapToState: jest.fn((state) => state),
    mapToStorage: jest.fn((state) => state),
    storage: { driver: localForage.LOCALSTORAGE, name: 'mock' },
  };

  const mockStore = getMockStore({
    rules: [ mockRule ],
  });

  it('should load state from storage', (done) => {
    const mockPayload: object = {};
    const expectedActions = [
      { type: '@@redux-simple-persist/LOAD_STATE_REQUEST' },
      { type: '@@redux-simple-persist/LOAD_STATE_SUCCESS', payload: mockPayload },
    ];

    const store: any = mockStore({});
    return store.dispatch(actions.loadStateRequest())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to load state from storage', (done) => {
    const mockError = new Error();
    const expectedActions = [
      { type: '@@redux-simple-persist/LOAD_STATE_REQUEST' },
      { type: '@@redux-simple-persist/LOAD_STATE_FAILURE', payload: mockError },
    ];

    Storage.prototype.getItem = jest.fn(() => { throw mockError; });

    const store: any = mockStore({});
    return store.dispatch(actions.loadStateRequest())
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should save state to storage', (done) => {
    const mockPayload: SimplePersistRule[] = [];
    const expectedActions = [
      { type: '@@redux-simple-persist/SAVE_STATE_REQUEST', payload: mockPayload },
      { type: '@@redux-simple-persist/SAVE_STATE_SUCCESS' },
    ];

    const store: any = mockStore({});
    return store.dispatch(actions.saveStateRequest(mockPayload))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to save state to storage', (done) => {
    const mockPayload: SimplePersistRule[] = [ mockRule ];
    const mockError = new Error('No available storage method found.');
    const expectedActions = [
      { type: '@@redux-simple-persist/SAVE_STATE_REQUEST', payload: mockPayload },
      { type: '@@redux-simple-persist/SAVE_STATE_FAILURE', payload: mockError },
    ];

    Storage.prototype.setItem = jest.fn(() => { throw mockError; });

    const store: any = mockStore({});
    return store.dispatch(actions.saveStateRequest(mockPayload))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should clear storage', (done) => {
    const expectedActions = [
      { type: '@@redux-simple-persist/CLEAR_STATE_REQUEST' },
      { type: '@@redux-simple-persist/CLEAR_STATE_SUCCESS' },
    ];

    const store: any = mockStore({});
    return store.dispatch(actions.clearStateRequest())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });

  it('should fail to clear storage', (done) => {
    const mockError = new Error('');
    const expectedActions = [
      { type: '@@redux-simple-persist/CLEAR_STATE_REQUEST' },
      { type: '@@redux-simple-persist/CLEAR_STATE_FAILURE', payload: mockError },
    ];

    Storage.prototype.removeItem = jest.fn(() => { throw mockError; });

    const store: any = mockStore({});
    return store.dispatch(actions.clearStateRequest())
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      });
  });
});
