import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  ClipboardList,
  Instagram,
  Linkedin,
  Menu,
  MessageCircle,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Snowflake,
  Store,
  Thermometer,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import BrandsExperience from "@/components/BrandsExperience";
import ServiceCarousel from "@/components/ServiceCarousel";
import SolutionsStack from "@/components/SolutionsStack";
import StickyAssistance from "@/components/StickyAssistance";
import { useCart } from "@/hooks/useCart";
import { brands, categories, countByCategory, products } from "@/lib/catalog";
import { WHATSAPP_NUMBER } from "@/lib/cart";

const heroImage = "/images/forno-combinado.jpg";
const founderImage =
  "https://images.squarespace-cdn.com/content/v1/6a56d13ce4d0b80e6de9f3fe/e35cdb76-3fa4-4791-85f0-d0f8b97d4782/ChatGPT+Image+18+de+jul.+de+2026%2C+02_49_04.png";

const categoryIcons = {
  Cocção: Thermometer,
  Refrigeração: Snowflake,
  Panificação: Store,
  Bancada: BarChart3,
  Açougue: Package,
  "Máquinas de gelo": Snowflake,
} as const;

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

function FounderFigure() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full max-w-md flex-col justify-between bg-[#1b394b] p-8">
        <p className="eyebrow text-[#f1a51b]">FUNDADOR</p>
        <div>
          <p className="text-6xl font-black tracking-[-.06em] text-white">AA</p>
          <p className="mt-3 text-sm font-bold text-white/80">Antonio Augusto</p>
          <p className="mt-1 text-xs text-white/55">Engenheiro mecânico • fundador da Limaq em 1987</p>
        </div>
      </div>
    );
  }
  return (
    <img
      src={founderImage}
      alt="Antonio Augusto, fundador da Limaq"
      className="hero-image w-full max-w-md object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function Home() {
  const { add, count, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceSubmitted, setServiceSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [brandFilter, setBrandFilter] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("Todas");
  const [heroShift, setHeroShift] = useState({ x: 0, y: 0 });

  const filteredProducts = useMemo(
    () => products.filter((p) => `${p.brand} ${p.name} ${p.model}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const catalogProducts = useMemo(
    () =>
      products.filter((p) => {
        const categoryMatch = categoryFilter === "Todas" || p.category === categoryFilter;
        const brandMatch = brandFilter === "Todas" || p.brand === brandFilter;
        const priceMatch =
          priceFilter === "Todas" ||
          (priceFilter === "Até R$ 10 mil" && p.price <= 10000) ||
          (priceFilter === "Acima de R$ 10 mil" && p.price > 10000);
        return categoryMatch && brandMatch && priceMatch;
      }),
    [categoryFilter, brandFilter, priceFilter],
  );

  const hasActiveFilters = categoryFilter !== "Todas" || brandFilter !== "Todas" || priceFilter !== "Todas";
  const clearFilters = () => {
    setCategoryFilter("Todas");
    setBrandFilter("Todas");
    setPriceFilter("Todas");
  };

  const addToCart = (slug: string, name: string) => {
    add(slug);
    toast.success("Produto adicionado ao carrinho", { description: name });
  };

  const goToAssistance = () => document.getElementById("assistencia")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#17212b]">
      <div className="bg-[#142b3a] px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white/75">
        ATENDIMENTO TÉCNICO EM BELÉM E REGIÃO METROPOLITANA <span className="mx-2 text-[#f1a51b]">•</span> SEGUNDA A
        SEXTA, 8H ÀS 18H
      </div>

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f7f8]/95 backdrop-blur-md">
        <div className="container flex h-[76px] items-center gap-5">
          <button className="mr-1 rounded-md p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <Menu size={22} />
          </button>
          <a href="#inicio" className="flex shrink-0 items-center" aria-label="Limaq — início">
            <BrandLogo className="h-12 w-auto object-contain" />
          </a>
          <nav className="hidden items-center gap-5 text-[12px] font-bold uppercase tracking-[0.1em] lg:flex">
            <a href="#produtos" className="nav-link">Produtos</a>
            <a href="#categorias" className="nav-link">Categorias</a>
            <a href="#marcas" className="nav-link">Marcas</a>
            <a href="#assistencia" className="nav-link">Assistência</a>
            <a href="#historia" className="nav-link">Sobre</a>
          </nav>
          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto hidden min-w-[235px] items-center gap-3 border-l border-[#cad0d4] pl-5 text-left text-sm text-[#66747d] transition hover:text-[#142b3a] md:flex"
          >
            <Search size={18} />
            <span>Buscar produto, marca ou modelo</span>
          </button>
          <a className="hidden items-center gap-2 text-[#128c68] md:flex" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={20} />
            <span className="hidden text-[11px] font-extrabold uppercase tracking-widest xl:inline">WhatsApp</span>
          </a>
          <button
            onClick={openCart}
            className="relative rounded-md p-2 transition hover:bg-black/5"
            aria-label={`Abrir carrinho com ${count} itens`}
          >
            <ShoppingCart size={21} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f1a51b] text-[10px] font-black">
                {count}
              </span>
            )}
          </button>
        </div>
        <div className="container flex pb-3 md:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-3 rounded-sm border border-[#cad0d4] bg-white px-4 py-3 text-left text-sm text-[#66747d]"
          >
            <Search size={17} /> Buscar produto, marca ou modelo
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#142b3a]/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="h-full w-[85%] max-w-sm bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e2e6e8] pb-5">
              <BrandLogo className="h-10 w-auto" />
              <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
                <X />
              </button>
            </div>
            <nav className="mt-8 grid gap-5 text-sm font-bold uppercase tracking-widest">
              <a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a>
              <a href="#categorias" onClick={() => setMenuOpen(false)}>Categorias</a>
              <a href="#assistencia" onClick={() => setMenuOpen(false)}>Assistência técnica</a>
              <a href="#marcas" onClick={() => setMenuOpen(false)}>Marcas atendidas</a>
              <a href="#historia" onClick={() => setMenuOpen(false)}>Sobre a Limaq</a>
            </nav>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 flex items-center justify-center gap-2 bg-[#128c68] px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-white"
            >
              <MessageCircle size={17} /> Falar no WhatsApp
            </a>
          </aside>
        </div>
      )}

      <main id="inicio">
        <section
          className="hero-depth relative overflow-hidden bg-[#142b3a] text-white"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setHeroShift({ x: (event.clientX - rect.left - rect.width / 2) / 45, y: (event.clientY - rect.top - rect.height / 2) / 45 });
          }}
          onMouseLeave={() => setHeroShift({ x: 0, y: 0 })}
        >
          <div className="hero-depth-bg" style={{ transform: `translate(${heroShift.x / 3}px, ${heroShift.y / 3}px)` }} />
          <div className="container relative z-10 grid min-h-[680px] items-center gap-8 py-16 lg:grid-cols-[.85fr_1.15fr] lg:py-20">
            <div className="max-w-xl">
              <p className="eyebrow text-[#f1a51b]">LIMAQ • DESDE 1987 • BELÉM/PA</p>
              <h1 className="mt-6 text-5xl font-black leading-[.92] tracking-[-.06em] sm:text-6xl lg:text-[78px]">
                Equipamentos para quem leva sua <span className="text-[#f1a51b]">operação</span> a sério.
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
                Venda, instalação, manutenção e suporte técnico para food service, cozinha industrial e refrigeração
                comercial.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#solucoes" className="button-primary">
                  Explorar soluções <ArrowRight size={17} />
                </a>
                <a href="#assistencia" className="button-ghost">
                  Fale com um especialista
                </a>
              </div>
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                <span>
                  <b className="mb-1 block text-xl text-white">35</b>Marcas atendidas
                </span>
                <span>
                  <b className="mb-1 block text-xl text-white">1987</b>Desde Belém
                </span>
                <span>
                  <b className="mb-1 block text-xl text-white">2ª</b>Geração
                </span>
              </div>
            </div>
            <div className="hero-depth-visual relative min-h-[460px] lg:min-h-[560px]">
              <img
                src={heroImage}
                alt="Forno combinado profissional em aço inox"
                className="hero-depth-image"
                style={{ transform: `translate(${heroShift.x}px, ${heroShift.y}px) scale(1.03)` }}
              />
              <div className="hero-depth-overlay" />
              <div className="hero-tech-tag tag-one" style={{ transform: `translate(${heroShift.x * 3}px, ${heroShift.y * 3}px)` }}>
                220V
              </div>
              <div className="hero-tech-tag tag-two" style={{ transform: `translate(${heroShift.x * 4}px, ${heroShift.y * 4}px)` }}>
                INOX
              </div>
              <div className="hero-tech-tag tag-three" style={{ transform: `translate(${heroShift.x * 2}px, ${heroShift.y * 2}px)` }}>
                ALTA PERFORMANCE
              </div>
              <div className="hero-depth-caption">
                <p className="eyebrow text-[#f1a51b]">EQUIPAMENTO PROFISSIONAL</p>
                <p className="mt-1 text-sm font-bold">Tecnologia para uma operação contínua.</p>
              </div>
            </div>
          </div>
        </section>

        <ServiceCarousel />

        <section id="categorias" className="container py-20 sm:py-28">
          <div className="flex flex-col justify-between gap-5 border-b border-[#cfd5d8] pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-[#128c68]">NAVEGUE POR APLICAÇÃO</p>
              <h2 className="section-title mt-3">
                Encontre o equipamento certo
                <br className="hidden sm:block" /> para sua operação.
              </h2>
            </div>
            <a href="#produtos" className="link-arrow">
              Ver todo o catálogo <ArrowRight size={16} />
            </a>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, image }) => {
              const total = countByCategory(name);
              const Icon = categoryIcons[name as keyof typeof categoryIcons] ?? Store;
              const active = categoryFilter === name;
              return (
                <a
                  href="#produtos"
                  key={name}
                  onClick={() => setCategoryFilter(active ? "Todas" : name)}
                  className={`category-card group ${active ? "is-active" : ""}`}
                >
                  <img src={image} alt={name} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#142b3a]/90 via-[#142b3a]/10 to-transparent" />
                  <div className="relative z-10 mt-auto p-5 text-white">
                    <Icon size={20} className="mb-8 text-[#f1a51b]" />
                    <h3 className="text-2xl font-black tracking-tight">{name}</h3>
                    <div className="mt-1 flex items-center justify-between text-xs text-white/70">
                      <span>{total > 0 ? `${total} ${total === 1 ? "equipamento" : "equipamentos"} em destaque` : "Sob consulta"}</span>
                      <ChevronRight size={18} className="transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <SolutionsStack />

        <section id="produtos" className="bg-white py-20 sm:py-28">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-[#128c68]">CURADORIA LIMAQ</p>
                <h2 className="section-title mt-3">Equipamentos em destaque.</h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-[#66747d]">
                  Produtos selecionados para operações que precisam de desempenho, durabilidade e assistência de
                  verdade.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                  className="filter-select"
                  aria-label="Filtrar por marca"
                >
                  <option value="Todas">Todas as marcas</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <select
                  value={priceFilter}
                  onChange={(event) => setPriceFilter(event.target.value)}
                  className="filter-select"
                  aria-label="Filtrar por faixa de investimento"
                >
                  <option value="Todas">Qualquer faixa</option>
                  <option value="Até R$ 10 mil">Até R$ 10 mil</option>
                  <option value="Acima de R$ 10 mil">Acima de R$ 10 mil</option>
                </select>
              </div>
            </div>

            {categoryFilter !== "Todas" && (
              <p className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#128c68]">
                Categoria: {categoryFilter}
                <button onClick={clearFilters} className="text-[#7c898f] underline-offset-4 transition hover:text-[#142b3a] hover:underline">
                  limpar
                </button>
              </p>
            )}

            {catalogProducts.length > 0 ? (
              <div className="product-rail mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
                {catalogProducts.map((product) => (
                  <article key={product.slug} className="product-card group w-[84vw] shrink-0 snap-start sm:w-[48vw] lg:w-[31vw]">
                    <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f1f3f4] p-6">
                      <img
                        src={product.image}
                        alt={`${product.name} ${product.model}`}
                        loading="lazy"
                        className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 bg-[#142b3a] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                        {product.badge}
                      </span>
                      <button
                        onClick={() => addToCart(product.slug, product.name)}
                        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#f1a51b] text-[#142b3a] transition hover:bg-[#128c68] hover:text-white"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                      >
                        <ShoppingCart size={17} />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-black tracking-[0.18em] text-[#128c68]">{product.brand}</p>
                      <h3 className="mt-2 text-xl font-black tracking-tight">{product.name}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#7c898f]">Modelo {product.model}</p>
                      <p className="mt-4 border-t border-[#e2e6e8] pt-4 text-xs font-bold">{product.spec}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#7c898f]">{product.priceLabel}</span>
                        <Link href={`/produtos/${product.slug}`} className="link-arrow">
                          Ver detalhes <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 border border-[#e2e6e8] bg-[#f6f7f8] p-10 text-center">
                <p className="eyebrow text-[#128c68]">CATÁLOGO EM ATUALIZAÇÃO</p>
                <h3 className="mx-auto mt-4 max-w-xl text-2xl font-black tracking-[-.04em]">
                  Nenhum equipamento nessa combinação de filtros — mas a Limaq localiza para você.
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66747d]">
                  Trabalhamos com 35 marcas e milhares de modelos sob encomenda. Diga o que sua operação precisa que
                  nós encontramos a solução correta.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={clearFilters} className="button-primary">
                    Limpar filtros
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="button-ghost !border-[#142b3a]/25 !text-[#142b3a]">
                    <MessageCircle size={16} /> Consultar no WhatsApp
                  </a>
                </div>
              </div>
            )}

            <p className="mt-6 text-[11px] text-[#9aa5aa]">
              A faixa de investimento é uma referência para filtragem; o preço final é sempre sob consulta, conforme
              configuração, instalação e prazo.
            </p>
            {hasActiveFilters && catalogProducts.length > 0 && (
              <button onClick={clearFilters} className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#7c898f] transition hover:text-[#142b3a]">
                Limpar filtros ({catalogProducts.length} {catalogProducts.length === 1 ? "resultado" : "resultados"})
              </button>
            )}
          </div>
        </section>

        <section id="assistencia" className="bg-[#eef1f2] py-20 sm:py-28">
          <div className="container grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow text-[#128c68]">SERVIÇO ESPECIALIZADO</p>
              <h2 className="section-title mt-3">
                Sua operação
                <br /> não pode parar.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-[#66747d]">
                Da instalação ao diagnóstico, a Limaq cuida do equipamento que mantém o seu negócio funcionando. Envie
                os dados e nossa equipe retorna com os próximos passos.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Wrench className="shrink-0 text-[#128c68]" size={20} />
                  <div>
                    <b className="text-sm">Diagnóstico técnico</b>
                    <p className="mt-1 text-xs leading-5 text-[#66747d]">Análise clara do problema e da solução.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Truck className="shrink-0 text-[#128c68]" size={20} />
                  <div>
                    <b className="text-sm">Atendimento em campo</b>
                    <p className="mt-1 text-xs leading-5 text-[#66747d]">Belém e região metropolitana.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#142b3a] p-6 text-white sm:p-9">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div>
                  <p className="eyebrow text-[#f1a51b]">ORDEM DE SERVIÇO DIGITAL</p>
                  <h3 className="mt-2 text-2xl font-black">Solicitar assistência</h3>
                </div>
                <ClipboardList className="text-[#f1a51b]" size={32} />
              </div>
              {serviceSubmitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#128c68]/20 text-[#128c68]">
                    <Check size={26} />
                  </div>
                  <p className="mt-5 text-lg font-black">WhatsApp aberto</p>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/60">
                    Revise a mensagem com os dados do equipamento e envie para nossa equipe técnica.
                  </p>
                  <button
                    onClick={() => setServiceSubmitted(false)}
                    className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#f1a51b] transition hover:text-white"
                  >
                    Enviar outra solicitação
                  </button>
                </div>
              ) : (
                <form
                  className="mt-6 grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = new FormData(event.currentTarget);
                    const text = `Olá, Limaq! Preciso solicitar assistência técnica.\n\nNome: ${form.get("name")}\nTelefone: ${form.get("phone")}\nMarca: ${form.get("brand")}\nModelo: ${form.get("model")}\nProblema: ${form.get("problem")}\n\nVim pelo novo site da Limaq.`;
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
                    setServiceSubmitted(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required name="name" placeholder="Seu nome" className="dark-input" />
                    <input required name="phone" placeholder="Telefone / WhatsApp" className="dark-input" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input name="brand" placeholder="Marca do equipamento" className="dark-input" />
                    <input name="model" placeholder="Modelo" className="dark-input" />
                  </div>
                  <textarea required name="problem" placeholder="Descreva o problema" className="dark-input min-h-24 resize-none" />
                  <button className="button-primary mt-2 justify-center">
                    Solicitar atendimento <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <StickyAssistance />

        <BrandsExperience onAssist={goToAssistance} />

        <section id="historia" className="bg-[#142b3a] py-20 text-white sm:py-28">
          <div className="container grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow text-[#f1a51b]">TRADIÇÃO QUE CONTINUA</p>
              <h2 className="section-title mt-3 text-white">
                Uma história de família,
                <br /> adaptação e especialização.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
                A Limaq nasceu em Belém em 10 de fevereiro de 1987, fundada por Antonio Augusto, engenheiro mecânico, e
                sua esposa Laudicéia. Hoje, em sua segunda geração, a empresa preserva a experiência dos fundadores e
                moderniza seus processos para atender melhor o food service.
              </p>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-white/15 pt-5">
                <div>
                  <b className="block text-3xl font-black text-[#f1a51b]">1987</b>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Fundação</span>
                </div>
                <div>
                  <b className="block text-3xl font-black text-[#f1a51b]">20+</b>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Anos de Bosch</span>
                </div>
                <div>
                  <b className="block text-3xl font-black text-[#f1a51b]">2ª</b>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Geração</span>
                </div>
              </div>
              <a href="#contato" className="button-ghost mt-9 inline-flex">
                Conheça a Limaq <ArrowRight size={17} />
              </a>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <FounderFigure />
            </div>
          </div>
        </section>
      </main>

      <footer id="contato" className="bg-[#0b1b25] py-14 text-white">
        <div className="container grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo variant="light" className="h-12 w-auto text-white" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              Equipamentos profissionais, assistência técnica e peças para manter sua operação funcionando.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com/limaq.assistencia.tecnica" className="footer-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Limaq">
                <Instagram size={17} />
              </a>
              <a href="https://www.linkedin.com/company/limaq" className="footer-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da Limaq">
                <Linkedin size={17} />
              </a>
              <a href={whatsappUrl} className="footer-icon" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Limaq">
                <MessageCircle size={17} />
              </a>
            </div>
          </div>
          <div>
            <p className="footer-title">Explorar</p>
            <div className="grid gap-3 text-sm text-white/55">
              <a href="#produtos" className="footer-link">Produtos</a>
              <a href="#categorias" className="footer-link">Categorias</a>
              <a href="#marcas" className="footer-link">Marcas atendidas</a>
              <a href="#assistencia" className="footer-link">Assistência técnica</a>
            </div>
          </div>
          <div>
            <p className="footer-title">Atendimento</p>
            <div className="grid gap-3 text-sm text-white/55">
              <a href={whatsappUrl} className="footer-link" target="_blank" rel="noopener noreferrer">
                (91) 98879-9884
              </a>
              <a href="mailto:contato@limaq.net" className="footer-link">contato@limaq.net</a>
              <a href="mailto:assistencia@limaq.net" className="footer-link">assistencia@limaq.net</a>
              <span>Seg. a sex. • 8h às 18h</span>
            </div>
          </div>
          <div>
            <p className="footer-title">Endereço</p>
            <div className="grid gap-3 text-sm text-white/55">
              <span>Belém — Pará</span>
              <span>Atendimento em toda a região metropolitana</span>
              <a href="#assistencia" className="footer-link">Solicitar visita técnica</a>
            </div>
          </div>
        </div>
        <div className="container mt-10 border-t border-white/10 pt-6 text-[11px] text-white/35">
          © {new Date().getFullYear()} Limaq Assistência Técnica • CNPJ sob consulta • Belém/PA
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#142b3a]/70 p-4 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="mx-auto mt-20 max-w-3xl bg-white p-5 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-3 border-b-2 border-[#142b3a] pb-4">
              <Search size={24} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busque por produto, marca ou modelo"
                className="w-full text-lg outline-none"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Fechar busca">
                <X />
              </button>
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#7c898f]">
              {query ? "Resultados encontrados" : "Equipamentos em destaque"}
            </p>
            <div className="mt-4 grid gap-3">
              {(query ? filteredProducts : products).map((product) => (
                <div key={product.slug} className="flex items-center justify-between gap-3 border-b border-[#e2e6e8] py-3">
                  <Link href={`/produtos/${product.slug}`} onClick={() => setSearchOpen(false)} className="flex-1 hover:text-[#128c68]">
                    <b className="mr-3 text-[10px] tracking-widest text-[#128c68]">{product.brand}</b>
                    {product.name}
                    <span className="ml-2 text-xs text-[#9aa5aa]">{product.model}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product.slug, product.name)}
                      className="rounded-md p-2 transition hover:bg-[#f1a51b]/20 hover:text-[#142b3a]"
                      aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                      <Plus size={16} />
                    </button>
                    <ChevronRight size={16} className="text-[#9aa5aa]" />
                  </div>
                </div>
              ))}
              {query && filteredProducts.length === 0 && (
                <p className="py-6 text-sm text-[#66747d]">
                  Nenhum produto encontrado. Fale com um especialista para localizar o equipamento ideal.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
