"use client";

import { useMemo, useState } from "react";
import TrainFace from "@/components/TrainFace";
import { railLines } from "@/data/lines";
import { loadRouteRecords } from "@/data/records";

type Props = {
  onStart: () => void;
};

const formatTime = (ms: number | null | undefined) => {
  if (!Number.isFinite(ms)) return "--:--.--";
  const value = Number(ms);
  const minutes = Math.floor(value / 60000);
  const seconds = Math.floor((value % 60000) / 1000);
  const hundredths = Math.floor((value % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};

function LandingNetworkBackdrop() {
  const minLng = 101.48;
  const maxLng = 101.82;
  const minLat = 2.96;
  const maxLat = 3.23;
  const width = 1600;
  const height = 900;
  const visibleLines = railLines.filter((line) => line.mode !== "ets" && line.id !== "ecrl" && !line.id.startsWith("komuter-utara") && line.id !== "komuter-selatan");

  const project = (lng: number, lat: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  return (
    <svg className="landingNetworkSvg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {visibleLines.map((line) => {
        const points = line.stations
          .filter((station) => station.lng >= minLng - .02 && station.lng <= maxLng + .02 && station.lat >= minLat - .02 && station.lat <= maxLat + .02)
          .map((station) => project(station.lng, station.lat))
          .join(" ");
        if (!points) return null;
        return <polyline key={line.id} className="landingTrack" points={points} style={{ stroke: line.color }} />;
      })}
    </svg>
  );
}

export default function LandingScreen({ onStart }: Props) {
  const [recordsOpen, setRecordsOpen] = useState(false);
  const records = useMemo(() => (typeof window === "undefined" ? {} : loadRouteRecords()), []);
  const recordRows = railLines
    .map((line) => ({ line, record: records[line.id] }))
    .filter((item) => item.record && item.record.runs > 0)
    .sort((a, b) => (b.record?.runs ?? 0) - (a.record?.runs ?? 0));

  return (
    <main className="landingShell landingShellV9">
      <LandingNetworkBackdrop />

      <header className="landingHeader landingHeaderV9">
        <div className="landingBrandV9">
          <div className="landingTrainLogo"><TrainFace mode="mrt" color="#192d34" code="" size={46} /></div>
          <strong>STESEN</strong>
        </div>
      </header>

      <section className="landingMenuV9" aria-label="Menu utama">
        <button type="button" className="landingTextAction landingTextPrimary" onClick={onStart}>
          <span>Mula</span><b>→</b>
        </button>
        <button type="button" className="landingTextAction" onClick={() => setRecordsOpen(true)}>
          <span>Rekod</span><b>→</b>
        </button>
      </section>

      <footer className="landingFooterV9"><span>STESEN</span><span>2026 · Lembah Klang</span></footer>

      {recordsOpen && (
        <div className="recordsOverlay" role="dialog" aria-modal="true" aria-label="Rekod laluan">
          <section className="recordsDialog">
            <div className="recordsHead">
              <div><small>REKOD PERMAINAN</small><h2>Rekod laluan</h2></div>
              <button type="button" onClick={() => setRecordsOpen(false)}>×</button>
            </div>
            {recordRows.length === 0 ? (
              <div className="recordsEmpty">Belum ada larian tamat pada peranti ini.</div>
            ) : (
              <div className="recordsList">
                {recordRows.map(({ line, record }) => (
                  <div className="recordRow" key={line.id}>
                    <i style={{ background: line.color }}>{line.routeNumber}</i>
                    <span><strong>{line.shortName}</strong><small>{record?.runs ?? 0} larian</small></span>
                    <b>{formatTime(record?.bestTimeMs)}</b>
                    <em>{record?.bestWpm ?? "--"} PPM · {record?.bestAccuracy ?? "--"}%</em>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
