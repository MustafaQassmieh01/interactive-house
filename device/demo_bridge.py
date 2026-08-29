import os

from hardw_bridge import BaseDevice, HardwareBridge, DEFAULT_SERIAL_PORT
from protocol import send_json


class DemoControlDevice(BaseDevice):
    """Virtual device that exposes safe controls for portfolio simulation mode."""

    def __init__(self, bridge: HardwareBridge):
        super().__init__("demo-control-1", "Demo Controls", 0, bridge.arduino)
        self.bridge = bridge

    def send_register(self):
        send_json(
            self.sock,
            {
                "type": "register_device",
                "sender_id": self.device_id,
                "payload": {"deviceType": "Demo Controls"},
            },
        )
        print(f"[{self.device_id}] Registered demo controls")

    def send_ui_definition(self):
        send_json(
            self.sock,
            {
                "type": "ui_definition",
                "sender_id": self.device_id,
                "payload": {
                    "ui": [
                        {"type": "button", "action": "TRIGGER_SMOKE", "label": "Trigger smoke"},
                        {"type": "button", "action": "RESET_SMOKE", "label": "Clear smoke"},
                        {"type": "button", "action": "TEMP_HIGH", "label": "Raise temperature"},
                        {"type": "button", "action": "TEMP_NORMAL", "label": "Normalize temperature"},
                        {"type": "button", "action": "RESET_ALL", "label": "Reset simulation"},
                    ]
                },
            },
        )
        print(f"[{self.device_id}] Sent demo UI definition")

    def send_state(self):
        smoke_level = getattr(self.bridge.smoke_device, "smoke_level", 100)
        temperature = getattr(self.bridge.temp_device, "temperature", 22.0)
        alarm_on = bool(getattr(self.bridge.alarm_device, "state", False))
        fan_on = any(bool(getattr(fan, "state", False)) for fan in self.bridge.fan_devices)

        send_json(
            self.sock,
            {
                "type": "device_state",
                "sender_id": self.device_id,
                "payload": {
                    "state": {
                        "simulationMode": True,
                        "smokeLevel": smoke_level,
                        "temperature": temperature,
                        "alarmOn": alarm_on,
                        "fanOn": fan_on,
                    }
                },
            },
        )

    def _set_simulated_temperature(self, celsius: float):
        # hardw_bridge simulates the raw analog value, then applies an LM35 conversion.
        # This maps the desired Celsius value back to the simulator's stored input.
        self.arduino.sim_temp_value = celsius * 0.2048
        self.bridge.handle_arduino_event(f"TEMP:{celsius}")

    def _normalize_temperature(self):
        self._set_simulated_temperature(22.0)
        for fan in self.bridge.fan_devices:
            if fan.state:
                fan.handle_action("OFF")

    def _clear_smoke(self):
        self.arduino.sim_smoke_value = 100
        self.bridge.handle_arduino_event("SMOKE:100")
        if self.bridge.alarm_device and self.bridge.alarm_device.state:
            self.bridge.alarm_device.stop_alarm()

    def handle_action(self, action: str):
        action = (action or "").upper()

        if action == "TRIGGER_SMOKE":
            self.arduino.sim_smoke_value = 250
            self.bridge.handle_arduino_event("SMOKE:250")
        elif action == "RESET_SMOKE":
            self._clear_smoke()
        elif action == "TEMP_HIGH":
            self._set_simulated_temperature(35.0)
        elif action == "TEMP_NORMAL":
            self._normalize_temperature()
        elif action == "RESET_ALL":
            self._clear_smoke()
            self._normalize_temperature()
        else:
            print(f"[{self.device_id}] Unknown action: {action}")
            return

        self.send_state()


def main():
    server_host = os.getenv("SERVER_HOST", "localhost")
    server_port = int(os.getenv("SERVER_PORT", "5001"))

    bridge = HardwareBridge(DEFAULT_SERIAL_PORT, simulate=True)

    # Correct the original demo defaults so the simulated LM35 reports ~22 C.
    bridge.arduino.sim_temp_value = 22.0 * 0.2048
    if bridge.temp_device:
        bridge.temp_device.threshold_high = 30.0
        bridge.temp_device.threshold_low = 8.0

    bridge.devices.append(DemoControlDevice(bridge))
    bridge.start(server_host, server_port)


if __name__ == "__main__":
    main()
