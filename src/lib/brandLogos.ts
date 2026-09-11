/**
 * Logos locais das marcas atendidas.
 *
 * Contrato: solte o arquivo em `src/assets/logos/<slug>.png` (ou jpg/svg/webp)
 * e ele entra neste mapa automaticamente, sem alterar código — ver
 * `src/assets/logos/README.md` para a convenção de nomes.
 *
 * Enquanto não existe arquivo local, o tile cai para o CDN oficial da marca e,
 * por último, para o wordmark tipográfico (o tile nunca fica vazio).
 */
const files = import.meta.glob("../assets/logos/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const localBrandLogos: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => {
    const file = path.split("/").pop() ?? "";
    const slug = file
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return [slug, url];
  }),
);

/** Logo local da Limaq, se existir em `src/assets/logo.*` — senão, undefined. */
const limaqFiles = import.meta.glob("../assets/logo.*", { eager: true, import: "default" }) as Record<
  string,
  string
>;
export const localLimaqLogo: string | undefined = Object.values(limaqFiles)[0];
