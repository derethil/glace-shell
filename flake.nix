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
      systems = import ./nix/systems.nix;
      imports = [inputs.flake-root.flakeModule];
      perSystem = {
        config,
        pkgs,
        system,
        ...
      }: {
        packages = import ./nix/packages/glace.nix {inherit pkgs system inputs config;};
        devShells.default = import ./nix/devshell.nix {inherit pkgs system config inputs;};
      };
    };
}
