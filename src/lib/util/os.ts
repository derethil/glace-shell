import { execAsync } from "ags/process";
import GLib from "gi://GLib";

export async function bash(
  strings: TemplateStringsArray | string,
  ...values: unknown[]
) {
  const cmd =
    typeof strings === "string"
      ? strings
      : strings.flatMap((str, i) => str + String(values[i])).join("");

  return execAsync(["bash", "-c", cmd]);
}

export function dependencies(...bins: string[]) {
  const missing = bins.filter((bin) => !GLib.find_program_in_path(bin));

  if (missing.length > 0) {
    printerr(`missing dependencies: ${missing.join(", ")}`);
  }

  return missing.length === 0;
}
