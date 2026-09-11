/**
 * Controle global do sistema de motion.
 *
 * Princípio (progressive enhancement): o conteúdo NUNCA depende de animação
 * para existir. Todo efeito é uma camada opcional por cima de um site que já
 * funciona sem JS de animação.
 *
 * Desligar tudo: `VITE_MOTION_ENABLED=false` no ambiente (dev ou build).
 * `prefers-reduced-motion: reduce` do usuário também desliga os efeitos.
 */
export const MOTION_ENABLED: boolean = (() => {
  const raw = import.meta.env.VITE_MOTION_ENABLED;
  if (raw === "false" || raw === "0") return false;
  return true;
})();

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True somente quando efeitos podem rodar (flag ligada E usuário não prefere menos movimento). */
export function motionAllowed(): boolean {
  return MOTION_ENABLED && !prefersReducedMotion();
}
