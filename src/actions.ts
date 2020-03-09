import { SimplePersistRule } from './models';

import { ActionType, createAction } from './utils';

const loadStateRequest = createAction('@@redux-simple-persist/LOAD_STATE_REQUEST');
const loadStateSuccess = createAction('@@redux-simple-persist/LOAD_STATE_SUCCESS', (state: any) => state);
const loadStateFailure = createAction('@@redux-simple-persist/LOAD_STATE_FAILURE', (err: any) => err);

const saveStateRequest = createAction('@@redux-simple-persist/SAVE_STATE_REQUEST', (rules: SimplePersistRule[] = []) => rules);
const saveStateSuccess = createAction('@@redux-simple-persist/SAVE_STATE_SUCCESS');
const saveStateFailure = createAction('@@redux-simple-persist/SAVE_STATE_FAILURE', (err: any) => err);

const clearStateRequest = createAction('@@redux-simple-persist/CLEAR_STATE_REQUEST');
const clearStateSuccess = createAction('@@redux-simple-persist/CLEAR_STATE_SUCCESS');
const clearStateFailure = createAction('@@redux-simple-persist/CLEAR_STATE_FAILURE', (err: any) => err);

export const actions = {
  loadStateRequest,
  loadStateSuccess,
  loadStateFailure,
  saveStateRequest,
  saveStateSuccess,
  saveStateFailure,
  clearStateRequest,
  clearStateSuccess,
  clearStateFailure,
};

export type ActionTypes = ActionType<typeof actions>;
