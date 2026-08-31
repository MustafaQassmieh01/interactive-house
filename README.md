# Interactive House

**Distributed smart-home platform spanning browser, Android, backend networking and physical hardware.**

React • Node.js • WebSockets • Python • TCP/IP • NDJSON • SQLite • Kotlin • Arduino

Interactive House is a multi-client IoT system where web and Android applications control simulated or physical home devices through a central Python server. The interesting part is not turning a light on — it is making several different technologies communicate reliably through one protocol while keeping clients and devices loosely coupled.

> **My focus:** networking and systems integration. I built the WebSocket ↔ TCP gateway that made the existing TCP backend accessible from a browser, including message framing, connection lifecycle handling and per-client TCP connections. I later extended the React protocol/client flow to support multi-device scene commands.

## What I built

### WebSocket ↔ TCP gateway

The backend already communicated using **NDJSON over raw TCP**. Browsers cannot connect to arbitrary TCP sockets, so the web client needed a transport bridge.

I implemented the Node.js gateway between the React application and Python server:

```text
React browser client
        │
        │ WebSocket / JSON
        ▼
┌──────────────────────┐
│  Node.js Gateway     │  ← my main contribution
│                      │
│  WS ↔ TCP bridge     │
│  NDJSON buffering    │
│  connection cleanup  │
│  error handling      │
└──────────┬───────────┘
           │ TCP / NDJSON
           ▼
     Python Server
```

The gateway:

- accepts WebSocket connections from browser clients;
- opens a dedicated TCP connection to the Python server for each client;
- converts WebSocket JSON messages into newline-delimited TCP messages;
- buffers TCP data until complete NDJSON messages are available;
- forwards backend state updates back to the browser in real time;
- handles malformed JSON and socket failures without crashing the client flow;
- closes the paired connection when either side disconnects.

That allowed the web application to use the **same backend protocol as the native clients without changing the Python server architecture**.

### Scene command integration

I also extended the React-side protocol and client state flow to support **multi-device scenes** such as `Good Morning` and `Good Night`.

Instead of sending several unrelated device commands from the browser, the client can send a scene identifier through the same message pipeline:

```text
React UI
   ↓
trigger_scene
   ↓
WebSocket gateway
   ↓
Python server
   ↓
multiple device actions
```

This included the protocol message builder, client-side send flow and scene controls in the UI.

### Evidence in the repository

