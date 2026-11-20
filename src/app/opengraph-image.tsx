import { ImageResponse } from "next/og";
import { getPortfolioData } from "@/lib/data/portfolio";

export const alt = "Vatsal Patel — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { profile } = await getPortfolioData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #060610 0%, #1e1b4b 100%)",
          color: "#fafafa"
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#818cf8", fontWeight: 600 }}>
          {profile.role} @ {profile.company}
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, marginTop: 16 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#d4d4d8", marginTop: 24, maxWidth: 940 }}>
          {profile.headline}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", marginTop: 48 }}>
          Next.js · React · TypeScript · i18n · Testing
        </div>
      </div>
    ),
    { ...size }
  );
}
