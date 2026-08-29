# Interactive House — Distributed IoT Platform

A server-centric smart-home platform connecting web, mobile, server, and hardware components through a shared networking architecture. The system was developed as a university group project and was validated with physical Arduino-based hardware. This portfolio branch adds a public simulation mode so the complete distributed architecture can still be demonstrated without the physical house.

> **Portfolio Demo — Live Simulation Mode**  
> The demo replaces only the physical Arduino hardware with simulated devices. The networking, server routing, WebSocket gateway, TCP communication, state propagation, scenes, and automation logic remain part of the running system.

## Architecture

```text
Browser
  ↓
React / Vite frontend
  ↓ WebSocket
Node.js WebSocket-to-TCP gateway
  ↓ TCP / NDJSON
Python server
  ↓ TCP
Hardware bridge / simulated devices
  ↓
Arduino hardware in the original physical setup
```

State updates travel back through the same architecture so the browser reflects device and sensor changes in real time.

### Technology

| Layer | Technology |
| --- | --- |
| Web client | React, Vite, JavaScript |
| Browser gateway | Node.js, WebSockets |
| Central server | Python, TCP sockets, threading |
| Protocol | NDJSON over TCP |
| Persistence | SQLite |
| Mobile client | Android / Kotlin |
| Hardware bridge | Python serial/TCP integration |
| Physical hardware | Arduino, sensors, LEDs, servos, fan, alarm |
| Portfolio demo | Simulated hardware bridge |

## Key Features

- Dynamic device registration and device-provided UI definitions.
- Live state synchronization between devices and multiple clients.
- React web client and Android/Kotlin client using the same server architecture.
- Python TCP server with SQLite persistence and message validation.
- WebSocket-to-TCP gateway allowing browser clients to use the TCP-based backend.
- Physical Arduino integration through a Python hardware bridge.
- Role-based access control with different permissions for primary users and caregivers.
- Smoke and temperature sensor integration with server-side automation.
- **Good Morning** and **Good Night** scenes that trigger multiple device actions.
- End-to-end, validation, and response-time/latency testing.
- Public simulation mode for demonstrating the distributed system without the original physical house.

## Interactive Portfolio Demo

The portfolio branch adds a virtual **Demo Controls** device with safe controls for provoking real system behavior:

- Trigger smoke
- Clear smoke
- Raise temperature
- Normalize temperature
- Reset simulation

One useful demo flow is the smoke automation:

```text
Demo Controls
      ↓
Simulated smoke sensor
      ↓ TCP
Python server receives sensor state
      ↓
Server-side automation rule
      ↓
Alarm ON
      ↓
State update broadcast
      ↓
React UI updates live
```

This is not a frontend-only animation: the action travels through the WebSocket gateway and TCP server before the resulting device states are returned to the UI.

### Demo credentials

```text
Primary user
Email: primary@email.com
Password: primary123

Caregiver
Email: caregiver@email.com
Password: caregiver123
```

### Recommended demo sequence

1. Log in as the primary user.
2. Turn an LED or fan on/off.
3. Open/close the window.
4. Trigger **Good Morning** or **Good Night**.
5. Open **Demo Controls**.
6. Select **Trigger smoke**.
7. Observe the smoke sensor change to `SMOKE` and the alarm change to `ON`.
8. Clear the smoke and observe the alarm return to `OFF`.

## My Contribution

This was a group university project, and my work covered multiple parts of the system rather than one isolated component. My contributions included:

- Building the Python test/CLI client used for end-to-end protocol and message-validation testing.
- Developing and integrating the Node.js WebSocket-to-TCP gateway used by the React web client.
- Contributing to the React web client, including device control, state handling, action UX, and hardware-facing integration.
- Implementing the **Good Morning** and **Good Night** scene functionality and integrating scene triggering into the client workflow.
- Contributing to the Python hardware bridge, Arduino/device integration, additional device support, sensor behavior, and integration debugging.
- Working on smoke/temperature sensor behavior and server-side automation flows such as smoke → alarm and high temperature → fan.
- Contributing to multi-client integration so web and Android clients could operate against the shared server architecture.
- Adding and working with end-to-end validation and server response-time/latency tests.
- Contributing to technical/software-engineering artifacts covering the iterative architecture, final iteration scope, RBAC design, sensors, automation, scenes, accessibility-oriented functionality, and system integration.
- Extending the completed university project with the portfolio simulation/deployment layer, including simulated demo controls, local/deployment configuration, Docker definitions, reverse-proxy configuration, and public-demo documentation.

