import { ActionTypes } from '@/actions';
import { persistMiddleware } from '@/middlewares';
import { SimplePersistRule } from '@/models';
import configureMockStore, { MockStoreCreator, MockStoreEnhanced } from '@jedmao/redux-mock-store';
import { AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

export type MockActionType = (
  ActionTypes
);

export type MockStoreType = MockStoreEnhanced<
any,
MockActionType,
ThunkDispatch<any, any, MockActionType>
>;

export interface CreateMockStoreOptions {
  rules: Array<SimplePersistRule<any>>;
}

export function getMockStore(opts?: CreateMockStoreOptions): MockStoreCreator {
  const rules = opts ? opts.rules : [];
  const mockMiddlewares = [ thunk, persistMiddleware({ rules }) ];
  const mockStore = configureMockStore<any, MockActionType, ThunkDispatch<any, any, MockActionType>>(mockMiddlewares);

  return mockStore;
}

export default getMockStore;
