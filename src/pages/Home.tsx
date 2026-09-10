import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Filter,
  Instagram,
  Linkedin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Star,
  Store,
  Thermometer,
  Truck,
  UserRound,
  X,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { brands as realBrands, categories as realCategories, products } from "@/lib/catalog";
import BrandsExperience from "@/components/BrandsExperience";
import ServiceCarousel from "@/components/ServiceCarousel";
import SolutionsStack from "@/components/SolutionsStack";
import StickyAssistance from "@/components/StickyAssistance";

const logo = "https://images.squarespace-cdn.com/content/v1/6a56d13ce4d0b80e6de9f3fe/6f176356-0f4f-429a-bc48-cb34f1d52d17/ChatGPT+Image+15+de+jul.+de+2026%2C+20_36_46.png?format=1500w";
const heroImage = "/manus-storage/combi-oven_175b4b6a.webp";
const founderImage = "https://images.squarespace-cdn.com/content/v1/6a56d13ce4d0b80e6de9f3fe/e35cdb76-3fa4-4791-85f0-d0f8b97d4782/ChatGPT+Image+18+de+jul.+de+2026%2C+02_49_04.png";

const categoryIcons = { Cocção: Thermometer, Refrigeração: Snowflake, Panificação: Store, Bancada: BarChart3 } as const;
const categories = realCategories.map((category) => ({ ...category, icon: categoryIcons[category.name as keyof typeof categoryIcons] ?? Store }));
const brands = realBrands;
const whatsapp = "5591988799884";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [cart, setCart] = useState<typeof products>([]);
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("Todas");
  const [priceFilter, setPriceFilter] = useState("Todos");
  const [heroShift, setHeroShift] = useState({ x: 0, y: 0 });

  const filteredProducts = useMemo(() => products.filter((p) => `${p.brand} ${p.name} ${p.model}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const catalogProducts = useMemo(() => products.filter((p) => {
    const brandMatch = brandFilter === "Todas" || p.brand === brandFilter;
    const priceMatch = priceFilter === "Todos" || (priceFilter === "Até R$ 10 mil" && p.price <= 10000) || (priceFilter === "Acima de R$ 10 mil" && p.price > 10000);
    return brandMatch && priceMatch;
  }), [brandFilter, priceFilter]);
  const addToCart = (product: typeof products[number]) => {
    setCart((current) => current.some((item) => item.model === product.model) ? current : [...current, product]);
    toast.success("Produto adicionado ao carrinho", { description: product.name });
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#17212b]">
      <div className="bg-[#142b3a] px-5 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-white/75">ATENDIMENTO TÉCNICO EM BELÉM E REGIÃO METROPOLITANA <span className="mx-2 text-[#f1a51b]">•</span> SEGUNDA A SEXTA, 8H ÀS 18H</div>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f7f8]/95 backdrop-blur-md">
        <div className="container flex h-[76px] items-center gap-5">
          <button className="mr-1 rounded-md p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button>
          <a href="#inicio" className="flex shrink-0 items-center"><img src={logo} alt="Limaq Assistência Técnica" className="h-12 w-auto object-contain" /></a>
          <nav className="hidden items-center gap-5 text-[12px] font-bold uppercase tracking-[0.1em] lg:flex">
            <a href="#produtos" className="nav-link">Produtos</a><a href="#categorias" className="nav-link">Categorias</a><a href="#marcas" className="nav-link">Marcas</a><a href="#assistencia" className="nav-link">Assistência</a><a href="#historia" className="nav-link">Sobre</a>
          </nav>
          <button onClick={() => setSearchOpen(true)} className="ml-auto hidden min-w-[235px] items-center gap-3 border-l border-[#cad0d4] pl-5 text-left text-sm text-[#66747d] transition hover:text-[#142b3a] md:flex"><Search size={18} /><span>Buscar produto, marca ou modelo</span></button>
          <a className="hidden items-center gap-2 text-[#128c68] md:flex" href="https://wa.me/5591988799884"><MessageCircle size={20} /><span className="hidden text-[11px] font-extrabold uppercase tracking-widest xl:inline">WhatsApp</span></a>
          <button onClick={() => setCartOpen(true)} className="relative rounded-md p-2 transition hover:bg-black/5" aria-label="Abrir carrinho"><ShoppingCart size={21} />{cart.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f1a51b] text-[10px] font-black">{cart.length}</span>}</button>
        </div>
        <div className="container flex pb-3 md:hidden"><button onClick={() => setSearchOpen(true)} className="flex w-full items-center gap-3 rounded-sm border border-[#cad0d4] bg-white px-4 py-3 text-left text-sm text-[#66747d]"><Search size={17} /> Buscar produto, marca ou modelo</button></div>
      </header>

      {menuOpen && <div className="fixed inset-0 z-50 bg-[#142b3a]/40 lg:hidden" onClick={() => setMenuOpen(false)}><aside className="h-full w-[85%] max-w-sm bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b pb-5"><img src={logo} alt="Limaq" className="h-10 w-auto" /><button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div><nav className="mt-8 grid gap-5 text-sm font-bold uppercase tracking-widest"><a href="#produtos" onClick={() => setMenuOpen(false)}>Produtos</a><a href="#categorias" onClick={() => setMenuOpen(false)}>Categorias</a><a href="#assistencia" onClick={() => setMenuOpen(false)}>Assistência técnica</a><a href="#marcas" onClick={() => setMenuOpen(false)}>Marcas atendidas</a><a href="#historia" onClick={() => setMenuOpen(false)}>Sobre a Limaq</a></nav><a href="https://wa.me/5591988799884" className="mt-10 flex items-center justify-center gap-2 bg-[#128c68] px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-white"><MessageCircle size={17} /> Falar no WhatsApp</a></aside></div>}

      <main id="inicio">
        <section className="hero-depth relative overflow-hidden bg-[#142b3a] text-white" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setHeroShift({ x: (event.clientX - rect.left - rect.width / 2) / 45, y: (event.clientY - rect.top - rect.height / 2) / 45 }); }} onMouseLeave={() => setHeroShift({ x: 0, y: 0 })}>
          <div className="hero-depth-bg" style={{ transform: `translate(${heroShift.x / 3}px, ${heroShift.y / 3}px)` }} />
          <div className="container relative z-10 grid min-h-[680px] items-center gap-8 py-16 lg:grid-cols-[.85fr_1.15fr] lg:py-20">
            <div className="max-w-xl"><p className="eyebrow text-[#f1a51b]">LIMAQ • DESDE 1987 • BELÉM/PA</p><h1 className="mt-6 text-5xl font-black leading-[.92] tracking-[-.06em] sm:text-6xl lg:text-[78px]">Equipamentos para quem leva sua <span className="text-[#f1a51b]">operação</span> a sério.</h1><p className="mt-7 max-w-lg text-base leading-7 text-white/70 sm:text-lg">Venda, instalação, manutenção e suporte técnico para food service, cozinha industrial e refrigeração comercial.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#solucoes" className="button-primary">Explorar soluções <ArrowRight size={17} /></a><a href="#assistencia" className="button-ghost">Fale com um especialista</a></div><div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60"><span><b className="mb-1 block text-xl text-white">35</b>Marcas atendidas</span><span><b className="mb-1 block text-xl text-white">1987</b>Desde Belém</span><span><b className="mb-1 block text-xl text-white">01</b>Equipe técnica</span></div></div>
            <div className="hero-depth-visual relative min-h-[460px] lg:min-h-[560px]"><img src={heroImage} alt="Forno combinado profissional em aço inox" className="hero-depth-image" style={{ transform: `translate(${heroShift.x}px, ${heroShift.y}px) scale(1.03)` }} /><div className="hero-depth-overlay" /><div className="hero-tech-tag tag-one" style={{ transform: `translate(${heroShift.x * 3}px, ${heroShift.y * 3}px)` }}>220V</div><div className="hero-tech-tag tag-two" style={{ transform: `translate(${heroShift.x * 4}px, ${heroShift.y * 4}px)` }}>INOX</div><div className="hero-tech-tag tag-three" style={{ transform: `translate(${heroShift.x * 2}px, ${heroShift.y * 2}px)` }}>ALTA PERFORMANCE</div><div className="hero-depth-caption"><p className="eyebrow text-[#f1a51b]">EQUIPAMENTO PROFISSIONAL</p><p className="mt-1 text-sm font-bold">Tecnologia para uma operação contínua.</p></div></div>
          </div>
        </section>
        <ServiceCarousel />

        <section id="categorias" className="container py-20 sm:py-28"><div className="flex flex-col justify-between gap-5 border-b border-[#cfd5d8] pb-7 sm:flex-row sm:items-end"><div><p className="eyebrow text-[#128c68]">NAVEGUE POR APLICAÇÃO</p><h2 className="section-title mt-3">Encontre o equipamento certo<br className="hidden sm:block" /> para sua operação.</h2></div><a href="#produtos" className="link-arrow">Ver todo o catálogo <ArrowRight size={16} /></a></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(({ name, count, image, icon: Icon }) => <a href="#produtos" key={name} className="category-card group"><img src={image} alt={name} loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-[#142b3a]/90 via-[#142b3a]/10 to-transparent" /><div className="relative z-10 mt-auto p-5 text-white"><Icon size={20} className="mb-8 text-[#f1a51b]" /><h3 className="text-2xl font-black tracking-tight">{name}</h3><div className="mt-1 flex items-center justify-between text-xs text-white/70"><span>{count}</span><ChevronRight size={18} className="transition group-hover:translate-x-1" /></div></div></a>)}</div></section>

        <SolutionsStack />

        <section id="produtos" className="bg-white py-20 sm:py-28"><div className="container"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-[#128c68]">CURADORIA LIMAQ</p><h2 className="section-title mt-3">Equipamentos em destaque.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#66747d]">Produtos selecionados para operações que precisam de desempenho, durabilidade e assistência de verdade.</p></div><div className="flex flex-wrap gap-2">
  <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="filter-select" aria-label="Filtrar por marca"><option>Todas</option>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select>
  <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="filter-select" aria-label="Filtrar por preço"><option>Todos</option><option>Até R$ 10 mil</option><option>Acima de R$ 10 mil</option></select>
</div></div><div className="product-rail mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">{catalogProducts.map((product) => <article key={product.model} className="product-card shrink-0 snap-start w-[84vw] sm:w-[48vw] lg:w-[31vw]"><div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f1f3f4] p-6"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 bg-[#142b3a] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{product.badge}</span><button onClick={() => addToCart(product)} className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#f1a51b] text-[#142b3a] transition hover:bg-[#128c68] hover:text-white" aria-label={`Adicionar ${product.name} ao carrinho`}><ShoppingCart size={17} /></button></div><div className="p-5"><p className="text-[10px] font-black tracking-[0.18em] text-[#128c68]">{product.brand}</p><Link href={`/produtos/${product.slug}`} className="mt-2 block text-xl font-black tracking-tight hover:text-[#128c68]">{product.name}</Link><p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#7c898f]">Modelo {product.model}</p><div className="mt-5 flex items-end justify-between border-t border-[#e2e6e8] pt-4"><div><p className="text-[10px] uppercase tracking-widest text-[#7c898f]">Especificação</p><p className="mt-1 text-xs font-bold">{product.spec}</p></div><strong className="text-sm">{product.priceLabel}</strong></div><div className="mt-5 flex gap-2"><button onClick={() => setQuoteOpen(true)} className="flex-1 border border-[#142b3a] py-3 text-[10px] font-black uppercase tracking-widest transition hover:bg-[#142b3a] hover:text-white">Solicitar orçamento</button><button onClick={() => addToCart(product)} className="border border-[#d4dadd] px-3 transition hover:border-[#128c68]" aria-label="Adicionar ao carrinho"><Plus size={17} /></button></div></div></article>)}</div></div></section>

        <section id="assistencia" className="bg-[#eef1f2] py-20 sm:py-28"><div className="container grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"><div><p className="eyebrow text-[#128c68]">SERVIÇO ESPECIALIZADO</p><h2 className="section-title mt-3">Sua operação<br /> não pode parar.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#66747d]">Da instalação ao diagnóstico, a Limaq cuida do equipamento que mantém o seu negócio funcionando. Envie os dados e nossa equipe retorna com os próximos passos.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="flex gap-3"><Wrench className="shrink-0 text-[#128c68]" size={20} /><div><b className="text-sm">Diagnóstico técnico</b><p className="mt-1 text-xs leading-5 text-[#66747d]">Análise clara do problema e da solução.</p></div></div><div className="flex gap-3"><Truck className="shrink-0 text-[#128c68]" size={20} /><div><b className="text-sm">Atendimento em campo</b><p className="mt-1 text-xs leading-5 text-[#66747d]">Belém e região metropolitana.</p></div></div></div></div><div className="bg-[#142b3a] p-6 text-white sm:p-9"><div className="flex items-center justify-between border-b border-white/15 pb-5"><div><p className="eyebrow text-[#f1a51b]">ORDEM DE SERVIÇO DIGITAL</p><h3 className="mt-2 text-2xl font-black">Solicitar assistência</h3></div><ClipboardList className="text-[#f1a51b]" size={32} /></div>{serviceOpen ? <div className="py-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#128c68]"><Check /></div><h4 className="mt-4 text-lg font-black">Solicitação recebida.</h4><p className="mt-2 text-sm text-white/60">Nossa equipe entrará em contato para entender o caso.</p><button onClick={() => setServiceOpen(false)} className="mt-6 text-xs font-bold uppercase tracking-widest text-[#f1a51b]">Enviar outra solicitação</button></div> : <form className="grid gap-4 pt-6" onSubmit={(e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const text = `Olá, Limaq! Preciso solicitar assistência técnica.\n\nNome: ${form.get("name")}\nTelefone: ${form.get("phone")}\nMarca: ${form.get("brand")}\nModelo: ${form.get("model")}\nProblema: ${form.get("problem")}\n\nVim pelo novo site da Limaq.`;
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  setServiceOpen(true);
        }}><div className="grid gap-4 sm:grid-cols-2"><input required name="name" placeholder="Seu nome" className="dark-input" /><input required name="phone" placeholder="Telefone / WhatsApp" className="dark-input" /></div><div className="grid gap-4 sm:grid-cols-2"><input name="brand" placeholder="Marca do equipamento" className="dark-input" /><input name="model" placeholder="Modelo" className="dark-input" /></div><textarea required name="problem" placeholder="Descreva o problema" className="dark-input min-h-24 resize-none" /><button className="button-primary mt-2 justify-center">Solicitar atendimento <ArrowRight size={17} /></button></form>}</div></div></section>

        <StickyAssistance />

        <BrandsExperience onAssist={() => setServiceOpen(true)} />

        <section id="historia" className="bg-[#142b3a] py-20 text-white sm:py-28"><div className="container grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center"><div><p className="eyebrow text-[#f1a51b]">TRADIÇÃO QUE CONTINUA</p><h2 className="section-title mt-3 text-white">Uma história de família,<br /> adaptação e especialização.</h2><p className="mt-6 max-w-xl text-base leading-7 text-white/65">A Limaq nasceu em Belém em 10 de fevereiro de 1987, fundada por Antonio Augusto, engenheiro mecânico, e sua esposa Laudicéia. Hoje, em sua segunda geração, a empresa preserva a experiência dos fundadores e moderniza seus processos para atender melhor o food service.</p><div className="mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-white/15 pt-5"><div><b className="block text-3xl font-black text-[#f1a51b]">1987</b><span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Fundação</span></div><div><b className="block text-3xl font-black text-[#f1a51b]">20+</b><span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Anos de Bosch</span></div><div><b className="block text-3xl font-black text-[#f1a51b]">2ª</b><span className="text-[10px] font-bold uppercase tracking-widest text-white/55">Geração</span></div></div><a href="#contato" className="button-ghost mt-9 inline-flex">Conheça a Limaq <ArrowRight size={17} /></a></div><div className="relative"><img src={founderImage} alt="Antonio Augusto, fundador da Limaq" className="aspect-[4/5] w-full object-cover grayscale" /><div className="absolute bottom-5 left-5 bg-[#f1a51b] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#142b3a]">Sr. Antonio<br /><span className="font-medium normal-case tracking-normal">Fundador e engenheiro mecânico</span></div></div></div></section>
      </main>

      <footer id="contato" className="bg-[#0b1b25] py-14 text-white"><div className="container grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]"><div><img src={logo} alt="Limaq" className="h-12 w-auto brightness-0 invert" /><p className="mt-5 max-w-xs text-sm leading-6 text-white/55">Equipamentos profissionais, assistência técnica e peças para manter sua operação funcionando.</p><div className="mt-5 flex gap-3"><a href="https://www.instagram.com/limaq.assistencia.tecnica" className="footer-icon"><Instagram size={17} /></a><a href="http://linkedin.com/company/limaq" className="footer-icon"><Linkedin size={17} /></a><a href="https://wa.me/5591988799884" className="footer-icon"><MessageCircle size={17} /></a></div></div><div><p className="footer-title">Explorar</p><div className="grid gap-3 text-sm text-white/55"><a href="#produtos" className="footer-link">Produtos</a><a href="#categorias" className="footer-link">Categorias</a><a href="#marcas" className="footer-link">Marcas atendidas</a><a href="#assistencia" className="footer-link">Assistência técnica</a></div></div><div><p className="footer-title">Atendimento</p><div className="grid gap-3 text-sm text-white/55"><a href="https://wa.me/5591988799884" className="footer-link">(91) 98879-9884</a><a href="mailto:contato@limaq.net" className="footer-link">contato@limaq.net</a><a href="mailto:assistecnica@limaq.net" className="footer-link">assistecnica@limaq.net</a><span>Seg. a sex. • 8h às 18h</span></div></div><div><p className="footer-title">Onde estamos</p><p className="text-sm leading-6 text-white/55">Rua dos Mundurucus, 813<br />Jurunas, Belém–PA<br />CEP 66035-360</p><a href="https://maps.google.com/?q=Rua+dos+Mundurucus+813+Belem" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f1a51b]">Como chegar <ArrowRight size={14} /></a></div></div><div className="container mt-12 border-t border-white/10 pt-5 text-[11px] text-white/35">© 2026 Limaq • ACDS Comércio e Serviços de Manutenção e Aluguel de Equipamentos LTDA. • CNPJ 15.289.499/0001-76</div></footer>

      {searchOpen && <div className="fixed inset-0 z-50 bg-[#142b3a]/70 p-4 backdrop-blur-sm" onClick={() => setSearchOpen(false)}><div className="mx-auto mt-20 max-w-3xl bg-white p-5 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-3 border-b-2 border-[#142b3a] pb-4"><Search size={24} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por produto, marca ou modelo" className="w-full text-lg outline-none" /><button onClick={() => setSearchOpen(false)} aria-label="Fechar busca"><X /></button></div><p className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#7c898f]">{query ? "Resultados encontrados" : "Buscas populares"}</p><div className="mt-4 grid gap-3">{(query ? filteredProducts : products).map((p) => <button key={p.model} onClick={() => { setSearchOpen(false); addToCart(p); }} className="flex items-center justify-between border-b border-[#e2e6e8] py-3 text-left hover:text-[#128c68]"><span><b className="mr-3 text-[10px] tracking-widest text-[#128c68]">{p.brand}</b>{p.name}</span><ChevronRight size={16} /></button>)}{query && filteredProducts.length === 0 && <p className="py-6 text-sm text-[#66747d]">Nenhum produto encontrado. Fale com um especialista para localizar o equipamento ideal.</p>}</div></div></div>}
      {cartOpen && <div className="fixed inset-0 z-50 bg-[#142b3a]/40" onClick={() => setCartOpen(false)}><aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b pb-5"><div><p className="eyebrow text-[#128c68]">SELEÇÃO LIMAQ</p><h3 className="mt-1 text-2xl font-black">Seu carrinho</h3></div><button onClick={() => setCartOpen(false)} aria-label="Fechar carrinho"><X /></button></div><div className="flex-1 py-6">{cart.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center text-[#66747d]"><ShoppingCart size={34} strokeWidth={1.2} /><p className="mt-4 text-sm font-bold">Seu carrinho está vazio.</p><p className="mt-2 text-xs">Adicione equipamentos para solicitar um orçamento.</p></div> : <div className="grid gap-4">{cart.map((p) => <div key={p.model} className="flex gap-3 border-b pb-4"><img src={p.image} alt="" className="h-16 w-16 object-cover" /><div className="flex-1"><p className="text-[10px] font-black tracking-widest text-[#128c68]">{p.brand}</p><p className="mt-1 text-sm font-bold">{p.name}</p><p className="mt-1 text-xs text-[#66747d]">{p.model}</p></div><button onClick={() => setCart(cart.filter((i) => i.model !== p.model))} className="self-start text-[#7c898f]" aria-label="Remover item"><X size={15} /></button></div>)}</div>}</div>{cart.length > 0 && <div className="border-t pt-5"><div className="flex justify-between text-sm font-bold"><span>Itens selecionados</span><span>{cart.length}</span></div><button onClick={() => { setCartOpen(false); setQuoteOpen(true); }} className="button-primary mt-5 w-full justify-center">Solicitar orçamento <ArrowRight size={17} /></button></div>}</aside></div>}
      {quoteOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#142b3a]/70 p-4" onClick={() => setQuoteOpen(false)}><div className="w-full max-w-lg bg-white p-6 sm:p-9" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="eyebrow text-[#128c68]">ATENDIMENTO COMERCIAL</p><h3 className="mt-2 text-2xl font-black">Solicitar orçamento</h3><p className="mt-2 text-sm text-[#66747d]">Conte o que sua operação precisa. A equipe Limaq responde.</p></div><button onClick={() => setQuoteOpen(false)} aria-label="Fechar formulário"><X /></button></div><form className="mt-7 grid gap-4" onSubmit={(e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const text = `Olá, Limaq! Gostaria de solicitar um orçamento.\n\nNome: ${form.get("name")}\nEmpresa: ${form.get("company")}\nWhatsApp: ${form.get("phone")}\nCidade: ${form.get("city")}\nEquipamento: ${form.get("equipment")}\n\nVim pelo novo site da Limaq.`;
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  setQuoteOpen(false);
  toast.success("WhatsApp aberto", { description: "Revise a mensagem e envie para a equipe Limaq." });
}}><input required name="name" placeholder="Nome completo" className="light-input" /><input required name="company" placeholder="Empresa" className="light-input" /><div className="grid gap-4 sm:grid-cols-2"><input required name="phone" placeholder="WhatsApp" className="light-input" /><input name="city" placeholder="Cidade" className="light-input" /></div><textarea name="equipment" placeholder="Qual equipamento você procura?" className="light-input min-h-24 resize-none" /><button className="button-primary justify-center">Enviar solicitação <ArrowRight size={17} /></button></form></div></div>}
    </div>
  );
}
