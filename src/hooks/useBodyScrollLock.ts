import { useEffect } from "react";

/**
 * Trava o scroll da página enquanto um drawer/modal está aberto e devolve o
 * estado anterior ao fechar — sem alterar a posição atual do scroll.
 *
 * Regras:
 * - UMA única trava por vez é suficiente aqui porque os overlays da home são
 *   mutuamente exclusivos e o CartDrawer é global;
 * - o `scrollbar-gutter: stable` no CSS evita qualquer deslocamento de layout
 *   quando a barra de some/aparece;
 * - o scroll interno do drawer/modal (overflow-y-auto) continua funcionando,
 *   porque a trava é aplicada no documento, não no elemento.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}
