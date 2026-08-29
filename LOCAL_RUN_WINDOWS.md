# Run Interactive House locally on Windows (no Docker)

Use four terminals from the repository root after switching to the `portfolio-demo` branch.

## 0. First-time setup

Verify Python and Node.js are installed:

```powershell
python --version
node --version
npm --version
```

Install the Python server dependency:

```powershell
cd server
python -m pip install -r requirements.txt
cd ..
```

Install gateway dependencies:

```powershell
cd webbasedclient/backend/gateway
npm install
cd ../../..
```

Install frontend dependencies:

```powershell
cd webbasedclient/frontend
npm install
cd ../..
```

## 1. Terminal 1 — Python TCP server

```powershell
cd server
python server.py
```

Expected port: `5001`.

## 2. Terminal 2 — simulated hardware bridge

```powershell
cd device
python demo_bridge.py
```

This runs the Arduino/hardware side in simulation mode and adds the portfolio Demo Controls device.

## 3. Terminal 3 — Node WebSocket/TCP gateway

```powershell
cd webbasedclient/backend/gateway
npm start
```

Expected WebSocket port: `3001`.

## 4. Terminal 4 — React frontend

```powershell
cd webbasedclient/frontend
npm run dev
```

Open the URL Vite prints, normally:

`http://localhost:5173`

The Vite development server proxies `/ws` to `ws://localhost:3001`, so no environment variable is required.

## Demo login

Primary user:

- Email: `primary@email.com`
- Password: `primary123`

## Demo flow

1. Log in.
2. Open a light or fan and send a normal device command.
3. Return to Devices and open **Demo Controls**.
4. Click **Trigger smoke**.
5. Return to the device list and observe the smoke sensor / alarm state updates.
6. Use **Clear smoke** or **Reset simulation** to restore the demo.

The browser, WebSocket gateway, Python TCP server, device registration, state propagation, and automation logic are real. Only the Arduino hardware is simulated.
