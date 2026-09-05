export type TransitMode = "mrt" | "lrt" | "monorail" | "brt" | "airport" | "komuter" | "ets" | "ecrl";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type RailLineId =
  | "kajang"
  | "putrajaya"
  | "kelana-jaya"
  | "sri-petaling"
  | "ampang"
  | "shah-alam"
  | "monorail"
  | "sunway"
  | "klia-transit"
  | "komuter-port-klang"
  | "komuter-seremban"
  | "komuter-utara-padang-besar"
  | "komuter-utara-ipoh"
  | "komuter-selatan"
  | "ets-kl-ipoh"
  | "ets-kl-butterworth"
  | "ets-kl-padang-besar"
  | "ets-jb-kl"
  | "ets-jb-butterworth"
  | "ets-jb-padang-besar"
  | "ets-segamat-butterworth"
  | "ecrl";

export type RailLine = {
  id: RailLineId;
  code: string;
  routeNumber: string;
  stationNumbers?: string[];
  name: string;
  shortName: string;
  color: string;
  mode: TransitMode;
  stations: Station[];
  operator?: string;
  status?: "operasi" | "akan-datang";
  note?: string;
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const s = (name: string, lat: number, lng: number): Station => ({
  id: slugify(name),
  name,
  lat,
  lng,
});

// Station coordinates provide the geographic structure for the unified network.
// STESEN keeps a real top-down map, while suppressing most labels, POIs, buildings
// and road detail so the rail lines stay visually dominant.
export const railLines: RailLine[] = [
  {
    id: "kajang",
    code: "KG",
    routeNumber: "9",
    stationNumbers: ["4", "5", "6", "7", "8", "9", "10", "12", "13", "14", "15", "16", "17", "18A", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "33", "34", "35"],
    name: "Laluan MRT Kajang",
    shortName: "Kajang",
    color: "#047940",
    mode: "mrt",
    stations: [
      s("Kwasa Damansara", 3.1763324, 101.5721456),
      s("Kwasa Sentral", 3.170112, 101.564651),
      s("Kota Damansara", 3.150134, 101.57869),
      s("Surian", 3.14948, 101.593925),
      s("Mutiara Damansara", 3.155301, 101.609077),
      s("Bandar Utama", 3.1448229, 101.6189291),
      s("Taman Tun Dr Ismail", 3.13613, 101.630539),
      s("Phileo Damansara", 3.129864, 101.642471),
      s("Pavilion Damansara Heights Pusat Bandar Damansara", 3.143444, 101.662857),
      s("Semantan", 3.150977, 101.665497),
      s("Muzium Negara (KL Sentral)", 3.137317, 101.687336),
      s("Pasar Seni", 3.142293265, 101.6955642),
      s("Merdeka", 3.141969, 101.70205),
      s("Pavilion Bukit Bintang", 3.146022, 101.7115),
      s("Tun Razak Exchange (TRX)", 3.1423687776, 101.7201077083),
      s("Cochrane", 3.132829, 101.722962),
      s("AEON Maluri", 3.123623, 101.727809),
      s("Taman Pertama", 3.112547, 101.729371),
      s("Taman Midah", 3.104505, 101.732186),
      s("Taman Mutiara", 3.090989, 101.740453),
      s("Taman Connaught", 3.079172, 101.74522),
      s("Taman Suntex", 3.071578, 101.763552),
      s("Sri Raya", 3.062273, 101.772899),
      s("Bandar Tun Hussein Onn", 3.048223, 101.775109),
      s("Batu Sebelas Cheras", 3.041339, 101.773383),
      s("Bukit Dukung", 3.026413, 101.771072),
      s("Sungai Jernih", 3.000948, 101.783857),
      s("Stadium Kajang", 2.994514, 101.786338),
      s("Kajang", 2.982778, 101.790278),
    ],
  },
  {
    id: "putrajaya",
    code: "PY",
    routeNumber: "12",
    stationNumbers: ["1", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "27", "28", "29", "31", "32", "33", "34", "36", "37", "38", "39", "40", "41"],
    name: "Laluan MRT Putrajaya",
    shortName: "Putrajaya",
    color: "#FFCD00",
    mode: "mrt",
    stations: [
      s("Kwasa Damansara", 3.1763324, 101.5721456),
      s("Kampung Selamat", 3.197266, 101.578499),
      s("Sungai Buloh", 3.206429, 101.581779),
      s("Damansara Damai", 3.199892, 101.592623),
      s("Sri Damansara Barat", 3.198197, 101.608302),
      s("Sri Damansara Sentral", 3.198815, 101.621396),
      s("Sri Damansara Timur", 3.207832, 101.628716),
      s("Metro Prima", 3.214438, 101.639402),
      s("Kepong Baru", 3.211663, 101.648193),
      s("Jinjang", 3.209544, 101.655829),
      s("Sri Delima", 3.207108, 101.665749),
      s("Kampung Batu", 3.205521, 101.675473),
      s("Kentonmen", 3.19563, 101.6797),
      s("Jalan Ipoh", 3.189319, 101.681145),
      s("Sentul Barat", 3.179369, 101.684742),
      s("Titiwangsa", 3.173192, 101.696022),
      s("Hospital Kuala Lumpur", 3.17405, 101.70239),
      s("Raja Uda", 3.16794, 101.71017),
      s("Ampang Park", 3.16225, 101.71781),
      s("Persiaran KLCC", 3.15712, 101.71834),
      s("Conlay", 3.151271968, 101.718286078),
      s("Tun Razak Exchange (TRX)", 3.1423687776, 101.7201077083),
      s("Chan Sow Lin", 3.12839, 101.71663),
      s("Kuchai", 3.089546, 101.694124),
      s("Taman Naga Emas", 3.077688, 101.699867),
      s("Sungai Besi", 3.063737, 101.7084),
      s("Serdang Raya Utara", 3.041674, 101.704928),
      s("Serdang Raya Selatan", 3.028463, 101.707514),
      s("Serdang Jaya", 3.0216, 101.709),
      s("UPM", 3.008489, 101.705396),
      s("Taman Equine", 2.98942, 101.67244),
      s("Putra Permai", 2.98339, 101.66099),
      s("16 Sierra", 2.964974, 101.654812),
      s("Cyberjaya Utara", 2.95, 101.6573),
      s("Cyberjaya City Centre", 2.9384, 101.6659),
      s("Putrajaya Sentral", 2.9313, 101.6715),
    ],
  },
  {
    id: "kelana-jaya",
    code: "KJ",
    routeNumber: "5",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37"],
    name: "Laluan LRT Kelana Jaya",
    shortName: "Kelana Jaya",
    color: "#D50032",
    mode: "lrt",
    stations: [
      s("Gombak", 3.231793, 101.724427),
      s("Taman Melati", 3.219558, 101.72197),
      s("Wangsa Maju", 3.205751, 101.731796),
      s("Sri Rampai", 3.199176, 101.73747),
      s("Setiawangsa", 3.17576, 101.73584),
      s("Jelatek", 3.167204, 101.735344),
      s("Dato' Keramat", 3.16509, 101.73184),
      s("Damai", 3.164406, 101.724489),
      s("Ampang Park", 3.16225, 101.71781),
      s("KLCC", 3.159394, 101.713356),
      s("Kampung Baru", 3.161386, 101.706608),
      s("Dang Wangi", 3.156942, 101.701975),
      s("Masjid Jamek", 3.14927, 101.696377),
      s("Pasar Seni", 3.142293265, 101.6955642),
      s("KL Sentral", 3.13442, 101.68625),
      s("Bangsar", 3.127588, 101.679062),
      s("Abdullah Hukum", 3.118735, 101.672897),
      s("Kerinchi", 3.115506, 101.668572),
      s("Universiti", 3.114616, 101.661639),
      s("Taman Jaya", 3.104086, 101.645248),
      s("Asia Jaya", 3.104343, 101.637695),
      s("Taman Paramount", 3.104716, 101.623192),
      s("Taman Bahagia", 3.11079, 101.612856),
      s("Kelana Jaya", 3.112497, 101.6043),
      s("Lembah Subang", 3.112094, 101.591034),
      s("Ara Damansara", 3.108643, 101.586372),
      s("Glenmarie", 3.094732, 101.590622),
      s("Subang Jaya", 3.08466, 101.588127),
      s("SS 15", 3.075972, 101.585983),
      s("SS 18", 3.067182, 101.585945),
      s("USJ 7", 3.054956, 101.592194),
      s("Taipan", 3.04815, 101.590233),
      s("Wawasan", 3.035062, 101.588348),
      s("USJ 21", 3.029881, 101.581711),
      s("Alam Megah", 3.023151, 101.572029),
      s("Subang Alam", 3.009421, 101.572281),
      s("Putra Heights", 2.996016, 101.575521),
    ],
  },
  {
    id: "sri-petaling",
    code: "SP",
    routeNumber: "4",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"],
    name: "Laluan LRT Sri Petaling",
    shortName: "Sri Petaling",
    color: "#76232F",
    mode: "lrt",
    stations: [
      s("Sentul Timur", 3.185897, 101.695217),
      s("Sentul", 3.178484, 101.695542),
      s("Titiwangsa", 3.173192, 101.696022),
      s("PWTC", 3.166333, 101.693586),
      s("Sultan Ismail", 3.161245, 101.694109),
      s("Bandaraya", 3.155567, 101.694485),
      s("Masjid Jamek", 3.14927, 101.696377),
      s("Plaza Rakyat", 3.144049, 101.702105),
      s("Hang Tuah", 3.140511, 101.706029),
      s("Pudu", 3.134879, 101.711957),
      s("Chan Sow Lin", 3.12839, 101.71663),
      s("Cheras", 3.112609, 101.714178),
      s("Salak Selatan", 3.102201, 101.706179),
      s("Bandar Tun Razak", 3.089576, 101.712466),
      s("Bandar Tasik Selatan", 3.076058, 101.711107),
      s("Sungai Besi", 3.063737, 101.7084),
      s("Bukit Jalil", 3.058196, 101.692125),
      s("Sri Petaling", 3.061445, 101.687074),
      s("Awan Besar", 3.062131, 101.670555),
      s("Muhibbah", 3.062229, 101.662552),
      s("Alam Sutera", 3.0547, 101.656468),
      s("Kinrara BK5", 3.050506, 101.644294),
      s("IOI Puchong Jaya", 3.048101, 101.62095),
      s("Pusat Bandar Puchong", 3.033194, 101.616057),
      s("Taman Perindustrian Puchong", 3.022814, 101.613514),
      s("Bandar Puteri", 3.017111, 101.612855),
      s("Puchong Perdana", 3.007913, 101.605021),
      s("Puchong Prima", 2.999808, 101.596692),
      s("Putra Heights", 2.996016, 101.575521),
    ],
  },
  {
    id: "ampang",
    code: "AG",
    routeNumber: "3",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
    name: "Laluan LRT Ampang",
    shortName: "Ampang",
    color: "#E57200",
    mode: "lrt",
    stations: [
      s("Sentul Timur", 3.185897, 101.695217),
      s("Sentul", 3.178484, 101.695542),
      s("Titiwangsa", 3.173192, 101.696022),
      s("PWTC", 3.166333, 101.693586),
      s("Sultan Ismail", 3.161245, 101.694109),
      s("Bandaraya", 3.155567, 101.694485),
      s("Masjid Jamek", 3.14927, 101.696377),
      s("Plaza Rakyat", 3.144049, 101.702105),
      s("Hang Tuah", 3.140511, 101.706029),
      s("Pudu", 3.134879, 101.711957),
      s("Chan Sow Lin", 3.12839, 101.71663),
      s("Miharja", 3.120973, 101.717922),
      s("Maluri", 3.123623, 101.727809),
      s("Pandan Jaya", 3.130141, 101.739122),
      s("Pandan Indah", 3.134581, 101.746509),
      s("Cempaka", 3.138324, 101.752979),
      s("Cahaya", 3.140575, 101.756677),
      s("Ampang", 3.150318, 101.760049),
    ],
  },
  {
    id: "shah-alam",
    code: "SA",
    routeNumber: "11",
    stationNumbers: ["1", "2", "3", "5", "6", "7", "9", "10", "12", "14", "15", "17", "18", "19", "20", "21", "22", "23", "24", "26"],
    name: "Laluan LRT Shah Alam",
    shortName: "Shah Alam",
    color: "#58B7D9",
    mode: "lrt",
    stations: [
      s("Bandar Utama", 3.1448229, 101.6189291),
      s("Kayu Ara", 3.134722, 101.616667),
      s("BU 11", 3.133333, 101.604444),
      s("Damansara Idaman", 3.122778, 101.594167),
      s("Subang", 3.106111, 101.591111),
      s("Glenmarie 2", 3.095278, 101.588611),
      s("Kerjaya", 3.082222, 101.561944),
      s("Stadium Shah Alam", 3.079722, 101.548889),
      s("Dato' Menteri", 3.069722, 101.521111),
      s("UiTM Shah Alam", 3.0625, 101.501111),
      s("Seksyen 7 Shah Alam", 3.067222, 101.486667),
      s("Bandar Baru Klang", 3.0625, 101.465556),
      s("Pasar Klang", 3.067778, 101.450833),
      s("Jalan Meru", 3.058889, 101.451944),
      s("Jambatan Kota", 3.047222, 101.4475),
      s("Taman Selatan", 3.026667, 101.442222),
      s("Seri Andalas", 3.015833, 101.440556),
      s("Klang Jaya", 3.005278, 101.441667),
      s("Bandar Bukit Tinggi", 2.993056, 101.445833),
      s("Johan Setia", 2.976111, 101.459167),
    ],
  },
  {
    id: "monorail",
    code: "MR",
    routeNumber: "8",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    name: "Laluan Monorel KL",
    shortName: "Monorel KL",
    color: "#84BD00",
    mode: "monorail",
    stations: [
      s("KL Sentral", 3.132852, 101.687817),
      s("Tun Sambanthan", 3.13132, 101.69085),
      s("Maharajalela", 3.138743, 101.699268),
      s("Hang Tuah", 3.140511, 101.706029),
      s("Imbi", 3.14283, 101.70945),
      s("Bukit Bintang", 3.146022, 101.7115),
      s("Raja Chulan", 3.150878, 101.710432),
      s("Bukit Nanas", 3.156214, 101.704809),
      s("Medan Tuanku", 3.15935, 101.69888),
      s("Chow Kit", 3.167358, 101.698379),
      s("Titiwangsa", 3.173192, 101.696022),
    ],
  },
  {
    id: "sunway",
    code: "B1",
    routeNumber: "B1",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7"],
    name: "Laluan BRT Sunway",
    shortName: "Sunway BRT",
    color: "#07553F",
    mode: "brt",
    stations: [
      s("Sunway–Setia Jaya", 3.0828, 101.6123),
      s("Mentari", 3.0761, 101.6101),
      s("Sunway Lagoon", 3.0706, 101.6107),
      s("SunMed", 3.0656, 101.6087),
      s("SunU–Monash", 3.0654, 101.6016),
      s("South Quay–USJ 1", 3.0617, 101.5969),
      s("USJ 7", 3.054956, 101.592194),
    ],
  },
  {
    id: "klia-transit",
    code: "KT",
    routeNumber: "7",
    stationNumbers: ["1", "2", "3", "4", "5", "6"],
    name: "KLIA Transit",
    shortName: "KLIA Transit",
    color: "#36AEC0",
    mode: "airport",
    stations: [
      s("KL Sentral", 3.132852, 101.687817),
      s("Bandar Tasik Selatan", 3.076058, 101.711107),
      s("Putrajaya & Cyberjaya", 2.93169, 101.67099),
      s("Salak Tinggi", 2.825556, 101.713058),
      s("KLIA T1", 2.75497, 101.7049),
      s("KLIA T2", 2.74459, 101.68514),
    ],
  },
  {
    id: "komuter-port-klang",
    code: "K2",
    routeNumber: "2",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"],
    name: "KTM Komuter Tanjung Malim–Pelabuhan Klang",
    shortName: "Komuter Pelabuhan Klang",
    color: "#D22630",
    mode: "komuter",
    operator: "KTMB",
    stations: [
      s("Tanjung Malim", 3.6851, 101.5183),
      s("Kuala Kubu Bharu", 3.5630, 101.6570),
      s("Rasa", 3.4990, 101.6340),
      s("Batang Kali", 3.4680, 101.6380),
      s("Serendah", 3.3640, 101.6040),
      s("Rawang", 3.3213, 101.5767),
      s("Kuang", 3.2582, 101.5546),
      s("Sungai Buloh", 3.206429, 101.581779),
      s("Kepong Sentral", 3.2111, 101.6372),
      s("Kepong", 3.2028, 101.6378),
      s("Segambut", 3.1867, 101.6672),
      s("Putra", 3.1657, 101.6916),
      s("Bank Negara", 3.1546, 101.6930),
      s("Kuala Lumpur", 3.1394, 101.6933),
      s("KL Sentral", 3.13442, 101.68625),
      s("Abdullah Hukum", 3.118735, 101.672897),
      s("Angkasapuri", 3.1123, 101.6735),
      s("Pantai Dalam", 3.0957, 101.6695),
      s("Petaling", 3.0862, 101.6587),
      s("Jalan Templer", 3.0845, 101.6480),
      s("Kampung Dato Harun", 3.0830, 101.6356),
      s("Seri Setia", 3.0839, 101.6229),
      s("Setia Jaya", 3.0831, 101.6127),
      s("Subang Jaya", 3.08466, 101.588127),
      s("Batu Tiga", 3.0760, 101.5590),
      s("Shah Alam", 3.0564, 101.5256),
      s("Padang Jawa", 3.0526, 101.4935),
      s("Bukit Badak", 3.0365, 101.4703),
      s("Klang", 3.0426, 101.4496),
      s("Teluk Pulai", 3.0406, 101.4307),
      s("Teluk Gadong", 3.0335, 101.4245),
      s("Kampung Raja Uda", 3.0205, 101.4105),
      s("Jalan Kastam", 3.0098, 101.4026),
      s("Pelabuhan Klang", 2.9997, 101.3928),
    ],
  },
  {
    id: "komuter-seremban",
    code: "K1",
    routeNumber: "1",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27"],
    name: "KTM Komuter Batu Caves–Pulau Sebang",
    shortName: "Komuter Seremban",
    color: "#1F5AA6",
    mode: "komuter",
    operator: "KTMB",
    stations: [
      s("Batu Caves", 3.2375, 101.6810),
      s("Taman Wahyu", 3.2146, 101.6721),
      s("Kampung Batu", 3.205521, 101.675473),
      s("Batu Kentonmen", 3.1964, 101.6815),
      s("Sentul", 3.1787, 101.6900),
      s("Putra", 3.1657, 101.6916),
      s("Bank Negara", 3.1546, 101.6930),
      s("Kuala Lumpur", 3.1394, 101.6933),
      s("KL Sentral", 3.13442, 101.68625),
      s("Mid Valley", 3.1189, 101.6787),
      s("Seputeh", 3.1131, 101.6816),
      s("Salak Selatan", 3.102201, 101.706179),
      s("Bandar Tasik Selatan", 3.076058, 101.711107),
      s("Serdang", 3.0233, 101.7154),
      s("Kajang", 2.982778, 101.790278),
      s("Kajang 2", 2.9638, 101.7908),
      s("UKM", 2.9395, 101.7874),
      s("Bangi", 2.9039, 101.7855),
      s("Batang Benar", 2.8297, 101.8264),
      s("Nilai", 2.8023, 101.7995),
      s("Labu", 2.7561, 101.8255),
      s("Tiroi", 2.7417, 101.9113),
      s("Seremban", 2.7297, 101.9381),
      s("Senawang", 2.6920, 101.9513),
      s("Sungai Gadut", 2.6562, 101.9499),
      s("Rembau", 2.5904, 102.0905),
      s("Pulau Sebang", 2.4550, 102.2320),
    ],
  },
  {
    id: "komuter-utara-padang-besar",
    code: "KU",
    routeNumber: "KU",
    stationNumbers: Array.from({ length: 13 }, (_, index) => String(index + 1)),
    name: "KTM Komuter Utara Padang Besar–Butterworth",
    shortName: "Komuter Utara Padang Besar–Butterworth",
    color: "#2B8A5A",
    mode: "komuter",
    operator: "KTMB",
    stations: [
      s("Padang Besar", 6.66209, 100.31908),
      s("Bukit Ketri", 6.5798, 100.2798),
      s("Arau", 6.42977, 100.26921),
      s("Kodiang", 6.3377, 100.3026),
      s("Anak Bukit", 6.18315, 100.37463),
      s("Alor Setar", 6.11456, 100.36980),
      s("Kobah", 5.9469, 100.4051),
      s("Gurun", 5.82451, 100.47756),
      s("Sungai Petani", 5.64302, 100.48975),
      s("Tasek Gelugor", 5.48179, 100.49690),
      s("Bukit Mertajam", 5.36640, 100.44783),
      s("Bukit Tengah", 5.3637, 100.4149),
      s("Butterworth", 5.3943, 100.3669),
    ],
  },
  {
    id: "komuter-utara-ipoh",
    code: "KU",
    routeNumber: "KU",
    stationNumbers: Array.from({ length: 13 }, (_, index) => String(index + 1)),
    name: "KTM Komuter Utara Butterworth–Ipoh",
    shortName: "Komuter Utara Butterworth–Ipoh",
    color: "#3168B1",
    mode: "komuter",
    operator: "KTMB",
    stations: [
      s("Butterworth", 5.3943, 100.3669),
      s("Bukit Tengah", 5.3637, 100.4149),
      s("Bukit Mertajam", 5.36640, 100.44783),
      s("Simpang Ampat", 5.2808, 100.4777),
      s("Nibong Tebal", 5.16936, 100.48003),
      s("Parit Buntar", 5.12873, 100.48662),
      s("Bagan Serai", 5.02719, 100.52705),
      s("Kamunting", 4.8876, 100.7331),
      s("Taiping", 4.85207, 100.73123),
      s("Padang Rengas", 4.7772, 100.8447),
      s("Kuala Kangsar", 4.77655, 100.93199),
      s("Sungai Siput", 4.81949, 101.07132),
      s("Ipoh", 4.59712, 101.07263),
    ],
  },
  {
    id: "komuter-selatan",
    code: "KS",
    routeNumber: "KS",
    stationNumbers: Array.from({ length: 7 }, (_, index) => String(index + 1)),
    name: "KTM Komuter Selatan Paloh–JB Sentral",
    shortName: "Komuter Selatan Paloh–JB Sentral",
    color: "#76507B",
    mode: "komuter",
    operator: "KTMB",
    note: "Perkhidmatan Komuter Selatan semasa antara Paloh dan JB Sentral.",
    stations: [
      s("Paloh", 2.186821, 103.193872),
      s("Kluang", 2.033503, 103.317511),
      s("Rengam", 1.884759, 103.403471),
      s("Layang-Layang", 1.814029, 103.474946),
      s("Kulai", 1.663680, 103.599143),
      s("Kempas Baru", 1.535885, 103.721452),
      s("JB Sentral", 1.463080, 103.764683),
    ],
  },
  {
    id: "ets-kl-ipoh",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 13 }, (_, index) => String(index + 1)),
    name: "KTM ETS KL Sentral–Ipoh",
    shortName: "ETS KL Sentral–Ipoh",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872),
      s("Rawang", 3.31895, 101.57475), s("Batang Kali", 3.46833, 101.63759),
      s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918),
      s("Kampar", 4.30280, 101.15337), s("Batu Gajah", 4.46128, 101.04928),
      s("Ipoh", 4.59712, 101.07263),
    ],
  },
  {
    id: "ets-kl-butterworth",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 21 }, (_, index) => String(index + 1)),
    name: "KTM ETS KL Sentral–Butterworth",
    shortName: "ETS KL Sentral–Butterworth",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872),
      s("Rawang", 3.31895, 101.57475), s("Batang Kali", 3.46833, 101.63759),
      s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918),
      s("Kampar", 4.30280, 101.15337), s("Batu Gajah", 4.46128, 101.04928),
      s("Ipoh", 4.59712, 101.07263), s("Sungai Siput", 4.81949, 101.07132),
      s("Kuala Kangsar", 4.77655, 100.93199), s("Taiping", 4.85207, 100.73123),
      s("Bagan Serai", 5.02719, 100.52705), s("Parit Buntar", 5.12873, 100.48662),
      s("Nibong Tebal", 5.16936, 100.48003), s("Bukit Mertajam", 5.36640, 100.44783),
      s("Butterworth", 5.3943, 100.3669),
    ],
  },
  {
    id: "ets-kl-padang-besar",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 27 }, (_, index) => String(index + 1)),
    name: "KTM ETS KL Sentral–Padang Besar",
    shortName: "ETS KL Sentral–Padang Besar",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872),
      s("Rawang", 3.31895, 101.57475), s("Batang Kali", 3.46833, 101.63759),
      s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918),
      s("Kampar", 4.30280, 101.15337), s("Batu Gajah", 4.46128, 101.04928),
      s("Ipoh", 4.59712, 101.07263), s("Sungai Siput", 4.81949, 101.07132),
      s("Kuala Kangsar", 4.77655, 100.93199), s("Taiping", 4.85207, 100.73123),
      s("Bagan Serai", 5.02719, 100.52705), s("Parit Buntar", 5.12873, 100.48662),
      s("Nibong Tebal", 5.16936, 100.48003), s("Bukit Mertajam", 5.36640, 100.44783),
      s("Tasek Gelugor", 5.48179, 100.49690), s("Sungai Petani", 5.64302, 100.48975),
      s("Gurun", 5.82451, 100.47756), s("Alor Setar", 6.11456, 100.36980),
      s("Anak Bukit", 6.18315, 100.37463), s("Arau", 6.42977, 100.26921),
      s("Padang Besar", 6.66209, 100.31908),
    ],
  },
  {
    id: "ets-jb-kl",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 17 }, (_, index) => String(index + 1)),
    name: "KTM ETS JB Sentral–KL Sentral",
    shortName: "ETS JB Sentral–KL Sentral",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("JB Sentral", 1.463080, 103.764683), s("Kempas Baru", 1.535885, 103.721452),
      s("Kulai", 1.663680, 103.599143), s("Layang-Layang", 1.814029, 103.474946),
      s("Rengam", 1.884759, 103.403471), s("Kluang", 2.033503, 103.317511),
      s("Paloh", 2.186821, 103.193872), s("Bekok", 2.295292, 103.129885),
      s("Labis", 2.382531, 103.020537), s("Segamat", 2.507515, 102.813342),
      s("Gemas", 2.579606, 102.611682), s("Batang Melaka", 2.475016, 102.419121),
      s("Pulau Sebang / Tampin", 2.46262, 102.22704), s("Seremban", 2.71856, 101.94063),
      s("Kajang", 2.98238, 101.79051), s("Bandar Tasik Selatan", 3.07647, 101.71118),
      s("KL Sentral", 3.13404, 101.68614),
    ],
  },
  {
    id: "ets-jb-butterworth",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 37 }, (_, index) => String(index + 1)),
    name: "KTM ETS JB Sentral–Butterworth",
    shortName: "ETS JB Sentral–Butterworth",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("JB Sentral", 1.463080, 103.764683), s("Kempas Baru", 1.535885, 103.721452), s("Kulai", 1.663680, 103.599143),
      s("Layang-Layang", 1.814029, 103.474946), s("Rengam", 1.884759, 103.403471), s("Kluang", 2.033503, 103.317511),
      s("Paloh", 2.186821, 103.193872), s("Bekok", 2.295292, 103.129885), s("Labis", 2.382531, 103.020537),
      s("Segamat", 2.507515, 102.813342), s("Gemas", 2.579606, 102.611682), s("Batang Melaka", 2.475016, 102.419121),
      s("Pulau Sebang / Tampin", 2.46262, 102.22704), s("Seremban", 2.71856, 101.94063), s("Kajang", 2.98238, 101.79051),
      s("Bandar Tasik Selatan", 3.07647, 101.71118), s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872), s("Rawang", 3.31895, 101.57475),
      s("Batang Kali", 3.46833, 101.63759), s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918), s("Kampar", 4.30280, 101.15337),
      s("Batu Gajah", 4.46128, 101.04928), s("Ipoh", 4.59712, 101.07263), s("Sungai Siput", 4.81949, 101.07132),
      s("Kuala Kangsar", 4.77655, 100.93199), s("Taiping", 4.85207, 100.73123), s("Bagan Serai", 5.02719, 100.52705),
      s("Parit Buntar", 5.12873, 100.48662), s("Nibong Tebal", 5.16936, 100.48003), s("Bukit Mertajam", 5.36640, 100.44783),
      s("Butterworth", 5.3943, 100.3669),
    ],
  },
  {
    id: "ets-jb-padang-besar",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 43 }, (_, index) => String(index + 1)),
    name: "KTM ETS JB Sentral–Padang Besar",
    shortName: "ETS JB Sentral–Padang Besar",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("JB Sentral", 1.463080, 103.764683), s("Kempas Baru", 1.535885, 103.721452), s("Kulai", 1.663680, 103.599143),
      s("Layang-Layang", 1.814029, 103.474946), s("Rengam", 1.884759, 103.403471), s("Kluang", 2.033503, 103.317511),
      s("Paloh", 2.186821, 103.193872), s("Bekok", 2.295292, 103.129885), s("Labis", 2.382531, 103.020537),
      s("Segamat", 2.507515, 102.813342), s("Gemas", 2.579606, 102.611682), s("Batang Melaka", 2.475016, 102.419121),
      s("Pulau Sebang / Tampin", 2.46262, 102.22704), s("Seremban", 2.71856, 101.94063), s("Kajang", 2.98238, 101.79051),
      s("Bandar Tasik Selatan", 3.07647, 101.71118), s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872), s("Rawang", 3.31895, 101.57475),
      s("Batang Kali", 3.46833, 101.63759), s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918), s("Kampar", 4.30280, 101.15337),
      s("Batu Gajah", 4.46128, 101.04928), s("Ipoh", 4.59712, 101.07263), s("Sungai Siput", 4.81949, 101.07132),
      s("Kuala Kangsar", 4.77655, 100.93199), s("Taiping", 4.85207, 100.73123), s("Bagan Serai", 5.02719, 100.52705),
      s("Parit Buntar", 5.12873, 100.48662), s("Nibong Tebal", 5.16936, 100.48003), s("Bukit Mertajam", 5.36640, 100.44783),
      s("Tasek Gelugor", 5.48179, 100.49690), s("Sungai Petani", 5.64302, 100.48975), s("Gurun", 5.82451, 100.47756),
      s("Alor Setar", 6.11456, 100.36980), s("Anak Bukit", 6.18315, 100.37463), s("Arau", 6.42977, 100.26921), s("Padang Besar", 6.66209, 100.31908),
    ],
  },
  {
    id: "ets-segamat-butterworth",
    code: "ETS",
    routeNumber: "ETS",
    stationNumbers: Array.from({ length: 28 }, (_, index) => String(index + 1)),
    name: "KTM ETS Segamat–Butterworth",
    shortName: "ETS Segamat–Butterworth",
    color: "#C79218",
    mode: "ets",
    operator: "KTMB",
    note: "Koridor perkhidmatan ETS semasa. Hentian sebenar berbeza mengikut nombor tren dan kelas ETS.",
    stations: [
      s("Segamat", 2.507515, 102.813342), s("Gemas", 2.579606, 102.611682), s("Batang Melaka", 2.475016, 102.419121),
      s("Pulau Sebang / Tampin", 2.46262, 102.22704), s("Seremban", 2.71856, 101.94063), s("Kajang", 2.98238, 101.79051),
      s("Bandar Tasik Selatan", 3.07647, 101.71118), s("KL Sentral", 3.13404, 101.68614), s("Kuala Lumpur", 3.13969, 101.69363),
      s("Kepong Sentral", 3.20864, 101.62804), s("Sungai Buloh", 3.20671, 101.57872), s("Rawang", 3.31895, 101.57475),
      s("Batang Kali", 3.46833, 101.63759), s("Tanjung Malim", 3.68461, 101.51809), s("Slim River", 3.82721, 101.40254),
      s("Sungkai", 4.00575, 101.30215), s("Tapah Road", 4.17278, 101.18918), s("Kampar", 4.30280, 101.15337),
      s("Batu Gajah", 4.46128, 101.04928), s("Ipoh", 4.59712, 101.07263), s("Sungai Siput", 4.81949, 101.07132),
      s("Kuala Kangsar", 4.77655, 100.93199), s("Taiping", 4.85207, 100.73123), s("Bagan Serai", 5.02719, 100.52705),
      s("Parit Buntar", 5.12873, 100.48662), s("Nibong Tebal", 5.16936, 100.48003), s("Bukit Mertajam", 5.36640, 100.44783),
      s("Butterworth", 5.3943, 100.3669),
    ],
  },
  {
    id: "ecrl",
    code: "ECRL",
    routeNumber: "ECRL",
    stationNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
    name: "Laluan Rel Pantai Timur (ECRL)",
    shortName: "ECRL",
    color: "#4BA6C8",
    mode: "ecrl",
    operator: "MRL / EOSB",
    status: "akan-datang",
    note: "Fasa 1 Kota Bharu–Terminal Bersepadu Gombak dijadualkan beroperasi Januari 2027; jajaran barat masih akan datang",
    stations: [
      s("Kota Bharu", 6.1254, 102.2381),
      s("Pasir Puteh", 5.8360, 102.4080),
      s("Jerteh", 5.7330, 102.4930),
      s("Bandar Permaisuri", 5.5200, 102.7450),
      s("Kuala Terengganu", 5.3302, 103.1408),
      s("Dungun", 4.7560, 103.4150),
      s("Kemasik", 4.4290, 103.4570),
      s("Chukai", 4.2320, 103.4260),
      s("Cherating", 4.1290, 103.3940),
      s("Kuantan Port City", 3.9700, 103.4100),
      s("KotaSAS", 3.8570, 103.2640),
      s("Paya Besar", 3.7900, 103.1900),
      s("Maran", 3.5860, 102.7730),
      s("Temerloh", 3.4470, 102.4170),
      s("Bentong", 3.5220, 101.9080),
      s("Terminal Bersepadu Gombak", 3.2340, 101.7245),
      s("Bandar Serendah", 3.3640, 101.6040),
      s("Puncak Alam", 3.1900, 101.4500),
      s("Kapar", 3.1380, 101.3750),
      s("Jalan Kastam", 3.0098, 101.4026),
    ],
  },

];

