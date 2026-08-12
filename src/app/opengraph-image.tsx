import { ImageResponse } from "next/og";

export const alt = "Артель — мастера, которых мы проверили лично";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14110d",
          padding: "72px 80px",
          color: "#f4ede0",
          fontSize: 34,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "4px solid #d6452d",
              borderRadius: 4,
            }}
          />
          <div style={{ letterSpacing: 10, fontSize: 26 }}>АРТЕЛЬ</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 82, lineHeight: 1.04 }}>Мастера, которых</div>
          <div style={{ fontSize: 82, lineHeight: 1.04 }}>мы проверили лично</div>
        </div>

        <div style={{ display: "flex", color: "#bcb0a0", fontSize: 28 }}>
          Репетиторы · Мастера ремонта · Фотографы
        </div>
      </div>
    ),
    size,
  );
}
