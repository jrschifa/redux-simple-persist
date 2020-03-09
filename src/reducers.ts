import { Reducer } from 'redux';
import { ActionTypes } from './actions';
import * as $E from './events';
import { mergeState } from './utils';

export const emitBeginStateMerge = () => $E.persistanceEvents.emit($E.BEGIN_STATE_MERGE);
export const emitEndStateMerge = () => $E.persistanceEvents.emit($E.END_STATE_MERGE);

/**
 * Composes the provided reducer in order to support persistance actions modifying state.  This is not necessary if
 * you do not use persistance actions (incl. loading state on startup), e.g. loading the state manually via `loadStateFromStorage` before
 * store creation.
 *
 * We do not need any options here, such as the depth at which state is merged in, since that can be entirely controlled by
 * each rules' `mapToState`.
 *
 * @param reducer
 */
export const persistReducer = <TState>(reducer: Reducer<TState>) => {
    return (prevState: TState, action: ActionTypes) => {
        switch (action.type) {
            case '@@redux-simple-persist/LOAD_STATE_SUCCESS': {
                emitBeginStateMerge();
                const nextState = mergeState(prevState, (action as any).payload);
                emitEndStateMerge();
                return nextState;
            }
            default: {
                return reducer(prevState, action);
            }
        }
    };
};
