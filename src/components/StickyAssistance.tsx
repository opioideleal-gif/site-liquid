import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Wrench } from "lucide-react";
import { useMediaQuery, useMotionAllowed } from "@/hooks/useMotionAllowed";
import { products } from "@/lib/catalog";

const steps = [
  ["01", "Diagnóstico", "Entendemos o sintoma, investigamos a causa e explicamos o caminho mais seguro para sua operação.", products[0].image, "#e9eff0"],
  ["02", "Manutenção", "Cuidamos do equipamento com método, clareza e atenção ao que realmente precisa ser feito.", products[1].image, "#e3ece8"],
  ["03", "Instalação", "Colocamos a solução no lugar certo, com orientação para extrair o melhor desempenho.", products[3].image, "#f2eadc"],
  ["04", "Peças", "Avaliamos componentes e possibilidades para reduzir o tempo de parada.", products[4].image, "#e9e5e1"],
  ["05", "Suporte", "Depois da entrega, a Limaq continua perto para sua operação seguir funcionando.", products[5].image, "#dce8ec"],
] as const;

/**
 * Seção de assistência em 5 passos.
 *
 * O "pin" (bloco sticky de ~285vh controlado por scroll) é tratado como efeito
 * EXPERIMENTAL: só roda em desktop E com motion ligado. Em qualquer outra
 * situação (mobile, `prefers-reduced-motion`, `VITE_MOTION_ENABLED=false`) o
 * conteúdo é renderizado empilhado, com scroll nativo e todos os passos
 * visíveis — o conteúdo nunca depende da animação para existir.
 */
export default function StickyAssistance() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const motionAllowed = useMotionAllowed();
  const pinned = motionAllowed && !isMobile;

  useEffect(() => {
    if (!pinned) return;
    const update = () => {
      const node = section.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(1, node.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setStep(Math.min(steps.length - 1, Math.floor(progress * steps.length)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pinned]);

  if (!pinned) {
    return (
      <section id="assistencia-sticky" className="assistance-stacked">
        <div className="container">
          <p className="eyebrow text-[#128c68]">A OPERAÇÃO NÃO PODE PARAR</p>
          <h2 className="section-title mt-4">
            Assistência técnica
            <br /> que acompanha o ritmo.
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {steps.map(([number, title, description, image]) => (
              <article key={number} className="assist-step">
                <div className="assist-step-image">
                  <img src={image} alt={`Equipamento relacionado a ${title}`} loading="lazy" />
                  <div className="sticky-assistance-label">
                    <Wrench size={15} /> ASSISTÊNCIA TÉCNICA LIMAQ
                  </div>
                </div>
                <div>
                  <strong className="sticky-step-number">{number}</strong>
                  <h3 className="mt-3 text-2xl font-black tracking-[-.05em] text-[#142b3a]">{title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#66747d]">{description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#128c68]">
                    <Check size={16} /> Atendimento em Belém e região metropolitana
                  </div>
                </div>
              </article>
            ))}
          </div>
          <a href="#contato" className="button-primary mt-12">
            Falar com especialista <ArrowRight size={17} />
          </a>
        </div>
      </section>
    );
  }

  const active = steps[step];
  return (
    <section
      ref={section}
      id="assistencia-sticky"
      className="sticky-assistance"
      style={{ "--sticky-bg": active[4] } as React.CSSProperties}
    >
      <div className="sticky-assistance-inner">
        <div className="container grid min-h-screen gap-10 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="sticky-assistance-visual">
            <div className="sticky-assistance-image-wrap">
              <img key={active[3]} src={active[3]} alt={`Equipamento relacionado a ${active[1]}`} className="sticky-assistance-image" />
              <div className="sticky-assistance-label">
                <Wrench size={15} /> ASSISTÊNCIA TÉCNICA LIMAQ
              </div>
            </div>
          </div>
          <div className="sticky-assistance-copy">
            <p className="eyebrow text-[#128c68]">A OPERAÇÃO NÃO PODE PARAR</p>
            <h2 className="section-title mt-4">
              Assistência técnica
              <br /> que acompanha o ritmo.
            </h2>
            <div className="mt-10 flex items-start gap-5">
              <div className="sticky-progress">
                <span style={{ height: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
              <div className="min-h-[245px]">
                <div className="flex items-center gap-4">
                  <strong className="sticky-step-number">{active[0]}</strong>
                  <span className="eyebrow text-[#7c898f]">
                    {String(step + 1).padStart(2, "0")} / 05
                  </span>
                </div>
                <h3 className="mt-4 text-4xl font-black tracking-[-.06em] text-[#142b3a]">{active[1]}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-[#66747d]">{active[2]}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#128c68]">
                  <Check size={16} /> Atendimento em Belém e região metropolitana
                </div>
              </div>
            </div>
            <a href="#contato" className="button-primary mt-5">
              Falar com especialista <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
