{
  pkgs,
  system,
  inputs,
  config,
}: let
  package = builtins.fromJSON (builtins.readFile ../../package.json);
  npmDeps = pkgs.importNpmLock.buildNodeModules {
    inherit (pkgs) nodejs;
    npmRoot = ../../.;
    package = builtins.removeAttrs package ["devDependencies"];
  };

  glaceSource = pkgs.runCommand "glace-source" {} ''
    mkdir -p $out
    cp -r ${builtins.filterSource (path: type: baseNameOf path != "node_modules") ../../.}/* $out/
    mkdir -p $out/node_modules
    cp -r ${npmDeps}/node_modules/* $out/node_modules/
    mkdir -p $out/node_modules/astal
    cp -r ${inputs.astal}/lang/gjs/src/* $out/node_modules/astal/
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
