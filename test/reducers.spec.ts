import { AnyAction, combineReducers } from 'redux';

import * as PersistActions from '../actions';
import { persistReducer } from '../reducers';

type EmptyObject = {};

describe('reducer', () => {
  const reducer = persistReducer(combineReducers<EmptyObject, AnyAction>({}));

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toMatchObject({});
  });

  it('should handle LOAD_STATE_SUCCESS', () => {
    const mockLoadStateSuccessAction: PersistActions.LoadStateSuccess = {
      type: PersistActions.LOAD_STATE_SUCCESS,
      state: { 'foo': 'bar' }
    };

    expect(reducer(undefined, mockLoadStateSuccessAction))
      .toEqual({
        ...mockLoadStateSuccessAction.state,
      });
  });
});
