import { clearTimedExecution, editScheduledExecution } from "./handler";
import { setInterval, setTimeout } from "./polyfill";

export type ScheduledOptions = { updateOnSubsequentCalls: boolean, type: 'debounce' | 'throttle' };
export type HigherScheduledOptions = Partial<Omit<ScheduledOptions, 'type'>>;

/**
 * Base for extra scheduling functions, use `debounce` or `throttle` instead.
 */
export function scheduled<T extends (...params: any[]) => any>(func: T, wait: number, options: ScheduledOptions) {
  let timeout: string | undefined;
  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = undefined;
      func(...args);
    };

    if (options.updateOnSubsequentCalls && timeout) {
      if (options.type === 'debounce') {
        if (timeout) clearTimedExecution(timeout)
        timeout = setTimeout(later, wait)
      } else {
        editScheduledExecution(timeout!, { func: later });
      }
    } else {
      if (!timeout) timeout = setTimeout(later, wait)
    }

    return timeout;
  };
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 * <br>
 * Example: <br>
 * ```ts
 * const debouncedFunction = debounce((name) => {
 *  log(`This will only be logged once, 500ms after the last call to debouncedFunction for ${name}`);
 * }, 500);
 * 
 * debouncedFunction("hello")
 * debouncedFunction("world")
 * debouncedFunction("test")
 * // Only "test" will be logged, 500ms after the last call
 * ```
 */
export function debounce<T extends (...params: any[]) => any>(func: T, wait: number, options?: HigherScheduledOptions) {
  return scheduled(func, wait, { updateOnSubsequentCalls: true, ...(options ?? {}), type: 'debounce' });
}


/**
 * Creates a throttled function that invokes `func` every `wait` milliseconds ignore subsequent invocations until `wait` periods ends.
 * <br>
 * Example: <br>
 * ```ts
 * const throttledFunction = throttle((name) => {
 *  log(`This will only be logged once, 500ms after the last call to debouncedFunction for ${name}`);
 * }, 500);
 * 
 * throttledFunction("hello")
 * throttledFunction("world")
 * throttledFunction("test")
 * // Only "hello" will be logged, 500ms after the first call, the rest will be ignored
 * ```
 */
export function throttle<T extends (...params: any[]) => any>(func: T, limit: number, options?: HigherScheduledOptions) {
  return scheduled(func, limit, { updateOnSubsequentCalls: false, ...(options ?? {}), type: 'throttle' });
}

/**
 * Can work as `debounce` or `throttle`, its different in that each unique set of parameters has its own
 * scheduler, so you can for example use this for pass in user ids, and each user id will work independently from the others
 */
export class ParameterScheduler<Type extends ScheduledOptions["type"], Func extends (...args: any[]) => any> {
  private readonly existingHandlers: { [encodedParams: string]: { scheduled: (...params: any[]) => any, cancelId?: string, lastUsed: number } } = {};
  private readonly functionToHandle: Func;
  private readonly wait: number;
  private readonly options: ScheduledOptions;
  // Cleans up unused handlers every 10 minutes
  private readonly cleanupId = setInterval(() => {
    for (const [key, { lastUsed, cancelId }] of Object.entries(this.existingHandlers)) {
      // if it hasn't been used for at least one minute
      if ((Date.now() - 60 * 1000) > lastUsed) {
        if (cancelId) clearTimedExecution(cancelId)
        delete this.existingHandlers[key];
      }
    }
  }, 10 * 60 * 1000);

  constructor(func: Func, wait = 1000, options: HigherScheduledOptions & { type: Type }) {
    this.functionToHandle = func;
    this.wait = wait;
    this.options = { updateOnSubsequentCalls: options.type === "debounce", ...options };
  }

  call(...params: Parameters<Func>) {
    const encodedParams = params.join("-")
    this.existingHandlers[encodedParams] ??= { scheduled: scheduled(() => this.functionToHandle(...params), this.wait, this.options), lastUsed: 0 }
    this.existingHandlers[encodedParams].lastUsed = Date.now()
    this.existingHandlers[encodedParams].cancelId = this.existingHandlers[encodedParams].scheduled(...params)

    return this.existingHandlers[encodedParams].cancelId;
  }
}