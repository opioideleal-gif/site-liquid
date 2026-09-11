import { getProduct, type Product } from "@/lib/catalog";

export const WHATSAPP_NUMBER = "5591988799884";
const STORAGE_KEY = "limaq:cart:v1";
const MIN_QTY = 1;
const MAX_QTY = 99;

export type CartItem = { slug: string; quantity: number };
export type CartLine = { product: Product; quantity: number };
export type QuoteData = {
  name?: string;
  company?: string;
  phone?: string;
  city?: string;
  notes?: string;
};

function clampQuantity(quantity: number) {
  return Math.max(MIN_QTY, Math.min(MAX_QTY, Math.round(quantity) || MIN_QTY));
}

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return [];
      const { slug, quantity } = entry as Partial<CartItem>;
      if (typeof slug !== "string" || !getProduct(slug)) return [];
      return [{ slug, quantity: clampQuantity(Number(quantity) || MIN_QTY) }];
    });
  } catch {
    return [];
  }
}

type Listener = () => void;

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get: () => state,
    set(next: T) {
      if (next === state) return;
      state = next;
      listeners.forEach((listener) => listener());
    },
  };
}

const itemsStore = createStore<CartItem[]>(read());
const openStore = createStore<boolean>(false);

function persist(items: CartItem[]) {
  try {
    if (items.length > 0) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* armazenamento indisponível (navegação privada etc.) — o carrinho segue em memória */
  }
}

export const cartStore = {
  subscribe: itemsStore.subscribe,
  get: itemsStore.get,

  add(slug: string, quantity = 1) {
    const items = itemsStore.get();
    const existing = items.find((item) => item.slug === slug);
    const next = existing
      ? items.map((item) =>
          item.slug === slug ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
        )
      : [...items, { slug, quantity: clampQuantity(quantity) }];
    persist(next);
    itemsStore.set(next);
  },

  setQuantity(slug: string, quantity: number) {
    const items = itemsStore.get();
    if (quantity <= 0) {
      cartStore.remove(slug);
      return;
    }
    const next = items.map((item) => (item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item));
    persist(next);
    itemsStore.set(next);
  },

  remove(slug: string) {
    const next = itemsStore.get().filter((item) => item.slug !== slug);
    persist(next);
    itemsStore.set(next);
  },

  clear() {
    persist([]);
    itemsStore.set([]);
  },
};

export const cartUi = {
  subscribe: openStore.subscribe,
  isOpen: openStore.get,
  open: () => openStore.set(true),
  close: () => openStore.set(false),
};

export function cartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
}

export function openWhatsApp(message: string) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

export function formatCartLines(lines: CartLine[]) {
  return lines.map((line) => `• ${line.quantity}× ${line.product.name} — ${line.product.brand} ${line.product.model}`).join("\n");
}

export function buildQuoteMessage(lines: CartLine[], data: QuoteData = {}) {
  const parts = ["Olá, Limaq! Gostaria de solicitar um orçamento."];
  if (lines.length > 0) parts.push(`Itens selecionados no site:\n${formatCartLines(lines)}`);
  const fields = [
    data.name && `Nome: ${data.name}`,
    data.company && `Empresa: ${data.company}`,
    data.phone && `WhatsApp: ${data.phone}`,
    data.city && `Cidade: ${data.city}`,
    data.notes && `Observações: ${data.notes}`,
  ].filter(Boolean);
  if (fields.length > 0) parts.push(fields.join("\n"));
  parts.push("Vim pelo novo site da Limaq.");
  return parts.join("\n\n");
}
