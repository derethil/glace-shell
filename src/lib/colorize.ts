const Reset = "\x1b[0m";

export enum Color {
  Black = "\x1b[30m",
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Blue = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan = "\x1b[36m",
  White = "\x1b[37m",
  Gray = "\x1b[90m",
}

export enum BgColor {
  Black = "\x1b[40m",
  Red = "\x1b[41m",
  Green = "\x1b[42m",
  Yellow = "\x1b[43m",
  Blue = "\x1b[44m",
  Magenta = "\x1b[45m",
  Cyan = "\x1b[46m",
  White = "\x1b[47m",
  Gray = "\x1b[100m",
}

interface ColorizeOptions {
  bg?: BgColor;
}

export function colorize(
  text: string,
  color: Color,
  options: ColorizeOptions = {},
) {
  return `${color}${options.bg ?? ""}${text}${Reset}`;
}
