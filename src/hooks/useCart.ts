import { useSyncExternalStore } from "react";
import { cartLines, cartStore, cartUi } from "@/lib/cart";

export function useCart() {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.get);
  const isOpen = useSyncExternalStore(cartUi.subscribe, cartUi.isOpen);

  const lines = cartLines(items);
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return {
    items,
    lines,
    count,
    isOpen,
    add: cartStore.add,
    setQuantity: cartStore.setQuantity,
    remove: cartStore.remove,
    clear: cartStore.clear,
    openCart: cartUi.open,
    closeCart: cartUi.close,
  };
}
