# Interactive House — Portfolio Demo

This branch packages the original distributed smart-home project as a public simulation. The networked architecture remains real; only the physical Arduino layer is replaced by a simulated hardware bridge.

## Architecture

```text
Browser / React frontend
        |
        | WebSocket (/ws)
        v
Node.js WebSocket-to-TCP gateway
        |
        | TCP / NDJSON
        v
Python smart-home server
        |
        | TCP / NDJSON
        v
Simulated hardware bridge
        |
        +-- LEDs
        +-- Fan
        +-- Window servo
        +-- Door servo
        +-- Smoke sensor
        +-- Temperature sensor
        +-- Alarm
        +-- Demo Controls
```

## Run locally

Requirements: Docker Desktop / Docker Compose v2.

```bash
docker compose up --build
```

Open:

```text
http://localhost:8080
```

Demo credentials:

```text
Primary user
email: primary@email.com
password: primary123

Caregiver
email: caregiver@email.com
password: caregiver123
```

Stop the stack with:

```bash
docker compose down
```

## What the containers do

- `frontend` builds the React/Vite app and serves it with Nginx.
- Nginx proxies `/ws` to the Node.js gateway, so the same deployment works cleanly behind HTTP or HTTPS.
- `gateway` translates WebSocket messages from the browser to TCP/NDJSON messages for the Python server.
- `server` runs the original Python socket server and SQLite-backed application logic.
- `simulator` runs the original hardware bridge in simulation mode plus a demo-only virtual control device.

## Demo Controls

Log in as the primary user and open `Demo Controls` to provoke sensor events without physical hardware:

- Trigger smoke
- Clear smoke
- Raise temperature
- Normalize temperature
- Reset simulation

The interesting part is the message path. For example, triggering smoke travels through the same public demo architecture and causes the alarm automation to react:

```text
React button
  -> WebSocket
  -> Node gateway
  -> TCP server
  -> Demo Controls device
  -> simulated smoke sensor state
  -> server/device automation
  -> alarm state update
  -> UI update
```

## Simulation disclosure

The public build is intentionally labeled **Live Simulation**. It does not claim a physical house is connected. The original project was also validated with physical Arduino-based hardware; this branch exists so the distributed system can still be demonstrated after the physical house is no longer available.
