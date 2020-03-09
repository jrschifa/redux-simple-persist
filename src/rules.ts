import { AnyAction, MiddlewareAPI } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { actions } from './actions';
import { SimplePersistOptions } from './models';

export const createRuleEngine = <TState>(store: MiddlewareAPI<ThunkDispatch<TState, undefined, AnyAction>, TState>, { rules, defer }: SimplePersistOptions<TState>) => {
    const persisting: { [key: string]: number } = {};

    return (prevState: TState, nextState: TState) => {
        rules.forEach((rule) => {
            if (rule.shouldPersist(prevState, nextState)) {
                if (persisting[rule.key] > 0) {
                    clearTimeout(persisting[rule.key]);
                }
                persisting[rule.key] = setTimeout(() => {
                    persisting[rule.key] = 0;
                    store.dispatch(actions.saveStateRequest([rule]));
                }, defer);
            }
        });
    };
};
