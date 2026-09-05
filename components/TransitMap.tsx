"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import {
  getConnectionGroup,
  getStationNumber,
  railLines,
  type RailLine,
  type Station,
} from "@/data/lines";

type Props = {
  line: RailLine;
  stations: Station[];
  currentIndex: number;
  typingProgress: number;
  finished: boolean;
  completedStationIds: string[];
  visitedLineIds: RailLine["id"][];
  viewRequest: number;
  followTrain: boolean;
  holdingAtStation: boolean;
  mobileKeyboardOpen?: boolean;
  mobileKeyboardHeight?: number;
};



const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const lineFeature = (line: RailLine) => ({
  type: "Feature" as const,
  properties: {},
  geometry: {
    type: "LineString" as const,
    coordinates: line.stations.map((station) => [station.lng, station.lat]),
  },
});

const trainSvg = (color: string, code: string, angle: number) => {
  const badgeFont = code.length >= 4 ? 5.3 : code.length === 3 ? 6.5 : 8;
  const badgeWidth = code.length >= 4 ? 36 : code.length === 3 ? 32 : 28;
  const badgeX = 46 - badgeWidth / 2;
  return `
  <div class="stesen-map-train" style="transform:rotate(${angle}deg)">
    <svg viewBox="0 0 92 92" width="68" height="68" aria-hidden="true">
      <g>
        <path d="M19 15 Q46 4 73 15 L75 61 Q75 73 63 77 L29 77 Q17 73 17 61 Z" fill="#fffdf8" stroke="#23343b" stroke-width="3.2" stroke-linejoin="round"/>
        <path d="M24 18 Q46 10 68 18 L68 58 Q68 66 60 68 L32 68 Q24 66 24 58 Z" fill="${color}"/>
        <rect x="29" y="23" width="34" height="19" rx="7.5" fill="#eef8fa"/>
        <rect x="32" y="26" width="12.5" height="12" rx="4.5" fill="#a8d7e2"/>
        <rect x="47.5" y="26" width="12.5" height="12" rx="4.5" fill="#a8d7e2"/>
        <rect x="30" y="46" width="32" height="7" rx="3.5" fill="#fffdf8" opacity=".95"/>
        <circle cx="34" cy="59" r="4.2" fill="#ffe16f" stroke="#23343b" stroke-width="1.4"/>
        <circle cx="58" cy="59" r="4.2" fill="#ffe16f" stroke="#23343b" stroke-width="1.4"/>
        <circle cx="37" cy="51" r="1.8" fill="#23343b"/>
        <circle cx="55" cy="51" r="1.8" fill="#23343b"/>
        <path d="M41 55 Q46 59 51 55" fill="none" stroke="#23343b" stroke-width="2.1" stroke-linecap="round"/>
        <circle cx="32" cy="53" r="2.1" fill="#f7a8a8" opacity=".9"/>
        <circle cx="60" cy="53" r="2.1" fill="#f7a8a8" opacity=".9"/>
        <path d="M31 77 L27 84" stroke="#23343b" stroke-width="3" stroke-linecap="round"/>
        <path d="M61 77 L65 84" stroke="#23343b" stroke-width="3" stroke-linecap="round"/>
        <rect x="${badgeX}" y="69" width="${badgeWidth}" height="13" rx="6.5" fill="#23343b"/>
        <text x="46" y="78.3" text-anchor="middle" fill="#fff" font-size="${badgeFont}" font-weight="900" font-family="Manrope, Trebuchet MS, sans-serif">${code}</text>
      </g>
    </svg>
  </div>`;
};

