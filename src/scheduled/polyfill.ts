import { generateId } from "../helpers";
import { addScheduledExecution } from "./handler";

/**
* Schedules a function to be executed after a specified delay.
* Its not completely accurate and might be delayed.
* Make sure to call `timingHandler` in the SetThink function otherwise it won't work.
*/
export function setTimeout(callback: () => any, delay: number) {
  const executionTime = Date.now() + delay;
  const id = generateId();
  addScheduledExecution(id, { executionTime, func: callback });
  return id;
}

/**
* Schedules a function to be executed repeatedly at specified intervals.
* Its not completely accurate and might be delayed.
* Make sure to call `timingHandler` in the SetThink function otherwise it won't work.
*/
export function setInterval(callback: () => any, delay: number) {
  const executionTime = Date.now() + delay;
  const id = generateId();
  addScheduledExecution(id, { executionTime, func: callback, repeat: true, delay });
  return id;
}