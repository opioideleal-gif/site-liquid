import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Wrench } from "lucide-react";
import { products } from "@/lib/catalog";

const steps = [
  ["01", "Diagnóstico", "Entendemos o sintoma, investigamos a causa e explicamos o caminho mais seguro para sua operação.", products[0].image, "#e9eff0"],
  ["02", "Manutenção", "Cuidamos do equipamento com método, clareza e atenção ao que realmente precisa ser feito.", products[1].image, "#e3ece8"],
  ["03", "Instalação", "Colocamos a solução no lugar certo, com orientação para extrair o melhor desempenho.", products[3].image, "#f2eadc"],
  ["04", "Peças", "Avaliamos componentes e possibilidades para reduzir o tempo de parada.", products[4].image, "#e9e5e1"],
  ["05", "Suporte", "Depois da entrega, a Limaq continua perto para sua operação seguir funcionando.", products[5].image, "#dce8ec"],
] as const;

export default function StickyAssistance() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => { const update = () => { if (!section.current) return; const rect = section.current.getBoundingClientRect(); const travel = Math.max(1, section.current.offsetHeight - window.innerHeight); const progress = Math.min(1, Math.max(0, -rect.top / travel)); setStep(Math.min(steps.length - 1, Math.floor(progress * steps.length))); }; update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); }; }, []);
  const active = steps[step];
  return <section ref={section} id="assistencia-sticky" className="sticky-assistance" style={{ "--sticky-bg": active[4] } as CSSProperties}><div className="sticky-assistance-inner"><div className="container grid min-h-screen gap-10 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20"><div className="sticky-assistance-visual"><div className="sticky-assistance-image-wrap"><img key={active[3]} src={active[3]} alt={`Equipamento relacionado a ${active[1]}`} className="sticky-assistance-image" /><div className="sticky-assistance-label"><Wrench size={15} /> ASSISTÊNCIA TÉCNICA LIMAQ</div></div></div><div className="sticky-assistance-copy"><p className="eyebrow text-[#128c68]">A OPERAÇÃO NÃO PODE PARAR</p><h2 className="section-title mt-4">Assistência técnica<br /> que acompanha o ritmo.</h2><div className="mt-10 flex items-start gap-5"><div className="sticky-progress"><span style={{ height: `${((step + 1) / steps.length) * 100}%` }} /></div><div className="min-h-[245px]"><div className="flex items-center gap-4"><strong className="sticky-step-number">{active[0]}</strong><span className="eyebrow text-[#7c898f]">{String(step + 1).padStart(2, "0")} / 05</span></div><h3 className="mt-4 text-4xl font-black tracking-[-.06em] text-[#142b3a]">{active[1]}</h3><p className="mt-4 max-w-md text-base leading-7 text-[#66747d]">{active[2]}</p><div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#128c68]"><Check size={16} /> Atendimento em Belém e região metropolitana</div></div></div><a href="#contato" className="button-primary mt-5">Falar com especialista <ArrowRight size={17} /></a></div></div></div></section>;
}
