"use client";

import { useState } from "react";
import LandingScreen from "@/components/LandingScreen";
import RouteSelectScreen from "@/components/RouteSelectScreen";
import TypingGame from "@/components/TypingGame";
import { getRailLine, type RailLineId } from "@/data/lines";

type GameConfig = {
  lineId: RailLineId;
  reverse: boolean;
};

type Stage = "landing" | "select" | "game";

export default function StesenApp() {
  const [stage, setStage] = useState<Stage>("landing");
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [revision, setRevision] = useState(0);

  if (stage === "landing") {
    return <LandingScreen key={`landing-${revision}`} onStart={() => setStage("select")} />;
  }

  if (stage === "select" || !config) {
    return (
      <RouteSelectScreen
        key={`select-${revision}`}
        onBack={() => setStage("landing")}
        onStart={(nextConfig) => {
          setConfig(nextConfig);
          setStage("game");
        }}
      />
    );
  }

  const line = getRailLine(config.lineId);
  const startStationId = config.reverse ? line.stations[line.stations.length - 1].id : line.stations[0].id;

  return (
    <TypingGame
      key={`${config.lineId}:${config.reverse ? "r" : "f"}:${revision}`}
      initialLineId={config.lineId}
      initialStartStationId={startStationId}
      initialReverse={config.reverse}
      onBackHome={() => {
        setConfig(null);
        setStage("select");
        setRevision((value) => value + 1);
      }}
    />
  );
}
