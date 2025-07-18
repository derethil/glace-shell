# Glace Shell

A custom shell interface built on [AGS](https://github.com/Aylur/ags).

## Development

It is recommended to use a Nix shell to pin dependencies, but you have the option
of manually installing AGS and (optionally) [watchexec](https://github.com/watchexec/watchexec).

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

## Bundling

Again, you can use Nix to bundle and install Glace, or build
the project manually using:

```bash
npm run dev:init
npm run build
./dist/glace-shell # run the shell
```

Once you have the bundled script, place it in your `$PATH`
and you can run it anywhere, assuming
AGS has been installed.
