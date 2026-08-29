export default function DemoBanner() {
  return (
    <div
      style={{
        background: "#111936",
        color: "#ffffff",
        padding: "10px 18px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        lineHeight: 1.45,
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div>
        <strong>Interactive House — Live Simulation.</strong>{" "}
        This deployment runs the original distributed architecture with simulated Arduino hardware.
        The project was also validated with a physical Arduino-based house.
      </div>
      <div style={{ marginTop: "3px", opacity: 0.9 }}>
        Demo login: <strong>primary@email.com</strong> / <strong>primary123</strong>
      </div>
    </div>
  );
}
