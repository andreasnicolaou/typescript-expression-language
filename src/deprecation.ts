const triggered = new Set<string>();

/**
 * Reports a deprecation once per message, like Symfony's `trigger_deprecation()`.
 *
 * Node.js receives it as a `DeprecationWarning` through `process.emitWarning()`,
 * so `--no-deprecation` and `--throw-deprecation` apply; other environments get
 * a `console.warn()`.
 * @param message
 */
export const triggerDeprecation = (message: string): void => {
  if (triggered.has(message)) {
    return;
  }
  triggered.add(message);
  const process = (globalThis as { process?: { emitWarning?: (message: string, type: string) => void } }).process;
  if (typeof process?.emitWarning === 'function') {
    process.emitWarning(message, 'DeprecationWarning');
  } else if (typeof console !== 'undefined') {
    console.warn(`DeprecationWarning: ${message}`);
  }
};
