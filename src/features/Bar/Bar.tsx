import { Astal, Gtk, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createPoll } from "ags/time";
import { Fzf } from "fzf";
import { scss } from "@/lib/theme";

scss`
  $fg-color: #{"@theme_fg_color"};
  $bg-color: #{"@theme_bg_color"};

  window.Bar {
      background: transparent;
      color: $fg-color;
      font-weight: bold;

      > centerbox {
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
  const time = createPoll("", 1000, "date");
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const fzf = new Fzf(["hello", "world"]);
  const result = fzf.find("hello");

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        <button $type="start" hexpand halign={Gtk.Align.CENTER}>
          {JSON.stringify(result)}
        </button>
        <box $type="center">
          <label>hi</label>
        </box>
        <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
          <label label={time} />
          <popover>
            <Gtk.Calendar />
          </popover>
        </menubutton>
      </centerbox>
    </window>
  );
}
