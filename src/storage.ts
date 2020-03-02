import * as localForage from 'localforage';
import { SimplePersistOptions, MapToStateThunk, SimplePersistRule, StorageMap, SimplePersistStorage } from './models';
import { mergeState } from './utils';
import * as $E from './events';

const emitBeginLoad = () => $E.persistanceEvents.emit($E.BEGIN_LOAD);
const emitEndLoad = () => $E.persistanceEvents.emit($E.END_LOAD);
const emitBeginLoadRule = (rule: SimplePersistRule) => $E.persistanceEvents.emit($E.BEGIN_LOAD_RULE, rule);
const emitEndLoadRule = (rule: SimplePersistRule) => $E.persistanceEvents.emit($E.END_LOAD_RULE, rule);
const emitBeginLoadFinalize = () => $E.persistanceEvents.emit($E.BEGIN_LOAD_FINALIZE);
const emitEndLoadFinalize = () => $E.persistanceEvents.emit($E.END_LOAD_FINALIZE);
const emitBeginSave = () => $E.persistanceEvents.emit($E.BEGIN_SAVE);
const emitEndSave = () => $E.persistanceEvents.emit($E.END_SAVE);
const emitBeginSaveRule = (rule: SimplePersistRule) => $E.persistanceEvents.emit($E.BEGIN_SAVE_RULE, rule);
const emitEndSaveRule = (rule: SimplePersistRule) => $E.persistanceEvents.emit($E.END_SAVE_RULE, rule);

const storageMap: StorageMap = {};

function createStorageInstance(key: string, options: SimplePersistStorage) {
    const storageInstance = localForage.createInstance(options);
    storageMap[key] = storageInstance;
    return storageInstance;
}

export async function loadStateFromStorage<TState>({ rules, storage: defaultStorage }: SimplePersistOptions<TState>): Promise<[Partial<TState>, MapToStateThunk<TState>[]]> {
    emitBeginLoad();
    type R = [Partial<TState>, MapToStateThunk<TState>[]];
    try {
        const reads = rules.map((rule: SimplePersistRule) => {
            const storage = storageMap[rule.key] ?? createStorageInstance(rule.key, rule.storage ?? defaultStorage);
            emitBeginLoadRule(rule);
            return storage.getItem<string>(rule.key).then((raw: string): [string, Partial<TState> | MapToStateThunk<TState> | null] => {
                const data = raw ? JSON.parse(raw) : null;
                const state = raw ? rule.mapToState(data) : null;
                emitEndLoadRule(rule);
                return [rule.key, raw ? state : {}];
            });
        });
        const pairs = [...await Promise.all(reads)];
        emitBeginLoadFinalize();
        const res: R = pairs.reduce(([state, thunks]: R, [_, v]) => (
            typeof v === 'function' ? [state, [...thunks, v]] as R : [v ? mergeState(state, v) : state, thunks] as R
        ), [{}, []] as R);
        emitEndLoadFinalize();
        emitEndLoad();
        return res;
    } catch (err) {
        throw err;
    }
}

export async function saveStateToStorage<TState>({ rules, storage: defaultStorage }: SimplePersistOptions<TState>, state: TState) {
    emitBeginSave();
    try {
        const writes = rules.map((rule: SimplePersistRule) => {
            const storage = storageMap[rule.key] ?? createStorageInstance(rule.key, rule.storage ?? defaultStorage);            
            emitBeginSaveRule(rule);
            const data = rule.mapToStorage(state);
            const raw = JSON.stringify(data);
            return storage.setItem(rule.key, raw).then(() => {
                emitEndSaveRule(rule);
            });
        });
        await Promise.all(writes);
        emitEndSave();
    } catch (err) {
        throw err;
    }
}

export async function clearStateInStorage<TState>({ rules, storage: defaultStorage }: SimplePersistOptions<TState>) {
    try {
        const deletes = rules.map((rule: SimplePersistRule) => {
            const storage = storageMap[rule.key] ?? createStorageInstance(rule.key, rule.storage ?? defaultStorage);
            storage.removeItem(rule.key)
        });
        await Promise.all(deletes);
    } catch (err) {
    }
}
