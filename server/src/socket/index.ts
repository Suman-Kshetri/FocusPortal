import { Server } from "socket.io";
import { registerQuestionSocket } from "./question.socket.js";

export const registerSocketRoutes = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    registerQuestionSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};