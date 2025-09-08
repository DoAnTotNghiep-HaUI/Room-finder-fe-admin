import { progress } from "framer-motion";
import { io, Socket } from "socket.io-client";

let socket: Socket;
// export const initializeSocket = (userId: string) => {
//   socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
//     query: { userId },
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     transports: ["websocket"],
//   });

//   return socket;
// };
export const initializeSocket = (userId: string) => {
  socket = io(`${import.meta.env.VITE_SOCKET_URL}`, {
    path: "/chat-socket",
    // auth: { token },
    query: { userId },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"],
  });
  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);

    // some additional description, for example the status code of the initial HTTP response
    console.log(err.name);

    // some additional context, for example the XMLHttpRequest object
    console.log(err.stack);
  });
  return socket;
};
export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
