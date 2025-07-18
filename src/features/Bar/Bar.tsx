import { Variable } from "astal";
import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Fzf } from "fzf";
import { scss } from "@/lib/theme";

const time = Variable("").poll(1000, "date");

scss`
  $fg-color: #{"@theme_fg_color"};
  $bg-color: #{"@theme_bg_color"};

  window.Bar {
      background: transparent;
      color: $fg-color;
      font-weight: bold;

      >centerbox {
          background: $bg-color;
          border-radius: 10px;
          margin: 8px;
      }

      button {
          border-radius: 8px;
          margin: 2px;
      }
  }
`;

export function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const fzf = new Fzf(["hello", "world"]);
  const result = fzf.find("hello");

  return (
    <window
      visible
      cssClasses={["Bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox>
        <button onClicked="echo hello" halign={Gtk.Align.CENTER}>
          {JSON.stringify(result)}
        </button>
        <box />
        <button onClicked={() => print("hello")} halign={Gtk.Align.CENTER}>
          <label label={time()} />
        </button>
      </centerbox>
    </window>
  );
}
