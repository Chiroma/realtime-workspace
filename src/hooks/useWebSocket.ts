import { useEffect, useRef } from "react";
import type { Task } from "../types/tasks";

const CLIENT_ID = Math.random().toString(36).substring(2, 9);

interface WebSocketMessage {
  type: "TASK_MOVED";
  senderId: string;
  payload: {
    id: string;
    direction: "forward" | "backward";
  };
}

export const useWebSocket = (
  onMessageReceived: (msg: WebSocketMessage) => void,
) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Current live community-maintained echo endpoint
    socketRef.current = new WebSocket("wss://echo-websocket.fly.dev/.ws");

    socketRef.current.onopen = () => {
      console.log("🔌 WebSocket Connected Successfully!");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        if (data.type === "TASK_MOVED" && data.senderId !== CLIENT_ID) {
          onMessageReceived(data);
        }
      } catch (e) {
        // Suppress parsing errors for non-matching server messages
      }
    };

    // Explicit error tracker to catch firewalls/blocks
    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket encountered an error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.log(
        `🔌 WebSocket Closed (Code: ${event.code}, Reason: ${event.reason})`,
      );
    };

    return () => {
      if (socketRef.current) {
        if (
          socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING
        ) {
          socketRef.current.close();
        }
      }
    };
  }, [onMessageReceived]);

  const sendTaskMove = (id: string, direction: "forward" | "backward") => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: "TASK_MOVED",
        senderId: CLIENT_ID,
        payload: { id, direction },
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("⚠️ Cannot send message: WebSocket connection is not open.");
    }
  };

  return { sendTaskMove };
};
