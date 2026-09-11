import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#142b3a] text-white">
      <header className="border-b border-white/10">
        <div className="container flex h-[76px] items-center">
          <Link href="/" className="flex items-center text-white" aria-label="Limaq — início">
            <BrandLogo variant="light" className="h-12 w-auto" />
          </Link>
        </div>
      </header>
      <main className="container flex flex-1 items-center py-20">
        <div className="max-w-xl">
          <p className="eyebrow text-[#f1a51b]">ERRO 404 • PÁGINA NÃO ENCONTRADA</p>
          <h1 className="mt-6 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
            Essa página saiu
            <br />
            de operação.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65">
            O endereço que você acessou não existe ou foi movido. Volte para o catálogo ou fale com um especialista —
            a operação não pode parar.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="button-primary">
              <ArrowLeft size={16} /> Voltar para a home
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button-ghost"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
          <p className="mt-10 flex items-center gap-2 text-xs text-white/45">
            <Search size={14} /> Procurando um equipamento? Use a busca na página inicial.
          </p>
        </div>
      </main>
    </div>
  );
}
