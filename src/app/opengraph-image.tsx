import { ImageResponse } from "next/og";

export const alt = "Promofy at SBC Summit 2026 — Turn engagement on. Live in Lisbon.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 82% 8%, rgba(154,101,229,0.35) 0%, transparent 42%), radial-gradient(circle at 8% 92%, rgba(234,78,101,0.28) 0%, transparent 45%), linear-gradient(160deg, #2b1550 0%, #1f1134 55%, #180b29 100%)",
        color: "white",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
          padding: "64px 72px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 700 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: 14,
                background: "linear-gradient(124deg, #6F2DBD 0%, #EA4E65 100%)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              p
            </div>
            promofy
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              color: "#DFC4FF",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            STARTUP HUB · S18
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#FC667C",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            SBC Summit 2026 · Lisbon · 29 Sept – 1 Oct
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1.02,
              textTransform: "uppercase",
            }}
          >
            <span>Turn engagement on.</span>
            <span style={{ color: "#DFC4FF" }}>Live in Lisbon.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ display: "flex", color: "#CFC5D9", fontSize: 17 }}>
            AI gamification · Loyalty · Acquisition · Sports engagement
          </span>
          <span style={{ display: "flex", color: "#CFC5D9", fontSize: 17 }}>promofy.ai/sbc-summit-2026</span>
        </div>
      </div>
    </div>,
    size,
  );
}
