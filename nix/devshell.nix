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
    shellHook = ''
      if [ ! -d "$FLAKE_ROOT/@girs" ] || [ ! "$(ls -A "$FLAKE_ROOT/@girs" 2>/dev/null)" ]; then
        ags types -d $FLAKE_ROOT
      fi
    '';
  }
