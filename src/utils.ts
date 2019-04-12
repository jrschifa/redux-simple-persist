import { SimplePersistRule } from "./models";

export function isPlainObject(obj: any) {
    if (typeof obj !== 'object' || obj === null || obj === void 0) {
        return false;
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto !== Object.prototype && proto !== null) {
        return false;
    }

    return true;
}

export function mergeState<S, P extends keyof S>(prevState: S, restState: Partial<S>): Partial<S> {
    const nextState: Partial<S> = { ...prevState };
    return Object.entries(restState).reduce((nextState, [prop, value]) => (
        nextState[<P>prop] = isPlainObject(value) ? mergeState(nextState[<P>prop], value) : value,
        nextState
    ), nextState);
}

export function assertUniqueKeysOnRules<S>(rules: SimplePersistRule<S>[]) {
    const test: { [key: string]: boolean } = {};
    if (rules.some(rule => test[rule.key] || (test[rule.key] = true, false))) {
        throw new Error('Keys must be unique between rules.');
    }
}

