function formatValue(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return String(value);
}

function formatLabel(key) {
  const labels = {
    simulationMode: "Simulation mode",
    smokeLevel: "Smoke level",
    temperature: "Temperature",
    alarmOn: "Alarm on",
    fanOn: "Fan on",
  };
  return labels[key] || key;
}

export default function DemoControlsPage({
  uiItems,
  state,
  statusMsg,
  actionPending,
  onBack,
  onAction,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #6f86b6 0%, #0d1333 100%)",
          color: "#ffffff",
          padding: "44px 28px 54px",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              float: "right",
              border: "none",
              background: "transparent",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back
          </button>
          <div style={{ fontSize: "14px", opacity: 0.82, fontWeight: 700 }}>
            PORTFOLIO SIMULATION
          </div>
          <h1 style={{ margin: "8px 0 10px", fontSize: "34px" }}>Demo Controls</h1>
          <p style={{ margin: 0, maxWidth: "560px", fontSize: "17px", lineHeight: 1.5 }}>
            Inject sensor events into the simulated Arduino layer and watch them travel through the
            real TCP server, automation rules, WebSocket gateway, and browser UI.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "-24px auto 0", padding: "0 24px 40px" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 10px 28px rgba(0, 0, 0, 0.14)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#1f2a5a" }}>Trigger an event</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {(uiItems || []).map((item, idx) => (
              <button
                key={`${item.action}-${idx}`}
                onClick={() => onAction(item.action)}
                disabled={actionPending || item.enabled === false}
                style={{
                  width: "100%",
                  minHeight: "52px",
                  borderRadius: "16px",
                  border: "none",
                  background: actionPending ? "#c9cbd6" : "#536899",
                  color: actionPending ? "#8f929c" : "#ffffff",
                  fontSize: "16px",
                  fontWeight: 800,
                  cursor: actionPending ? "not-allowed" : "pointer",
                }}
              >
                {actionPending ? "Please wait..." : item.label}
              </button>
            ))}
          </div>

          <h2 style={{ color: "#1f2a5a", marginTop: "28px" }}>Simulation state</h2>
          <div style={{ display: "grid", gap: "9px" }}>
            {Object.entries(state || {}).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "18px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background: "#e9ebf5",
                  color: "#363945",
                }}
              >
                <strong>{formatLabel(key)}</strong>
                <span>{formatValue(value)}</span>
              </div>
            ))}
          </div>

          {statusMsg && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#f4f6fc",
                color: "#5b6478",
                fontSize: "14px",
              }}
            >
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
