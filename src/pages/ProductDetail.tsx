import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check, ChevronRight, MessageCircle, Minus, Plus, ShoppingCart, Wrench } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import { useCart } from "@/hooks/useCart";
import { getProduct } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export default function ProductDetail({ params }: { params: { slug?: string } }) {
  const { add, count, openCart } = useCart();
  const product = getProduct(params.slug ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f8] p-10 text-center">
        <p className="eyebrow text-[#128c68]">CATÁLOGO LIMAQ</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-.05em]">Produto não encontrado</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#66747d]">
          O equipamento que você procura pode ter saído do catálogo — mas a Limaq localiza equipamentos de 35 marcas
          sob encomenda.
        </p>
        <Link href="/" className="button-primary mt-8">
          <ArrowLeft size={16} /> Voltar para a home
        </Link>
      </div>
    );
  }

  const sendQuote = () => {
    const text = `Olá, Limaq! Gostaria de solicitar um orçamento para:\n\n${product.brand} — ${product.name}\nModelo: ${product.model}\nQuantidade: ${quantity}\n\nVim pelo novo site da Limaq.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const addToCart = () => {
    add(product.slug, quantity);
    toast.success("Produto adicionado ao carrinho", { description: `${product.name} • ${quantity} unidade(s)` });
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#17212b]">
      <div className="bg-[#142b3a] px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white/75">
        ATENDIMENTO TÉCNICO EM BELÉM E REGIÃO METROPOLITANA <span className="mx-2 text-[#f1a51b]">•</span> SEGUNDA A
        SEXTA, 8H ÀS 18H
      </div>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f7f8]">
        <div className="container flex h-[76px] items-center justify-between gap-5">
          <Link href="/" className="flex items-center" aria-label="Limaq — início">
            <BrandLogo className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#produtos" className="hidden text-xs font-bold uppercase tracking-widest text-[#66747d] transition hover:text-[#142b3a] sm:inline">
              Voltar ao catálogo
            </Link>
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-sm border border-[#142b3a] px-4 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[#142b3a] hover:text-white"
            >
              <ShoppingCart size={16} /> Carrinho
              {count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f1a51b] text-[10px] font-black text-[#142b3a]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8 sm:py-12">
        <div className="flex items-center gap-2 text-xs text-[#7c898f]">
          <Link href="/" className="hover:text-[#128c68]">Home</Link>
          <ChevronRight size={14} />
          <span>{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-[#17212b]">{product.name}</span>
        </div>

        <section className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="flex min-h-[420px] items-center justify-center bg-white p-8 sm:min-h-[560px]">
              <img src={product.gallery[activeImage]} alt={`${product.name} ${product.model}`} className="h-full max-h-[500px] w-full object-contain mix-blend-multiply" />
            </div>
            {product.gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`flex h-24 items-center justify-center border bg-white p-2 ${index === activeImage ? "border-[#128c68]" : "border-transparent"}`}
                    aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                  >
                    <img src={image} alt={`${product.name} imagem ${index + 1}`} className="h-full w-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-1">
            <p className="eyebrow text-[#128c68]">
              {product.brand} <span className="mx-2 text-[#c5cdd1]">/</span> {product.category}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl">{product.name}</h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.14em] text-[#7c898f]">Modelo {product.model}</p>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#66747d]">{product.description}</p>
            <div className="mt-8 border-y border-[#d8dfe2] py-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#7c898f]">Disponibilidade e preço</p>
              <p className="mt-2 text-2xl font-black">{product.priceLabel}</p>
              <p className="mt-1 text-xs text-[#66747d]">Consulte condições, instalação e prazo de entrega com um especialista.</p>
            </div>
            <div className="mt-7 flex items-center gap-3">
              <div className="flex h-12 items-center border border-[#ccd4d8]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-full px-4 text-[#66747d] transition hover:text-[#128c68]" aria-label="Diminuir quantidade">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="h-full px-4 text-[#66747d] transition hover:text-[#128c68]" aria-label="Aumentar quantidade">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={addToCart} className="button-primary flex-1 justify-center">
                <ShoppingCart size={17} /> Adicionar ao carrinho
              </button>
            </div>
            <button
              onClick={sendQuote}
              className="mt-3 flex w-full items-center justify-center gap-2 border border-[#128c68] py-4 text-xs font-black uppercase tracking-widest text-[#128c68] transition hover:bg-[#128c68] hover:text-white"
            >
              <MessageCircle size={16} /> Solicitar orçamento pelo WhatsApp
            </button>
            <div className="mt-7 grid gap-3 text-xs text-[#66747d] sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#128c68]" /> Atendimento técnico Limaq
              </span>
              <span className="flex items-center gap-2">
                <Wrench size={15} className="text-[#128c68]" /> Instalação e manutenção
              </span>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-8 border-t border-[#d8dfe2] pt-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow text-[#128c68]">INFORMAÇÃO TÉCNICA</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.04em]">
              Especificações
              <br />
              do produto.
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#66747d]">Dados sujeitos à confirmação conforme a configuração e disponibilidade do fabricante.</p>
          </div>
          <div className="grid border-l border-t border-[#d8dfe2] sm:grid-cols-2">
            {Object.entries(product.specs).map(([label, value]) => (
              <div key={label} className="border-b border-r border-[#d8dfe2] p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#7c898f]">{label}</p>
                <p className="mt-2 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-[#d8dfe2] pt-6 sm:flex-row sm:items-center">
          <Link href="/" className="link-arrow">
            <ArrowLeft size={16} /> Voltar para produtos
          </Link>
          <button onClick={sendQuote} className="link-arrow">
            Falar com um especialista <ArrowRight size={16} />
          </button>
        </div>
      </main>

      <footer className="bg-[#0b1b25] py-8 text-center text-xs text-white/45">
        Limaq • Equipamentos e assistência técnica • Belém/PA •{" "}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-[#f1a51b]">
          (91) 98879-9884
        </a>
      </footer>
    </div>
  );
}
