# Glace Shell

## Development

If you're on Nix:

```bash
nix develop    # Enter the devshell 
npm install    # Install NPM dependencies
glace-dev      # Start glace-shell hot reload script
```

Otherwise, first install [AGS](https://github.com/aylur/ags), then run

```bash
ags types -d ./.   # Generate GJS types
npm install        # Install NPM dependencies
ags run -d $(pwd)  # Start glace-shell (no hot reload)
```
