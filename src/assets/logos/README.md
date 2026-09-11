# Logos das marcas atendidas

Solte aqui o arquivo de cada fabricante para ele aparecer automaticamente no site
(sem alterar código e sem depender de CDN externo).

## Convenção de nome

O nome do arquivo deve ser o **slug da marca** — o mesmo que aparece na URL
`/marcas/<slug>` — gerado assim: minúsculas, sem acentos, espaços viram `-`.

Exemplos:

| Marca            | Arquivo                    |
|------------------|----------------------------|
| G.Paniz          | `g-paniz.png`              |
| Bras Sulamericana| `bras-sulamericana.png`    |
| Robot Coupe      | `robot-coupe.png`          |
| Tramontina Primia| `tramontina-primia.png`    |
| Planeta Água     | `planeta-agua.png`         |

Formatos aceitos: `.png` (preferido, fundo transparente), `.svg`, `.webp`, `.jpg`.

## Ordem de exibição no tile

1. arquivo local desta pasta (se existir);
2. URL oficial do CDN de origem da marca (se carregar);
3. wordmark tipográfico local (nunca deixa o tile vazio).

A logo da Limaq segue a mesma lógica: solte o arquivo em `src/assets/logo.png`
(ou `.svg`/`.webp`) que ele vira a logo principal do header/footer.
