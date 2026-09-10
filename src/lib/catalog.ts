export type Product = {
  slug: string;
  brand: string;
  name: string;
  model: string;
  category: string;
  price: number;
  priceLabel: string;
  spec: string;
  badge: string;
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
};

export const categories = [
  { name: "Cocção", count: "42 produtos", image: "/manus-storage/combi-oven_175b4b6a.webp" },
  { name: "Refrigeração", count: "28 produtos", image: "/manus-storage/commercial-refrigeration_e04df44d.jpg" },
  { name: "Panificação", count: "19 produtos", image: "/manus-storage/dough-mixer_05e79f9f.jpg" },
  { name: "Bancada", count: "36 produtos", image: "/manus-storage/fryer_f742f6bd.jpg" },
];

const gallery = (image: string) => image.startsWith("/") ? [image, image, image] : [image, `${image}&sat=-20`, `${image}&con=10`];

export const products: Product[] = [
  { slug: "forno-combinado-pratica-fit-express", brand: "PRÁTICA", name: "Forno combinado Fit Express", model: "FEX-4", category: "Cocção", price: 38000, priceLabel: "Consulte", spec: "220V • Elétrico • 4 GN", badge: "Mais procurado", image: "/manus-storage/combi-oven_175b4b6a.webp", gallery: gallery("/manus-storage/combi-oven_175b4b6a.webp"), description: "Forno profissional compacto para operações que precisam de produtividade, precisão e padronização. Consulte a Limaq para disponibilidade, instalação e configuração do equipamento.", specs: { "Capacidade": "4 GN 2/3", "Alimentação": "Elétrica", "Tensão": "220V monofásico", "Potência": "6,4 kW", "Dimensões": "750 × 645 × 590 mm", "Garantia": "Conforme fabricante" } },
  { slug: "processador-skymsen-pa-7l", brand: "SKYMSEN", name: "Processador de alimentos", model: "PA-7L", category: "Bancada", price: 5200, priceLabel: "Consulte", spec: "1/2 CV • 7 litros • Inox", badge: "Disponível", image: "/manus-storage/food-processor_f8cc8f7f.jpg", gallery: gallery("/manus-storage/food-processor_f8cc8f7f.jpg"), description: "Processador de alimentos de bancada para cortes e preparos em cozinhas profissionais, com estrutura resistente e operação simples.", specs: { "Capacidade": "7 litros", "Motor": "1/2 CV", "Tensão": "127V ou 220V", "Material": "Aço inox", "Aplicação": "Cortes e processamento", "Garantia": "Conforme fabricante" } },
  { slug: "bebedouro-industrial-everest-eco-100", brand: "EVEREST", name: "Bebedouro industrial", model: "ECO 100", category: "Refrigeração", price: 9500, priceLabel: "Consulte", spec: "100L/h • Inox • 220V", badge: "Linha profissional", image: "/manus-storage/commercial-refrigeration_e04df44d.jpg", gallery: gallery("/manus-storage/commercial-refrigeration_e04df44d.jpg"), description: "Bebedouro de alta vazão para ambientes profissionais, com reservatório dimensionado para atender equipes e operações de alimentação.", specs: { "Vazão": "100 litros/hora", "Reservatório": "25 litros", "Tensão": "220V", "Refrigeração": "Compressor", "Material": "Aço inox", "Garantia": "Conforme fabricante" } },
  { slug: "amassadeira-g-paniz-am15", brand: "G.PANIZ", name: "Amassadeira espiral", model: "AM-15", category: "Panificação", price: 11500, priceLabel: "Consulte", spec: "15 kg • 2 velocidades • 220V", badge: "Panificação", image: "/manus-storage/dough-mixer_05e79f9f.jpg", gallery: gallery("/manus-storage/dough-mixer_05e79f9f.jpg"), description: "Amassadeira espiral para padarias e cozinhas profissionais que precisam de consistência no preparo de massas.", specs: { "Capacidade de massa": "15 kg", "Velocidades": "2", "Tensão": "220V", "Potência": "1,5 CV", "Material": "Aço carbono pintado", "Garantia": "Conforme fabricante" } },
  { slug: "fatiador-hobart-automatico", brand: "HOBART", name: "Fatiador automático", model: "HS-9", category: "Açougue", price: 26000, priceLabel: "Consulte", spec: "Lâmina 9 • Automático • Inox", badge: "Açougue", image: "/manus-storage/meat-slicer-isolated_27a8ca35.jpg", gallery: gallery("/manus-storage/meat-slicer-isolated_27a8ca35.jpg"), description: "Fatiador profissional para açougues, supermercados e operações que exigem precisão, segurança e ritmo de produção.", specs: { "Lâmina": "9 polegadas", "Operação": "Automática", "Material": "Aço inox", "Regulagem": "Espessura ajustável", "Tensão": "220V", "Garantia": "Conforme fabricante" } },
  { slug: "maquina-de-gelo-everest-120", brand: "EVEREST", name: "Máquina de gelo", model: "EGE-120", category: "Máquinas de gelo", price: 32000, priceLabel: "Consulte", spec: "120 kg/dia • Cubo • 220V", badge: "Food service", image: "/manus-storage/ice-maker_7942a56e.jpg", gallery: gallery("/manus-storage/ice-maker_7942a56e.jpg"), description: "Máquina de gelo para bares, restaurantes e operações que dependem de fornecimento contínuo e previsível.", specs: { "Produção": "Até 120 kg/dia", "Tipo de gelo": "Cubo", "Tensão": "220V", "Refrigeração": "Ar", "Material": "Aço inox", "Garantia": "Conforme fabricante" } },
];

export const brands = ["PRÁTICA", "RATIONAL", "SKYMSEN", "HOBART", "G.PANIZ", "VENÂNCIO", "EVEREST", "GASTROMAQ"];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
