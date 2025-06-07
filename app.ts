import { App } from "astal/gtk3";
import { Bar } from "@/features/Bar";
import { logger } from "@/lib/logs";
import { theme } from "@/lib/theme";

async function main() {
  await theme();
  render();
}

function render() {
  App.get_monitors().map(Bar);
}

App.start({
  instanceName: "glace",
  main: () => {
    main().catch((error: unknown) => logger.fatal(error));
  },
});
