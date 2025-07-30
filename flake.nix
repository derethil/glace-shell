{
  description = "Glace - A Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} ({moduleWithSystem, ...}: {
      systems = [
        "x86_64-linux"
        "aarch64-linux" # not actively supported, but may work
      ];
      flake = {
        flakeModules.default = moduleWithSystem (
          perSystem @ {config, ...}: {
            imports = [./nix/modules/glace-shell.nix];
            services.glace-shell.package = perSystem.config.packages.default;
          }
        );
      };
      perSystem = {
        config,
        pkgs,
        system,
        ...
      }: {
        packages = import ./nix/packages/glace.nix {inherit pkgs system inputs config;};
        devShells.default = import ./nix/devshell.nix {inherit pkgs system inputs;};
      };
    });
}
