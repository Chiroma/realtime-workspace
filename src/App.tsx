import { useState, useCallback } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useWebSocket } from "./hooks/useWebSocket";
import type { Task } from "./types/tasks";
import type { TaskStatus } from "./types/tasks";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup Stripe Webhooks",
    description: "Configure local listener using Stripe CLI.",
    status: "TODO",
  },
  {
    id: "2",
    title: "Integrate Gemini API",
    description: "Implement service layer logic for prompt generation.",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    title: "Dockerize Platform",
    description: "Configure Laravel Sail for environment parity.",
    status: "DONE",
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Core execution function that actually shifts state arrays
  const executeMove = useCallback(
    (id: string, direction: "forward" | "backward") => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== id) return task;

          let newStatus: TaskStatus = task.status;
          if (direction === "forward") {
            if (task.status === "TODO") newStatus = "IN_PROGRESS";
            else if (task.status === "IN_PROGRESS") newStatus = "DONE";
          } else {
            if (task.status === "DONE") newStatus = "IN_PROGRESS";
            else if (task.status === "IN_PROGRESS") newStatus = "TODO";
          }

          return { ...task, status: newStatus };
        }),
      );
    },
    [],
  );

  // Set up WebSocket listener
  const handleWebSocketMessage = useCallback(
    (msg: any) => {
      // This executes when an event comes over the wire from another client
      executeMove(msg.payload.id, msg.payload.direction);
    },
    [executeMove],
  );

  const { sendTaskMove } = useWebSocket(handleWebSocketMessage);

  // Triggered when a physical user clicks a button
  const handleUserMoveClick = (
    id: string,
    direction: "forward" | "backward",
  ) => {
    // 1. Update our screen instantly (Optimistic UI update)
    executeMove(id, direction);
    // 2. Broadcast to everyone else via WebSockets
    sendTaskMove(id, direction);
  };

  const renderColumn = (title: string, status: TaskStatus) => {
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-4 min-h-[500px]">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
          <h2 className="font-semibold text-slate-200">{title}</h2>
          <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {columnTasks.length}
          </span>
        </div>

        {columnTasks.map((task) => (
          <Card
            key={task.id}
            className="bg-slate-900 border border-slate-800 shadow-sm hover:border-indigo-500/50 transition-colors"
          >
            <CardContent className="p-4 flex flex-col gap-2">
              <Typography
                variant="body1"
                className="font-semibold text-white tracking-tight"
              >
                {task.title}
              </Typography>
              <Typography variant="body2" className="text-slate-400 text-xs">
                {task.description}
              </Typography>

              <div className="flex justify-end gap-1 mt-2 border-t border-slate-800/60 pt-2">
                {status !== "TODO" && (
                  <IconButton
                    size="small"
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleUserMoveClick(task.id, "backward")}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                )}
                {status !== "DONE" && (
                  <IconButton
                    size="small"
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={() => handleUserMoveClick(task.id, "forward")}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <StyledEngineProvider injectFirst>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <AppBar
          position="static"
          className="bg-slate-900 border-b border-slate-800 shadow-none"
        >
          <Toolbar className="flex justify-between">
            <div className="flex items-center gap-2">
              <AssignmentIcon className="text-indigo-500" />
              <Typography
                variant="h6"
                component="div"
                className="font-bold tracking-tight text-white"
              >
                SyncBoard{" "}
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded ml-2">
                  Real-Time
                </span>
              </Typography>
            </div>
            <Button
              variant="contained"
              className="bg-indigo-600 hover:bg-indigo-700 capitalize font-medium"
            >
              + New Task
            </Button>
          </Toolbar>
        </AppBar>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Project Workspace</h1>
            <p className="text-sm text-slate-400">
              Collaborate with your team in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderColumn("To Do", "TODO")}
            {renderColumn("In Progress", "IN_PROGRESS")}
            {renderColumn("Done", "DONE")}
          </div>
        </main>
      </div>
    </StyledEngineProvider>
  );
}
