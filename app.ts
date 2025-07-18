import "gi://Gtk?version=4.0";
import App from "ags/gtk4/app";
import { Bar } from "@/features/Bar";
import { logger } from "@/lib/logs";
import { theme } from "@/lib/theme";

async function init() {
  await theme();
}

function render() {
  App.get_monitors().map(Bar);
}

App.start({
  gtkTheme: "Adwaita",
  instanceName: "glace",
  main: () => {
    init().catch((error: unknown) => logger.fatal(error));
    render();
  },
});
