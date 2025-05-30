import { App } from "astal/gtk3";
import { theme } from "@/lib/theme";
import { Bar } from "@/widget/Bar";

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
      console.error(error);
      App.quit();
    }
  },
});
