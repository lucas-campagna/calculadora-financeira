import type { Locale } from '$lib/i18n';

export const aboutContent: Record<Locale, string> = {
  pt: `## O que é a Calculadora de Financiamento?

A Calculadora de Financiamento é uma ferramenta educacional gratuita que permite simular e comparar diferentes sistemas de amortização para financiamentos no Brasil. Seja um financiamento imobiliário, de veículo ou pessoal, esta calculadora ajuda a visualizar como cada sistema afeta o valor das parcelas, os juros pagos e o custo total ao longo do tempo.

A ferramenta foi desenvolvida com foco em transparência e educação financeira, permitindo que tomadores de decisão compreendam profundamente os compromissos antes de assinar um contrato de financiamento.

## Sistemas de Amortização

### PRICE (Tabela Price)

O sistema PRICE é o mais utilizado no Brasil para financiamentos imobiliários. Nele, as parcelas são fixas durante todo o período do financiamento. Isso significa que o valor que você paga mês a mês não muda. No entanto, a composição da parcela varia: nos primeiros meses, uma maior proporção do pagamento é destinada aos juros, enquanto a amortização (redução do saldo devedor) é menor. Com o tempo, essa proporção se inverte, e a amortização passa a representar a maior parte da parcela.

**Vantagens:** Parcelas fixas facilitam o planejamento mensal do orçamento.

**Desvantagens:** O total de juros pagos é geralmente maior em comparação com o SAC, pois o saldo devedor permanece elevado por mais tempo.

### SAC (Sistema de Amortização Constante)

No SAC, a amortização é constante em cada parcela. Isso significa que a cada mês, você reduz o saldo devedor na mesma proporção. Como os juros são calculados sobre o saldo devedor, as parcelas são decrescentes: começam mais altas e vão diminuindo ao longo do tempo.

**Vantagens:** O total de juros pagos é menor, pois o saldo devedor é reduzido mais rapidamente. Além disso, a parcela decrescente pode facilitar o aumento da renda ao longo dos anos.

**Desvantagens:** As primeiras parcelas são mais altas, o que pode comprometer o orçamento inicial do mutuário.

### SAM (Sistema de Amortização Mista)

O SAM é uma combinação dos sistemas PRICE e SAC. Nele, a parcela começa com um valor intermediário entre os dois sistemas e vai se aproximando do valor do PRICE ao longo do tempo. O objetivo é equilibrar as desvantagens de cada sistema, oferecendo parcelas mais estáveis que o SAC, mas com juros totais menores que o PRICE puro.

**Vantagens:** Parcelas mais equilibradas ao longo do contrato, com compromisso entre o custo total e a previsibilidade do orçamento.

**Desvantagens:** Não é tão comum quanto o PRICE ou SAC, e alguns produtos financeiros podem não oferecer essa modalidade.

### Americano (Sistema Americano de Amortização)

No sistema americano, o mutuário paga apenas os juros durante a maior parte do contrato, e o principal (amortização) é pago de forma diluída ou em uma única parcela no final (conhecida como "balloon payment" ou parcela balão). É comum em financiamentos de curto prazo ou em operações imobiliárias onde o comprador pretende revender o imóvel antes do vencimento.

**Vantagens:** Parcelas iniciais muito baixas, pois apenas os juros são pagos mensalmente.

**Desvantagens:** Risco elevado, pois o saldo devedor permanece alto durante todo o contrato. Se o mutuário não tiver planejado a quitação, pode enfrentar dificuldades financeiras ao final do prazo.

## Como Usar a Calculadora

1. **Insira o valor financiado:** Digite o valor total que deseja financiar, descontando o valor da entrada.
2. **Informe a taxa de juros:** Consulte a taxa de juros oferecida pela instituição financeira. Essa taxa pode ser fixa ou variável.
3. **Defina o prazo:** Escolha o número de meses para quitar o financiamento.
4. **Selecione o sistema de amortização:** Escolha entre PRICE, SAC, SAM ou Americano.
5. **Visualize os resultados:** Veja o valor de cada parcela, o total de juros, o custo total e a tabela de amortização completa.
6. **Compare cenários:** Crie múltiplos estudos para comparar diferentes sistemas, valores ou prazos lado a lado.
7. **Simule parcelas extras:** Adicione parcelas extras para ver como isso impacta o prazo total e os juros pagos.

## Metodologia

A calculadora utiliza fórmulas matemáticas padrão para cada sistema de amortização:

- **PRICE:** Utiliza a fórmula de juros compostos para calcular parcelas fixas, onde cada parcela é composta por amortização + juros sobre o saldo devedor.
- **SAC:** A amortização é calculada dividindo o valor financiado pelo número de parcelas. Os juros são calculados sobre o saldo devedor remanescente a cada período.
- **SAM:** Combina as fórmulas do PRICE e SAC, ajustando progressivamente a composição da parcela.
- **Americano:** Os juros são calculados sobre o saldo devedor, com amortização definida conforme as condições do contrato.

Todos os cálculos são baseados em taxa de juros composta mensal, que é o padrão para financiamentos no Brasil.

## Aviso Legal

Esta ferramenta é estritamente educacional e não substitui o aconselhamento financeiro profissional. Os resultados apresentados são estimativas baseadas nos dados inseridos pelo usuário e podem não refletir condições reais de mercado, como taxas administrativas, seguros obrigatórios, impostos ou outras cobranças adicionais.

Antes de tomar qualquer decisão financeira, consulte um profissional qualificado, como um consultor financeiro ou um advogado especializado em direito bancário.

## Privacidade

A Calculadora de Financiamento não coleta, armazena ou transmite dados pessoais dos usuários. Todos os cálculos são realizados localmente no navegador, e nenhuma informação é enviada a servidores externos. Os dados inseridos permanecem apenas no seu dispositivo.

## Nossa Equipe

A Calculadora de Financiamento foi desenvolvida por três irmãos com experiências complementares no universo financeiro e tecnológico:

- **Lucas Prett Campagna** — Desenvolvedor de Software na HP
- **Daniel Prett Campagna** — Analista de Dados na 7D Analytics
- **André Prett Campagna** — Gerente Bancário no Sicred

Conheça mais sobre cada autor na nossa página de [autor](autor).

## Contato

Em caso de dúvidas ou sugestões, entre em contato através do repositório do projeto no GitHub.`,
  en: `## What Is the Financing Calculator?

The Financing Calculator is a free educational tool that lets you simulate and compare different amortization systems for loans in Brazil. Whether you are financing a home, a vehicle, or taking out a personal loan, this calculator helps you see how each system affects your installments, the interest paid, and the total cost over time.

The tool was developed with a focus on transparency and financial education, helping borrowers understand their commitments deeply before signing a financing agreement.

## Amortization Systems

### PRICE (Price Table)

The PRICE system is the most widely used in Brazil for home financing. Under it, installments stay fixed for the entire financing term. In other words, the amount you pay month after month does not change. However, the composition of each installment does change: in the early months, a larger share of the payment goes toward interest, while amortization (the reduction of the outstanding balance) is smaller. Over time, this ratio reverses, and amortization comes to make up most of the installment.

**Advantages:** Fixed installments make monthly budgeting easier.

**Disadvantages:** The total interest paid is generally higher than with SAC, because the outstanding balance remains high for longer.

### SAC (Constant Amortization System)

Under SAC, the amortization amount is constant in every installment. That means that each month you reduce the outstanding balance by the same amount. Since interest is calculated on the outstanding balance, installments decline over time: they start higher and gradually get smaller.

**Advantages:** The total interest paid is lower because the outstanding balance is reduced more quickly. In addition, declining installments can accommodate growing income over the years.

**Disadvantages:** The early installments are higher, which can strain the borrower's initial budget.

### SAM (Mixed Amortization System)

SAM combines the PRICE and SAC systems. The installment starts at an amount somewhere between the two systems and gradually approaches the PRICE amount over time. The goal is to balance the drawbacks of each system, offering installments that are more stable than SAC but with lower total interest than pure PRICE.

**Advantages:** More balanced installments over the life of the contract, striking a compromise between total cost and budget predictability.

**Disadvantages:** It is less common than PRICE or SAC, and some financial products may not offer this option.

### American (American Amortization System)

Under the American system, the borrower pays only interest for most of the contract, and the principal (amortization) is paid either in installments spread out over time or in a single payment at the end (known as a "balloon payment" or, in Portuguese, a "parcela balão"). This is common in short-term financing or in real estate deals where the buyer intends to resell the property before the term ends.

**Advantages:** Very low initial installments, since only interest is paid each month.

**Disadvantages:** High risk, because the outstanding balance stays high throughout the contract. If the borrower has not planned for the final payment, they may face financial difficulties at the end of the term.

## How to Use the Calculator

1. **Enter the financed amount:** Type the total amount you want to finance, after subtracting the down payment.
2. **Enter the interest rate:** Check the interest rate offered by the financial institution. This rate may be fixed or variable.
3. **Set the term:** Choose the number of months in which to repay the financing.
4. **Select the amortization system:** Choose among PRICE, SAC, SAM, or American.
5. **View the results:** See the amount of each installment, the total interest, the total cost, and the full amortization schedule.
6. **Compare scenarios:** Create multiple studies to compare different systems, amounts, or terms side by side.
7. **Simulate extra payments:** Add extra installments to see how they affect the overall term and the interest paid.

## Methodology

The calculator uses standard mathematical formulas for each amortization system:

- **PRICE:** Uses the compound-interest formula to calculate fixed installments, where each installment consists of amortization plus interest on the outstanding balance.
- **SAC:** Amortization is calculated by dividing the financed amount by the number of installments. Interest is calculated on the remaining outstanding balance each period.
- **SAM:** Combines the PRICE and SAC formulas, progressively adjusting the composition of each installment.
- **American:** Interest is calculated on the outstanding balance, with amortization set according to the contract terms.

All calculations are based on monthly compound interest, which is the standard for financing in Brazil.

## Legal Disclaimer

This tool is strictly educational and does not replace professional financial advice. The results shown are estimates based on data entered by the user and may not reflect real market conditions, such as administrative fees, mandatory insurance, taxes, or other additional charges.

Before making any financial decision, consult a qualified professional, such as a financial advisor or a lawyer specializing in banking law.

## Privacy

The Financing Calculator does not collect, store, or transmit users' personal data. All calculations are performed locally in your browser, and no information is sent to external servers. The data you enter stays only on your device.

## Our Team

The Financing Calculator was developed by three brothers with complementary backgrounds in finance and technology:

- **Lucas Prett Campagna** — Software Developer at HP
- **Daniel Prett Campagna** — Data Analyst at 7D Analytics
- **André Prett Campagna** — Banking Manager at Sicred (a Brazilian credit cooperative)

Learn more about each author on our [author](autor) page.

## Contact

If you have any questions or suggestions, please get in touch through the project's GitHub repository.`
};
