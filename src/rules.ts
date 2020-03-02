import { Store } from "redux";
import { SimplePersistOptions } from './models';
import { actions } from './actions';

export const createRuleEngine = <TState>(store: Store<TState>, { rules, defer }: SimplePersistOptions<TState>) => {
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
