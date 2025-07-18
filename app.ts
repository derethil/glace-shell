import "gi://Gtk?version=4.0";
import { App } from "astal/gtk4";
import { Bar } from "@/features/Bar";
import { logger } from "@/lib/logs";
import { handleRequest } from "@/lib/messageRouter";
import { theme } from "@/lib/theme";

async function main() {
  await theme();
  render();
}

function render() {
  App.get_monitors().map(Bar);
}

App.start({
  gtkTheme: "Adwaita",
  instanceName: "glace",
  requestHandler: handleRequest,
  main: () => {
    main().catch((error: unknown) => logger.fatal(error));
  },
});