export const getRailLine = (id: RailLineId) => railLines.find((line) => line.id === id) ?? railLines[0];

export const normalizeStationKey = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/[().,]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export type ConnectionKind = "pertukaran" | "sambungan";

export type ConnectionGroup = {
  id: string;
  label: string;
  kind: ConnectionKind;
  members: Partial<Record<RailLineId, string>>;
};

// Sambungan/pertukaran dibuat secara eksplisit supaya laluan yang berkongsi
// landasan (terutamanya Ampang + Sri Petaling) tidak tersalah ditanda sebagai
// stesen pertukaran pada setiap hentian.
export const connectionGroups: ConnectionGroup[] = [
  // Klasifikasi mengikuti legenda pada Peta Transit Berintegrasi Lembah Klang
  // Jun 2026: hanya `pertukaran` dibenarkan menukar laluan di dalam permainan.
  // `sambungan` kekal sebagai rujukan rangkaian tetapi permainan terus seperti biasa.
  { id: "kwasa-damansara", label: "Kwasa Damansara", kind: "pertukaran", members: { kajang: "Kwasa Damansara", putrajaya: "Kwasa Damansara" } },
  { id: "bandar-utama", label: "Bandar Utama", kind: "pertukaran", members: { kajang: "Bandar Utama", "shah-alam": "Bandar Utama" } },
  { id: "sungai-buloh", label: "Sungai Buloh", kind: "sambungan", members: { putrajaya: "Sungai Buloh", "komuter-port-klang": "Sungai Buloh" } },
  { id: "sri-damansara-timur-kepong-sentral", label: "Sri Damansara Timur · Kepong Sentral", kind: "sambungan", members: { putrajaya: "Sri Damansara Timur", "komuter-port-klang": "Kepong Sentral" } },
  { id: "kampung-batu", label: "Kampung Batu", kind: "sambungan", members: { putrajaya: "Kampung Batu", "komuter-seremban": "Kampung Batu" } },
  { id: "titiwangsa", label: "Titiwangsa", kind: "pertukaran", members: { putrajaya: "Titiwangsa", "sri-petaling": "Titiwangsa", ampang: "Titiwangsa", monorail: "Titiwangsa" } },
  { id: "ampang-park", label: "Ampang Park", kind: "sambungan", members: { putrajaya: "Ampang Park", "kelana-jaya": "Ampang Park" } },
  { id: "klcc-persiaran-klcc", label: "KLCC · Persiaran KLCC", kind: "sambungan", members: { putrajaya: "Persiaran KLCC", "kelana-jaya": "KLCC" } },
  { id: "trx", label: "Tun Razak Exchange (TRX)", kind: "pertukaran", members: { kajang: "Tun Razak Exchange (TRX)", putrajaya: "Tun Razak Exchange (TRX)" } },
  { id: "chan-sow-lin", label: "Chan Sow Lin", kind: "pertukaran", members: { putrajaya: "Chan Sow Lin", "sri-petaling": "Chan Sow Lin", ampang: "Chan Sow Lin" } },
  { id: "sungai-besi", label: "Sungai Besi", kind: "pertukaran", members: { putrajaya: "Sungai Besi", "sri-petaling": "Sungai Besi" } },
  { id: "putrajaya-sentral", label: "Putrajaya Sentral", kind: "sambungan", members: { putrajaya: "Putrajaya Sentral", "klia-transit": "Putrajaya & Cyberjaya" } },

  // KL Sentral ialah hab pertukaran. Muzium Negara pada Laluan Kajang ialah
  // stesen sambungan kepada hab tersebut, jadi Laluan Kajang sengaja tidak
  // dimasukkan dalam kumpulan pertukaran ini.
  { id: "kl-sentral", label: "KL Sentral", kind: "pertukaran", members: { "kelana-jaya": "KL Sentral", "klia-transit": "KL Sentral", "komuter-port-klang": "KL Sentral", "komuter-seremban": "KL Sentral" } },
  { id: "monorail-kl-sentral", label: "KL Sentral", kind: "sambungan", members: { monorail: "KL Sentral" } },
  { id: "muzium-negara-kl-sentral", label: "Muzium Negara · KL Sentral", kind: "sambungan", members: { kajang: "Muzium Negara (KL Sentral)" } },

  { id: "pasar-seni", label: "Pasar Seni", kind: "pertukaran", members: { kajang: "Pasar Seni", "kelana-jaya": "Pasar Seni" } },
  { id: "merdeka-plaza-rakyat", label: "Merdeka · Plaza Rakyat", kind: "sambungan", members: { kajang: "Merdeka", "sri-petaling": "Plaza Rakyat", ampang: "Plaza Rakyat" } },
  { id: "bukit-bintang", label: "Bukit Bintang", kind: "sambungan", members: { kajang: "Pavilion Bukit Bintang", monorail: "Bukit Bintang" } },
  { id: "maluri", label: "Maluri", kind: "pertukaran", members: { kajang: "AEON Maluri", ampang: "Maluri" } },
  { id: "masjid-jamek", label: "Masjid Jamek", kind: "pertukaran", members: { "kelana-jaya": "Masjid Jamek", "sri-petaling": "Masjid Jamek", ampang: "Masjid Jamek" } },
  { id: "hang-tuah", label: "Hang Tuah", kind: "pertukaran", members: { "sri-petaling": "Hang Tuah", ampang: "Hang Tuah", monorail: "Hang Tuah" } },
  { id: "dang-wangi-bukit-nanas", label: "Dang Wangi · Bukit Nanas", kind: "sambungan", members: { "kelana-jaya": "Dang Wangi", monorail: "Bukit Nanas" } },
  { id: "sultan-ismail-medan-tuanku", label: "Sultan Ismail · Medan Tuanku", kind: "sambungan", members: { "sri-petaling": "Sultan Ismail", ampang: "Sultan Ismail", monorail: "Medan Tuanku" } },
  { id: "putra-pwtc", label: "Putra · PWTC", kind: "sambungan", members: { "komuter-port-klang": "Putra", "komuter-seremban": "Putra", "sri-petaling": "PWTC", ampang: "PWTC" } },
  { id: "bank-negara-bandaraya", label: "Bank Negara · Bandaraya", kind: "sambungan", members: { "komuter-port-klang": "Bank Negara", "komuter-seremban": "Bank Negara", "sri-petaling": "Bandaraya", ampang: "Bandaraya" } },
  { id: "abdullah-hukum", label: "Abdullah Hukum", kind: "sambungan", members: { "komuter-port-klang": "Abdullah Hukum", "kelana-jaya": "Abdullah Hukum" } },

  // Bandar Tasik Selatan: KTM Komuter + KLIA Transit ialah pertukaran pada hab
  // rel yang sama. Laluan Sri Petaling disambungkan melalui stesen sambungan,
  // maka ia tidak menawarkan pertukaran dalam permainan.
  { id: "bandar-tasik-selatan-hub", label: "Bandar Tasik Selatan", kind: "pertukaran", members: { "klia-transit": "Bandar Tasik Selatan", "komuter-seremban": "Bandar Tasik Selatan" } },
  { id: "bandar-tasik-selatan-lrt", label: "Bandar Tasik Selatan", kind: "sambungan", members: { "sri-petaling": "Bandar Tasik Selatan" } },
  { id: "kajang-rail", label: "Kajang", kind: "sambungan", members: { kajang: "Kajang", "komuter-seremban": "Kajang" } },

  { id: "putra-heights", label: "Putra Heights", kind: "pertukaran", members: { "kelana-jaya": "Putra Heights", "sri-petaling": "Putra Heights" } },
  { id: "usj-7", label: "USJ 7", kind: "pertukaran", members: { "kelana-jaya": "USJ 7", sunway: "USJ 7" } },
  { id: "setia-jaya", label: "Setia Jaya · Sunway–Setia Jaya", kind: "sambungan", members: { "komuter-port-klang": "Setia Jaya", sunway: "Sunway–Setia Jaya" } },
  { id: "subang-jaya", label: "Subang Jaya", kind: "sambungan", members: { "kelana-jaya": "Subang Jaya", "komuter-port-klang": "Subang Jaya" } },
  { id: "glenmarie", label: "Glenmarie · Glenmarie 2", kind: "sambungan", members: { "kelana-jaya": "Glenmarie", "shah-alam": "Glenmarie 2" } },

  // KTM Komuter Utara: pertukaran antara dua koridor berlaku di Bukit Mertajam.
  { id: "bukit-mertajam-utara", label: "Bukit Mertajam", kind: "pertukaran", members: { "komuter-utara-padang-besar": "Bukit Mertajam", "komuter-utara-ipoh": "Bukit Mertajam" } },
];

