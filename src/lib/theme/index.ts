import { exec, idle, Variable, writeFileAsync } from "astal";
import { App } from "astal/gtk3";

const stylesheets = Variable<Array<string>>([]);

export function scss(sheet: TemplateStringsArray | { default: string }) {
  const style = "default" in sheet ? sheet.default : sheet;
  stylesheets.set([...stylesheets.get(), style as string]);
}

export async function theme() {
  const apply = async () => {
    const tmp = "/tmp/glace";
    exec(`mkdir -p ${tmp}`);
    const scss = `${tmp}/main.scss`;
    const css = `${tmp}/main.css`;
    const sheet = stylesheets.get().join("\n");

    await writeFileAsync(scss, sheet);
    exec(`sass ${scss} ${css}`);
    App.apply_css(css);
  };

  stylesheets.subscribe(apply);

  return new Promise((resolve, reject) => {
    apply()
      .then(() => idle(() => resolve(null)))
      .catch(reject);
  });
}
