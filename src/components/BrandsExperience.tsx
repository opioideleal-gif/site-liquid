import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";

/**
 * Marcas atendidas pela Limaq.
 * Os logotipos pertencem aos fabricantes, então em vez de hospedar/hotlinkar
 * arquivos de terceiros, cada tile exibe o nome da marca como wordmark
 * tipográfico — sempre disponível, sem depender de CDN externo.
 */
export const brands = [
  ["Bras Sulamericana", "Refrigeração", "Sistemas de refrigeração comercial e conservação."],
  ["Elvi Cozinhas", "Cocção", "Cozinhas profissionais e equipamentos de cocção."],
  ["Everest", "Água", "Bebedouros, purificadores e soluções para água."],
  ["Gastromaq", "Processamento", "Equipamentos para preparo e processamento de alimentos."],
  ["Gerbelli", "Cocção", "Equipamentos para cozinhas de alta demanda."],
  ["G.Paniz", "Panificação", "Máquinas para panificação e confeitaria profissional."],
  ["Grano", "Panificação", "Soluções para produção e preparo de massas."],
  ["Granomaq", "Processamento", "Equipamentos robustos para processamento."],
  ["Gural", "Refrigeração", "Equipamentos de conservação para food service."],
  ["Hobart", "Processamento", "Tecnologia para processamento e lavagem profissional."],
  ["IBBL", "Água", "Purificadores e bebedouros para diferentes operações."],
  ["Maquipão", "Panificação", "Equipamentos para padarias e confeitarias."],
  ["Marchesoni", "Cocção", "Equipamentos profissionais para preparo e cocção."],
  ["Metalcubas", "Bancada", "Cubas e equipamentos em aço inox."],
  ["Metalmaq", "Bancada", "Estruturas e equipamentos para cozinhas profissionais."],
  ["Metvisa", "Processamento", "Equipamentos para preparo de alimentos."],
  ["Monarcha", "Cocção", "Equipamentos para cozinhas profissionais."],
  ["Multifritas", "Cocção", "Soluções profissionais para fritura."],
  ["Palladium", "Refrigeração", "Equipamentos para conservação e exposição."],
  ["Planeta Água", "Água", "Soluções para tratamento e fornecimento de água."],
  ["P.Pienk", "Bancada", "Equipamentos e acessórios para operações profissionais."],
  ["Prática", "Cocção", "Tecnologia profissional para operações de alta demanda."],
  ["Progas", "Cocção", "Equipamentos a gás para food service."],
  ["Rational", "Cocção", "Equipamentos profissionais de cocção inteligente."],
  ["Robot Coupe", "Processamento", "Processadores para cozinhas profissionais."],
  ["Sirman", "Processamento", "Equipamentos para preparo e processamento."],
  ["Skymsen", "Processamento", "Máquinas para preparo, corte e processamento."],
  ["Soft by Everest", "Água", "Soluções de água para ambientes profissionais."],
  ["Tedesco", "Panificação", "Equipamentos para panificação profissional."],
  ["Tita", "Bancada", "Equipamentos de apoio para cozinhas profissionais."],
  ["Tramontina", "Bancada", "Utensílios e equipamentos para operações profissionais."],
  ["Tramontina Primia", "Bancada", "Linha de equipamentos e utensílios profissionais."],
  ["Universal", "Processamento", "Equipamentos para preparo e processamento."],
  ["Venâncio", "Cocção", "Equipamentos profissionais para cozinhas e panificação."],
  ["Vitamix", "Processamento", "Liquidificadores profissionais para alta demanda."],
].map(([name, category, description], index) => ({ name, category, description, index }));

export const brandSlug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const filters = ["Todas", "Cocção", "Refrigeração", "Panificação", "Processamento", "Bancada", "Água"];

