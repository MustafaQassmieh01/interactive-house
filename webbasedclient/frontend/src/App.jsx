import { useHouseClient, VIEW } from "./state/useHouseClient";

import LoginPage from "./pages/LoginPage";
import DeviceListPage from "./pages/DeviceListPage";
import DevicePage from "./pages/DevicePage";
import DemoBanner from "./components/DemoBanner";

export default function App() {
  const hc = useHouseClient();

  let page;

  if (hc.view === VIEW.LOGIN) {
    page = (
      <LoginPage
        connected={hc.connected}
        statusMsg={hc.statusMsg}
        onLogin={hc.login}
      />
    );
  } else if (hc.view === VIEW.DEVICES) {
    page = (
      <DeviceListPage
        devices={hc.devices}
        deviceStates={hc.deviceStates}
        statusMsg={hc.statusMsg}
        onRefresh={hc.refreshDevices}
        onOpenDevice={hc.openDevice}
        onTriggerScene={hc.sendScene}
        scenePending={hc.scenePending}
        role={hc.role}
      />
    );
  } else {
    page = (
      <DevicePage
        deviceId={hc.selectedDeviceId}
        uiItems={hc.uiItems}
        state={hc.latestState}
        statusMsg={hc.statusMsg}
        actionPending={hc.actionPending}
        onBack={hc.backToDevices}
        onAction={hc.sendAction}
      />
    );
  }

  return (
    <>
      <DemoBanner />
      {page}
    </>
  );
}
