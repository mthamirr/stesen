import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "STESEN",
    short_name: "STESEN",
    description: "Permainan menaip berasaskan rangkaian rel Lembah Klang.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f2eb",
    theme_color: "#f4f2eb",
    lang: "ms",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
