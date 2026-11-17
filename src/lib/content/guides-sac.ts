import type { Locale } from '$lib/i18n';

export const sacGuideContent: Record<Locale, string> = {
  pt: `## O que é o Sistema SAC?

O SAC (Sistema de Amortização Constante) é o segundo método mais utilizado no Brasil para financiamentos, especialmente em operações com recursos do SFH (Sistema Financeiro de Habitação). Diferente do PRICE, onde as parcelas são fixas, no SAC as parcelas são decrescentes ao longo do tempo.

A característica principal do SAC é que o valor da **amortização é constante** em todas as parcelas. Isso significa que, independentemente dos juros, você paga sempre o mesmo valor para reduzir o saldo devedor. Como os juros são calculados sobre o saldo remanescente, o valor total da parcela diminui progressivamente.

### Como funciona o cálculo?

No SAC, a amortização mensal é calculada dividindo-se o valor principal pelo número de parcelas:

**Amortização mensal = Principal / Número de parcelas**

Os juros de cada mês são calculados sobre o saldo devedor do mês anterior:

**Juros do mês = Saldo devedor anterior × Taxa de juros mensal**

A parcela de cada mês é a soma da amortização constante com os juros daquele mês.

### Exemplo prático: Financiamento de R$ 300.000 a 10% ao ano

Vamos simular o mesmo financiamento pelo sistema SAC:
- Valor financiado: R$ 300.000
- Taxa de juros: 10% ao ano (0,83% ao mês)
- Prazo: 360 meses (30 anos)

**Amortização mensal: R$ 833,33** (R$ 300.000 / 360)

**Primeira parcela: R$ 3.125,00**
- Amortização: R$ 833,33
- Juros: R$ 2.500,00

**Última parcela (360ª): R$ 837,50**
- Amortização: R$ 833,33
- Juros: R$ 4,17

A parcela diminuiu de R$ 3.125 para R$ 837 ao longo do financiamento — uma redução de 73%.

### Comparação PRICE vs SAC para o mesmo financiamento

| Aspecto | PRICE | SAC |
|---------|-------|-----|
| Primeira parcela | R$ 2.610 | R$ 3.125 |
| Última parcela | R$ 2.610 | R$ 837 |
| Total de juros | R$ 639.600 | R$ 452.500 |
| Custo total | R$ 939.600 | R$ 752.500 |
| Economia no custo | — | R$ 187.100 |

O SAC resulta em uma economia de R$ 187.100 ao longo de 30 anos!

### Vantagens do Sistema SAC

1. **Menor custo total**: Você paga menos juros porque o saldo devedor diminui mais rapidamente.

2. **Parcelas decrescentes**: Com o tempo, você paga menos, o que pode aliviar o orçamento familiar.

3. **Quitação mais rápida do sonho**: A cada parcela, você está amortizando mais do que no PRICE inicial.

4. **Melhor para longo prazo**: Se você não pretende vender o imóvel, o SAC é mais vantajoso financeiramente.

### Desvantagens do Sistema SAC

1. **Parcelas iniciais mais altas**: A primeira parcela é 20% maior que no PRICE.

2. **Planejamento mais difícil**: A variação das parcelas dificulta o planejamento de longo prazo.

3. **Menor poder de compra**: Com parcelas iniciais mais altas, você pode ser aprovado para um valor menor.

4. **Impacto emocional**: Ver parcelas altas no início pode gerar ansiedade.

### Quando escolher o SAC?

O sistema SAC é recomendado para quem:

- Tem renda mais alta e pode arcar com parcelas iniciais maiores
- Espera que sua renda aumente ao longo dos anos
- Pretende quitar o financiamento mais rapidamente
- Quer pagar menos juros no total
- Está financeiramente preparado para variações no orçamento

### Evolução das parcelas no SAC

Para ilustrar a evolução, vejamos os primeiros 6 meses:

| Mês | Parcela | Juros | Amortização | Saldo |
|-----|---------|-------|-------------|-------|
| 1 | R$ 3.125 | R$ 2.500 | R$ 833 | R$ 299.167 |
| 2 | R$ 3.097 | R$ 2.493 | R$ 833 | R$ 298.333 |
| 3 | R$ 3.070 | R$ 2.486 | R$ 833 | R$ 297.500 |
| 4 | R$ 3.042 | R$ 2.479 | R$ 833 | R$ 296.667 |
| 5 | R$ 3.015 | R$ 2.472 | R$ 833 | R$ 295.833 |
| 6 | R$ 2.987 | R$ 2.465 | R$ 833 | R$ 295.000 |

Note que a amortização permanece constante em R$ 833, enquanto os juros diminuem a cada mês.

### SAC no contexto brasileiro

O sistema SAC é muito utilizado em financiamentos da Caixa Econômica Federal e do Banco do Brasil, especialmente para produtos do Minha Casa Minha Vida. Muitos consultores financeiros recomendam o SAC para clientes com perfil mais arrojado ou que têm expectativa de aumento de renda.

É importante ressaltar que, apesar de o SAC ter um custo total menor, o PRICE pode ser a melhor escolha para quem precisa de parcelas iniciais menores para ser aprovado no financiamento. A decisão deve considerar não apenas o custo total, mas também a capacidade de pagamento em cada fase do financiamento.

### Conclusão

O Sistema SAC é uma excelente opção para quem pode arcar com parcelas iniciais mais altas e deseja minimizar o custo total do financiamento. A economia de quase R$ 200 mil em 30 anos é significativa e pode representar a diferença entre um financiamento confortável e um que consome toda a renda familiar.

Antes de decidir, analise sua capacidade financeira atual e futura, e considere usar nossa calculadora para comparar os dois sistemas com os dados específicos do seu financiamento.`,
  en: `## What is the SAC System?

SAC (Sistema de Amortização Constante, or Constant Amortization System) is the second most widely used method in Brazil for financing, especially in operations using funds from the SFH (Sistema Financeiro de Habitação — Housing Finance System). Unlike PRICE, where installments are fixed, in SAC the installments decrease over time.

The main characteristic of SAC is that the **amortization amount is constant** in every installment. This means that, regardless of interest, you always pay the same amount to reduce the outstanding balance. Since interest is calculated on the remaining balance, the total installment amount decreases progressively.

### How does the calculation work?

In SAC, the monthly amortization is calculated by dividing the principal amount by the number of installments:

**Monthly amortization = Principal / Number of installments**

The interest for each month is calculated on the previous month's outstanding balance:

**Monthly interest = Previous outstanding balance × Monthly interest rate**

Each month's installment is the sum of the constant amortization and that month's interest.

### Practical example: Financing of R$ 300.000 at 10% per year

Let's simulate the same financing under the SAC system:
- Amount financed: R$ 300.000
- Interest rate: 10% per year (0,83% per month)
- Term: 360 months (30 years)

**Monthly amortization: R$ 833,33** (R$ 300.000 / 360)

**First installment: R$ 3.125,00**
- Amortization: R$ 833,33
- Interest: R$ 2.500,00

**Last installment (360th): R$ 837,50**
- Amortization: R$ 833,33
- Interest: R$ 4,17

The installment decreased from R$ 3.125 to R$ 837 over the course of the financing — a reduction of 73%.

### PRICE vs SAC comparison for the same financing

| Aspect | PRICE | SAC |
|--------|-------|-----|
| First installment | R$ 2.610 | R$ 3.125 |
| Last installment | R$ 2.610 | R$ 837 |
| Total interest | R$ 639.600 | R$ 452.500 |
| Total cost | R$ 939.600 | R$ 752.500 |
| Cost savings | — | R$ 187.100 |

SAC results in savings of R$ 187.100 over 30 years!

### Advantages of the SAC System

1. **Lower total cost**: You pay less interest because the outstanding balance decreases more quickly.

2. **Decreasing installments**: Over time, you pay less, which can ease the family budget.

3. **Faster payoff of your dream**: With each installment, you are amortizing more than you would with PRICE initially.

4. **Better for the long term**: If you do not intend to sell the property, SAC is more advantageous financially.

### Disadvantages of the SAC System

1. **Higher initial installments**: The first installment is 20% larger than with PRICE.

2. **More difficult planning**: The variation in installments makes long-term planning harder.

3. **Lower purchasing power**: With higher initial installments, you may be approved for a smaller amount.

4. **Emotional impact**: Seeing high installments at the start can cause anxiety.

### When to choose SAC?

The SAC system is recommended for those who:

- Have a higher income and can afford larger initial installments
- Expect their income to increase over the years
- Intend to pay off the financing more quickly
- Want to pay less interest in total
- Are financially prepared for variations in the budget

### How installments evolve in SAC

To illustrate the progression, let's look at the first 6 months:

| Month | Installment | Interest | Amortization | Balance |
|-------|-------------|----------|--------------|---------|
| 1 | R$ 3.125 | R$ 2.500 | R$ 833 | R$ 299.167 |
| 2 | R$ 3.097 | R$ 2.493 | R$ 833 | R$ 298.333 |
| 3 | R$ 3.070 | R$ 2.486 | R$ 833 | R$ 297.500 |
| 4 | R$ 3.042 | R$ 2.479 | R$ 833 | R$ 296.667 |
| 5 | R$ 3.015 | R$ 2.472 | R$ 833 | R$ 295.833 |
| 6 | R$ 2.987 | R$ 2.465 | R$ 833 | R$ 295.000 |

Note that amortization remains constant at R$ 833, while interest decreases each month.

### SAC in the Brazilian context

The SAC system is widely used in financing from Caixa Econômica Federal and Banco do Brasil, especially for Minha Casa Minha Vida products. Many financial advisors recommend SAC for clients with a more aggressive profile or who expect their income to increase.

It is important to emphasize that, although SAC has a lower total cost, PRICE may be the better choice for those who need smaller initial installments to be approved for financing. The decision should consider not only the total cost, but also the ability to pay at each stage of the financing.

### Conclusion

The SAC System is an excellent option for those who can afford higher initial installments and want to minimize the total cost of financing. Savings of nearly R$ 200 thousand over 30 years are significant and can make the difference between a comfortable financing and one that consumes the entire family income.

Before deciding, analyze your current and future financial capacity, and consider using our calculator to compare the two systems with the specific details of your financing.`
};