export default function TransitMap({
  line,
  stations,
  currentIndex,
  typingProgress,
  finished,
  completedStationIds,
  visitedLineIds,
  viewRequest,
  followTrain,
  holdingAtStation,
  mobileKeyboardOpen = false,
  mobileKeyboardHeight = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);
  const trainMarkerRef = useRef<MapLibreMarker | null>(null);
  const stationMarkersRef = useRef<MapLibreMarker[]>([]);
  const previousIndexRef = useRef(currentIndex);
  const previousLineRef = useRef(line.id);
  const [ready, setReady] = useState(false);


  const focusSegment = (index = currentIndex, animate = true) => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre || stations.length === 0) return;

    const from = Math.max(0, index - 1);
    const to = Math.min(stations.length - 1, index + 1);
    const segment = stations.slice(from, to + 1);
    const bounds = new maplibre.LngLatBounds();
    segment.forEach((station) => bounds.extend([station.lng, station.lat]));

    if (segment.length === 1) {
      map.easeTo({ center: [segment[0].lng, segment[0].lat], zoom: 14.7, duration: animate ? 450 : 0 });
      return;
    }

    const phone = typeof window !== "undefined" && window.innerWidth <= 640;
    const padding = phone
      ? {
          top: mobileKeyboardOpen ? 72 : 92,
          right: 52,
          bottom: mobileKeyboardOpen ? mobileKeyboardHeight + 250 : 320,
          left: 52,
        }
      : { top: 100, right: 150, bottom: 325, left: 150 };

    map.fitBounds(bounds, {
      padding,
      maxZoom: phone ? (mobileKeyboardOpen ? 14.7 : 15.0) : 15.15,
      duration: animate ? 480 : 0,
    });
  };

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current || mapRef.current) return;
      maplibreRef.current = maplibre;

      const map = new maplibre.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [101.695, 3.145],
        zoom: 12.5,
        minZoom: 9,
        maxZoom: 17,
        pitch: 0,
        bearing: 0,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: {},
      });

      map.touchZoomRotate.disableRotation();

      map.on("load", () => {
        if (cancelled) return;

        // Peta sebenar dikekalkan sebagai konteks geografi, tetapi label, POI,
        // bangunan dan jalan direndahkan supaya rangkaian rel menjadi fokus utama.
        for (const layerItem of map.getStyle().layers ?? []) {
          try {
            if (layerItem.type === "symbol") {
              map.setLayoutProperty(layerItem.id, "visibility", "none");
              continue;
            }
            const id = layerItem.id.toLowerCase();
            if (layerItem.type === "line") {
              if (/(road|street|highway|transportation|tunnel|bridge)/.test(id)) {
                map.setPaintProperty(layerItem.id, "line-opacity", 0.025);
                map.setPaintProperty(layerItem.id, "line-color", "#bdc9c4");
              } else if (/boundary/.test(id)) {
                map.setPaintProperty(layerItem.id, "line-opacity", 0.025);
              }
            }
            if (layerItem.type === "fill") {
              if (/building/.test(id)) {
                map.setPaintProperty(layerItem.id, "fill-opacity", 0.018);
                map.setPaintProperty(layerItem.id, "fill-color", "#cfd7d3");
              } else if (/water/.test(id)) {
                map.setPaintProperty(layerItem.id, "fill-opacity", 0.48);
                map.setPaintProperty(layerItem.id, "fill-color", "#d9eef0");
              } else if (/(park|wood|landcover|landuse|grass)/.test(id)) {
                map.setPaintProperty(layerItem.id, "fill-opacity", 0.2);
                map.setPaintProperty(layerItem.id, "fill-color", "#e5f0df");
              } else {
                map.setPaintProperty(layerItem.id, "fill-opacity", 0.075);
              }
            }
          } catch {
            // Sesetengah gaya mempunyai property yang tidak boleh ditukar.
          }
        }

        railLines.forEach((networkLine) => {
          const sourceId = `stesen-line-${networkLine.id}`;
          map.addSource(sourceId, { type: "geojson", data: lineFeature(networkLine) });
          map.addLayer({
            id: `${sourceId}-casing`,
            type: "line",
            source: sourceId,
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#fffdf8", "line-width": 7, "line-opacity": 0.78 },
          });
          map.addLayer({
            id: `${sourceId}-core`,
            type: "line",
            source: sourceId,
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": networkLine.color, "line-width": 3.5, "line-opacity": 0.22 },
          });
        });

        mapRef.current = map;
        setReady(true);
        window.setTimeout(() => focusSegment(0, false), 30);
      });
    };

    setup();
    return () => {
      cancelled = true;
      stationMarkersRef.current.forEach((marker) => marker.remove());
      trainMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
      trainMarkerRef.current = null;
      stationMarkersRef.current = [];
    };
    // Map dibuat sekali sahaja.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    railLines.forEach((networkLine) => {
      const active = networkLine.id === line.id;
      const visited = visitedLineIds.includes(networkLine.id);
      const casingId = `stesen-line-${networkLine.id}-casing`;
      const coreId = `stesen-line-${networkLine.id}-core`;
      if (!map.getLayer(coreId)) return;

      map.setPaintProperty(casingId, "line-width", active ? 15 : visited ? 9 : 6.5);
      map.setPaintProperty(casingId, "line-opacity", active ? 1 : visited ? 0.74 : 0.52);
      map.setPaintProperty(coreId, "line-width", active ? 9.2 : visited ? 5 : 3.4);
      map.setPaintProperty(coreId, "line-opacity", active ? 1 : visited ? 0.52 : 0.18);
      if (active) {
        map.moveLayer(casingId);
        map.moveLayer(coreId);
      }
    });
  }, [ready, line.id, visitedLineIds]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!ready || !map || !maplibre) return;

    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current = [];

    const completed = new Set(completedStationIds);
    const targetIndex = finished ? stations.length - 1 : clamp(currentIndex, 0, stations.length - 1);
    const trainStationIndex = targetIndex;

    stations.forEach((station, index) => {
      const el = document.createElement("div");
      const isCompleted = completed.has(`${line.id}:${station.id}`) || finished;
      const isCurrent = index === targetIndex && !finished;
      const group = getConnectionGroup(station.name, line.id);
      const isInterchange = Boolean(group?.kind === "pertukaran" && Object.keys(group.members).length > 1);
      const trainIsAtStation = index === trainStationIndex && (finished || holdingAtStation || (isCurrent && (targetIndex === 0 || typingProgress >= 0.999)));
      el.className = `stesen-map-station${isCompleted ? " is-complete" : ""}${isCurrent ? " is-current" : ""}${isInterchange ? " is-interchange" : ""}${trainIsAtStation ? " is-train-here" : ""}`;
      el.style.setProperty("--station-color", line.color);
      el.style.setProperty("--station-text", ["putrajaya", "shah-alam"].includes(line.id) ? "#203039" : "#ffffff");
      el.textContent = getStationNumber(line, station);
      const marker = new maplibre.Marker({ element: el, anchor: "center" })
        .setLngLat([station.lng, station.lat])
        .addTo(map);
      marker.getElement().style.zIndex = isCurrent ? "40" : "20";
      stationMarkersRef.current.push(marker);

      const near = Math.abs(index - targetIndex) <= 2;
      const endpoint = index === 0 || index === stations.length - 1;
      if ((near || endpoint) && !isCurrent) {
        const label = document.createElement("div");
        label.className = `stesen-map-label${near ? " is-near" : ""}`;
        label.textContent = station.name;
        const labelMarker = new maplibre.Marker({
          element: label,
          anchor: index % 2 === 0 ? "bottom" : "top",
          offset: [0, index % 2 === 0 ? -9 : 9],
        })
          .setLngLat([station.lng, station.lat])
          .addTo(map);
        stationMarkersRef.current.push(labelMarker);
      }
    });

  }, [ready, line, stations, currentIndex, finished, completedStationIds, holdingAtStation, typingProgress]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!ready || !map || !maplibre || stations.length === 0) return;

    const targetIndex = finished ? stations.length - 1 : clamp(currentIndex, 0, stations.length - 1);
    const target = stations[targetIndex];
    const previous = targetIndex > 0 ? stations[targetIndex - 1] : target;
    const segmentProgress = targetIndex === 0 ? 1 : finished ? 1 : holdingAtStation ? 1 : clamp(typingProgress, 0, 1);
    const trainLng = previous.lng + (target.lng - previous.lng) * segmentProgress;
    const trainLat = previous.lat + (target.lat - previous.lat) * segmentProgress;

    const previousPoint = map.project([previous.lng, previous.lat]);
    const targetPoint = map.project([target.lng, target.lat]);
    const angle = targetIndex === 0
      ? 0
      : Math.atan2(targetPoint.y - previousPoint.y, targetPoint.x - previousPoint.x) * (180 / Math.PI) + 90;

    let marker = trainMarkerRef.current;
    if (!marker) {
      const el = document.createElement("div");
      el.className = "stesen-train-marker";
      el.innerHTML = trainSvg(line.color, line.code, angle);
      marker = new maplibre.Marker({ element: el, anchor: "center" })
        .setLngLat([trainLng, trainLat])
        .addTo(map);
      marker.getElement().style.zIndex = "200";
      trainMarkerRef.current = marker;
    } else {
      marker.getElement().innerHTML = trainSvg(line.color, line.code, angle);
      marker.getElement().style.zIndex = "200";
      marker.setLngLat([trainLng, trainLat]);
    }
  }, [ready, line.color, line.code, stations, currentIndex, typingProgress, finished, holdingAtStation]);

  useEffect(() => {
    if (!ready) return;
    focusSegment(currentIndex, true);
    // Permintaan ini hanya berlaku apabila mula semula / pilih laluan baharu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewRequest, ready]);

  useEffect(() => {
    if (!ready || !followTrain) return;
    const lineChanged = previousLineRef.current !== line.id;
    const indexChanged = previousIndexRef.current !== currentIndex;
    previousLineRef.current = line.id;
    previousIndexRef.current = currentIndex;
    if (lineChanged || indexChanged) focusSegment(currentIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, line.id, currentIndex, followTrain]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;
    map.resize();
    const timeout = window.setTimeout(() => focusSegment(currentIndex, true), 80);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mobileKeyboardOpen, mobileKeyboardHeight]);

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ zoom: clamp(map.getZoom() + delta, 9, 17), duration: 220 });
  };

  return (
    <section className="networkStage" aria-label="Peta rangkaian rel Lembah Klang">
      <div ref={containerRef} className="realMapCanvas" />

      <div className="mapRouteTag">
        <span className="mapRouteNumber" style={{ background: line.color }}>{line.routeNumber}</span>
        <div><small>LALUAN {line.code}</small><strong>{line.shortName}</strong></div>
      </div>

      <div className="mapZoom" aria-label="Kawalan zum peta">
        <button type="button" onClick={() => zoomBy(1)} aria-label="Zum masuk">+</button>
        <button type="button" onClick={() => focusSegment(currentIndex, true)} aria-label="Pusatkan pada tren">⌾</button>
        <button type="button" onClick={() => zoomBy(-1)} aria-label="Zum keluar">−</button>
      </div>
    </section>
  );
}
