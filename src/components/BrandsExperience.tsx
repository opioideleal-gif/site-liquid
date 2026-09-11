import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { localBrandLogos } from "@/lib/brandLogos";

/**
 * Logotipos oficiais dos fabricantes (hospedados no CDN de origem da marca).
 * São tratados como progressive enhancement: se a imagem falhar (CDN fora,
 * hotlink bloqueado), o tile cai para o wordmark tipográfico local — o
 * conteúdo e a navegação nunca dependem da imagem para existir.
 */
const base = "https://images.squarespace-cdn.com/content/v1/6a56d13ce4d0b80e6de9f3fe";
const logos: Record<string, string> = {
  "Bras Sulamericana": `${base}/476cebbf-28b3-4bb9-a63c-72f13608884e/09_Bras_Sulamericana.png`,
  "Elvi Cozinhas": `${base}/9df640de-b35c-46b7-8317-7f1de1d0ec99/13_Elvi_Cozinhas.png`,
  Everest: `${base}/f436055f-7ec3-44d5-a8a4-69e78321eb1a/14_Everest.png`,
  Gastromaq: `${base}/86109bdb-8c92-40ed-9ddf-2d1fd8d78e55/15_Gastromaq.png`,
  Gerbelli: `${base}/2cdbfed1-cc87-450a-bd3e-857b0c03d33e/16_Gerbelli.png`,
  "G.Paniz": `${base}/48ac22fe-2a55-4275-9a89-01561a31581d/17_G.Paniz.png`,
  Grano: `${base}/da4059ab-7eef-4c51-88f6-102f3922d3f8/18_Grano.png`,
  Granomaq: `${base}/c11a89c5-419f-46f1-9934-7df4c03fda2a/19_Granomaq.png`,
  Gural: `${base}/b76f3a69-733e-4034-b61b-c17014a1a957/20_Gural.png`,
  Hobart: `${base}/12d9ef59-e2f4-4410-9e1a-4969bab04285/21_Hobart.png`,
  IBBL: `${base}/e4ab7588-f43b-4fe1-8a23-aefa5ea82021/22_IBBL.png`,
  Maquipão: `${base}/1c04b88a-436c-4aea-891b-3464bf3ba054/23_Maquipao.png`,
  Marchesoni: `${base}/ab7c52fb-9452-42b9-a8f6-73bbb7b5d4e0/24_Marchesoni.png`,
  Metalcubas: `${base}/ce5c9613-4027-4c1c-85c7-2c10125a5084/25_Metalcubas.png`,
  Metalmaq: `${base}/effdc3fb-9229-4bd6-8a84-97d771d3bcc3/26_Metalmaq.png`,
  Metvisa: `${base}/1130067a-1c09-4d28-9827-94ab9a6a8a58/27_Metvisa.png`,
  Monarcha: `${base}/9cf9440b-3ca2-4fc1-8fae-eaa281bda167/28_Monarcha.png`,
  Multifritas: `${base}/9ea4e46d-be53-47a2-8d35-fd3eac1a25bd/29_Multifritas.png`,
  Palladium: `${base}/b457260f-ac6c-4d84-a6ea-f90702744d60/30_Palladium.png`,
  "Planeta Água": `${base}/8d0c4beb-ac94-4b1d-ad6b-29f1a1780998/31_Planeta_Agua.png`,
  "P.Pienk": `${base}/0288f635-2176-4038-811b-004315e6c3b0/32_PPienk.png`,
  Prática: `${base}/6c141ddb-22f8-41cb-8cfc-4bb0452d25ea/33_Pratica.png`,
  Progas: `${base}/9a0bd398-e4e1-4e47-a5de-8432d360f80e/34_Progas.png`,
  Rational: `${base}/df01997f-31c0-43c9-b4a0-b60fa74fb863/35_Rational.png`,
  "Robot Coupe": `${base}/f32a64ca-9a1f-499b-8a56-947e70fdbe1f/36_Robot_Coupe.png`,
  Sirman: `${base}/20388bdb-e2ec-4c35-a0d9-c4577479c8af/37_Sirman.png`,
  Skymsen: `${base}/eb7cf1aa-989d-4893-b597-c0ff0ddef44d/38_Skymsen.png`,
  "Soft by Everest": `${base}/433d333e-98e3-44de-a660-598ab234c5e0/39_Soft_by_Everest.png`,
  Tedesco: `${base}/e244f6c6-2969-4fea-ab51-fd58bc79a7f5/40_Tedesco.png`,
  Tita: `${base}/c2297d00-c8f8-4fc0-829a-ba887b595811/41_Tita.png`,
  Tramontina: `${base}/dac80d3a-0cef-4f12-890d-05579bdfb9f6/42_Tramontina.png`,
  "Tramontina Primia": `${base}/1eb8854e-c887-4080-8d4a-6950d661d046/43_Tramontina_Primia.png`,
  Universal: `${base}/612147e9-565d-425f-8fb5-503436c0f8a6/44_Universal.png`,
  Venâncio: `${base}/ad8d8edf-e4af-4512-9a1e-e46ff10f7362/45_Venancio.png`,
  Vitamix: `${base}/f12d375f-4096-4f85-958a-9f0675a54f4c/46_Vitamix.png`,
};

