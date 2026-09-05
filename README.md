# STESEN

STESEN is a single-player Malaysian rail typing game built with Next.js, React, TypeScript and MapLibre GL. Players trace station names character by character while a small train moves continuously along the selected Klang Valley rail route.

## Player flow

1. Open the STESEN landing page.
2. Choose **Mula**.
3. Select a rail line.
4. Select one of the two terminal-origin directions.
5. Start the run.
6. Type each station name in sequence.
7. At a valid **interchange station**, a compact `TAB` cue appears while that station is still the typing target. Press `TAB` repeatedly to cycle the departure line.

## Route and station numbering

The route-number badges follow the official integrated map:

- **1** KTM Batu Caves - Pulau Sebang
- **2** KTM Tanjung Malim - Pelabuhan Klang
- **3** Ampang
- **4** Sri Petaling
- **5** Kelana Jaya
- **7** KLIA Transit
- **8** KL Monorail
- **9** Kajang
- **11** Shah Alam
- **12** Putrajaya
- **B1** Sunway BRT

Services outside that numbered Klang Valley legend are not given invented Klang Valley route numbers. STESEN uses service badges such as `KU` (Komuter Utara), `KS` (Komuter Selatan), `ETS` and `ECRL`. The picker remains one unified list rather than splitting the UI into urban/intercity categories.

## Playable routes

The selection screen keeps the Klang Valley routes first, followed by the current KTMB regional/intercity services used by the game:

- **1** KTM Komuter Batu Caves - Pulau Sebang
- **2** KTM Komuter Tanjung Malim - Pelabuhan Klang
- **3** LRT Ampang
- **4** LRT Sri Petaling
- **5** LRT Kelana Jaya
- **7** KLIA Transit
- **8** KL Monorail
- **9** MRT Kajang
- **11** LRT Shah Alam
- **12** MRT Putrajaya
- **B1** Sunway BRT
- **KU** Komuter Utara Padang Besar - Butterworth
- **KU** Komuter Utara Butterworth - Ipoh
- **KS** Komuter Selatan Paloh - JB Sentral
- **ETS** KL Sentral - Ipoh
- **ETS** KL Sentral - Butterworth
- **ETS** KL Sentral - Padang Besar
- **ETS** JB Sentral - KL Sentral
- **ETS** JB Sentral - Butterworth
- **ETS** JB Sentral - Padang Besar
- **ETS** Segamat - Butterworth
- **ECRL** Kota Bharu - Jalan Kastam

## Gameplay

- Correct letters fill from left to right.
- The train moves continuously according to the correctly typed prefix.
- Incorrect characters are highlighted and must be corrected.
- Time, typing speed (PPM) and accuracy are tracked live.
- The active map uses numbered station circles.
- The numbered station circle remains behind the train marker, with the train always rendered in the foreground.
- Transfers happen on the same map and page.
- At an interchange, `TAB` cycles the departure line immediately while the station name is still being typed.
- No `ENTER` confirmation is required; completing the station commits the currently selected line.
- If the current line is selected, the run simply continues on it.
- Connecting stations do not interrupt the run.

## Map and data source

The transfer classification, route identities, station numbering and route colours are maintained against the official June 2026 Klang Valley Integrated Transit Map:

https://myrapid.com.my/wp-content/uploads/2026/06/Integrated-Transit-Map_110626_V2.pdf

Official KTMB references used during the current audit:

- https://www.ktmb.com.my/traintime.html
- https://www.ktmb.com.my/ETS.html
- https://www.ktmb.com.my/assets/pdf/2026/Jadual%20Tren%20ETS%201%20Jun%202026.pdf

## Tech stack

- Next.js
- React
- TypeScript
- MapLibre GL JS
- OpenFreeMap basemap
- Vitest
- GitHub Actions CI
- Vercel deployment

## CI/CD

The repository includes `.github/workflows/ci.yml`.

Every push or pull request to `main` runs:

1. dependency installation
2. TypeScript type checking
3. automated tests
4. a production Next.js build

For CD, connect the GitHub repository to Vercel. Vercel then builds and publishes the latest version to a public URL whenever the connected branch is updated.

```text
https://stesen.vercel.app
```

Anyone with the URL can play. Their records remain local to their own browser.