import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { actions, ActionTypes } from './actions';
import { SimplePersistOptions } from './models';
import { createResponders } from './responders';
import { createRuleEngine } from './rules';
import { assertUniqueKeysOnRules } from './utils';

export const persistMiddleware = <TState>(opts: SimplePersistOptions<TState>) => {
    assertUniqueKeysOnRules(opts.rules);

    return (store: MiddlewareAPI<ThunkDispatch<TState, undefined, AnyAction>, TState>) => {
        const responders = createResponders(store, opts);

        if (opts.loadOnStart) {
            setImmediate(() => store.dispatch(actions.loadStateRequest()));
        }

        const runPersistenceRules = createRuleEngine(store, opts);

        return (next: Dispatch) => (action: ActionTypes) => {
            let res: any;

            if (responders[action.type]) {
                res = responders[action.type](action);
                next(action);
                return res; // our actions do not trigger persistence
            }

            const prevState = store.getState();
            res = next(action);
            const nextState = store.getState();

            runPersistenceRules(prevState, nextState);

            return res;
        };
    };
};
