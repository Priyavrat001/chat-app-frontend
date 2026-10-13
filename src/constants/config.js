export const server = import.meta.env.VITE_SERVER;
export const socketServer =
  import.meta.env.VITE_SOCKET_SERVER ||
  (server ? new URL(server).origin : "http://localhost:4000");