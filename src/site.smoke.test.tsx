import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import { cartStore } from "@/lib/cart";

const CART_KEY = "limaq:cart:v1";

function productCards() {
  return document.querySelectorAll(".product-card");
}

function badge() {
  return document.querySelector("header [aria-label^='Abrir carrinho']")?.textContent?.trim() ?? "";
}

beforeEach(() => {
  cartStore.clear();
  window.localStorage.clear();
  vi.spyOn(window, "open").mockImplementation(() => null);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Home — renderização baseline (sem depender de animação)", () => {
  it("renderiza hero, catálogo, categorias, marcas e assistência visíveis", () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Equipamentos para quem leva");
    expect(productCards().length).toBe(6);
    document.querySelectorAll(".product-card img").forEach((img) => {
      expect(img.getAttribute("src")).toMatch(/^\/images\//);
    });
    expect(document.querySelectorAll(".category-card").length).toBe(6);
    expect(document.querySelectorAll(".brand-tile").length).toBe(35);
    // logotipos oficiais presentes, com fallback tipográfico disponível em runtime
    expect(document.querySelectorAll(".brand-tile-logo").length).toBe(35);
    expect(screen.getByText(/Sua operação/)).toBeTruthy();
    expect(errors).not.toHaveBeenCalled();
  });
});

describe("Home — filtros do catálogo", () => {
  it("marca sem produtos exibe empty state com ação, e limpar filtros restaura o rail", () => {
    render(<Home />);
    const brandSelect = screen.getByLabelText("Filtrar por marca");
    fireEvent.change(brandSelect, { target: { value: "RATIONAL" } });

    expect(productCards().length).toBe(0);
    expect(screen.getByText(/Nenhum equipamento nessa combinação/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /^Limpar filtros$/ }));
    expect(productCards().length).toBe(6);
  });

  it("clicar em uma categoria filtra o rail e mostra o indicador ativo", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Cocção", { selector: ".category-card h3" }));
    expect(productCards().length).toBe(1);
    expect(screen.getByText(/Categoria: Cocção/)).toBeTruthy();
  });
});

describe("Carrinho → orçamento (conversão)", () => {
  it("adiciona, persiste, trava o scroll com drawer aberto e envia itens no WhatsApp", () => {
    // como no App: Home + drawer global do carrinho
    render(
      <>
        <Home />
        <CartDrawer />
      </>,
    );

    fireEvent.click(document.querySelector("[aria-label='Adicionar Forno combinado Fit Express ao carrinho']")!);
    expect(badge()).toBe("1");
    expect(window.localStorage.getItem(CART_KEY)).toContain("forno-combinado-pratica-fit-express");

    fireEvent.click(document.querySelector("header [aria-label^='Abrir carrinho']")!);
    const drawer = screen.getByRole("dialog");
    expect(within(drawer).getByText("Seu carrinho")).toBeTruthy();
    expect(within(drawer).getByText("Forno combinado Fit Express")).toBeTruthy();
    expect(document.documentElement.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: /Solicitar orçamento/ }));
    fireEvent.change(screen.getByPlaceholderText("Nome completo"), { target: { value: "Maria Teste" } });
    fireEvent.change(screen.getByPlaceholderText("Empresa"), { target: { value: "Bistrô X" } });
    fireEvent.change(screen.getByPlaceholderText("WhatsApp"), { target: { value: "91 99999-0000" } });
    fireEvent.submit(screen.getByPlaceholderText("Nome completo").closest("form")!);

    expect(window.open).toHaveBeenCalledTimes(1);
    const url = String(vi.mocked(window.open).mock.calls[0][0]);
    const message = decodeURIComponent(url.split("text=")[1]);
    expect(url).toContain("https://wa.me/5591988799884");
    expect(message).toContain("Itens selecionados no site:");
    expect(message).toContain("1× Forno combinado Fit Express — PRÁTICA FEX-4");
    expect(message).toContain("Nome: Maria Teste");
    expect(screen.getByText("WhatsApp aberto")).toBeTruthy();

    fireEvent.click(document.querySelector("[aria-label='Fechar carrinho']")!);
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("carrinho sobrevive a unmount/remount (persistência entre páginas)", () => {
    const first = render(<Home />);
    fireEvent.click(document.querySelector("[aria-label='Adicionar Processador de alimentos ao carrinho']")!);
    first.unmount();

    render(<Home />);
    expect(badge()).toBe("1");
  });
});

describe("Página de produto (PDP)", () => {
  it("exibe produto, quantidade e soma ao carrinho compartilhado", () => {
    render(<ProductDetail params={{ slug: "forno-combinado-pratica-fit-express" }} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Forno combinado Fit Express");

    fireEvent.click(screen.getByLabelText("Aumentar quantidade"));
    fireEvent.click(screen.getByRole("button", { name: /Adicionar ao carrinho/ }));
    expect(JSON.parse(window.localStorage.getItem(CART_KEY)!)[0].quantity).toBe(2);
  });

  it("slug inexistente mostra estado amigável, não tela branca", () => {
    render(<ProductDetail params={{ slug: "nao-existe" }} />);
    expect(screen.getByText("Produto não encontrado")).toBeTruthy();
  });
});

describe("Mobile / motion — layout empilhado da assistência", () => {
  it("em viewport mobile os 5 passos aparecem empilhados (sem pin de 285vh)", () => {
    (globalThis as unknown as { __setMedia: (q: string, m: boolean) => void }).__setMedia("(max-width: 768px)", true);
    render(<Home />);
    expect(document.querySelectorAll(".assist-step").length).toBe(5);
    expect(document.querySelector(".sticky-assistance")).toBeNull();
    (globalThis as unknown as { __setMedia: (q: string, m: boolean) => void }).__setMedia("(max-width: 768px)", false);
  });
});
