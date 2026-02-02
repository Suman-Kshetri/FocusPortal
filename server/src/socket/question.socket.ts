import { Server, Socket } from "socket.io";

export const registerQuestionSocket = (io: Server, socket: Socket) => {
  socket.join("questions-feed");
    console.log(`${socket.id} auto-joined questions-feed`);
};