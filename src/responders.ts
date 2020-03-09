import { AnyAction, MiddlewareAPI } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { actions } from './actions';
import { MapToStateThunk, SimplePersistOptions } from './models';
import { clearStateInStorage, loadStateFromStorage, saveStateToStorage } from './storage';

// TODO: not an ideal return type for this
export const createResponders = <TState>(store: MiddlewareAPI<ThunkDispatch<TState, undefined, AnyAction>, TState>, opts: SimplePersistOptions<TState>): { [type: string]: ((action: any) => any) } => {
    return {
        '@@redux-simple-persist/LOAD_STATE_REQUEST': (action: ReturnType<typeof actions.loadStateRequest>) => {
            return new Promise(async (resolve, reject) => {
                let state: Partial<TState>;
                let thunks: Array<MapToStateThunk<TState>>;

                try {
                    [state, thunks] = await loadStateFromStorage(opts);
                    thunks.forEach((thunk) => thunk(store.dispatch, store.getState));
                    resolve(state);
                } catch (err) {
                    reject(err);
                }
            })
            .then((state) => actions.loadStateSuccess(state))
            .catch((err) => { actions.loadStateFailure(err); throw err; });
        },
        '@@redux-simple-persist/LOAD_STATE_SUCCESS': (action: ReturnType<typeof actions.loadStateSuccess>) => action,
        '@@redux-simple-persist/LOAD_STATE_FAILURE': (action: ReturnType<typeof actions.loadStateFailure>) => action,
        '@@redux-simple-persist/SAVE_STATE_REQUEST': (action: ReturnType<typeof actions.saveStateRequest>) => {
            return new Promise((resolve, reject) => {
                try {
                    saveStateToStorage({ ...opts, rules: action.payload || opts.rules }, store.getState());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .then(() => store.dispatch(actions.saveStateSuccess()))
            .catch((err) => { store.dispatch(actions.saveStateFailure(err)); throw err; });
        },
        '@@redux-simple-persist/SAVE_STATE_SUCCESS': (action: ReturnType<typeof actions.saveStateSuccess>) => action,
        '@@redux-simple-persist/SAVE_STATE_FAILURE': (action: ReturnType<typeof actions.saveStateFailure>) => action,
        '@@redux-simple-persist/CLEAR_STATE_REQUEST': (action: ReturnType<typeof actions.clearStateRequest>) => {
            return new Promise((resolve, reject) => {
                try {
                    clearStateInStorage(opts);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .then(() => store.dispatch(actions.clearStateSuccess()))
            .catch((err) => {actions.clearStateFailure(err); throw err; });
        },
        '@@redux-simple-persist/CLEAR_STATE_SUCCESS': (action: ReturnType<typeof actions.clearStateSuccess>) => action,
        '@@redux-simple-persist/CLEAR_STATE_FAILURE': (action: ReturnType<typeof actions.clearStateFailure>) => action,
    };
};
