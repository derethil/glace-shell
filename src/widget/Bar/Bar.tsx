import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import { Fzf } from "fzf";

const time = Variable("").poll(1000, "date");

export function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  const fzf = new Fzf(["hello", "world"]);
  const result = fzf.find("hello");

  return (
    <window
      className="Bar"
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
