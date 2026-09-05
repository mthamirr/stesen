"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import CompletionScreen from "@/components/CompletionScreen";
import TransitMap from "@/components/TransitMap";
import TrainFace from "@/components/TrainFace";
import {
  getInterchangeLines,
  getTransferGroup,
  getRailLine,
  getStationNumber,
  normalizeStationKey,
  type RailLine,
  type RailLineId,
} from "@/data/lines";
import { saveRouteResult } from "@/data/records";

type GameStatus = "ready" | "running" | "finished";

type TransferOption = {
  line: RailLine;
  interchangeStationName: string;
};

type Props = {
  initialLineId: RailLineId;
  initialStartStationId: string;
  initialReverse: boolean;
  onBackHome: () => void;
};

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const toTypingTarget = (value: string) => value.replace(/[’]/g, "'").replace(/[–—]/g, "-");
const sameChar = (typed: string, expected: string) => typed.toLocaleLowerCase() === expected.toLocaleLowerCase();

const getStartIndex = (line: RailLine, stationId: string, reverse: boolean) => {
  const ordered = reverse ? [...line.stations].reverse() : line.stations;
  const index = ordered.findIndex((station) => station.id === stationId);
  return index >= 0 ? index : 0;
};

export default function TypingGame({
  initialLineId,
  initialStartStationId,
  initialReverse,
  onBackHome,
}: Props) {
  const initialLine = getRailLine(initialLineId);
  const initialOriginalIndex = initialLine.stations.findIndex((station) => station.id === initialStartStationId);
  const initialFullLine = initialReverse
    ? initialOriginalIndex === initialLine.stations.length - 1
    : initialOriginalIndex === 0;

  const [lineId, setLineId] = useState<RailLineId>(initialLineId);
  const [reverse, setReverse] = useState(initialReverse);
  const [segmentStartIndex, setSegmentStartIndex] = useState(() => getStartIndex(initialLine, initialStartStationId, initialReverse));
  const [status, setStatus] = useState<GameStatus>("ready");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [completedChars, setCompletedChars] = useState(0);
  const [completedStationIds, setCompletedStationIds] = useState<string[]>([]);
  const [visitedLineIds, setVisitedLineIds] = useState<RailLineId[]>([initialLineId]);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [hasTransferred, setHasTransferred] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [followTrain, setFollowTrain] = useState(true);
  const [viewRequest, setViewRequest] = useState(0);
  const [mobileKeyboardOpen, setMobileKeyboardOpen] = useState(false);
  const [mobileKeyboardHeight, setMobileKeyboardHeight] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const line = getRailLine(lineId);
  const orderedStations = useMemo(() => (reverse ? [...line.stations].reverse() : line.stations), [line, reverse]);
  const stations = useMemo(() => orderedStations.slice(segmentStartIndex), [orderedStations, segmentStartIndex]);
  const currentStation = stations[currentIndex] ?? stations[stations.length - 1];
  const previousStation = currentIndex > 0 ? stations[currentIndex - 1] : null;
  const nextStation = currentIndex < stations.length - 1 ? stations[currentIndex + 1] : null;
  const typingTarget = toTypingTarget(currentStation?.name ?? "");
  const previousStationNumber = previousStation ? getStationNumber(line, previousStation) : "";
  const nextStationNumber = nextStation ? getStationNumber(line, nextStation) : "";
  const bestKey = `stesen-best-${initialLineId}-${initialStartStationId}-${initialReverse ? "reverse" : "forward"}`;

  const accuracy = totalKeys === 0 ? 100 : clamp(((totalKeys - mistakes) / totalKeys) * 100, 0, 100);

  let correctPrefixLength = 0;
  while (
    correctPrefixLength < input.length &&
    typingTarget[correctPrefixLength] &&
    sameChar(input[correctPrefixLength], typingTarget[correctPrefixLength])
  ) {
    correctPrefixLength += 1;
  }

  const typingProgress = typingTarget.length ? correctPrefixLength / typingTarget.length : 0;
  const hasTypingError = [...input].some(
    (char, index) => !typingTarget[index] || !sameChar(char, typingTarget[index]),
  );
  const minutes = Math.max(elapsedMs / 60000, 1 / 600);
  const wpm = elapsedMs > 0 ? Math.round((completedChars / 5) / minutes) : 0;
  const liveChars = completedChars + correctPrefixLength;
  const liveWpm = elapsedMs > 0 ? Math.round((liveChars / 5) / minutes) : 0;

  const currentConnection = currentStation ? getTransferGroup(currentStation.name, line.id) : null;

  const transferOptions = useMemo(() => {
    if (!currentStation) return [] as TransferOption[];
    const group = getTransferGroup(currentStation.name, line.id);
    if (!group || group.kind !== "pertukaran") return [] as TransferOption[];

    return getInterchangeLines(currentStation.name, line.id)
      .filter((targetLine) => targetLine.id !== line.id)
      .filter((targetLine) => {
        const ampangSibling =
          (line.id === "ampang" && targetLine.id === "sri-petaling") ||
          (line.id === "sri-petaling" && targetLine.id === "ampang");
        return !ampangSibling || group.id === "chan-sow-lin";
      })
      .flatMap((targetLine) => {
        const targetStationName = group.members[targetLine.id];
        if (!targetStationName) return [];
        const originalIndex = targetLine.stations.findIndex(
          (station) => normalizeStationKey(station.name) === normalizeStationKey(targetStationName),
        );
        if (originalIndex < 0) return [];
        const hasForward = originalIndex < targetLine.stations.length - 1;
        const hasReverse = originalIndex > 0;
        if (!hasForward && !hasReverse) return [];
        return [{ line: targetLine, interchangeStationName: targetStationName }];
      });
  }, [currentStation, line.id]);


  useEffect(() => {
    const stored = window.localStorage.getItem(bestKey);
    setBestMs(stored ? Number(stored) : null);
  }, [bestKey]);

  // iOS/Safari keeps the layout viewport tall when the software keyboard opens.
  // visualViewport gives us the actually visible area, so the HUD can stay above
  // the keyboard instead of being covered by it.
  useEffect(() => {
    const viewport = window.visualViewport;

    const updateMobileViewport = () => {
      const isPhone = window.innerWidth <= 640;
      if (!isPhone || !viewport) {
        setMobileKeyboardOpen(false);
        setMobileKeyboardHeight(0);
        return;
      }

      const coveredHeight = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      const keyboardIsOpen = coveredHeight > 140;
      setMobileKeyboardOpen(keyboardIsOpen);
      setMobileKeyboardHeight(keyboardIsOpen ? Math.round(coveredHeight) : 0);
    };

    updateMobileViewport();
    viewport?.addEventListener("resize", updateMobileViewport);
    viewport?.addEventListener("scroll", updateMobileViewport);
    window.addEventListener("orientationchange", updateMobileViewport);

    return () => {
      viewport?.removeEventListener("resize", updateMobileViewport);
      viewport?.removeEventListener("scroll", updateMobileViewport);
      window.removeEventListener("orientationchange", updateMobileViewport);
    };
  }, []);

  useEffect(() => {
    if (status !== "running") {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }

    const tick = () => {
      if (startTimeRef.current !== null) setElapsedMs(performance.now() - startTimeRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "finished" && !settingsOpen) inputRef.current?.focus();
  }, [lineId, reverse, currentIndex, status, settingsOpen]);

  const resetState = () => {
    const resetLine = getRailLine(initialLineId);
    setLineId(initialLineId);
    setReverse(initialReverse);
    setSegmentStartIndex(getStartIndex(resetLine, initialStartStationId, initialReverse));
    setStatus("ready");
    setCurrentIndex(0);
    setInput("");
    setElapsedMs(0);
    setTotalKeys(0);
    setMistakes(0);
    setCompletedChars(0);
    setCompletedStationIds([]);
    setVisitedLineIds([initialLineId]);
    setNewBest(false);
    setHasTransferred(false);
    startTimeRef.current = null;
  };

  const reset = () => {
    resetState();
    setViewRequest((value) => value + 1);
  };

  const beginIfNeeded = () => {
    if (status === "ready") {
      startTimeRef.current = performance.now();
      setStatus("running");
    }
  };

  const finishGame = (finalElapsed: number) => {
    setElapsedMs(finalElapsed);
    setStatus("finished");
    setInput("");

    if (hasTransferred) {
      setNewBest(false);
      return;
    }

    const finalWpm = finalElapsed > 0 ? Math.round((completedChars + typingTarget.length) / 5 / (finalElapsed / 60000)) : 0;
    const finalAccuracy = Math.round(accuracy);
    saveRouteResult(initialLineId, {
      elapsedMs: finalElapsed,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      fullLine: initialFullLine,
    });
    const previousRaw = window.localStorage.getItem(bestKey);
    const previous = previousRaw ? Number(previousRaw) : null;
    if (previous === null || finalElapsed < previous) {
      window.localStorage.setItem(bestKey, String(finalElapsed));
      setBestMs(finalElapsed);
      setNewBest(true);
    } else {
      setNewBest(false);
    }
  };

  const hasRealTransferAt = (stationName: string) => {
    const group = getTransferGroup(stationName, line.id);
    if (!group) return false;
    return getInterchangeLines(stationName, line.id)
      .filter((targetLine) => targetLine.id !== line.id)
      .some((targetLine) => {
        const ampangSibling =
          (line.id === "ampang" && targetLine.id === "sri-petaling") ||
          (line.id === "sri-petaling" && targetLine.id === "ampang");
        return !ampangSibling || group.id === "chan-sow-lin";
      });
  };

  const completeCurrentStation = () => {
    const stationRunId = `${line.id}:${currentStation.id}`;
    setCompletedStationIds((value) => (value.includes(stationRunId) ? value : [...value, stationRunId]));
    setCompletedChars((value) => value + typingTarget.length);
    setInput("");

    if (currentIndex >= stations.length - 1) {
      finishGame(startTimeRef.current ? performance.now() - startTimeRef.current : elapsedMs);
      return;
    }

    // The selected line is already the live route. If the player never pressed
    // TAB, this simply continues on the same line. If they did, the next station
    // belongs to the newly selected line immediately.
    setCurrentIndex((index) => index + 1);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") return;
    const value = event.target.value.slice(0, typingTarget.length);
    if (value.length > input.length) beginIfNeeded();
    setInput(value);

    if (
      value.length === typingTarget.length &&
      [...value].every((char, index) => sameChar(char, typingTarget[index]))
    ) {
      completeCurrentStation();
    }
  };

  const switchLineAtCurrentInterchange = (targetLineId: RailLineId) => {
    if (!currentStation || status === "finished" || !currentConnection) return;
    if (targetLineId === line.id) return;

    const targetLine = getRailLine(targetLineId);
    const targetStationName = currentConnection.members[targetLineId];
    if (!targetStationName) return;

    const originalIndex = targetLine.stations.findIndex(
      (station) => normalizeStationKey(station.name) === normalizeStationKey(targetStationName),
    );
    if (originalIndex < 0) return;

    const possibleDirections: boolean[] = [];
    if (originalIndex < targetLine.stations.length - 1) possibleDirections.push(false);
    if (originalIndex > 0) possibleDirections.push(true);
    if (possibleDirections.length === 0) return;

    // The player only chooses the line. When both directions are valid, STESEN
    // chooses one direction automatically, as requested.
    const nextReverse = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    const ordered = nextReverse ? [...targetLine.stations].reverse() : targetLine.stations;
    const interchangeIndex = ordered.findIndex(
      (station) => normalizeStationKey(station.name) === normalizeStationKey(targetStationName),
    );
    if (interchangeIndex < 0 || interchangeIndex >= ordered.length - 1) return;

    const nextTarget = toTypingTarget(ordered[interchangeIndex].name);
    const canKeepInput = [...input].every((char, index) => nextTarget[index] && sameChar(char, nextTarget[index]));

    setLineId(targetLine.id);
    setReverse(nextReverse);
    setSegmentStartIndex(interchangeIndex);
    setCurrentIndex(0);
    if (!canKeepInput) setInput("");
    setNewBest(false);
    setHasTransferred(true);
    setVisitedLineIds((value) => (value.includes(targetLine.id) ? value : [...value, targetLine.id]));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (status === "finished") return;

    // TAB changes the LIVE line immediately at a true interchange. Press TAB
    // again to keep cycling through every line available at that same station.
    if (event.key === "Tab" && hasRealTransferAt(currentStation.name)) {
      event.preventDefault();
      const groupLines = getInterchangeLines(currentStation.name, line.id).filter((targetLine) => {
        const ampangSibling =
          (line.id === "ampang" && targetLine.id === "sri-petaling") ||
          (line.id === "sri-petaling" && targetLine.id === "ampang");
        return !ampangSibling || currentConnection?.id === "chan-sow-lin";
      });
      if (groupLines.length > 1) {
        const currentSelection = groupLines.findIndex((item) => item.id === line.id);
        const nextLine = groupLines[(currentSelection + 1 + groupLines.length) % groupLines.length];
        if (nextLine) switchLineAtCurrentInterchange(nextLine.id);
      }
      return;
    }

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;

    if (input.length >= typingTarget.length) {
      event.preventDefault();
      return;
    }

    beginIfNeeded();
    setTotalKeys((value) => value + 1);
    const expected = typingTarget[input.length] ?? "";
    if (!sameChar(event.key, expected)) setMistakes((value) => value + 1);
  };

  const charNode = (char: string, index: number): ReactNode => {
    const typed = input[index];
    const isCorrect = typed !== undefined && sameChar(typed, char);
    const isWrong = typed !== undefined && !sameChar(typed, char);
    const isCursor = index === input.length;
    const className = isWrong
      ? "traceWrong"
      : isCorrect
        ? "traceCorrect"
        : isCursor
          ? "tracePending traceCursor"
          : "tracePending";
    return (
      <span className={className} key={`${index}-${char}`}>
        {char === " " ? "\u00A0" : char}
      </span>
    );
  };

  const renderTrace = () => {
    const words = typingTarget.split(" ");
    let charOffset = 0;
    return words.flatMap((word, wordIndex) => {
      const wordStart = charOffset;
      charOffset += word.length;
      const nodes: ReactNode[] = [
        <span className="traceWord" key={`word-${wordIndex}-${word}`}>
          {[...word].map((char, index) => charNode(char, wordStart + index))}
        </span>,
      ];
      if (wordIndex < words.length - 1) {
        const spaceIndex = charOffset;
        charOffset += 1;
        const typed = input[spaceIndex];
        const isWrong = typed !== undefined && !sameChar(typed, " ");
        const isCursor = spaceIndex === input.length;
        nodes.push(
          <span
            className={`traceGap${isWrong ? " traceWrong" : ""}${isCursor ? " traceCursor" : ""}`}
            key={`space-${wordIndex}`}
            aria-hidden="true"
          >
            {" "}
          </span>,
        );
      }
      return nodes;
    });
  };

  const traceSizeClass = typingTarget.length > 48
    ? "traceSizeXxs"
    : typingTarget.length > 38
      ? "traceSizeXs"
      : typingTarget.length > 29
        ? "traceSizeSm"
        : typingTarget.length > 22
          ? "traceSizeMd"
          : "traceSizeLg";

  const visitedLines = visitedLineIds.map((id) => getRailLine(id));

  return (
    <main
      className={`stesenShell${mobileKeyboardOpen ? " is-mobile-keyboard-open" : ""}`}
      style={{
        "--route-color": line.color,
        "--mobile-keyboard-height": `${mobileKeyboardHeight}px`,
      } as CSSProperties}
    >
      <header className="simpleTopBar">
        <button className="simpleTopButton" type="button" onClick={onBackHome}>
          <span aria-hidden="true">←</span> Kembali
        </button>
        <button
          className="simpleTopButton simpleSettingsButton"
          type="button"
          onClick={() => setSettingsOpen((value) => !value)}
          aria-expanded={settingsOpen}
        >
          <span aria-hidden="true">⚙</span> Tetapan
        </button>
      </header>

      {settingsOpen && (
        <aside className="settingsPopover" aria-label="Tetapan permainan">
          <div className="settingsPopoverHead"><strong>Tetapan</strong><button type="button" onClick={() => setSettingsOpen(false)}>×</button></div>
          <div className="settingRow">
            <div><strong>Ikut tren</strong><small>Peta bergerak apabila stesen berubah</small></div>
            <button className={`settingToggle ${followTrain ? "is-on" : ""}`} type="button" onClick={() => setFollowTrain((value) => !value)} aria-pressed={followTrain}>{followTrain ? "Hidup" : "Mati"}</button>
          </div>
        </aside>
      )}

      <div className="playfield">
        <TransitMap
          line={line}
          stations={stations}
          currentIndex={currentIndex}
          typingProgress={typingProgress}
          finished={status === "finished"}
          completedStationIds={completedStationIds}
          visitedLineIds={visitedLineIds}
          viewRequest={viewRequest}
          followTrain={followTrain}
          holdingAtStation={false}
          mobileKeyboardOpen={mobileKeyboardOpen}
          mobileKeyboardHeight={mobileKeyboardHeight}
        />

        {status !== "finished" && (
          <>
            {hasRealTransferAt(currentStation.name) && (
              <div className="transferCycleHintV14" aria-label={`Tukar laluan di ${currentStation.name}`}>
                <kbd>TAB</kbd>
                <div className="transferCycleDotsV14">
                  {[line, ...transferOptions.map((option) => option.line)].map((cycleLine) => (
                    <button
                      key={cycleLine.id}
                      type="button"
                      className={line.id === cycleLine.id ? "is-selected" : ""}
                      style={{ "--transfer-dot": cycleLine.color } as CSSProperties}
                      onClick={() => {
                        switchLineAtCurrentInterchange(cycleLine.id);
                        inputRef.current?.focus();
                      }}
                      aria-label={`Tukar ke ${cycleLine.shortName}`}
                      title={cycleLine.shortName}
                    >
                      {cycleLine.routeNumber}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="centerTimer" aria-label={`Masa ${formatTime(elapsedMs)}, ketepatan ${Math.round(accuracy)} peratus`}>
              <div className="speedReadout"><small>KELAJUAN</small><strong>{liveWpm}</strong><span>PPM</span></div>
              <i />
              <div className="timeReadout"><small>MASA</small><strong>{formatTime(elapsedMs)}</strong></div>
              <i />
              <div className="accuracyReadout"><small>KETEPATAN</small><strong>{Math.round(accuracy)}<span>%</span></strong></div>
            </div>

            <section className="typingDock" onClick={() => inputRef.current?.focus()}>
              <div className="dockSide dockPrevious">
                <span className="dockArrow" aria-hidden="true">←</span>
                <div>
                  <small>STESEN SEBELUMNYA{previousStationNumber ? ` · ${previousStationNumber}` : ""}</small>
                  <strong>{previousStation?.name ?? "Stesen permulaan"}</strong>
                </div>
              </div>

              <div className="dockMain">
                <div className="dockTrain"><TrainFace mode={line.mode} color={line.color} code={line.code} size={64} /></div>
                <div className="typingTargetWrap">
                  <label className={`traceBox ${hasTypingError ? "traceHasError" : ""}`}>
                    <input
                      ref={inputRef}
                      className="typingCapture"
                      value={input}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                      inputMode="text"
                      enterKeyHint="done"
                      spellCheck={false}
                      aria-label={`Taip ${typingTarget}`}
                    />
                    <span className={`typingTrace ${traceSizeClass}`} aria-hidden="true">
                      {renderTrace()}
                    </span>
                  </label>
                </div>
              </div>

              <div className="dockSide dockNext">
                <div>
                  <small>STESEN BERIKUTNYA{nextStationNumber ? ` · ${nextStationNumber}` : ""}</small>
                  <strong>{nextStation?.name ?? "Hujung laluan"}</strong>
                </div>
                <span className="dockArrow" aria-hidden="true">→</span>
              </div>
            </section>
          </>
        )}

        {status === "finished" && (
          <CompletionScreen
            line={line}
            stationName={currentStation.name}
            elapsed={formatTime(elapsedMs)}
            accuracy={Math.round(accuracy)}
            wpm={wpm}
            newBest={newBest}
            best={bestMs !== null && !hasTransferred ? formatTime(bestMs) : null}
            visitedLines={visitedLines}
            onReplay={reset}
            onChooseRoute={onBackHome}
          />
        )}
      </div>
    </main>
  );
}
