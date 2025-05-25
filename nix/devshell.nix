{
  pkgs,
  system,
  inputs,
}:
pkgs.mkShell {
  packages = [
    inputs.ags.packages.${system}.agsFull
    pkgs.watchexec
  ];
}