The goal of this section is not to claim sole authorship of the group project, but to make the scope of my own implementation and integration work clear.

## Running the Portfolio Demo Locally — Windows

Docker is **not required** for local development. Run the four components in separate terminals.

### 1. Python server

```powershell
cd server
python -m pip install -r requirements.txt
python server.py
```

### 2. Simulated hardware bridge

```powershell
cd device
python demo_bridge.py
```

### 3. Node.js gateway

```powershell
cd webbasedclient/backend/gateway
npm install
npm start
```

### 4. React frontend

```powershell
cd webbasedclient/frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

For more detail see:

- [`PORTFOLIO_DEMO.md`](PORTFOLIO_DEMO.md) — portfolio/demo architecture and usage.
- [`LOCAL_RUN_WINDOWS.md`](LOCAL_RUN_WINDOWS.md) — Windows local-run instructions.
- [`docs/ITERATIONS_4_5.md`](docs/ITERATIONS_4_5.md) — final iteration technical planning and software-engineering artifact.

---

# Original University Project Documentation

The material below preserves the original iteration-by-iteration project documentation.

# Interactive House Project

The goal is to design a server-centric, distributed system that allows users—especially people with functional disabilities—to independently control their home environment in a simple, accessible, and secure way.

The system supports permission-based control, where different users (e.g. user vs caregiver) may have different access rights. Devices provide their own UI definitions, and users interact through mobile or web-based units.

## Architecture

All communication goes through a central server:

- No direct unit ↔ device communication

- Devices register dynamically and upload their UI

- Units render device-provided UIs without hardcoding device logic

## Development Approach

The project follows an iterative (RUP-inspired) process.
Each iteration delivers a working system, even if small, and builds on the previous one.

## Iteration 1 – Overview

Goal: prove the end-to-end architecture works.

Scope:

- One Python TCP server

- One simulated device (light)

- One Python unit (CLI client)

Focus:

- Device registration

- Dynamic UI distribution

- User actions and state updates

- In-memory state only (no DB, no permissions, no Android app yet)

## Iteration 2 – Overview

Goal: scale the working end-to-end architecture from Iteration 1 by adding persistence, more devices, and real clients.

Scope:

- Server upgraded with SQLite persistence (devices, UI definitions, last known state, seeded users)

- Multiple simulated devices

- Android unit client (Kotlin) replacing the Python CLI as the primary unit

- Web-based unit client

Focus:

- Persistence across server restarts (server reloads devices/UI/state from SQLite on startup)

- Same NDJSON message protocol across Android and Web

- Device-provided UI rendered dynamically across platforms

Not in scope yet:

- Role-based access control (RBAC) / permissions (planned for Iteration 3)

- Advanced security (encryption, password hashing, signup/account management)

### Run the web based client (React + Node Gateway) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

user@email.com / user123

bhavik@email.com / bhavik

meryam@email.com / meryam

Note: This is login only (no sign-up in Iteration 2). Users are seeded into SQLite on server startup.

#### start the simulated devices

```bash
    cd device
    python light.py
    python door.py
    python coffee_machine.py
```
#### Start the Node WebSocket Gateway (Browser ↔ TCP Bridge)

```bash
    cd webbasedclient/backend/gateway
    npm install
    npm start
```


#### Start the React Frontend

```bash
    cd webbasedclient/frontend
    npm install
    npm run dev
```

#### Test flow (Web UI)

- Verify Connected: Yes

- Login with one of the demo users

- Refresh device list

- Open a device → UI is rendered dynamically from the device-provided UI definition

- Press buttons → actions go Unit → Server → Device, and state updates are broadcast back

### Run the Android Client (Android Studio + Emulator) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

user@email.com / user123

bhavik@email.com / bhavik

meryam@email.com / meryam

Note: This is login only (no sign-up in Iteration 2). Users are seeded into SQLite on server startup.

#### start the simulated devices

```bash
    cd device
    python light.py
    python door.py
    python coffee_machine.py
