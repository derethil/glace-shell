import "@/lib/logs";
import { App } from "astal/gtk3";
import { theme } from "@/lib/theme";
import { Bar } from "@/features/Bar";
import { logger } from "@/lib/logs";

function main() {
  App.get_monitors().map(Bar);
}

App.start({
  instanceName: "glace",
  main: async () => {
    try {
      await theme();
      main();
    } catch (error) {
      logger.fatal(error);
    }
  },
});
