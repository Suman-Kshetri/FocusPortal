import { Server } from "socket.io";
import { registerQuestionSocket } from "./question.socket.js";

export const registerSocketRoutes = (io: Server) => {
   io.on("connection", (socket) => {
      // console.log($&)

      registerQuestionSocket(io, socket);

      socket.on("disconnect", () => {
         // console.log($&)
      });
   });
};
