# Glace Shell

A custom shell interface built on [AGS](https://github.com/Aylur/ags).

## Development

You can either use Nix (recommended) or manually install AGS
and (optionally) [watchexec](https://github.com/watchexec/watchexec).

Set up the environment:

```bash
nix develop # only if you're using Nix, skip if not
npm run dev:init
```

Then run the project:

```bash
npm run dev # run normally
npm run dev:watch # run with hot reload (requires watchexec)
```
