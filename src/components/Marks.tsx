import { LETTER_PATH, LETTER_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from "./wordmark-path";

/**
 * Оттиск: рамка и буква «А» из Oranienbaum, переведённые в кривые,
 * с рваным краем через feTurbulence — печать, а не чистый вектор.
 */
export function Seal({ className = "seal" }: { className?: string }) {
  const [, minY, w, h] = LETTER_VIEWBOX.split(" ").map(Number);
  const pad = 46;
  const box = `${-pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;

  return (
    <svg
      className={className}
      viewBox={box}
      role="img"
      aria-label="Артель"
      focusable="false"
    >
      <filter id="seal-ink" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.09"
          numOctaves="3"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="6"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <g filter="url(#seal-ink)" fill="var(--stamp)">
        <path
          d={`M${-pad + 10} ${minY - pad + 10} H${w + pad - 10} V${minY + h + pad - 10} H${-pad + 10} Z`}
          fill="none"
          stroke="var(--stamp)"
          strokeWidth="17"
        />
        <path d={LETTER_PATH} />
      </g>
    </svg>
  );
}

/** «АРТЕЛЬ» кривыми: гарнитура в рантайме не грузится. */
export function Wordmark({ className = "wordmark" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={WORDMARK_VIEWBOX}
      role="img"
      aria-label="Артель"
      focusable="false"
    >
      <path d={WORDMARK_PATH} fill="currentColor" />
    </svg>
  );
}

/** Бамбуковое ребро: страница гнётся под светом. */
export function RibRule({ flip = false }: { flip?: boolean }) {
  const d = flip
    ? "M0 34 C 260 4, 740 4, 1000 34"
    : "M0 6 C 260 36, 740 36, 1000 6";
  const d2 = flip
    ? "M0 27 C 260 -3, 740 -3, 1000 27"
    : "M0 13 C 260 43, 740 43, 1000 13";
  return (
    <svg
      className="rib"
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
      <path d={d2} />
    </svg>
  );
}

export function Arrow({ className = "act__arrow" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 7h20M14.5 1.5 20.5 7l-6 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
