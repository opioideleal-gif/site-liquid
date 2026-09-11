import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Com `VITE_MOTION_ENABLED=false` o site precisa continuar 100% funcional:
 * conteúdo visível, sem pin, sem listeners de efeito.
 */
vi.stubEnv("VITE_MOTION_ENABLED", "false");

describe("motion desligado (VITE_MOTION_ENABLED=false)", () => {
  afterEach(cleanup);

  it("assistência renderiza os 5 passos empilhados, sem bloco sticky", async () => {
    const { default: StickyAssistance } = await import("@/components/StickyAssistance");
    render(<StickyAssistance />);
    expect(document.querySelectorAll(".assist-step").length).toBe(5);
    expect(document.querySelector(".sticky-assistance")).toBeNull();
  });

  it("home inteira renderiza com catálogo e marcas visíveis", async () => {
    const { default: Home } = await import("@/pages/Home");
    render(<Home />);
    expect(document.querySelectorAll(".product-card").length).toBe(6);
    expect(document.querySelectorAll(".brand-tile").length).toBe(35);
    expect(document.querySelector("h1")?.textContent).toContain("Equipamentos para quem leva");
  });
});
