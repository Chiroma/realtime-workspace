# 🚀 SyncBoard: Real-Time Collaborative Workspace

A high-fidelity, real-time project management workspace built using **React 19**, **TypeScript**, **Tailwind CSS**, and **Material UI (MUI)**. This project demonstrates advanced frontend architecture, asynchronous state sync over WebSockets, and strict type safety in a responsive dashboard interface.

## 🛠️ Technical Stack

* **Framework:** React 19 (Vite-powered)
* **Language:** TypeScript (Strict Type Safety with `verbatimModuleSyntax`)
* **Styling:** Tailwind CSS v4 & Material UI v6
* **Icons:** MUI Icons Material
* **Networking:** Native WebSockets (Bidirectional Event Streaming)

---

## ✨ Key Features

### 🔄 Real-Time State Synchronization
* **Event-Driven UI:** Connected to a live WebSocket server to broadcast and ingest card movements across separate browser clients instantly.
* **Optimistic UI Updates:** UI updates immediately upon user interaction for zero perceived latency, gracefully catching asynchronous responses or failure loops over the socket wire.
* **Idempotent Event Handlers:** Generated a custom browser tab `CLIENT_ID` framework to stamp payloads, preventing network loopbacks and "double-jump" side effects from public echo frames.

### 📐 UI Architecture & Design Systems
* **Hybrid Styling System:** Implemented MUI's `<StyledEngineProvider injectFirst>` injection engine, combining heavy functional widgets (AppBars, Cards, IconButtons) with utility-first Tailwind spacing layout utilities seamlessly.
* **Custom React Hooks:** Encapsulated state event-driven networking listeners inside a modular `useWebSocket` custom hook, decoupling raw UI views from persistent protocol lifecycle scopes.

### 🛡️ Production-Grade TypeScript
* **Explicit Type Schemas:** Fully declared type structures isolating status variants (`'TODO' | 'IN_PROGRESS' | 'DONE'`) from explicit metadata payloads.
* **Type-Only Imports:** Adhered to strict compilation architectures to fully drop non-runtime interfaces from the final production bundle.

---

## 🚦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* npm or yarn

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/syncboard-workspace.git](https://github.com/your-username/syncboard-workspace.git)
    cd syncboard-workspace
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Local Development Server:**
    ```bash
    npm run dev
    ```

4.  **Test Multiplayer Functionality:**
    Open `http://localhost:5173` in **two separate browser windows** side-by-side. Drag or move cards in one window to watch the updates stream dynamically to the other in real time.

---

## 🏗️ Architectural Decisions Explained

* **Why WebSockets over Polling?** Instead of hammering an API endpoint every few seconds, WebSockets open a single persistent TCP connection, keeping server overhead minimal and reducing data consumption.
* **Why `useCallback` on Mutation Methods?** Wrapped the main array transformation handlers in `useCallback` to prevent garbage collection sweeps and unnecessary downstream re-renders across custom hook tracking scopes.
* **Strict Handshake Cleanup:** Implemented strict conditional checks inside the `useEffect` unmount state cleanup hook to intercept and safely isolate React StrictMode dual-mount event collisions during local profiling cycles.
