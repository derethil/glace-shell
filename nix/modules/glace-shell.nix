{
  config,
  lib,
  ...
}: let
  cfg = config.services.glace-shell;
in {
  options.services.glace-shell = {
    enable = lib.mkEnableOption "glace-shell desktop shell";

    package = lib.mkOption {
      type = lib.types.package;
      description = "The glace-shell package to use";
    };

    systemd = {
      enable = lib.mkOption {
        type = lib.types.bool;
        default = cfg.enable;
        description = "Whether to enable the systemd user service for glace-shell";
      };

      extraServiceConfig = lib.mkOption {
        type = lib.types.attrs;
        default = {};
        description = "Extra configuration for the systemd service";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.user.services.glace-shell = lib.mkIf cfg.systemd.enable {
      Unit = {
        Description = "A desktop shell built with AGS.";
        PartOf = ["graphical-session.target"];
        After = ["graphical-session.target"];
      };
      Install = {
        WantedBy = ["graphical-session.target"];
      };
      Service = lib.mkMerge [
        {
          ExecStart = "${cfg.package}/bin/glace-shell";
        }
        cfg.systemd.extraServiceConfig
      ];
    };
  };
}
