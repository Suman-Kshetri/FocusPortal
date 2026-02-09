import { Server, Socket } from "socket.io";

export const registerQuestionSocket = (io: Server, socket: Socket) => {
   socket.on("join:questions-feed", () => {
      socket.join("questions-feed");
      console.log(`${socket.id} joined questions-feed`);
   });

   socket.on("leave:questions-feed", () => {
      socket.leave("questions-feed");
      console.log(`${socket.id} left questions-feed`);
   });
};
