import type { Category } from "@/lib/types";

/**
 * Illustrated side view of an e-bike, used whenever a product has no photo.
 * The battery and hub are drawn in the product's accent colour.
 */
export function BikeArt({
  category,
  accent,
  className,
}: {
  category: Category;
  accent: string;
  className?: string;
}) {
  const folding = category === "folding";
  const mountain = category === "mountain";
  const cargo = category === "cargo";
  const road = category === "road";

  const r = folding ? 46 : 60;
  const tyre = mountain ? 13 : cargo ? 10 : road ? 5 : 8;
  const rear = { x: cargo ? 80 : 100, y: 182 };
  const front = { x: 310, y: 182 };
  const bb = { x: 196, y: 188 };
  const seat = { x: 172, y: folding ? 110 : 98 };
  const head = { x: 272, y: folding ? 104 : 92 };
  const headLow = { x: 281, y: folding ? 132 : 124 };

  const wheel = (x: number, y: number) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="currentColor" strokeWidth={tyre} />
      <circle cx={x} cy={y} r={r - tyre / 2 - 5} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const len = r - tyre / 2 - 5;
        return (
          <line
            key={deg}
            x1={x - Math.cos(rad) * len}
            y1={y - Math.sin(rad) * len}
            x2={x + Math.cos(rad) * len}
            y2={y + Math.sin(rad) * len}
            stroke="currentColor"
            strokeOpacity={0.18}
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );

  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-hidden="true">
      <ellipse cx={205} cy={182 + r + 6} rx={170} ry={7} fill="currentColor" opacity={0.08} />
      {wheel(rear.x, rear.y)}
      {wheel(front.x, front.y)}

      <g stroke="currentColor" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* chain stay, seat stay, seat tube, top tube */}
        <path d={`M${rear.x} ${rear.y} L${bb.x} ${bb.y}`} />
        <path d={`M${rear.x} ${rear.y} L${seat.x - 4} ${seat.y + 12}`} />
        <path d={`M${bb.x} ${bb.y} L${seat.x} ${seat.y}`} />
        {category === "city" ? (
          <path d={`M${bb.x + 8} ${bb.y - 22} Q${bb.x + 30} ${bb.y - 70} ${headLow.x - 2} ${headLow.y + 2}`} />
        ) : (
          <path d={`M${seat.x} ${seat.y + 6} L${head.x} ${head.y + 4}`} />
        )}
        {/* fork */}
        <path d={`M${headLow.x} ${headLow.y} L${front.x} ${front.y}`} strokeWidth={mountain ? 11 : 7} />
        {/* head tube + stem + bars */}
        <path d={`M${headLow.x} ${headLow.y} L${head.x} ${head.y}`} strokeWidth={10} />
        <path d={`M${head.x} ${head.y} L${head.x - 6} ${head.y - 24}`} strokeWidth={6} />
        {road ? (
          <path d={`M${head.x - 8} ${head.y - 24} L${head.x + 12} ${head.y - 26} Q${head.x + 24} ${head.y - 20} ${head.x + 16} ${head.y - 6}`} strokeWidth={5} />
        ) : (
          <path d={`M${head.x - 16} ${head.y - 22} L${head.x + 14} ${head.y - 30}`} strokeWidth={6} />
        )}
        {/* seat post + saddle */}
        <path d={`M${seat.x} ${seat.y} L${seat.x - 5} ${seat.y - 22}`} strokeWidth={6} />
        <path d={`M${seat.x - 26} ${seat.y - 26} Q${seat.x - 4} ${seat.y - 32} ${seat.x + 14} ${seat.y - 26}`} strokeWidth={9} />
      </g>

      {/* battery on the down tube */}
      <line
        x1={bb.x + 6}
        y1={bb.y - 14}
        x2={headLow.x - 14}
        y2={headLow.y + 12}
        stroke={accent}
        strokeWidth={20}
        strokeLinecap="round"
      />
      <line
        x1={bb.x + 6}
        y1={bb.y - 14}
        x2={headLow.x - 14}
        y2={headLow.y + 12}
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth={2}
        strokeDasharray="4 6"
      />

      {/* rear hub motor */}
      <circle cx={rear.x} cy={rear.y} r={15} fill={accent} stroke="currentColor" strokeWidth={4} />
      <circle cx={front.x} cy={front.y} r={5} fill="currentColor" />

      {/* crank */}
      <circle cx={bb.x} cy={bb.y} r={13} fill="none" stroke="currentColor" strokeWidth={5} />
      <path d={`M${bb.x} ${bb.y} L${bb.x + 16} ${bb.y + 20}`} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
      <rect x={bb.x + 9} y={bb.y + 19} width={16} height={6} rx={2} fill="currentColor" />

      {cargo && (
        <g stroke="currentColor" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d={`M${rear.x - 45} ${rear.y - 72} L${seat.x - 20} ${rear.y - 72}`} />
          <path d={`M${rear.x - 30} ${rear.y - 72} L${rear.x - 10} ${rear.y - 4}`} />
          <path d={`M${rear.x + 40} ${rear.y - 72} L${rear.x + 10} ${rear.y - 4}`} />
        </g>
      )}
      {mountain && (
        <rect x={headLow.x + 6} y={headLow.y + 14} width={9} height={22} rx={4} fill={accent} transform={`rotate(-22 ${headLow.x + 10} ${headLow.y + 25})`} />
      )}
      {/* headlight */}
      <circle cx={head.x + 9} cy={head.y + 8} r={5} fill={accent} stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}
