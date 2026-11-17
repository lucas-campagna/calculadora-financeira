> 🇺🇸 [Read this README in English](README.md)

# Calculadora de Financiamento

Uma aplicação web gratuita e educacional para simular e comparar financiamentos no Brasil. Ela calcula sistemas de amortização **PRICE**, **SAC**, **SAM** e **Americano**, permite testar diferentes cenários lado a lado e mostra exatamente quanto de juros você pagaria ao longo do tempo.

A interface da aplicação está atualmente em português brasileiro.

## Funcionalidades

- **Quatro sistemas de amortização:** PRICE (parcelas fixas), SAC (amortização constante), SAM (misto) e Americano (juros durante o prazo com parcela balão final).
- **Múltiplos estudos:** crie, clone, renomeie e defina cores das simulações para comparar sistemas, valores, taxas ou prazos ao mesmo tempo. Os campos podem ser travados por estudo, permitindo que cada cenário sobrescreva os valores compartilhados.
- **Aportes extras:** adicione pagamentos pontuais que reduzem o valor da parcela ou encurtam o prazo do financiamento.
- **Resultados detalhados:** primeira e última parcela, total pago, total de juros, taxa efetiva, tabela de amortização completa e gráfico comparativo. Clique em um ponto do gráfico ou em uma linha da tabela para adicionar um aporte extra naquele mês.
- **Compartilhamento e exportação:** copie um link completo com o estado da simulação (comprimido na própria URL) ou exporte o estudo ativo em CSV ou PDF.
- **Funciona offline:** PWA instalável com service worker, layout responsivo para celular e desktop e suporte a temas claro e escuro.
- **Privado por padrão:** todos os cálculos são feitos localmente no navegador. Os estudos ficam salvos no `localStorage` e nenhum dado pessoal é enviado a servidores.

> Esta ferramenta é estritamente educacional e não substitui aconselhamento financeiro. Os resultados são estimativas e podem não incluir taxas administrativas, seguros, impostos ou outras cobranças.

## Tecnologias

| Área | Ferramentas |
| --- | --- |
| Framework | [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev), TypeScript |
| Estilo / UI | Tailwind CSS 4, bits-ui, ícones Lucide, Embla Carousel |
| Funcionalidades | Chart.js, jsPDF, PapaParse, lz-string (links de compartilhamento), vite-plugin-pwa |
| Ferramentas | Vite, Vitest, Prettier, svelte-check |
| Saída | Site estático via `@sveltejs/adapter-static` |

## Começando

Pré-requisitos: **Node.js 20+** e npm.

```sh
npm install
npm run dev
```

Acesse <http://localhost:5173>. Para usar outro host/porta, execute `npm run dev -- --host 0.0.0.0 --port 3000` (o host padrão já é `0.0.0.0`).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera o site estático em `build/`. |
| `npm run preview` | Visualiza a versão de produção localmente. |
| `npm run check` | Executa svelte-check e diagnósticos do TypeScript. |
| `npm run check:watch` | Executa a checagem de tipos em modo watch. |
| `npm test` | Executa os testes com Vitest (modo watch). Use `npm test -- --run` para uma execução única. |
| `npm run test:ui` | Abre a interface do Vitest. |

## Estrutura do projeto

```text
src/
├── lib/
│   ├── calculator/   # Algoritmos de amortização, tipos e formatação
│   ├── components/   # Formulário, resultados, gráfico, tabela, exportação e UI
│   └── stores/       # Estado dos estudos, persistência, compartilhamento e anúncios
└── routes/           # Páginas: Calculadora, Comparar, Guias, FAQ, Sobre, Autor
```

Tanto `svelte.config.js` quanto `vite.config.ts` leem a variável de ambiente opcional `SVELTE_BASE_PATH` para permitir deploy em um subdiretório.

## Deploy

O site é totalmente pré-renderizado e publicado como arquivos estáticos:

- **GitHub Pages** — `.github/workflows/deploy.yml` é executado a cada push em `main` e faz o build com `SVELTE_BASE_PATH=/calculadora-financeira`.
- **AWS S3 + CloudFront** — `.github/workflows/deploy-aws.yml` é executado em tags `v*`, faz o build com base vazia, sincroniza `build/` com o bucket configurado e invalida o cache do CloudFront.

Ambos os fluxos exigem os segredos correspondentes configurados no repositório.

## Privacidade e aviso legal

Os cálculos são feitos inteiramente no seu navegador; os dados inseridos e os estudos permanecem no seu dispositivo (exceto quando você copia um link de compartilhamento). Este projeto oferece apenas estimativas educacionais — consulte um profissional qualificado antes de tomar decisões financeiras.
