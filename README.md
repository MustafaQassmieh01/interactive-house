# Interactive House

A distributed smart-home control platform that connects **web and Android clients** to a **Python TCP backend** and **Arduino-connected devices** through a shared message protocol.

The project explores the engineering problems behind a real multi-client IoT system: device registration, dynamic UI definitions, persistent state, protocol bridging, automation, role-based access control, sensors, scenes, and physical hardware integration.

## At a glance

| Area | Implementation |
| --- | --- |
| Backend | Python TCP server |
| Web | React frontend + Node.js WebSocket gateway |
| Mobile | Android / Kotlin client |
| Persistence | SQLite |
| Hardware | Arduino + Python hardware bridge |
| Protocol | NDJSON over TCP |
| Access control | Role-based access control (RBAC) |
| Automation | Sensors, rules and multi-device scenes |
| Device model | Dynamic registration + device-provided UI definitions |

## Architecture

```text
                         ┌──────────────────┐
                         │   React Web UI   │
                         └────────┬─────────┘
                                  │ WebSocket
                                  v
                         ┌──────────────────┐
                         │ Node.js Gateway  │
                         └────────┬─────────┘
                                  │ TCP / NDJSON
                                  │
┌──────────────────┐              v              ┌──────────────────┐
│ Android Client   │ ───────> Python TCP Server <────── Device Sims │
│ Kotlin           │           + SQLite           │      / Bridges   │
└──────────────────┘              │              └──────────────────┘
                                  │
                                  v
                         ┌──────────────────┐
                         │ Hardware Bridge  │
                         │      Python      │
                         └────────┬─────────┘
                                  │ Serial
                                  v
                         ┌──────────────────┐
                         │ Arduino Devices  │
                         └──────────────────┘
```

All communication goes through the central server. Clients do not talk directly to devices.

## Engineering highlights

### Dynamic device model

Devices register with the server and provide their own UI definitions. Web and Android clients can therefore render controls without hardcoding every device type into the client.

### Shared protocol across clients

The system uses the same NDJSON-based message model across the Android client, web gateway and device side. This keeps the central server independent of the client UI technology.

### WebSocket ↔ TCP protocol bridge

Browsers cannot use the project's raw TCP protocol directly, so the web client uses a Node.js gateway that bridges browser WebSockets to the Python TCP server.

```text
Browser → WebSocket → Node gateway → TCP → Python server
```

### Persistent state

SQLite stores device registration information, UI definitions, last-known device state and seeded users so the server can rebuild the system state after restart.

### Physical and simulated hardware

The hardware bridge supports both:

- a **simulation mode** for development without the original physical house;
- a **serial mode** for communicating with Arduino-connected hardware.

This means the complete architecture can still be demonstrated without access to the physical installation.

### Sensors and automation

The later iterations add motion, smoke and temperature sensing together with automation rules such as:

```text
Motion detected   → lights ON
Smoke detected    → alarm ON
High temperature  → fan ON
```

### Scenes

Multi-device actions can be grouped into scenes.

Example:

```text
Good Morning
- open window
- turn on fan
- turn on lights

Good Night
- close window
- turn off fan
- turn off lights
```

### Role-based access control

The system supports different user roles and restricts available devices based on permissions. For example, a caregiver account can be prevented from accessing selected devices such as the door or window.

### Multiple client types

The same backend can serve:

- Android clients;
- browser clients through the Node.js gateway;
- test clients;
- simulated devices;
- physical Arduino-connected devices.

## Fastest way to run the project

The simulation mode is the easiest way to run the full web flow without physical Arduino hardware.

### 1. Start the Python server

```bash
cd server
pip install -r requirements.txt
python server.py
```

Demo users are seeded into SQLite at startup.

```text
primary@email.com / primary123
caregiver@email.com / caregiver123
```

### 2. Start the simulated hardware bridge

```bash
cd device
python hardw_bridge.py --simulate
```

### 3. Start the Node.js WebSocket gateway

```bash
cd webbasedclient/backend/gateway
npm install
npm start
```

### 4. Start the React frontend

```bash
cd webbasedclient/frontend
npm install
npm run dev
```

### 5. Test the flow

Log in and verify that the client receives registered devices such as:

- LED lights;
- fan;
- window / servo;
- door;
- motion sensor;
- smoke sensor;
- temperature sensor;
- alarm.

A normal web action follows this path:

```text
Web UI
  → Node WebSocket gateway
  → Python TCP server
  → hardware bridge
  → device
```

State updates travel back through the same architecture to the client.

## Running with real Arduino hardware

Upload the included Arduino firmware, connect the board over USB and run the hardware bridge with the relevant serial port.

Example on Windows:

```bash
cd device
python hardw_bridge.py --port COM7
```

The higher-level architecture stays unchanged when switching between simulation and physical hardware.

## Android client

Start the Python server and either the simulated or physical hardware bridge, then open the Android project in Android Studio and run it on an emulator or device.

The Android client supports:

- login;
- dynamic device lists;
- device-specific controls;
- sensor information;
- scenes;
- device state updates;
- role-based visibility;
- voice command support.

## Project evolution

The project was developed iteratively. Each stage kept the end-to-end architecture working while adding another layer of functionality.

### Iteration 1 — architecture proof

- Python TCP server
- one simulated light
- Python CLI client
- device registration
- dynamic UI distribution
- in-memory state

### Iteration 2 — persistence and real clients

- SQLite persistence
- multiple simulated devices
- Android / Kotlin client
- React web client
- Node.js WebSocket gateway
- shared NDJSON message protocol

### Iteration 3 — physical hardware integration

- Arduino devices
- Python hardware bridge
- simulation and serial modes
- end-to-end control of physical devices

### Iterations 4–5 — automation and permissions

- motion, smoke and temperature sensors
- alarm / buzzer
- automation rules
- scenes
- RBAC
- UI improvements
- voice command integration
- additional validation and latency testing

## What this project demonstrates

This repository is primarily useful as an example of systems integration rather than a single isolated application. It combines several layers that have to cooperate correctly:

- TCP networking;
- WebSockets;
- message protocol design;
- concurrent clients;
- backend state management;
- persistence;
- Android development;
- React development;
- Node.js protocol bridging;
- embedded / Arduino integration;
- sensor-driven automation;
- access control;
- end-to-end testing.

## Current limitations

This is an academic / prototype system, not a production smart-home platform. Current limitations include:

- no encrypted device communication;
- seeded demo accounts instead of production account management;
- no cloud deployment;
- no production-grade secrets management;
- some functionality depends on prototype hardware assumptions.

These constraints are kept explicit so the repository demonstrates the implemented system without overstating its production readiness.

## Repository purpose

The goal of the project is to demonstrate a server-centric distributed architecture where different clients and hardware devices can interact through one consistent backend and protocol while remaining loosely coupled from one another.
