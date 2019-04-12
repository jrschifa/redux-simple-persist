import { EventEmitter } from 'events';

export const BEGIN_LOAD = 'beginload';
export const END_LOAD = 'endload';
export const BEGIN_LOAD_RULE = 'beginloadrule';
export const END_LOAD_RULE = 'endloadrule';
export const BEGIN_LOAD_FINALIZE = 'beginloadfinalize';
export const END_LOAD_FINALIZE = 'endloadfinalize';
export const BEGIN_SAVE = 'beginsave';
export const END_SAVE = 'endsave';
export const BEGIN_SAVE_RULE = 'beginsaverule';
export const END_SAVE_RULE = 'endsaverule';
export const BEGIN_STATE_MERGE = 'beginstatemerge';
export const END_STATE_MERGE = 'endstatemerge';

export const persistanceEvents = new EventEmitter();
