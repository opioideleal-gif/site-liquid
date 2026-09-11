import { useState } from "react";

/**
 * Logo da Limaq.
 *
 * A fonte primária é o arquivo oficial hospedado no CDN (o mesmo usado no site
 * anterior). Se ele ficar indisponível — queda do CDN, bloqueio de hotlink,
 * migração de domínio — caímos para um wordmark SVG local, para o site nunca
 * ficar sem identidade.
 *
 * Para usar um arquivo próprio, salve-o em `public/images/logo.png` e troque
 * `PRIMARY_SRC` abaixo.
 */
const PRIMARY_SRC =
  "https://images.squarespace-cdn.com/content/v1/6a56d13ce4d0b80e6de9f3fe/6f176356-0f4f-429a-bc48-cb34f1d52d17/ChatGPT+Image+15+de+jul.+de+2026%2C+20_36_46.png?format=1500w";

function Wordmark({ className, accent = "#f1a51b" }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 220 64" className={className} role="img" aria-label="Limaq Assistência Técnica">
      <rect x="4" y="14" width="10" height="36" fill={accent} />
      <text
        x="24"
        y="42"
        fontFamily="Manrope, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="-1.5"
        fill="currentColor"
      >
        LIMAQ
      </text>
      <text x="25" y="55" fontFamily="'DM Mono', monospace" fontSize="8.5" letterSpacing="2.6" fill="currentColor" opacity="0.65">
        ASSISTÊNCIA TÉCNICA
      </text>
    </svg>
  );
}

export default function BrandLogo({
  className = "h-12 w-auto",
  variant = "color",
}: {
  className?: string;
  /** `color` usa o arquivo oficial; `light`/`dark` forçam o wordmark local em uma cor. */
  variant?: "color" | "light" | "dark";
}) {
  const [failed, setFailed] = useState(false);

  if (variant === "light" || variant === "dark" || failed) {
    return <Wordmark className={className} accent={variant === "light" ? "#f1a51b" : "#f1a51b"} />;
  }

  return (
    <img
      src={PRIMARY_SRC}
      alt="Limaq Assistência Técnica"
      className={className}
      width={220}
      height={64}
      onError={() => setFailed(true)}
    />
  );
}