- [`Implement WebSocket-TCP gateway bridge for web client`](https://github.com/bhavikbhagwani/interactive-house/commit/6b06e71ea755b5ec93bbde155890fa25e7d6a276)
- [`Add scene trigger buttons`](https://github.com/bhavikbhagwani/interactive-house/commit/16dcad95e52807f86e03fc74fb1b61ee9cb6a720)

## Full system architecture

```text
                         ┌──────────────────┐
                         │   React Web UI   │
                         └────────┬─────────┘
                                  │ WebSocket
                                  ▼
                         ┌──────────────────┐
                         │ Node.js Gateway  │
                         └────────┬─────────┘
                                  │ TCP / NDJSON
                                  ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Android Client   │ ──▶ │ Python TCP Server│ ◀── │ Device Simulators│
│ Kotlin           │     │ + SQLite         │     └──────────────────┘
└──────────────────┘     └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Hardware Bridge  │
                         │ Python           │
                         └────────┬─────────┘
                                  │ Serial
                                  ▼
                         ┌──────────────────┐
                         │ Arduino Hardware │
                         └──────────────────┘
```

All application traffic goes through the central server. Clients never communicate directly with devices.

## Why this project is interesting

This project combines several problems that usually appear separately in coursework:

- **TCP networking** and message framing;
- **WebSockets** for real-time browser communication;
- **protocol translation** between browser and backend transports;
- **concurrent client connections**;
- **dynamic device registration**;
- **device-provided UI definitions**;
- **persistent state** with SQLite;
- **Android/Kotlin and React clients** using the same backend;
- **Arduino hardware integration** through a Python bridge;
- **sensor-driven automation**;
- **role-based access control**;
- **multi-device scenes**;
- **simulation vs. physical hardware** using the same architecture.

The result is a system where changing the client technology or replacing simulated devices with physical hardware does not require redesigning the entire backend.

## Features

| Area | Implementation |
| --- | --- |
| Backend | Python TCP server |
| Web | React + Node.js WebSocket gateway |
| Mobile | Android / Kotlin |
| Protocol | NDJSON over TCP |
| Browser transport | WebSockets |
| Persistence | SQLite |
| Hardware | Arduino + Python serial bridge |
| Devices | Dynamic registration + UI definitions |
| Automation | Motion, smoke and temperature rules |
| Access | Role-based access control |
| Scenes | Multi-device `Good Morning` / `Good Night` actions |
| Development | Physical and simulated hardware modes |

## Run it without the original house

The project includes a **simulation mode**, so the end-to-end architecture can still be demonstrated without access to the physical Arduino installation.

### 1. Python server

```bash
cd server
pip install -r requirements.txt
python server.py
```

Demo accounts:

```text
primary@email.com / primary123
caregiver@email.com / caregiver123
```

### 2. Simulated hardware bridge

```bash
cd device
python hardw_bridge.py --simulate
```

### 3. WebSocket ↔ TCP gateway

```bash
cd webbasedclient/backend/gateway
npm install
npm start
```

### 4. React frontend

```bash
cd webbasedclient/frontend
npm install
npm run dev
```

A normal command then travels through the complete stack:

```text
Browser → WebSocket → Node.js Gateway → TCP → Python Server → Device
```

and state updates travel back to the browser in real time.

## Example system behavior

The final system supports devices and sensors including lights, fan, door, window/servo, motion sensor, smoke sensor, temperature sensor and alarm.

Automation rules include:

```text
Motion detected  → lights ON
Smoke detected   → alarm ON
High temperature → fan ON
```

Scenes can coordinate several devices at once:

```text
Good Morning → open window + fan on + lights on
Good Night   → close window + fan off + lights off
```

Role-based permissions can also restrict which devices a caregiver is allowed to access.

## Engineering challenges

### Bridging two networking models

The browser communicates naturally over WebSockets while the existing backend uses raw TCP. The challenge was preserving the server's protocol while translating transports at the edge instead of rewriting the backend around the browser.

### TCP is a stream, not a message queue

A TCP `data` event is not guaranteed to contain exactly one JSON message. The gateway therefore keeps a receive buffer and only parses data once a newline delimiter indicates a complete NDJSON frame.

### Connection ownership

Each browser WebSocket owns a corresponding backend TCP connection. Disconnecting either side requires cleaning up the other side to avoid stale sockets and resource leaks.

### Keeping the architecture hardware-independent

The same higher-level clients and server work whether the device layer is simulated or connected to Arduino hardware over serial. That separation makes development and testing possible even when the physical installation is unavailable.

## Tech stack

**Languages:** JavaScript, Python, Kotlin, C/C++  
**Frontend:** React, Vite  
**Networking:** TCP/IP, WebSockets, NDJSON  
**Backend:** Python socket server, Node.js gateway  
**Data:** SQLite  
**Mobile:** Android / Kotlin  
**Embedded:** Arduino, serial communication  
**Workflow:** Git, iterative team development

## Project context

Interactive House was developed as a **team university project**. The complete repository contains contributions from several developers. This fork highlights the areas I personally worked on while preserving the full system so the integration can be understood in context.

It is a prototype rather than a production smart-home platform: communication is not end-to-end encrypted, demo users are seeded locally, and there is no production cloud deployment or secrets infrastructure.

Those limitations are explicit because the value of this project is the engineering underneath it: **networking, protocol design, real-time communication and integration across web, backend and hardware boundaries.**
