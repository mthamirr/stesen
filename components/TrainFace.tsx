import type { TransitMode } from "@/data/lines";

type Props = {
  mode: TransitMode;
  color: string;
  code: string;
  size?: number;
};

// Every service deliberately uses the same friendly front-view train silhouette.
// The line identity comes from colour + route badge only, keeping the visual
// language consistent across MRT, LRT, Monorail, Komuter, ETS, airport rail, etc.
export default function TrainFace({ color, code, size = 72 }: Props) {
  const bodyW = 44;
  const bodyH = 46;
  const badgeFont = code.length >= 4 ? 5.4 : code.length === 3 ? 6.6 : 8;
  const badgeW = code.length >= 4 ? 36 : code.length === 3 ? 32 : 30;
  const x = -bodyW / 2;
  const y = -bodyH / 2;

  return (
    <svg width={size} height={size} viewBox="-42 -42 84 84" aria-hidden="true">
      <g>
        <path
          d="M-29 -28 Q0 -38 29 -28 L31 21 Q31 34 19 37 L-19 37 Q-31 34 -31 21 Z"
          fill="#fffdf8"
          stroke="#23343b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x={x} y={y - 1} width={bodyW} height={bodyH} rx="13" fill={color} />
        <rect x={x + 4} y={y + 4} width={bodyW - 8} height="19" rx="7.5" fill="#eef8fa" />
        <rect x={x + 7} y={y + 7} width={(bodyW - 18) / 2} height="12" rx="4.5" fill="#a8d7e2" />
        <rect x="2" y={y + 7} width={(bodyW - 18) / 2} height="12" rx="4.5" fill="#a8d7e2" />
        <rect x={x + 6} y={y + 26} width={bodyW - 12} height="7" rx="3.5" fill="#fffdf8" opacity=".95" />
        <circle cx={x + 10} cy={y + bodyH - 5} r="4.2" fill="#ffe16f" stroke="#23343b" strokeWidth="1.4" />
        <circle cx={x + bodyW - 10} cy={y + bodyH - 5} r="4.2" fill="#ffe16f" stroke="#23343b" strokeWidth="1.4" />
        <circle cx="-9" cy="17" r="1.8" fill="#23343b" />
        <circle cx="9" cy="17" r="1.8" fill="#23343b" />
        <path d="M-6 22 Q0 27 6 22" fill="none" stroke="#23343b" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="-15" cy="21" r="2.1" fill="#f7a8a8" opacity=".9" />
        <circle cx="15" cy="21" r="2.1" fill="#f7a8a8" opacity=".9" />
        {code && (
          <>
            <rect x={-badgeW / 2} y="31" width={badgeW} height="14" rx="7" fill="#23343b" />
            <text x="0" y="40.6" textAnchor="middle" fill="#fff" fontSize={badgeFont} fontWeight="900" fontFamily="Manrope, Trebuchet MS, sans-serif">
              {code}
            </text>
          </>
        )}
        <path d="M-18 37 L-23 43" stroke="#23343b" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M18 37 L23 43" stroke="#23343b" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