// Lookup mesti mengambil kira laluan. Ini mengelakkan stesen bernama sama pada
// ETS / ECRL daripada tersalah dianggap stesen pertukaran hanya kerana namanya
// sama dengan stesen bandar.
const connectionLookup = new Map<string, ConnectionGroup>();
const connectionKey = (lineId: RailLineId, stationName: string) => `${lineId}:${normalizeStationKey(stationName)}`;
connectionGroups.forEach((group) => {
  Object.entries(group.members).forEach(([lineId, stationName]) => {
    if (stationName) connectionLookup.set(connectionKey(lineId as RailLineId, stationName), group);
  });
});

export const getConnectionGroup = (stationName: string, lineId: RailLineId) =>
  connectionLookup.get(connectionKey(lineId, stationName)) ?? null;

export const getTransferGroup = (stationName: string, lineId: RailLineId) => {
  const group = getConnectionGroup(stationName, lineId);
  return group?.kind === "pertukaran" ? group : null;
};

export const canTransferAt = (stationName: string, lineId: RailLineId) =>
  Boolean(getTransferGroup(stationName, lineId));

export const getStationNetworkKey = (stationName: string, lineId: RailLineId) =>
  getConnectionGroup(stationName, lineId)?.id ?? `${lineId}:${normalizeStationKey(stationName)}`;

export const getInterchangeLines = (stationName: string, lineId: RailLineId) => {
  const group = getConnectionGroup(stationName, lineId);
  if (!group) return [];
  return railLines.filter((targetLine) => Boolean(group.members[targetLine.id]));
};

export const getInterchangeColors = (stationName: string, lineId: RailLineId) =>
  getInterchangeLines(stationName, lineId).map((targetLine) => targetLine.color);

export const getConnectionStationName = (group: ConnectionGroup, lineId: RailLineId) =>
  group.members[lineId] ?? null;


export const getStationNumber = (line: RailLine, station: Station) => {
  const index = line.stations.findIndex((item) => item.id === station.id);
  if (index < 0) return "";
  return line.stationNumbers?.[index] ?? String(index + 1);
};
