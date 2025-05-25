{
  pkgs,
  system,
  inputs,
}:
pkgs.mkShell {
  ASTAL_GJS_PATH = "${inputs.astal}/lang/gjs";
  packages = [
    inputs.ags.packages.${system}.agsFull
    pkgs.watchexec
  ];
}
