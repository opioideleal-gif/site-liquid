import { useEffect, useState } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useCart } from "@/hooks/useCart";
import { buildQuoteMessage, openWhatsApp } from "@/lib/cart";

type Step = "cart" | "form" | "sent";

export default function CartDrawer() {
  const { lines, count, isOpen, closeCart, setQuantity, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen && step === "sent") setStep("cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const submitQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    openWhatsApp(
      buildQuoteMessage(lines, {
        name: String(form.get("name") ?? ""),
        company: String(form.get("company") ?? ""),
        phone: String(form.get("phone") ?? ""),
        city: String(form.get("city") ?? ""),
        notes: String(form.get("notes") ?? ""),
      }),
    );
    setStep("sent");
    toast.success("WhatsApp aberto", { description: "Revise a mensagem com seus itens e envie para a equipe Limaq." });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#142b3a]/40" onClick={closeCart}>
      <aside
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de orçamento"
      >
        <div className="flex items-center justify-between border-b border-[#e2e6e8] p-6 pb-5">
          <div>
            <p className="eyebrow text-[#128c68]">SELEÇÃO LIMAQ</p>
            <h3 className="mt-1 text-2xl font-black tracking-tight">
              {step === "cart" ? "Seu carrinho" : step === "form" ? "Solicitar orçamento" : "Quase lá"}
            </h3>
          </div>
          <button onClick={closeCart} className="rounded-md p-2 transition hover:bg-black/5" aria-label="Fechar carrinho">
            <X />
          </button>
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#66747d]">
                  <ShoppingCart size={34} strokeWidth={1.2} />
                  <p className="mt-4 text-sm font-bold">Seu carrinho está vazio.</p>
                  <p className="mt-2 max-w-[220px] text-xs leading-5">
                    Adicione equipamentos pelo catálogo para montar seu pedido de orçamento.
                  </p>
                  <button onClick={closeCart} className="button-primary mt-6">
                    Ver equipamentos <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {lines.map(({ product, quantity }) => (
                    <div key={product.slug} className="flex gap-3 border-b border-[#eef1f2] pb-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 shrink-0 bg-[#f1f3f4] object-contain p-1" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black tracking-widest text-[#128c68]">{product.brand}</p>
                        <p className="mt-0.5 text-sm font-bold leading-tight">{product.name}</p>
                        <p className="mt-0.5 text-xs text-[#66747d]">Modelo {product.model}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex h-8 items-center border border-[#ccd4d8]">
                            <button
                              onClick={() => setQuantity(product.slug, quantity - 1)}
                              className="h-full px-2 text-[#66747d] transition hover:text-[#128c68]"
                              aria-label={`Diminuir quantidade de ${product.name}`}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                            <button
                              onClick={() => setQuantity(product.slug, quantity + 1)}
                              className="h-full px-2 text-[#66747d] transition hover:text-[#128c68]"
                              aria-label={`Aumentar quantidade de ${product.name}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(product.slug)}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#9aa5aa] transition hover:text-[#b3402f]"
                          >
                            <Trash2 size={13} /> Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-[#e2e6e8] p-6 pt-5">
                <div className="flex justify-between text-sm font-bold">
                  <span>Itens selecionados</span>
                  <span>{count}</span>
                </div>
                <p className="mt-2 text-[11px] leading-4 text-[#66747d]">
                  Preços sob consulta: o orçamento final considera configuração, instalação e prazo de entrega.
                </p>
                <button onClick={() => setStep("form")} className="button-primary mt-4 w-full justify-center">
                  Solicitar orçamento <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => {
                    clear();
                    toast.info("Carrinho limpo");
                  }}
                  className="mt-3 w-full text-[10px] font-bold uppercase tracking-widest text-[#9aa5aa] transition hover:text-[#142b3a]"
                >
                  Limpar seleção
                </button>
              </div>
            )}
          </>
        )}

        {step === "form" && (
          <form onSubmit={submitQuote} className="flex flex-1 flex-col overflow-y-auto p-6">
            <div className="border border-[#e2e6e8] bg-[#f6f7f8] p-4">
              <p className="eyebrow text-[#142b3a]">ITENS NO PEDIDO</p>
              <ul className="mt-3 grid gap-2">
                {lines.map(({ product, quantity }) => (
                  <li key={product.slug} className="flex justify-between gap-3 text-xs font-semibold">
                    <span>
                      {quantity}× {product.name}
                    </span>
                    <span className="shrink-0 text-[#66747d]">{product.model}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#128c68] transition hover:text-[#142b3a]"
              >
                Editar seleção
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <input required name="name" placeholder="Nome completo" className="light-input" />
              <input required name="company" placeholder="Empresa" className="light-input" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input required name="phone" placeholder="WhatsApp" className="light-input" />
                <input name="city" placeholder="Cidade" className="light-input" />
              </div>
              <textarea name="notes" placeholder="Observações (prazos, instalação, tensão…)" className="light-input min-h-20 resize-none" />
            </div>
            <button className="button-primary mt-4 justify-center">
              Abrir WhatsApp com o pedido <ArrowRight size={16} />
            </button>
            <p className="mt-3 text-[11px] leading-4 text-[#66747d]">
              Abrimos o WhatsApp com a lista de itens e seus dados já preenchidos — é só revisar e enviar.
            </p>
          </form>
        )}

        {step === "sent" && (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#128c68]/10 text-[#128c68]">
              <Check size={26} />
            </div>
            <h4 className="mt-5 text-2xl font-black tracking-tight">WhatsApp aberto</h4>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#66747d]">
              Sua solicitação com {count} {count === 1 ? "item" : "itens"} foi preparada. Revise a mensagem na aba do
              WhatsApp e envie para concluir.
            </p>
            <button onClick={closeCart} className="button-primary mt-7">
              Continuar navegando <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setStep("cart")}
              className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#66747d] transition hover:text-[#142b3a]"
            >
              Voltar ao carrinho
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
