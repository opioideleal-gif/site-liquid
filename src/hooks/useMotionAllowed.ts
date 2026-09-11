import { useEffect, useState } from "react";
import { MOTION_ENABLED, prefersReducedMotion } from "@/lib/motion";

/** Assina mudanças de `prefers-reduced-motion` e expõe se efeitos podem rodar. */
export function useMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(() => MOTION_ENABLED && !prefersReducedMotion());

  useEffect(() => {
    if (!MOTION_ENABLED) {
      setAllowed(false);
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return allowed;
}

/** matchMedia reativo, para decisões de layout (ex.: pin só no desktop). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