/**
 * Cadeia de fallback do logotipo, na ordem:
 * 1. arquivo local em `src/assets/logos/<slug>.*` (confiável, versionado);
 * 2. URL oficial no CDN de origem da marca;
 * 3. wordmark tipográfico local — o tile nunca fica vazio nem depende de rede.
 */
function BrandMark({ name }: { name: string }) {
  const [stage, setStage] = useState(0);
  const sources = [localBrandLogos[brandSlug(name)], logos[name]].filter(Boolean) as string[];
  const src = sources[stage];
  if (!src) return <span className="brand-tile-wordmark">{name}</span>;
  return (
    <img
      src={src}
      alt={`Logo ${name}`}
      loading="lazy"
      decoding="async"
      className="brand-tile-logo"
      onError={() => setStage((current) => current + 1)}
    />
  );
}

export const brands = [
  ["Aquaplus", "Água", "Purificadores e soluções de água para ambientes profissionais."],
  ["Arke", "Refrigeração", "Cervejeiras, frigobares e conservação para o seu ponto de venda."],
  ["Begel", "Refrigeração", "Refrigeração comercial para conservação e exposição."],
  ["Belliere", "Água", "Bebedouros e soluções de água para alta demanda."],
  ["Bermar", "Processamento", "Máquinas para preparo, corte e processamento de alimentos."],
  ["Bimg", "Panificação", "Fornos e equipamentos para produção de panificação."],
  ["Braesi", "Refrigeração", "Refrigeração comercial e expositores para food service."],
  ["Bras Sulamericana", "Refrigeração", "Sistemas de refrigeração comercial e conservação."],
  ["CAF Máquinas", "Panificação", "Máquinas para panificação e confeitaria profissional."],
  ["Cozil", "Cocção", "Equipamentos de cocção para cozinhas profissionais."],
  ["Croydon", "Água", "Bebedouros e purificadores para operações profissionais."],
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
  ["Vulcan", "Cocção", "Equipamentos profissionais de cocção de alta performance."],
  ["Wictory", "Cocção", "Soluções de cocção e fritura para food service."],
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
  const [filter, setFilter] = useState("Todas");
  const [activeName, setActiveName] = useState("Rational");

  const filtered = useMemo(() => (filter === "Todas" ? brands : brands.filter((brand) => brand.category === filter)), [filter]);
  const active = filtered.find((brand) => brand.name === activeName) ?? filtered[0] ?? brands[0];
  const activeIndex = filtered.findIndex((brand) => brand.name === active.name);

  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !motionAllowed) return;
    const timer = window.setInterval(() => {
      setActiveName((current) => {
        const currentIndex = Math.max(0, filtered.findIndex((brand) => brand.name === current));
        return filtered[(currentIndex + 1) % filtered.length]?.name ?? current;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [filtered, visible, motionAllowed]);

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
                    <BrandMark name={brand.name} />
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
