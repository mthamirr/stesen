import type { CSSProperties } from "react";
import TrainFace from "@/components/TrainFace";
import type { RailLine } from "@/data/lines";

type Props = {
  line: RailLine;
  stationName: string;
  elapsed: string;
  accuracy: number;
  wpm: number;
  newBest: boolean;
  best: string | null;
  visitedLines: RailLine[];
  onReplay: () => void;
  onChooseRoute: () => void;
};

export default function CompletionScreen({
  line,
  stationName,
  elapsed,
  accuracy,
  wpm,
  newBest,
  best,
  visitedLines,
  onReplay,
  onChooseRoute,
}: Props) {
  return (
    <div className="arrivalOverlay" role="dialog" aria-modal="true" aria-label="Perjalanan selesai">
      <section className="arrivalBoard" style={{ "--arrival-color": line.color } as CSSProperties}>
        <div className="arrivalBoardTop">
          <div className="arrivalRoute">
            <span className="arrivalRouteBadge">{line.routeNumber}</span>
            <div><small>LALUAN</small><strong>{line.shortName}</strong></div>
            {visitedLines.length > 1 && (
              <div className="journeyBadges" aria-label="Laluan yang digunakan">
                {visitedLines.map((item) => (
                  <i key={item.id} style={{ background: item.color }}>{item.routeNumber}</i>
                ))}
              </div>
            )}
          </div>
          <strong className="arrivalClock">{elapsed}</strong>
        </div>

        <div className="arrivalMessage">
          <div className="arrivalTrain"><TrainFace mode={line.mode} color={line.color} code={line.code} size={76} /></div>
          <div className="arrivalWords">
            <small>TIBA DI</small>
            <h2>{stationName}</h2>
          </div>
          {newBest && <span className="bestRibbon">REKOD BAHARU</span>}
        </div>

        <div className="arrivalLineStrip">
          <span className="arrivalStationDot" />
          <i />
          <strong>{stationName}</strong>
          <span className="arrivalTerminal">TAMAT PERJALANAN</span>
        </div>

        <div className="arrivalStats">
          <div><small>MASA</small><strong>{elapsed}</strong></div>
          <div><small>KELAJUAN PURATA</small><strong>{wpm}<span> PPM</span></strong></div>
          <div><small>KETEPATAN</small><strong>{accuracy}<span>%</span></strong></div>
        </div>

        {best && <div className="bestTimeLine">Rekod peribadi · <strong>{best}</strong></div>}

        <div className="arrivalActions">
          <button className="arrivalPrimary" type="button" onClick={onReplay}>Main lagi <span>→</span></button>
          <button className="arrivalSecondary" type="button" onClick={onChooseRoute}>Pilih laluan</button>
        </div>
      </section>
    </div>
  );
}