```
#### Open the Android project in Android Studio and run the app

#### Test flow (Android app)

- Login with one of the demo users

- The device list will load from the server

- Select a device (Light / Door / Coffee Machine)

- Press buttons → actions go Unit → Server → Device, and state updates are broadcast back

## Iteration 3 – Overview

Goal: integrate the physical Arduino house into the system and validate that the architecture works with real hardware devices.

Scope:

- Existing Python TCP server (architecture unchanged)

- Physical Arduino devices (LED lights and window)

- Python hardware bridge connecting the Arduino to the server

- Existing unit clients (Web and Android)

Focus:

- Replacing simulated light devices with physical Arduino-controlled lights

- End-to-end interaction from unit client → server → physical device

- Maintaining the same device registration, UI definition, and state update flow

- UI improvements for the Web and Android clients

Not in scope:

- Role-based access control (RBAC) / permissions (planned for Iteration 4)

- Advanced security (encryption, authentication improvements)

- Full physical implementation of all house devices (only lights and window for now)

### Run the web based client (React + Node Gateway) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

user@email.com / user123

Note: This is login only (no sign-up). Users are seeded into SQLite on server startup.

#### option A: Run with simulated hardware bridge (no Arduino required)

This mode simulates the physical house but still uses the hardware bridge architecture.

```bash
    cd device
    python hardw_bridge.py --simulate
```

#### option B: Run with real Arduino hardware

- Upload Arduino firmware
- Open main.cpp in Arduino IDE
- Select board: Arduino UNO
- Select correct port (e.g. COM7)
- Upload the firmware to the board
- Connect Arduino via USB
- Start hardware bridge (real mode):

```bash
    cd device
    python hardw_bridge.py --port COM7
```

#### Start the Node WebSocket Gateway (Browser ↔ TCP Bridge)

```bash
    cd webbasedclient/backend/gateway
    npm install
    npm start
```

#### Start the React Frontend

```bash
    cd webbasedclient/frontend
    npm install
    npm run dev
```

#### Test flow (Web UI)

- Verify Connected: Yes
- Login with one of the demo users
- Refresh device list

You should see devices such as:

- LED 1
- LED 2
- Fan
- Window (servo)
- Door

#### Interaction

- Open a device → UI is rendered dynamically (device-provided UI)

- Press buttons → actions flow:
```bash
Web UI → Gateway → Server → Hardware Bridge → Arduino → Physical Device
```

Device state updates are sent back:

```bash
Arduino → Hardware Bridge → Server → Web UI
```

#### Expected behavior

- LED turns ON/OFF physically

- Fan activates/deactivates

- Door/servo responds (if connected)

- UI updates after action (with slight delay due to hardware communication)

### Run the Android Client (Android Studio + Emulator) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

user@email.com / user123

Note: This is login only (no sign-up). Users are seeded into SQLite on server startup.

#### option A: Run with simulated hardware bridge (no Arduino required)

This mode simulates the physical house but still uses the hardware bridge architecture.

```bash
    cd device
    python hardw_bridge.py --simulate
```

#### option B: Run with real Arduino hardware

- Upload Arduino firmware
- Open main.cpp in Arduino IDE
- Select board: Arduino UNO
- Select correct port (e.g. COM7)
- Upload the firmware to the board
- Connect Arduino via USB
- Start hardware bridge (real mode):

```bash
    cd device
    python hardw_bridge.py --port COM7
```

#### Open the Android project in Android Studio and run the app

#### Test flow (Android)

- Login with one of the demo users
- Refresh device list

You should see devices such as:

- LED 1
- LED 2
- Fan
- Window (servo)
- Door

#### Interaction

- Open a device → UI is rendered dynamically (device-provided UI)

- Press buttons → actions flow:
```bash
Android UI → Server → Hardware Bridge → Arduino → Physical Device
```

Device state updates are sent back:

```bash
Arduino → Hardware Bridge → Server → Android UI
```

#### Expected behavior

- LED turns ON/OFF physically

- Fan activates/deactivates

- Door/servo responds (if connected)

- UI updates after action (with slight delay due to hardware communication)


## Iteration 4 and 5 – Overview

Goal: extend the Interactive House system with automation, sensors, scenes, and role-based access control (RBAC), while improving the Web and Android user interfaces and integrating additional physical Arduino devices.

Scope:

- Existing Python TCP server (extended with automation and RBAC)
- Existing Web and Android unit clients
- Physical Arduino devices connected through the Python hardware bridge
- Additional sensors and automation logic
- Scene system and role-based permissions

Focus:

- Adding physical sensors: 
    - Motion sensor
    - Smoke sensor
    - Temperature sensor
    - Alarm/Buzzer

- Adding automation rules: 
    - Motion detected → lights ON
    - Smoke detected → alarm ON
    - High temperature → fan ON

- Adding scene support:
    - Good Morning scene
    - Good Night scene

- Adding role-based access control (RBAC):
    - Admin users can control all devices
    - Caregiver users have restricted access

- UI redesign and improvements

Not in scope:

- Encryption / secure communication
- Cloud deployment
- Advanced AI decision-making

### Run the web based client (React + Node Gateway) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

primary@email.com / primary123

caregiver@email.com / caregiver123

Note: This is login only (no sign-up). Users are seeded into SQLite on server startup.

#### option A: Run with simulated hardware bridge (no Arduino required)

This mode simulates the physical house but still uses the hardware bridge architecture.

```bash
    cd device
    python hardw_bridge.py --simulate
