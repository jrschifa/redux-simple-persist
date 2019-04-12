import { Store, AnyAction } from 'redux';
import { SimplePersistOptions, MapToStateThunk } from './models';
import * as PersistActions from './actions';
import { loadStateFromStorage, saveStateToStorage, clearStateInStorage } from './storage';

// TODO: not an ideal return type for this
export const createResponders = <TState>(store: Store<TState>, opts: SimplePersistOptions<TState>): { [type: string]: ((action: any) => any) } => {
    return {
        [PersistActions.LOAD_STATE_REQUEST]: async (action: PersistActions.LoadStateRequest) => {
            let state: Partial<TState>, thunks: MapToStateThunk<TState>[];
            try {
                [state, thunks] = await loadStateFromStorage(opts);
            } catch (err) {
                store.dispatch({ type: PersistActions.LOAD_STATE_FAILURE, err });
                throw err;
            }
            store.dispatch({ type: PersistActions.LOAD_STATE_SUCCESS, state });
            thunks.forEach(thunk => thunk(store.dispatch, store.getState));
        },
        [PersistActions.LOAD_STATE_SUCCESS]: (action: PersistActions.LoadStateSuccess) => action,
        [PersistActions.LOAD_STATE_FAILURE]: (action: PersistActions.LoadStateFailure) => action,
        [PersistActions.SAVE_STATE_REQUEST]: async (action: PersistActions.SaveStateRequest) => {
            try {
                await saveStateToStorage({ ...opts, rules: action.rules || opts.rules }, store.getState());
            } catch (err) {
                store.dispatch({ type: PersistActions.SAVE_STATE_FAILURE, err });
                throw err;
            }
            store.dispatch({ type: PersistActions.SAVE_STATE_SUCCESS });
        },
        [PersistActions.SAVE_STATE_SUCCESS]: (action: PersistActions.SaveStateSuccess) => action,
        [PersistActions.SAVE_STATE_FAILURE]: (action: PersistActions.SaveStateFailure) => action,
        [PersistActions.CLEAR_STATE_REQUEST]: async (action: PersistActions.ClearStateRequest) => {
            try {
                await clearStateInStorage(opts);
            } catch (err) {
                store.dispatch({ type: PersistActions.CLEAR_STATE_FAILURE, err });
                throw err;
            }
            store.dispatch({ type: PersistActions.CLEAR_STATE_SUCCESS });
        },
        [PersistActions.CLEAR_STATE_SUCCESS]: (action: PersistActions.ClearStateSuccess) => action,
        [PersistActions.CLEAR_STATE_FAILURE]: (action: PersistActions.ClearStateFailure) => action
    };
};
