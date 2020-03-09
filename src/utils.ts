import { SimplePersistRule } from './models';

export type Action<T extends string, P extends any = undefined> = (
P extends undefined
    ? { type: T }
    : { type: T; payload: P }
);

export function action<T extends string, P extends any = undefined>(actionType: T, payload?: P) {
if (typeof payload === 'undefined') {
    return ({ type: actionType }) as Action<T, P>;
}
return ({ type: actionType, payload: payload as P }) as Action<T, P>;
}

export function createAction<T extends string, P extends any = undefined>(actionType: T, payloadCallback?: (payload: any) => P) {
return <RP extends any = any>(rawPayload?: RP) => {
    if (payloadCallback != null) {
    return action<T, P>(actionType, payloadCallback(rawPayload));
    }
    return action<T, P>(actionType);
};
}

type ActionDispatch = ReturnType<typeof createAction>;
interface ActionObject { [key: string]: any; }
type ParseAction<TType extends any = any> = TType extends ActionDispatch ? ReturnType<TType> : TType;

export type ActionType<TType extends any = any> = (
TType extends ActionObject
    ? { [K in keyof TType]: ParseAction<TType[K]>; }[keyof TType]
    : ParseAction<TType>
);

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
    return Object.entries(restState).reduce((nextRestState, [prop, value]) => (
        nextRestState[prop as P] = isPlainObject(value) ? mergeState(nextRestState[prop as P], value as any) : value as any,
        nextRestState
    ), nextState);
}

export function assertUniqueKeysOnRules<S>(rules: Array<SimplePersistRule<S>>) {
    const test: { [key: string]: boolean } = {};
    if (rules.some((rule) => test[rule.key] || (test[rule.key] = true, false))) {
        throw new Error('Keys must be unique between rules.');
    }
}
