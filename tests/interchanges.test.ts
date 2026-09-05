import { describe, expect, it } from "vitest";
import { canTransferAt, getConnectionGroup, getRailLine, getStationNumber, railLines } from "../data/lines";

describe("Klang Valley transfer rules", () => {
  it("allows route changes only at interchange stations", () => {
    expect(canTransferAt("Titiwangsa", "putrajaya")).toBe(true);
    expect(canTransferAt("Tun Razak Exchange (TRX)", "kajang")).toBe(true);
    expect(canTransferAt("USJ 7", "kelana-jaya")).toBe(true);
    expect(canTransferAt("KL Sentral", "kelana-jaya")).toBe(true);
    expect(canTransferAt("Masjid Jamek", "kelana-jaya")).toBe(true);
  });

  it("does not pause gameplay at connecting stations", () => {
    expect(canTransferAt("PWTC", "ampang")).toBe(false);
    expect(canTransferAt("Ampang Park", "putrajaya")).toBe(false);
    expect(canTransferAt("Muzium Negara (KL Sentral)", "kajang")).toBe(false);
    expect(canTransferAt("Subang Jaya", "kelana-jaya")).toBe(false);
    expect(canTransferAt("Kampung Batu", "putrajaya")).toBe(false);
    expect(canTransferAt("Putrajaya Sentral", "putrajaya")).toBe(false);
    expect(canTransferAt("Abdullah Hukum", "kelana-jaya")).toBe(false);
    expect(canTransferAt("Kajang", "kajang")).toBe(false);
    expect(canTransferAt("KL Sentral", "monorail")).toBe(false);
    expect(getConnectionGroup("Kampung Batu", "putrajaya")?.kind).toBe("sambungan");
  });

  it("treats Bandar Tasik Selatan differently by service", () => {
    expect(canTransferAt("Bandar Tasik Selatan", "sri-petaling")).toBe(false);
    expect(canTransferAt("Bandar Tasik Selatan", "klia-transit")).toBe(true);
    expect(canTransferAt("Bandar Tasik Selatan", "komuter-seremban")).toBe(true);
  });

  it("does not turn connecting or same-name intercity stops into false transfers", () => {
    expect(canTransferAt("Putrajaya & Cyberjaya", "klia-transit")).toBe(false);
    expect(canTransferAt("KL Sentral", "ets-kl-ipoh")).toBe(false);
    expect(canTransferAt("Kajang", "ets-jb-kl")).toBe(false);
  });

  it("allows the two Northern Komuter corridors to interchange at Bukit Mertajam", () => {
    expect(canTransferAt("Bukit Mertajam", "komuter-utara-padang-besar")).toBe(true);
    expect(canTransferAt("Bukit Mertajam", "komuter-utara-ipoh")).toBe(true);
  });
});

describe("official integrated-map numbering", () => {
  it("keeps the printed Kajang and Putrajaya station numbers including gaps", () => {
    const kajang = getRailLine("kajang");
    expect(getStationNumber(kajang, kajang.stations[0])).toBe("4");
    expect(getStationNumber(kajang, kajang.stations[7])).toBe("12");
    expect(getStationNumber(kajang, kajang.stations[13])).toBe("18A");
    expect(getStationNumber(kajang, kajang.stations[26])).toBe("33");

    const putrajaya = getRailLine("putrajaya");
    expect(getStationNumber(putrajaya, putrajaya.stations[0])).toBe("1");
    expect(getStationNumber(putrajaya, putrajaya.stations[1])).toBe("3");
    expect(getStationNumber(putrajaya, putrajaya.stations[23])).toBe("27");
    expect(getStationNumber(putrajaya, putrajaya.stations.at(-1)!)).toBe("41");
  });

  it("keeps every line numbering list aligned with its station list", () => {
    railLines.forEach((line) => {
      expect(line.stationNumbers?.length).toBe(line.stations.length);
    });
  });
});
