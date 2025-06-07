type Handler = (args: string[]) => unknown;

const handlers = new Map<string, Handler>();

export function registerHandler(command: string, fn: Handler) {
  handlers.set(command, fn);
}

export function handleRequest(
  request: string,
  respond: (payload: unknown) => void,
) {
  const [command, ...args] = request.split(" ");
  const handler = handlers.get(command);

  if (!handler) {
    respond(`no handler for command: ${command}`);
  } else {
    respond(handler(args));
  }
}
