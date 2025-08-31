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
