import { assertUniqueKeysOnRules } from './utils';
import { SimplePersistOptions } from './models';
import { Store, Dispatch, AnyAction } from 'redux';
import { createResponders } from './responders';
import { actions, ActionTypes } from './actions';
import { createRuleEngine } from './rules';

export const persistMiddleware = <TState>(opts: SimplePersistOptions<TState>) => {
    assertUniqueKeysOnRules(opts.rules);

    return (store: Store<TState>) => {
        const responders = createResponders(store, opts);

        if (opts.loadOnStart) {
            setImmediate(() => store.dispatch(actions.loadStateRequest()));
        }

        const runPersistenceRules = createRuleEngine(store, opts);

        return (next: Dispatch) => (action: ActionTypes) => {
            if (responders[action.type]) {
                const res = responders[action.type](action);
                next(action);
                return res; // our actions do not trigger persistence
            }

            const prevState = store.getState();
            const res = next(action);
            const nextState = store.getState();

            runPersistenceRules(prevState, nextState);

            return res;
        };
    };
};
