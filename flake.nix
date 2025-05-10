{
  description = "Glace - A Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-root.url = "github:srid/flake-root";
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      systems = ["x86_64-linux" "aarch64-linux"];
      imports = [inputs.flake-root.flakeModule];
      perSystem = {
        config,
        pkgs,
        system,
        ...
      }: let
        glace-dev = pkgs.writeShellScriptBin "glace-dev" ''
          ${pkgs.watchexec}/bin/watchexec -r -w $FLAKE_ROOT -- ags run -d $FLAKE_ROOT
        '';

        npmDeps = pkgs.importNpmLock.buildNodeModules {
          npmRoot = ./.;
          inherit (pkgs) nodejs;
        };

        glaceSource = pkgs.runCommand "glace-source" {} ''
          mkdir -p $out
          cp -r ${builtins.filterSource (path: type: baseNameOf path != "node_modules") ./.}/* $out/

          mkdir -p $out/node_modules
          cp -r ${npmDeps}/node_modules/* $out/node_modules/

          mkdir -p $out/node_modules/astal
          cp -r ${inputs.astal}/lang/gjs/src/* $out/node_modules/astal/
        '';
      in {
        packages.default = inputs.ags.lib.bundle {
          inherit pkgs;
          src = glaceSource;
          name = "glace";
          entry = "app.ts";
          gtk4 = false;
          extraPackages = [
            inputs.ags.packages.${system}.agsFull
            # For building node modules
            pkgs.nodejs
          ];
        };

        devShells.default = pkgs.mkShell {
          inputsFrom = [config.flake-root.devShell];
          packages = with pkgs; [
            inputs.ags.packages.${system}.agsFull
            watchexec
            glace-dev
          ];
        };
      };
    };
}
