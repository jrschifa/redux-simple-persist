import * as $E from './events';
import { SimplePersistRule } from './models';

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
        [$E.END_LOAD_RULE, (rule: SimplePersistRule) => { if (onRuleLoad) { onRuleLoad(rule, ruleLoadBeginAt[rule.key] - now()); } }],
        [$E.BEGIN_SAVE_RULE, (rule: SimplePersistRule) => { ruleSaveBeginAt[rule.key] = now(); }],
        [$E.END_SAVE_RULE, (rule: SimplePersistRule) => { if (onRuleSave) { onRuleSave(rule, ruleSaveBeginAt[rule.key] - now()); } }],
        [$E.BEGIN_LOAD, () => { loadBeginAt = now(); }],
        [$E.END_LOAD, () => { if (onLoad) { onLoad(now() - loadBeginAt); } }],
        [$E.BEGIN_SAVE, () => { saveBeginAt = now(); }],
        [$E.END_SAVE, () => { if (onSave) { onSave(now() - saveBeginAt); } }],
    ];

    handlers.forEach(([event, fn]) => $E.persistanceEvents.addListener(event, fn));

    return () => handlers.forEach(([event, fn]) => $E.persistanceEvents.removeListener(event, fn));
};

const now = Date.now;
