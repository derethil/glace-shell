import { GLib, readFileAsync } from "astal";
import { Color, colorize } from "./colorize";
import { App } from "astal/gtk3";

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LoggerOptions {
  level?: LogLevel;
  colorize?: boolean;
}

class Logger {
  private _level = LogLevel.INFO;
  private _colorize = true;
  private _sourceLines: Record<string, string[]> = {};

  // PUBLIC METHODS

  public constructor(opts: LoggerOptions = {}) {
    if (opts.level) this._level = opts.level;
    if (opts.colorize !== undefined) this._colorize = opts.colorize;
    this.checkEnvironment();
  }

  public setLogLevel(level: LogLevel) {
    this._level = level;
  }

  public getLogLevel() {
    return this._level;
  }

  // LOGGERS

  public info(message: string) {
    this._log(message, LogLevel.INFO);
  }

  public debug(message: string) {
    this._log(message, LogLevel.DEBUG);
  }

  public warn(message: string) {
    this._log(message, LogLevel.WARN);
  }

  public error(message: string) {
    this._log(message, LogLevel.ERROR);
  }

  public fatal(message: string) {
    this._log(message, LogLevel.FATAL).then(() => App.quit());
  }

  // PRIVATE METHODS

  private checkEnvironment() {
    const env = GLib.getenv("GLACE_LOG_LEVEL")?.toUpperCase();
    const level = LogLevel[env as keyof typeof LogLevel];
    if (level === undefined) return;
    this._level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this._level;
  }

  private async _log(message: string, level: LogLevel) {
    if (!this.shouldLog(level)) return;

    const levelName = LogLevel[level];
    const timestamp = new Date().toISOString();
    const { file, func } = await this.getLogSource();

    if (!this._colorize) {
      print(`[${timestamp}] [${levelName}] [${file}:${func}] ${message}`);
    }

    let log = "";
    log += colorize(`[${timestamp}] `, Color.Cyan);
    log += colorize(`[${levelName}] `, this.logColor(level));
    log += colorize(`[${file}:${func}]`, Color.Blue);
    print(`${log} ${message}`);
  }

  private logColor(level: LogLevel): Color {
    return {
      [LogLevel.DEBUG]: Color.Gray,
      [LogLevel.INFO]: Color.Green,
      [LogLevel.WARN]: Color.Yellow,
      [LogLevel.ERROR]: Color.Red,
      [LogLevel.FATAL]: Color.Magenta,
    }[level];
  }

  private async getLogSource() {
    const trace = this.parseStackTrace();
    const source = await this.findSourceFile(trace.file, trace.line);
    return { func: trace.func, file: source || trace.file };
  }

  private parseStackTrace() {
    const lines = new Error().stack?.split("\n");
    const unknown = { file: "unknown", func: "unknown", line: -1 };

    if (!lines || lines.length < 5) return unknown;

    const sourceLine = lines[4].trim();
    const match = sourceLine.match(/([^@]+)@(.+?):(\d+):(\d+)/);
    if (!match) return unknown;

    return {
      func: match[1],
      file: match[2].split(":")[1],
      line: Number(match[3]),
    };
  }

  private async readBundledFile(file: string, line: number) {
    if (this._sourceLines[file] && this._sourceLines[file].length >= line) {
      return this._sourceLines[file];
    } else {
      const compiled = await readFileAsync(file);
      const lines = compiled.toString().split("\n");
      this._sourceLines[file] = lines;
      return lines;
    }
  }

  private async findSourceFile(file: string, line: number) {
    const lines = await this.readBundledFile(file, line);

    for (let i = line - 1; i >= 0; i--) {
      const fileComment = lines[i].match(/^\s*\/\/\s*(.*\.(ts|js|tsx|jsx))$/);
      if (fileComment) return fileComment[1];
    }
  }
}

export const logger = new Logger({ level: LogLevel.INFO });