export default function BrandsExperience({ onAssist }: { onAssist: () => void }) {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [filter, setFilter] = useState("Todas");
  const [activeName, setActiveName] = useState("Rational");

  const filtered = useMemo(() => (filter === "Todas" ? brands : brands.filter((brand) => brand.category === filter)), [filter]);
  const active = filtered.find((brand) => brand.name === activeName) ?? filtered[0] ?? brands[0];
  const activeIndex = filtered.findIndex((brand) => brand.name === active.name);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveName((current) => {
        const currentIndex = Math.max(0, filtered.findIndex((brand) => brand.name === current));
        return filtered[(currentIndex + 1) % filtered.length]?.name ?? current;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [filtered, visible, reducedMotion]);

  return (
    <section ref={section} id="marcas" className="brands-experience bg-[#f0f2f2] py-20 sm:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-[#128c68]">MARCAS ATENDIDAS</p>
            <h2 className="section-title mt-4">Marcas que fazem parte da nossa experiência.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-[#66747d]">
              Tecnologia, equipamentos e conhecimento técnico acumulados ao longo da nossa trajetória.
            </p>
            <div className="mt-10 flex items-end gap-3 border-t border-[#cbd2d4] pt-5">
              <strong className="text-6xl font-black tracking-[-.08em] text-[#142b3a]">{brands.length}</strong>
              <span className="pb-2 text-[11px] font-black uppercase tracking-[.18em] text-[#128c68]">
                marcas
                <br />
                atendidas
              </span>
            </div>
            <div className="mt-10 border-l-2 border-[#f1a51b] pl-4">
              <p className="eyebrow text-[#142b3a]">{active.category}</p>
              <h3 className="mt-2 text-2xl font-black">{active.name}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#66747d]">{active.description}</p>
              <button onClick={onAssist} className="link-arrow mt-5">
                Enviar equipamento <ArrowRight size={16} />
              </button>
            </div>
            <div className="mt-10 text-[11px] font-black uppercase tracking-[.16em] text-[#7c898f]">
              <span className="text-[#142b3a]">{String(activeIndex + 1).padStart(2, "0")}</span> /{" "}
              {String(filtered.length).padStart(2, "0")}
            </div>
          </div>

          <div>
            <div className="brands-filter-row mb-6 flex gap-2 overflow-x-auto pb-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setFilter(item);
                    setActiveName(item === "Todas" ? "Rational" : (brands.find((brand) => brand.category === item)?.name ?? "Rational"));
                  }}
                  className={`brand-filter ${filter === item ? "is-active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="brand-editorial-grid">
              {filtered.map((brand, index) => (
                <Link
                  key={brand.name}
                  href={`/marcas/${brandSlug(brand.name)}`}
                  onMouseEnter={() => setActiveName(brand.name)}
                  onFocus={() => setActiveName(brand.name)}
                  onClick={() => setActiveName(brand.name)}
                  className={`brand-tile ${active.name === brand.name ? "is-featured" : ""}`}
                >
                  <div className="brand-tile-inner">
                    <span className="brand-tile-wordmark">{brand.name}</span>
                    <span className="brand-tile-category">{brand.category}</span>
                    <span className="brand-tile-cta">
                      Explorar <ArrowRight size={14} />
                    </span>
                    <ChevronDown className="brand-mobile-chevron" size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="brands-transition mt-16 grid gap-6 border-t border-[#cbd2d4] pt-10 sm:grid-cols-[.8fr_1.2fr] sm:items-end">
          <div className="flex items-end gap-6">
            <div>
              <strong className="block text-5xl font-black tracking-[-.08em] text-[#142b3a]">{brands.length}</strong>
              <span className="eyebrow text-[#128c68]">marcas</span>
            </div>
            <div className="pb-1 text-3xl text-[#f1a51b]">↓</div>
            <div>
              <strong className="block text-5xl font-black tracking-[-.08em] text-[#142b3a]">1</strong>
              <span className="eyebrow text-[#128c68]">equipe técnica</span>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#66747d]">
            Cada marca atendida representa anos de instalação, manutenção e convívio com o equipamento em campo — é
            essa experiência que a Limaq leva para o diagnóstico da sua operação.
          </p>
        </div>
      </div>
    </section>
  );
}
