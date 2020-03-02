import { Dispatch } from 'redux';
import * as LocalForage from 'localforage';

export interface SimplePersistStorage extends LocalForageOptions {}

export interface MapToStateThunk<TState> {
    (dispatch: Dispatch, getState: () => TState): void;
}

export interface SimplePersistRule<TState = any> {
    /**
     * the storage key where this rules data will be persisted
     */
    key: string;
    /**
     * whether or not persistance is required for this state update
     */
    shouldPersist: (prevState: TState, nextState: TState) => boolean;
    /**
     * transform state data to storage data
     */
    mapToStorage: (state: TState) => any;
    /**
     * transform storage data from state data
     */
    mapToState: (storageValue: any) => Partial<TState> | MapToStateThunk<TState>;
    /**
     * we could also add a priority to rules that allow only a subset to be loaded in a time.
     */
    storage?: SimplePersistStorage;
}

export interface SimplePersistOptions<TState = any> {
    rules: SimplePersistRule<TState>[];
    defer?: number;
    loadOnStart?: boolean;
    storage: SimplePersistStorage;
}

export interface RuleMap<TState = any> {
    [key: string]: SimplePersistRule<TState>;
}

export interface StorageMap {
    [key: string]: LocalForage;
}
