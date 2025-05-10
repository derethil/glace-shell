{
  pkgs,
  system,
  inputs,
  config,
}: let
  npmDeps = pkgs.importNpmLock.buildNodeModules {
    npmRoot = ./.;
    inherit (pkgs) nodejs;
  };

  glaceSource =
    pkgs.runCommand "glace-source" {
      nativeBuildInputs = [pkgs.symlinkJoin];
    } ''
      mkdir -p $out
      cp -r ${builtins.filterSource (path: type: baseNameOf path != "node_modules") ./.}/* $out/
      mkdir -p $out/node_modules
      cp -r ${npmDeps}/node_modules/* $out/node_modules/
      mkdir -p $out/node_modules/astal
      cp -r ${inputs.astal-src}/lang/gjs/src/* $out/node_modules/astal/
    '';
in {
  default = inputs.ags.lib.bundle {
    inherit pkgs;
    src = glaceSource;
    name = "glace";
    entry = "app.ts";
    gtk4 = false;
    extraPackages = [
      inputs.ags.packages.${system}.agsFull
      pkgs.nodejs
    ];
  };
}
