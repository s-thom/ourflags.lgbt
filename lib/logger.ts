import P, { pino } from "pino";

export interface Logger {
  trace: (message: string, obj?: any) => void;
  debug: (message: string, obj?: any) => void;
  info: (message: string, obj?: any) => void;
  warn: (message: string, obj?: any) => void;
  error: (message: string, obj?: any) => void;
  fatal: (message: string, obj?: any) => void;
  /** @deprecated */
  instance: P.Logger;
}

function createLogFn(
  logger: P.Logger,
  level: Exclude<keyof Logger, "instance">
) {
  return (message: any, obj = {}) => logger[level](obj, message);
}

function wrapLogger(logger: P.Logger): Logger {
  return {
    trace: createLogFn(logger, "trace"),
    debug: createLogFn(logger, "debug"),
    info: createLogFn(logger, "info"),
    warn: createLogFn(logger, "warn"),
    error: createLogFn(logger, "error"),
    fatal: createLogFn(logger, "fatal"),
    instance: logger,
  };
}

const base = pino({
  level: process.env.NEXT_PUBLIC_LOGGER_LEVEL ?? "info",
  formatters: { level: (label) => ({ level: label }) },
});

export function getLogger(name: string): Logger {
  const child = base.child({ module: name });
  return wrapLogger(child);
}

export function getMethodLogger(method: string, baseInstance: Logger): Logger {
  const child = baseInstance.instance.child({ method });
  return wrapLogger(child);
}

type Marker = (message: string) => void;

export function getTracer(logger: Logger, obj?: any): Marker {
  return (message: string) => logger.trace(message, obj);
}
