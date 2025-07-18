{
  pkgs,
  system,
  inputs,
}:
pkgs.mkShell {
  AGS_LIB_PATH = "${inputs.ags.packages.${system}.gjsPackage}/share/ags/js";
  packages = [
    inputs.ags.packages.${system}.agsFull
    pkgs.watchexec
  ];
}
