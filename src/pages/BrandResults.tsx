import { Link } from "wouter";
import { ArrowLeft, ArrowRight, MessageCircle, Search, ShoppingCart } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { brandSlug, brands } from "@/components/BrandsExperience";
import { useCart } from "@/hooks/useCart";
import { products } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export default function BrandResults({ params }: { params: { slug?: string } }) {
  const { count, openCart } = useCart();
  const slug = params.slug ?? "";
  const brand = brands.find((item) => brandSlug(item.name) === slug);
  const brandProducts = products.filter((product) => brand && brandSlug(product.brand) === slug);

  if (!brand) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f8] p-10 text-center">
        <p className="eyebrow text-[#128c68]">MARCAS ATENDIDAS</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-.05em]">Marca não encontrada</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-[#66747d]">
          Veja a lista completa das {brands.length} marcas atendidas pela Limaq em Belém e região metropolitana.
        </p>
        <Link href="/" className="button-primary mt-8">
          <ArrowLeft size={16} /> Voltar para a home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#17212b]">
      <div className="bg-[#142b3a] px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white/75">
        MARCAS ATENDIDAS <span className="mx-2 text-[#f1a51b]">•</span> LIMAQ DESDE 1987
      </div>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f7f8]/95 backdrop-blur-md">
        <div className="container flex h-[76px] items-center justify-between gap-5">
          <Link href="/" className="flex items-center" aria-label="Limaq — início">
            <BrandLogo className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/#produtos" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#66747d] transition hover:text-[#142b3a] sm:flex">
              <Search size={16} /> Catálogo
            </Link>
            <button onClick={openCart} className="relative rounded-sm border border-[#142b3a] p-3 transition hover:bg-[#142b3a] hover:text-white" aria-label={`Abrir carrinho com ${count} itens`}>
              <ShoppingCart size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f1a51b] text-[10px] font-black text-[#142b3a]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#142b3a] py-20 text-white sm:py-28">
          <div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <Link href="/#marcas" className="eyebrow inline-flex items-center gap-2 text-[#f1a51b]">
                <ArrowLeft size={14} /> Voltar para marcas
              </Link>
              <p className="eyebrow mt-10 text-[#f1a51b]">MARCA ATENDIDA • {brand.category}</p>
              <h1 className="mt-4 text-5xl font-black tracking-[-.06em] sm:text-7xl">{brand.name}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/65">{brand.description}</p>
            </div>
            <div className="border-l border-white/20 pl-6 lg:justify-self-end">
              <p className="eyebrow text-[#f1a51b]">RESULTADOS FILTRADOS</p>
              <p className="mt-3 text-5xl font-black">{brandProducts.length.toString().padStart(2, "0")}</p>
              <p className="mt-2 text-sm text-white/60">
                equipamentos cadastrados
                <br />
                desta fabricante
              </p>
            </div>
          </div>
        </section>

        <section className="container py-16 sm:py-24">
          <div className="flex flex-col justify-between gap-4 border-b border-[#d0d7d9] pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-[#128c68]">EQUIPAMENTOS {brand.name.toUpperCase()}</p>
              <h2 className="section-title mt-3">
                O que você procura
                <br /> para sua operação.
              </h2>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá, Limaq! Gostaria de consultar um equipamento da marca ${brand.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow"
            >
              Falar com especialista <MessageCircle size={16} />
            </a>
          </div>

          {brandProducts.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {brandProducts.map((product) => (
                <article key={product.slug} className="product-card group">
                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-white p-6">
                    <img
                      src={product.image}
                      alt={`${product.name} ${product.model}`}
                      loading="lazy"
                      className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 bg-[#142b3a] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-black tracking-[0.18em] text-[#128c68]">{product.brand}</p>
                    <h3 className="mt-2 text-xl font-black tracking-tight">{product.name}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#7c898f]">Modelo {product.model}</p>
                    <p className="mt-4 border-t border-[#e2e6e8] pt-4 text-xs font-bold">{product.spec}</p>
                    <Link href={`/produtos/${product.slug}`} className="button-primary mt-5 w-full justify-center">
                      Ver detalhes <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-[#d0d7d9] bg-white p-8 sm:p-14">
              <p className="eyebrow text-[#128c68]">CATÁLOGO EM ATUALIZAÇÃO</p>
              <h3 className="mt-4 max-w-2xl text-3xl font-black tracking-[-.04em]">Ainda não há equipamentos cadastrados para {brand.name}.</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#66747d]">
                A Limaq atende equipamentos de diferentes linhas e modelos. Envie o modelo do seu equipamento para
                confirmarmos a possibilidade de atendimento e localizarmos a solução correta.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá, Limaq! Gostaria de consultar um equipamento da marca ${brand.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary mt-7"
              >
                Consultar pelo WhatsApp <MessageCircle size={16} />
              </a>
            </div>
          )}

          <div className="mt-16 border-t border-[#d0d7d9] pt-7">
            <Link href="/#marcas" className="link-arrow">
              <ArrowLeft size={16} /> Explorar todas as marcas atendidas
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#0b1b25] py-8 text-center text-xs text-white/45">
        Limaq • Marcas atendidas • Belém/PA •{" "}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-[#f1a51b]">
          (91) 98879-9884
        </a>
      </footer>
    </div>
  );
}
