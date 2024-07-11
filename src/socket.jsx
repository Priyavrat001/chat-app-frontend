import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";


const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("https://chat-app-backend-i5qs.onrender.com", { withCredentials: true }), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket }
