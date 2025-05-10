{
  pkgs,
  system,
  config,
  inputs,
}: let
  glace-dev = pkgs.writeShellScriptBin "glace-dev" ''
    ${pkgs.watchexec}/bin/watchexec -r -w $FLAKE_ROOT -- ags run -d $FLAKE_ROOT
  '';
in
  pkgs.mkShell {
    inputsFrom = [config.flake-root.devShell];
    packages = [
      inputs.ags.packages.${system}.agsFull
      pkgs.watchexec
      glace-dev
    ];
  }
