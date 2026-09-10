import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

const solutions = [
  ["01", "Restaurantes", "Fluxo, cocção e refrigeração para servir com consistência.", "#128c68"],
  ["02", "Pizzarias", "Equipamentos para ganhar ritmo sem abrir mão do padrão.", "#f1a51b"],
  ["03", "Padarias", "Panificação profissional para transformar produção em rotina.", "#d66e46"],
  ["04", "Supermercados", "Conservação, exposição e processamento em escala.", "#3c7a9c"],
  ["05", "Cafeterias", "Bancada compacta, eficiente e pronta para o atendimento.", "#8f6b51"],
  ["06", "Hotéis", "Estrutura técnica para operações que não podem parar.", "#4f6874"],
] as const;

export default function SolutionsStack() {
  return <section id="solucoes" className="solutions-stack bg-[#f6f7f8] py-20 sm:py-28"><div className="container"><div className="max-w-2xl"><p className="eyebrow text-[#128c68]">PARA CADA OPERAÇÃO</p><h2 className="section-title mt-4">Soluções para sua operação.</h2><p className="mt-5 max-w-lg text-sm leading-6 text-[#66747d]">Da primeira bancada ao parque completo de equipamentos, a Limaq ajuda a construir um fluxo que funciona.</p></div><div className="solutions-stack-list mt-14">{solutions.map(([number, title, description, accent], index) => <article key={number} className="solution-panel" style={{ "--solution-accent": accent, zIndex: index + 1 } as CSSProperties}><div className="flex items-start justify-between gap-8"><span className="solution-number">{number}</span><span className="solution-index">{String(index + 1).padStart(2, "0")} / 06</span></div><div className="mt-24 grid gap-6 sm:mt-32 sm:grid-cols-[1fr_auto] sm:items-end"><div><h3>{title}</h3><p>{description}</p></div><a href="#assistencia" className="solution-cta">Falar com especialista <ArrowRight size={17} /></a></div></article>)}</div></div></section>;
}
