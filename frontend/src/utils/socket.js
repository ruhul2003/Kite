import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function joinUser(userId) {
  const s = getSocket();
  if (s.connected) {
    s.emit("join", userId);
  } else {
    s.on("connect", () => {
      s.emit("join", userId);
    });
  }
}

export function sendRealtimeMessage(messageData) {
  const s = getSocket();
  s.emit("send_message", messageData);
}

export function sendTypingIndicator(senderId, receiverId, isTyping) {
  const s = getSocket();
  s.emit("typing", { senderId, receiverId, isTyping });
}

export function onReceiveMessage(callback) {
  const s = getSocket();
  s.on("receive_message", callback);
  return () => s.off("receive_message", callback);
}

export function onMessageSent(callback) {
  const s = getSocket();
  s.on("message_sent", callback);
  return () => s.off("message_sent", callback);
}

export function onUserTyping(callback) {
  const s = getSocket();
  s.on("user_typing", callback);
  return () => s.off("user_typing", callback);
}

export function onOnlineUsers(callback) {
  const s = getSocket();
  s.on("online_users", callback);
  return () => s.off("online_users", callback);
}
