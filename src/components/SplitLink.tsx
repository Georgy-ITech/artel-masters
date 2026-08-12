import Link from "next/link";

/**
 * Пункт навигации, разобранный на буквы: при наведении строка перекатывается
 * посимвольно. Ширина не меняется — анимируется только сдвиг внутри буквы.
 * Для скринридера ссылка остаётся одним словом.
 */
export function SplitLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const chars = [...children];
  return (
    <Link
      href={href}
      className={`split ${className}`.trim()}
      prefetch={false}
      aria-label={children}
    >
      <span className="split__inner" aria-hidden="true">
        {chars.map((c, i) => (
          <span
            className="split__char"
            key={`${c}-${i}`}
            style={{ ["--i" as string]: i }}
          >
            <span className="split__up">{c === " " ? " " : c}</span>
            <span className="split__down">{c === " " ? " " : c}</span>
          </span>
        ))}
      </span>
    </Link>
  );
}
