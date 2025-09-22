/** Generates a unique ID with a specified level of randomness */
export function generateId(repetition: number = Math.ceil(Math.random() * 3)) {
  let id = Math.random().toString(36).substring(2, 15);

  for (let i = 0; i < repetition; i++) {
    id += Math.random().toString(36).substring(2, 15);
  }

  return id;
}

/** Works the same as `console.log` and logs to VConsole2 */
export function log(...logs: any[]) {
  Instance.Msg(logs.map(log => {
    if (typeof log === 'object' && log !== null) return JSON.stringify(log)

    return `${log}`;
  }).join(' '));
}