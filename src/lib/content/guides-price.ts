import type { Locale } from '$lib/i18n';

export const priceGuideContent: Record<Locale, string> = {
  pt: `## O que é a Tabela PRICE?

A Tabela PRICE, também conhecida como Sistema Francês de Amortização, é o método de cálculo de parcelas mais utilizado no Brasil para financiamentos imobiliários. O nome "Price" vem do matemático inglês Richard Price, que no século XVIII adaptou as fórmulas de juros compostos para o cálculo de aposentadorias e pensões.

Neste sistema, as parcelas são **fixas durante toda a duração do financiamento**. Isso significa que o valor que você paga a cada mês permanece o mesmo, independentemente da inflação ou de mudanças na taxa de juros do mercado. Essa previsibilidade é um dos principais atrativos do sistema PRICE para quem busca planejamento financeiro de longo prazo.

### Como funciona o cálculo?

A parcela fixa do PRICE é calculada usando a seguinte fórmula:

**Parcela = Principal × [i × (1 + i)^n] / [(1 + i)^n – 1]**

Onde:
- **Principal**: Valor total do financiamento
- **i**: Taxa de juros mensal
- **n**: Número de parcelas

A mágica do sistema está na composição interna da parcela. Nos primeiros meses, a maior parte do pagamento é destinada aos juros bancários, enquanto a amortização do saldo devedor é relativamente pequena. Com o passar do tempo, essa proporção se inverte: você paga menos juros e mais principal a cada parcela.

### Exemplo prático: Financiamento de R$ 300.000 a 10% ao ano

Vamos simular um financiamento imobiliário com os seguintes parâmetros:
- Valor financiado: R$ 300.000
- Taxa de juros: 10% ao ano (0,83% ao mês)
- Prazo: 360 meses (30 anos)

**Parcela mensal: R$ 2.610,43**

Nos primeiros meses, a composição da parcela é aproximadamente:
- Juros: R$ 2.500 (95,8%)
- Amortização: R$ 110,43 (4,2%)

Após 180 meses (15 anos), a composição já mudou significativamente:
- Juros: R$ 1.850 (70,9%)
- Amortização: R$ 760,43 (29,1%)

No final do financiamento, a composição é invertida, com a maior parte indo para amortização.

### Vantagens do Sistema PRICE

1. **Parcelas fixas e previsíveis**: O valor da parcela não muda ao longo do contrato, facilitando o planejamento orçamentário familiar.

2. **Estabilidade emocional**: Em períodos de crise econômica, você sabe exatamente quanto vai pagar nos próximos anos.

3. **Facilidade de compreensão**: O sistema é simples de entender e comparar entre diferentes ofertas.

4. **Maior poder de compra inicial**: Como as parcelas começam menores que no SAC, você pode financiar um valor maior.

### Desvantagens do Sistema PRICE

1. **Total de juros mais alto**: Por manter o saldo devedor elevado por mais tempo, você paga mais juros totais.

2. **Amortização lenta no início**: Nos primeiros anos, sua dívida praticamente não diminui.

3. **Maior risco de inadimplência longo prazo**: Se você quitar antecipadamente, ainda terá um saldo devedor significativo.

### Quando escolher o PRICE?

O sistema PRICE é recomendado para quem:

- Tem renda fixa e estável que permite planejamento de longo prazo
- Prioriza a previsibilidade das parcelas
- Deseja financiar um valor mais alto com parcelas iniciais menores
- Pretende permanecer no imóvel por um longo período
- Tem perfil conservador e prefere não arriscar parcelas altas no início

### PRICE no contexto brasileiro

No Brasil, o sistema PRICE é amplamente utilizado em financiamentos imobiliários pelo SFH (Sistema Financeiro de Habitação). A Caixa Econômica Federal e outros grandes bancos oferecem esse sistema como opção padrão para a maioria dos produtos de crédito imobiliário.

É importante notar que, legalmente, você tem o direito de escolher entre PRICE e SAC. Alguns bancos podem dificultar a opção pelo SAC, mas a legislação brasileira garante essa liberdade ao mutuário.

### Exemplo de evolução da amortização

Para ilustrar melhor, vejamos os primeiros 6 meses de um financiamento de R$ 300.000 a 10% ao ano pelo sistema PRICE:

| Mês | Parcela | Juros | Amortização | Saldo |
|-----|---------|-------|-------------|-------|
| 1 | R$ 2.610 | R$ 2.500 | R$ 110 | R$ 299.890 |
| 2 | R$ 2.610 | R$ 2.499 | R$ 111 | R$ 299.779 |
| 3 | R$ 2.610 | R$ 2.498 | R$ 112 | R$ 299.667 |
| 4 | R$ 2.610 | R$ 2.497 | R$ 113 | R$ 299.554 |
| 5 | R$ 2.610 | R$ 2.496 | R$ 114 | R$ 299.440 |
| 6 | R$ 2.610 | R$ 2.495 | R$ 115 | R$ 299.325 |

Observe como a amortização aumenta gradualmente enquanto os juros diminuem, mas a parcela total permanece constante.

### Conclusão

A Tabela PRICE é uma excelente opção para quem valoriza previsibilidade e estabilidade. Embora o custo total seja maior que o SAC, a segurança de saber exatamente quanto você pagará durante décadas tem valor significativo para muitas famílias brasileiras.

Antes de decidir, use nossa calculadora para comparar PRICE e SAC com os dados específicos do seu financiamento. O melhor sistema depende do seu perfil financeiro, da sua tolerância a risco e dos seus objetivos de longo prazo.`,
  en: `## What is the PRICE Table?

The PRICE Table, also known as the French Amortization System, is the most widely used installment calculation method in Brazil for home financing. The name "Price" comes from the English mathematician Richard Price, who in the 18th century adapted compound interest formulas for the calculation of retirements and pensions.

In this system, installments are **fixed throughout the entire term of the financing**. This means that the amount you pay each month remains the same, regardless of inflation or changes in market interest rates. This predictability is one of the main attractions of the PRICE system for those seeking long-term financial planning.

### How does the calculation work?

The fixed PRICE installment is calculated using the following formula:

**Installment = Principal × [i × (1 + i)^n] / [(1 + i)^n – 1]**

Where:
- **Principal**: Total amount of the financing
- **i**: Monthly interest rate
- **n**: Number of installments

The magic of the system lies in the internal composition of the installment. In the first months, most of the payment goes toward bank interest, while amortization of the outstanding balance is relatively small. Over time, this ratio reverses: you pay less interest and more principal with each installment.

### Practical example: Financing of R$ 300.000 at 10% per year

Let's simulate a home financing with the following parameters:
- Amount financed: R$ 300.000
- Interest rate: 10% per year (0,83% per month)
- Term: 360 months (30 years)

**Monthly installment: R$ 2.610,43**

In the first months, the composition of the installment is approximately:
- Interest: R$ 2.500 (95,8%)
- Amortization: R$ 110,43 (4,2%)

After 180 months (15 years), the composition has already changed significantly:
- Interest: R$ 1.850 (70,9%)
- Amortization: R$ 760,43 (29,1%)

At the end of the financing, the composition is reversed, with most of it going toward amortization.

### Advantages of the PRICE System

1. **Fixed and predictable installments**: The installment amount does not change over the course of the contract, making family budget planning easier.

2. **Emotional stability**: In times of economic crisis, you know exactly how much you will pay over the next few years.

3. **Easy to understand**: The system is simple to understand and compare across different offers.

4. **Greater initial purchasing power**: Since installments start lower than with SAC, you can finance a larger amount.

### Disadvantages of the PRICE System

1. **Higher total interest**: By keeping the outstanding balance high for longer, you pay more interest overall.

2. **Slow amortization at the beginning**: In the first years, your debt hardly decreases.

3. **Higher long-term default risk**: If you pay off the loan early, you will still have a significant outstanding balance.

### When to choose PRICE?

The PRICE system is recommended for those who:

- Have a fixed and stable income that allows for long-term planning
- Prioritize predictable installments
- Want to finance a higher amount with lower initial installments
- Intend to stay in the property for a long period
- Have a conservative profile and prefer not to risk high installments at the start

### PRICE in the Brazilian context

In Brazil, the PRICE system is widely used in home financing under the SFH (Sistema Financeiro de Habitação — Housing Finance System). Caixa Econômica Federal and other major banks offer this system as the standard option for most real estate credit products.

It is important to note that, legally, you have the right to choose between PRICE and SAC. Some banks may make it difficult to opt for SAC, but Brazilian legislation guarantees this freedom to the borrower.

### Example of amortization progress

To illustrate further, let's look at the first 6 months of a financing of R$ 300.000 at 10% per year under the PRICE system:

| Month | Installment | Interest | Amortization | Balance |
|-------|-------------|----------|--------------|---------|
| 1 | R$ 2.610 | R$ 2.500 | R$ 110 | R$ 299.890 |
| 2 | R$ 2.610 | R$ 2.499 | R$ 111 | R$ 299.779 |
| 3 | R$ 2.610 | R$ 2.498 | R$ 112 | R$ 299.667 |
| 4 | R$ 2.610 | R$ 2.497 | R$ 113 | R$ 299.554 |
| 5 | R$ 2.610 | R$ 2.496 | R$ 114 | R$ 299.440 |
| 6 | R$ 2.610 | R$ 2.495 | R$ 115 | R$ 299.325 |

Notice how amortization gradually increases while interest decreases, but the total installment remains constant.

### Conclusion

The PRICE Table is an excellent option for those who value predictability and stability. Although the total cost is higher than with SAC, the security of knowing exactly how much you will pay for decades has significant value for many Brazilian families.

Before deciding, use our calculator to compare PRICE and SAC with the specific details of your financing. The best system depends on your financial profile, your tolerance for risk, and your long-term goals.`
};
