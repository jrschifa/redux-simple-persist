import { SimplePersistRule } from './models';
import * as $E from './events';

export interface MetricsReporterOptions {
    onRuleLoad?: (rule: SimplePersistRule, timeSpent: number) => void;
    onRuleSave?: (rule: SimplePersistRule, timeSpent: number) => void;
    onLoad?: (timeSpent: number) => void;
    onSave?: (timeSpent: number) => void;
}

export type RemoveFn = () => void;

export const createMetricsReporter = (opts: MetricsReporterOptions): RemoveFn => {
    const { onRuleLoad, onRuleSave, onLoad, onSave } = opts;

    const ruleLoadBeginAt: { [key: string]: number } = {};
    const ruleSaveBeginAt: { [key: string]: number } = {};
    let loadBeginAt = 0;
    let saveBeginAt = 0;

    const handlers: Array<[string, (...args: any[]) => void]> = [
        [$E.BEGIN_LOAD_RULE, (rule: SimplePersistRule) => { ruleLoadBeginAt[rule.key] = now(); }],
        [$E.END_LOAD_RULE, (rule: SimplePersistRule) => { onRuleLoad ? onRuleLoad(rule, ruleLoadBeginAt[rule.key] - now()) : void 0 }],
        [$E.BEGIN_SAVE_RULE, (rule: SimplePersistRule) => { ruleSaveBeginAt[rule.key] = now(); }],
        [$E.END_SAVE_RULE, (rule: SimplePersistRule) => { onRuleSave ? onRuleSave(rule, ruleSaveBeginAt[rule.key] - now()) : void 0 }],
        [$E.BEGIN_LOAD, () => { loadBeginAt = now() }],
        [$E.END_LOAD, () => { onLoad ? onLoad(now() - loadBeginAt) : void 0 }],
        [$E.BEGIN_SAVE, () => { saveBeginAt = now() }],
        [$E.END_SAVE, () => { onSave ? onSave(now() - saveBeginAt) : void 0}]
    ];

    handlers.forEach(([event, fn]) => $E.persistanceEvents.addListener(event, fn));

    return () => handlers.forEach(([event, fn]) => $E.persistanceEvents.removeListener(event, fn));
}

const now = Date.now;