```

#### option B: Run with real Arduino hardware

- Upload Arduino firmware
- Open main.cpp in Arduino IDE
- Select board: Arduino UNO
- Select correct port (e.g. COM7)
- Upload the firmware to the board
- Connect Arduino via USB
- Start hardware bridge (real mode):

```bash
    cd device
    python hardw_bridge.py --port COM7
```

#### Start the Node WebSocket Gateway (Browser ↔ TCP Bridge)

```bash
    cd webbasedclient/backend/gateway
    npm install
    npm start
```

#### Start the React Frontend

```bash
    cd webbasedclient/frontend
    npm install
    npm run dev
```

#### Test flow (Web UI)

- Verify Connected: Yes
- Login with one of the demo users
- Refresh device list

You should see devices such as:

- LED 1
- LED 2
- Fan
- Window (servo)
- Door
- Motion Sensor
- Smoke Sensor
- Temperature Sensor
- Alarm

Depending on the user role, some devices may be hidden.
Caregiver cannot access window and door

#### Interaction

- Open a device → UI is rendered dynamically (device-provided UI)

- Press buttons → actions flow:
```bash
Web UI → Gateway → Server → Hardware Bridge → Arduino → Physical Device
```

Device state updates are sent back:

```bash
Arduino → Hardware Bridge → Server → Web UI
```

### Scene Support

Available scenes:

- Good Morning
- Good Night

Scenes trigger multiple device actions simultaneously.

Example:
```bash
Good Morning:
- Open window
- Turn on fan
- Turn on lights
```
```bash
Good Night:
- Close window
- Turn off fan
- Turn off lights
```

### Automation Support

Implemented automation rules:
```bash
    Motion detected → lights ON
    Smoke detected → alarm ON
    High temperature → fan ON
```
### Expected behavior
- LED turns ON/OFF physically
- Fan activates/deactivates
- Window servo responds
- Door servo responds
- Alarm activates when smoke is detected
- Fan activates automatically on high temperature
- Sensor values update in the UI
- Device state updates appear dynamically in Web UI
- Scene buttons trigger multiple actions

### Run the Android Client (Android Studio + Emulator) (Windows)

#### start the python server

```bash
    cd server
    pip install -r requirements.txt
    python server.py
```
Demo login credentials (seeded):

primary@email.com / primary123

caregiver@email.com / caregiver123

Note: This is login only (no sign-up). Users are seeded into SQLite on server startup.

#### option A: Run with simulated hardware bridge (no Arduino required)

This mode simulates the physical house but still uses the hardware bridge architecture.

```bash
    cd device
    python hardw_bridge.py --simulate
```

#### option B: Run with real Arduino hardware

- Upload Arduino firmware
- Open main.cpp in Arduino IDE
- Select board: Arduino UNO
- Select correct port (e.g. COM7)
- Upload the firmware to the board
- Connect Arduino via USB
- Start hardware bridge (real mode):

```bash
    cd device
    python hardw_bridge.py --port COM7
```

#### Open the Android project in Android Studio and run the app

#### Test flow (Android)

- Login with one of the demo users
- Refresh device list

You should see devices such as:

- LED 1
- LED 2
- Fan
- Window (servo)
- Door
- Motion Sensor
- Smoke Sensor
- Temperature Sensor
- Alarm

Depending on the user role, some devices may be hidden.
Caregiver cannot access window and door

#### Interaction

- Open a device → UI is rendered dynamically (device-provided UI)

- Press buttons → actions flow:
```bash
Android UI → Server → Hardware Bridge → Arduino → Physical Device
```

Device state updates are sent back:

```bash
Arduino → Hardware Bridge → Server → Android UI
```

###Android UI Improvements

The Android client now includes:

- Redesigned device list screen
- Device status cards
- Dynamic sensor information
- Improved device-specific layouts
- Modernized styling and gradients
- Scene buttons
- Voice command support
- Improved device icons and state indicators

#### Expected behavior

- LED turns ON/OFF physically
- Fan activates/deactivates
- Window and door servos respond
- Alarm activates when smoke is detected
- Fan activates automatically on high temperature
- Sensor values update in the UI
- Device states update dynamically
- Scene buttons trigger multiple actions
- RBAC restrictions apply depending on user role


