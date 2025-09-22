export * from './enums';
export * from './helpers';
export * from './scheduled';

/**
 * MUST BE CALLED FIRST BEFORE ANYTHING ELSE RUNS
 */
export function registerCsScriptNativeGlobally(csScriptGlobals: any) {
  for (const [key, value] of Object.entries(csScriptGlobals)) {
    //@ts-expect-error
    globalThis[key] = value;
  }
}