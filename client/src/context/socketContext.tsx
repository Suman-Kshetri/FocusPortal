import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context.socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      // console.log($&)
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      // console.log($&)
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
