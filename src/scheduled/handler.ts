type TimedExecutionBase = { executionTime: number, func: () => any, repeat?: false };
type TimedExecutionRepeat = Omit<TimedExecutionBase, 'repeat'> & { repeat: true, delay: number };
type TimedExecution = TimedExecutionBase | TimedExecutionRepeat;
const TIMING_TABLE: { [key: string]: TimedExecution } = {}

/**
 * Handles the timing of scheduled functions.
 * All scheduled functions can be cancelled with `clearTimedExecution`.
 * Make sure to call this in the SetThink function otherwise scheduled functions won't be executed.
 * 
 * ```ts
 * Instance.SetThink(() => {
 *  timingHandler();
 *  // rest of your code
 *  Instance.SetNextThink(Instance.GetGameTime());
 * });
 * Instance.SetNextThink(Instance.GetGameTime());
 * ```
 */
export function timingHandler() {
  for (const [key, { executionTime, func, repeat }] of Object.entries(TIMING_TABLE)) {
    if (Date.now() >= executionTime) {
      func();

      if (repeat) TIMING_TABLE[key].executionTime = Date.now() + (TIMING_TABLE[key] as TimedExecutionRepeat).delay;
      else clearTimedExecution(key);
    }
  }
}

export function addScheduledExecution(id: string, execution: TimedExecution) {
  TIMING_TABLE[id] = execution;
}

export function editScheduledExecution(id: string, execution: Partial<TimedExecution>) {
  if (TIMING_TABLE[id]) {
    TIMING_TABLE[id] = { ...TIMING_TABLE[id], ...execution } as TimedExecution;
  }
}

/**
* Clears a scheduled event.
*/
export function clearTimedExecution(id: string) {
  delete TIMING_TABLE[id];
}