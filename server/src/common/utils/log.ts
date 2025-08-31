const skipLoggers = new Set<string>();

export function skipLogger(loggerName: string) {
  skipLoggers.add(loggerName);
}

export interface Logger {
  readonly name: string;
  info: (...msgs: any[]) => void;
  log: (...msgs: any[]) => void;
  warn: (...msgs: any[]) => void;
  error: (...msgs: any[]) => void;
}

export function getLog(loggerName: string): Logger {
  return logWrapper(loggerName);
}

function logWrapper(loggerName: string): Logger {
  if (skipLoggers.has(loggerName)) {
    return stubLogger(loggerName);
  }

  const prefix = `[${loggerName}] `;

  return {
    name: loggerName,
    info(...msgs: any[]) {
      console.info(prefix, ...msgs);
    },
    log(...msgs: any[]) {
      console.log(prefix, ...msgs);
    },
    warn(...msgs: any[]) {
      console.warn(prefix, ...msgs);
    },
    error(...msgs: any[]) {
      console.error(prefix, ...msgs);
    },
  };
}

function stubLogger(loggerName: string): Logger {
  return {
    name: loggerName,
    info(...msgs: any[]) {},
    log(...msgs: any[]) {},
    warn(...msgs: any[]) {},
    error(...msgs: any[]) {},
  };
}
