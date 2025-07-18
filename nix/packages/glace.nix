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
in {
  default = pkgs.stdenv.mkDerivation {
    pname = "glace-shell";
    version = package.version;
    src = builtins.filterSource (path: type: baseNameOf path != "node_modules") ../../.;

    nativeBuildInputs = with pkgs; [
      wrapGAppsHook
      gobject-introspection
      inputs.ags.packages.${system}.default
    ];

    buildInputs = with pkgs; [
      # Required for ags bundle
      gtk4
      glib
      inputs.astal.packages.${system}.io
      inputs.astal.packages.${system}.astal4
      # Optional astal libraries
      inputs.ags.packages.${system}.agsFull # TODO: cherry pick packages
    ];

    buildPhase = ''
      runHook preBuild

      mkdir -p node_modules
      cp -r ${npmDeps}/node_modules/* node_modules/
      chmod -R +w node_modules

      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall

      mkdir -p $out/bin
      ags bundle app.ts $out/bin/glace-shell

      runHook postInstall
    '';

    meta = with pkgs.lib; {
      description = "Glace - A Desktop Shell";
      license = licenses.mit;
      platforms = platforms.linux;
    };
  };
}
