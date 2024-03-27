import { useContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const getSocket = useContext(SocketContext);

const SocketProvider = ({children})=>{

const socket = useMemo(() => io("http://localhost:4000", {withCredentials:true}), [second]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};

export {SocketProvider, getSocket};