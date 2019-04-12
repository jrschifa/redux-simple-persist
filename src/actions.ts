import { SimplePersistRule } from './models';

export const LOAD_STATE_REQUEST = '@@redux-simple-persist/LOAD_STATE_REQUEST';
export const LOAD_STATE_SUCCESS = '@@redux-simple-persist/LOAD_STATE_SUCCESS';
export const LOAD_STATE_FAILURE = '@@redux-simple-persist/LOAD_STATE_FAILURE';

export interface LoadStateRequest {
    type: typeof LOAD_STATE_REQUEST;
}

export interface LoadStateSuccess {
    type: typeof LOAD_STATE_SUCCESS;
    state: any;
}

export interface LoadStateFailure {
    type: typeof LOAD_STATE_FAILURE;
    err: any;
}

export type LoadStateType = LoadStateRequest | LoadStateSuccess | LoadStateFailure;

export type loadStateFn = () => Promise<{}>;
export function loadState() {
    // todo: this works for dispatch promise typing, but isn't really right
    return <LoadStateRequest & Promise<{}>>{ type: LOAD_STATE_REQUEST };
}

export const SAVE_STATE_REQUEST = '@@redux-simple-persist/SAVE_STATE_REQUEST';
export const SAVE_STATE_SUCCESS = '@@redux-simple-persist/SAVE_STATE_SUCCESS';
export const SAVE_STATE_FAILURE = '@@redux-simple-persist/SAVE_STATE_FAILURE';

export interface SaveStateRequest {
    type: typeof SAVE_STATE_REQUEST;
    rules?: SimplePersistRule[];
}

export interface SaveStateSuccess {
    type: typeof SAVE_STATE_SUCCESS;
}

export interface SaveStateFailure {
    type: typeof SAVE_STATE_FAILURE;
    err: any;
}

export type SaveStateType = SaveStateRequest | SaveStateSuccess | SaveStateFailure;

export type saveStateFn = <TState>(rules?: SimplePersistRule<TState>[]) => Promise<{}>;
export function saveState<TState>(rules?: SimplePersistRule<TState>[]) {
    return <SaveStateRequest & Promise<{}>>{ type: SAVE_STATE_REQUEST, rules };
}

export const CLEAR_STATE_REQUEST = 'CLEAR_STATE_REQUEST';
export const CLEAR_STATE_SUCCESS = 'CLEAR_STATE_SUCCESS';
export const CLEAR_STATE_FAILURE = 'CLEAR_STATE_FAILURE';

export interface ClearStateRequest {
    type: typeof CLEAR_STATE_REQUEST;
}

export interface ClearStateSuccess {
    type: typeof CLEAR_STATE_SUCCESS;
}

export interface ClearStateFailure {
    type: typeof CLEAR_STATE_FAILURE;
    err: any;
}

export type ClearStateType = ClearStateRequest | ClearStateSuccess | ClearStateFailure;

export type clearStateFn = () => Promise<{}>;
export function clearState() {
    return <ClearStateSuccess & Promise<{}>>{ type: CLEAR_STATE_SUCCESS };
}

export type ActionType = LoadStateType | SaveStateType | ClearStateType;
