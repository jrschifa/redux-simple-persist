import { AnyAction, combineReducers, createStore } from 'redux';

import { actions } from '@/actions';
import { persistReducer } from '@/reducers';

const EMPTY = {};
type EmptyObject = typeof EMPTY;

describe('reducer', () => {
  const reducer = persistReducer(combineReducers<EmptyObject, AnyAction>({ mock: (state: any = {}) => state }));

  it('should return the initial state', () => {
    expect(reducer({}, {} as AnyAction)).toMatchObject({});
  });

  it('should handle LOAD_STATE_SUCCESS', () => {
    const mockLoadStateSuccessAction = {
      type: '@@redux-simple-persist/LOAD_STATE_SUCCESS',
      payload: { foo: 'bar' },
    } as ReturnType<typeof actions.loadStateSuccess>;

    expect(reducer({}, mockLoadStateSuccessAction))
      .toEqual({
        ...(mockLoadStateSuccessAction as any).payload,
      });
  });
});
