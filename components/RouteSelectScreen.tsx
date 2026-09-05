"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import TrainFace from "@/components/TrainFace";
import { getRailLine, railLines, type RailLineId } from "@/data/lines";
import { emptyRouteRecord, getRouteRecord, type RouteRecord } from "@/data/records";

type StartConfig = {
  lineId: RailLineId;
  reverse: boolean;
};

type Props = {
  onStart: (config: StartConfig) => void;
  onBack: () => void;
};

const formatRecordTime = (ms: number | null) => {
  if (ms === null) return "--:--.--";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};

const routeOrder: RailLineId[] = [
  "komuter-seremban",
  "komuter-port-klang",
  "ampang",
  "sri-petaling",
  "kelana-jaya",
  "klia-transit",
  "monorail",
  "kajang",
  "shah-alam",
  "putrajaya",
  "sunway",
  "komuter-utara-padang-besar",
  "komuter-utara-ipoh",
  "komuter-selatan",
  "ets-kl-ipoh",
  "ets-kl-butterworth",
  "ets-kl-padang-besar",
  "ets-jb-kl",
  "ets-jb-butterworth",
  "ets-jb-padang-besar",
  "ets-segamat-butterworth",
  "ecrl",
];

export default function RouteSelectScreen({ onStart, onBack }: Props) {
  const [lineId, setLineId] = useState<RailLineId>("kajang");
  const [reverse, setReverse] = useState(false);
  const [record, setRecord] = useState<RouteRecord>(() => emptyRouteRecord());
  const line = getRailLine(lineId);
  const first = line.stations[0];
  const last = line.stations[line.stations.length - 1];

  useEffect(() => setRecord(getRouteRecord(line.id)), [line.id]);

  const sortedLines = useMemo(
    () => [...railLines].sort((a, b) => routeOrder.indexOf(a.id) - routeOrder.indexOf(b.id)),
    [],
  );
  const standardLines = useMemo(() => sortedLines.filter((item) => item.mode !== "ets"), [sortedLines]);
  const etsLines = useMemo(() => sortedLines.filter((item) => item.mode === "ets"), [sortedLines]);

  const chooseLine = (nextLineId: RailLineId) => {
    setLineId(nextLineId);
    setReverse(false);
  };

  const origin = reverse ? last : first;
  const destination = reverse ? first : last;

  return (
    <main className="routeSelectShell routeSelectShellV10" style={{ "--select-route": line.color } as CSSProperties}>
      <header className="routeSelectHeaderV10">
        <button type="button" onClick={onBack} className="routeBackV10" aria-label="Kembali ke halaman utama">
          <span>←</span><strong>Kembali</strong>
        </button>
        <div className="routeSelectBrandV10" aria-label="STESEN">
          <TrainFace mode="lrt" color="#192d34" code="" size={46} />
          <strong>STESEN</strong>
        </div>
      </header>

      <section className="routeSelectMainPanelV10">
        <div className="routeSelectTopV10">
          <div className="selectedRouteIdentityV10">
            <TrainFace mode="lrt" color={line.color} code={line.code} size={78} />
            <div>
              <h1>{line.shortName}</h1>
              <p>{line.stations.length} stesen <span>·</span> {first.name} ↔ {last.name}</p>
            </div>
          </div>
          <b className="officialRouteNumberV10" style={{ background: line.color }}>{line.routeNumber}</b>
        </div>

        <div className="selectedRouteRecordsV10">
          <div><small>MASA TERBAIK</small><strong>{formatRecordTime(record.bestTimeMs)}</strong></div>
          <div><small>KELAJUAN TERBAIK</small><strong>{record.bestWpm ?? "--"}<span> PPM</span></strong></div>
          <div><small>KETEPATAN TERBAIK</small><strong>{record.bestAccuracy ?? "--"}<span>%</span></strong></div>
          <div><small>LARIAN TAMAT</small><strong>{record.runs}</strong></div>
        </div>

        <div className="routeSelectBodyV10">
          <section className="routeLibraryV10" aria-label="Pilihan laluan">
            <div className="routeLibraryHeadingV10 routeLibraryHeadingV13">
              <h2>PILIH LALUAN</h2>
            </div>

            <div className="routeGridV10 routeGridUnifiedV11">
              {standardLines.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseLine(item.id)}
                  className={`routeTileV10${item.id === line.id ? " is-selected" : ""}`}
                  style={{ "--tile-color": item.color } as CSSProperties}
                >
                  <i className="routeNumberTileV10" style={{ background: item.color }}>{item.routeNumber}</i>
                  <span><strong>{item.shortName}</strong><small>{item.stations.length} stesen</small></span>
                </button>
              ))}
            </div>

            <div className="etsRouteGroupV13">
              <h3>KTM ETS</h3>
              <div className="routeGridV10 routeGridUnifiedV11 etsRouteGridV13">
                {etsLines.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => chooseLine(item.id)}
                    className={`routeTileV10${item.id === line.id ? " is-selected" : ""}`}
                    style={{ "--tile-color": item.color } as CSSProperties}
                  >
                    <i className="routeNumberTileV10" style={{ background: item.color }}>ETS</i>
                    <span><strong>{item.shortName.replace(/^ETS\s*/, "")}</strong><small>{item.stations.length} stesen</small></span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="journeySetupV10 journeySetupNoHeadingV15">
            <div className="terminalChoicesV10">
              <button type="button" className={!reverse ? "is-selected" : ""} onClick={() => setReverse(false)}>
                <i style={{ background: line.color }}>{line.routeNumber}</i>
                <span><small>DARI</small><strong>{first.name}</strong><em>ke {last.name}</em></span>
              </button>
              <button type="button" className={reverse ? "is-selected" : ""} onClick={() => setReverse(true)}>
                <i style={{ background: line.color }}>{line.routeNumber}</i>
                <span><small>DARI</small><strong>{last.name}</strong><em>ke {first.name}</em></span>
              </button>
            </div>

            <button className="routeStartButtonV10 routeStartTextV14" type="button" onClick={() => onStart({ lineId, reverse })}>
              <strong>Mula perjalanan</strong>
              <small>{origin.name} ke {destination.name}</small>
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
