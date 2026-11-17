/**
 * UI dictionaries for the calculator.
 *
 * Portuguese (Brazil) is the default locale. English is available under /en.
 * Keep both objects in sync — TypeScript enforces that `en` has every key
 * defined by `pt`.
 */
export const pt = {
  // Shared navigation and labels
  "nav.calculator": "Calculadora",
  "nav.compare": "Comparar",
  "nav.guides": "Guias",
  "nav.faq": "FAQ",
  "nav.about": "Sobre",
  "nav.author": "Autor",
  "footer.disclaimer":
    "Calculadora de Financiamento — Simulação educacional. Consulte um profissional antes de decisões financeiras.",
  "language.label": "Idioma",
  "language.pt": "Português",
  "language.en": "English",

  "common.openCalculator": "Abrir calculadora",
  "common.export": "Exportar",
  "common.copyLink": "Copiar link",
  "common.copied": "Link copiado!",
  "common.copyError": "Erro ao copiar",
  "common.month": "Mês",
  "common.months": "meses",
  "common.monthOne": "mês",
  "common.years": "anos",
  "common.yearOne": "ano",
  "common.and": "e",
  "common.installments": "Parcelas",
  "common.firstInstallment": "1ª Parcela",
  "common.lastInstallment": "Última Parcela",
  "common.totalPaid": "Total Pago",
  "common.totalInterest": "Total Juros",
  "common.interest": "Juros",
  "common.balance": "Saldo",
  "common.amortizationShort": "Amort.",
  "common.payment": "Parcela",
  "common.extra": "Extra",
  "common.extraPayment": "Pagamento extra",
  "common.addExtraPayment": "Adicionar pagamento extra",
  "common.editExtraPayment": "Editar Pagamento Extra",
  "common.remove": "Remover",
  "common.removeConfirm": "Remover?",
  "common.save": "Salvar",
  "common.add": "Adicionar",
  "common.update": "Atualizar",
  "common.study": "Estudo",
  "common.newStudy": "Novo Estudo",
  "common.editStudy": "Editar Estudo",
  "common.system": "Sistema",
  "common.name": "Nome",
  "common.studyName": "Nome do estudo",
  "common.principal": "Valor (R$)",
  "common.downPayment": "Entrada (R$)",
  "common.rate": "Taxa",
  "common.termMonths": "Prazo (meses)",
  "common.disabled": "desabilitado",
  "common.perAnnum": "a.a.",
  "common.perMonth": "a.m.",
  "common.exampleAmount": "Ex: 5.000",
  "common.github": "GitHub",
  "common.by": "Por",
  "common.updatedAt": "Atualizado em",

  // Layout / PWA
  "pwa.installMessage": "Instale o app para acesso rápido offline",
  "pwa.install": "Instalar",
  "ad.dialog": "Anúncio",
  "ad.calculating": "Calculando seu financiamento...",
  "ad.message":
    "A publicidade nos ajuda a manter este serviço gratuito para você. Obrigado pela compreensão!",
  "ad.close": "Fechar e ver resultado",
  "ad.wait": "Aguarde {seconds}s",
  "ad.placeholder": "Espaço publicitário",
  "pwa.close": "Fechar",

  // Home / calculator page
  "home.title": "Calculadora de Financiamento",
  "home.subtitle":
    "Simule PRICE, SAC, SAM e Americano. Ajuste os valores e veja o resultado automaticamente.",
  "home.tab.chart": "Gráfico",
  "home.tab.results": "Resultado",
  "home.tab.table": "Tabela",
  "home.scrollTop": "Voltar ao topo",
  "home.toggleTheme": "Alternar tema",

  // Calculator form
  "form.amount": "Valor (R$)",
  "form.downPayment": "Entrada (R$)",
  "form.rate": "Taxa",
  "form.termMonths": "Prazo (meses)",
  "form.financingAmount": "Valor do Financiamento (R$)",
  "form.interestRate": "Taxa de Juros (% {period})",
  "form.term": "Prazo",
  "form.placeholderPrincipal": "Ex: 500.000",
  "form.placeholderDownPayment": "Ex: 100.000",
  "form.placeholderRate": "Ex: 10,5",
  "form.placeholderMonth": "Mês",
  "form.installApp": "Instalar app",
  "form.rateLabelMonthly": "{value}% a.m.",
  "form.rateLabelAnnual": "{value}% a.a.",

  // Study pills
  "studies.add": "Adicionar estudo",
  "studies.restore": "Restaurar estudos",
  "studies.restoreDialog": "Confirmar restauracao",
  "studies.restoreTitle": "Restaurar valores?",
  "studies.restoreBody":
    "Todos os estudos serão resetados para os valores iniciais. Esta ação não pode ser desfeita.",
  "studies.restoreAction": "Restaurar",

  // Results summary
  "results.title": "Resultado",
  "results.multiplierTitle": "Vezes o valor financiado",

  // Amortization table
  "table.financing": "Financiamento",
  "table.financingShort": "Financ.",
  "table.compare": "Comparar",
  "table.payment": "Parcela",
  "table.amortization": "Amort.",
  "table.interest": "Juros",
  "table.balance": "Saldo",
  "table.previousRow": "Linha anterior",
  "table.nextRow": "Próxima linha",
  "table.showSummary": "▲ Ver resumo",
  "table.showAll": "▼ Ver tudo",
  "table.hint": "Toque em uma parcela para adicionar pagamento extra.",
  "table.month": "Mês",
  "table.paymentCurrency": "Parcela (R$)",
  "table.amortizationCurrency": "Amort. (R$)",
  "table.interestCurrency": "Juros (R$)",
  "table.balanceCurrency": "Saldo (R$)",
  "table.extraCurrency": "Extra (R$)",

  // Comparison chart
  "chart.balance": "Saldo",
  "chart.payment": "Parcela",
  "chart.amortization": "Amort.",
  "chart.interest": "Juros",
  "chart.evolution.balance": "Evolução do Saldo",
  "chart.evolution.payment": "Evolução da Parcela",
  "chart.evolution.principal": "Evolução da Amortização",
  "chart.evolution.interest": "Evolução dos Juros",
  "chart.hint": "Clique em um ponto do gráfico para adicionar pagamento extra.",
  "chart.aria": "Gráfico de evolução do saldo devedor",

  // Export dialog and files
  "export.title": "Exportar/Compartilhar",
  "export.filenamePrefix": "financiamento",
  "export.csv.month": "Mes",
  "export.csv.payment": "Parcela",
  "export.csv.amortization": "Amortizacao",
  "export.csv.interest": "Juros",
  "export.csv.balance": "Saldo_Devedor",
  "export.csv.extra": "Aporte_Extra",
  "export.pdf.title": "Simulação - {name}",
  "export.pdf.totalPaid": "Valor Total Pago",
  "export.pdf.totalInterest": "Total de Juros",
  "export.pdf.firstInstallment": "Primeira Parcela",
  "export.pdf.lastInstallment": "Última Parcela",
  "export.pdf.installments": "Número de Parcelas",
  "export.pdf.amortizationTable": "Tabela de Amortização",

  // Extra payment modal
  "extra.dialog": "Pagamento extra",
  "extra.title": "Pagamento Extra",
  "extra.editTitle": "Editar Pagamento Extra",
  "extra.selectStudy": "Selecionar estudo",
  "extra.month": "Mês",
  "extra.monthPlaceholder": "Mes",
  "extra.reduceTerm": "Reduzir prazo (R$)",
  "extra.reduceTermHint": "Mantém valor da parcela, reduz prazo",
  "extra.reduceInstallment": "Reduzir parcela (R$)",
  "extra.reduceInstallmentHint": "Mantém prazo, reduz valor da parcela",
  "extra.remove": "Remover pagamento extra",
  "extra.save": "Salvar",
  "extra.add": "Adicionar",

  // Study edit modal
  "study.dialog": "Estudo",
  "study.new": "Novo Estudo",
  "study.edit": "Editar Estudo",
  "study.changeColor": "Mudar cor do estudo",
  "study.clone": "Clonar estudo",
  "study.enable": "Habilitar estudo",
  "study.disable": "Desabilitar estudo",
  "study.name": "Nome",
  "study.namePlaceholder": "Nome do estudo",
  "study.system": "Sistema",
  "study.remove": "Remover estudo",
  "study.defaultName": "Novo",

  // Compare page
  "compare.title": "Comparar Sistemas de Amortização",
  "compare.heading": "Comparar Estudos",
  "compare.subtitle": "Compare seus estudos de financiamento lado a lado.",
  "compare.summary": "Resumo Comparativo",
  "compare.savings": "Economia em Juros (em relação a {name})",
  "compare.savingsLine": "economia de {amount} em juros ({percent}% a menos)",
  "compare.howTitle": "Como Comparar Estudos",
  "compare.how1": "Crie pelo menos 2 estudos na calculadora principal",
  "compare.how2":
    "Cada estudo pode representar um cenário diferente de financiamento",
  "compare.how3": "Compare juros totais, parcelas e custo final entre sistemas",
  "compare.systemsTitle": "Sistemas de Amortização",
  "compare.priceDesc":
    "Parcelas fixas, juros maiores no início. Muito usado em imóveis.",
  "compare.sacDesc":
    "Parcelas decrescentes, juros menores no total. Melhor para quem pode pagar mais no início.",
  "compare.samDesc": "Média entre PRICE e SAC. Parcelas intermediárias.",
  "compare.americanDesc":
    "Juros sobre saldo devedor. Última parcela geralmente maior.",
  "compare.backBefore": "Volte à",
  "compare.backLink": "calculadora",
  "compare.backAfter": "para criar seus estudos.",

  // Guides index
  "guides.title": "Guias sobre Financiamento",
  "guides.subtitle":
    "Aprenda tudo sobre os diferentes sistemas de amortização utilizados no Brasil. Escolha o guia abaixo que mais interessa a você.",
  "guides.read": "Ler guia",
  "guides.system.price": "PRICE",
  "guides.system.sac": "SAC",
  "guides.system.comparacao": "Comparação",
  "guides.helpTitle": "Precisa de ajuda para escolher?",
  "guides.helpBody":
    "Use nossa calculadora interativa para simular diferentes cenários e comparar o custo total de cada sistema de amortização com os seus dados específicos de financiamento.",

  // Guide detail pages
  "guide.price.title": "Tabela PRICE (Sistema Francês de Amortização)",
  "guide.price.subtitle":
    "Entenda como funcionam as parcelas fixas mais comuns nos financiamentos brasileiros.",
  "guide.price.ctaTitle": "Quer comparar com SAC?",
  "guide.price.ctaBody":
    "Use nossa calculadora para simular o mesmo financiamento nos dois sistemas e ver a diferença no custo total.",
  "guide.sac.title": "Tabela SAC (Sistema de Amortização Constante)",
  "guide.sac.subtitle":
    "Entenda como funcionam as parcelas decrescentes e a economia total do SAC em relação ao PRICE.",
  "guide.sac.ctaTitle": "Quer comparar com PRICE?",
  "guide.sac.ctaBody":
    "Use nossa calculadora para simular o mesmo financiamento nos dois sistemas e ver qual é o melhor para o seu perfil.",
  "guide.comparison.title": "PRICE vs SAC: Qual escolher?",
  "guide.comparison.subtitle":
    "Guia completo para escolher o melhor sistema de amortização para o seu perfil financeiro.",
  "guide.comparison.ctaTitle": "Simule seu cenário específico",
  "guide.comparison.ctaBody":
    "Use nossa calculadora para comparar PRICE e SAC com os dados reais do seu financiamento.",

  // FAQ page
  "faq.title": "Perguntas Frequentes",
  "faq.subtitle":
    "Respostas para as dúvidas mais comuns sobre financiamentos e sistemas de amortização.",
  "faq.noAnswer": "Não encontrou a resposta?",
  "faq.noAnswerBody":
    "Entre em contato através do repositório do projeto no GitHub.",

  // About / authors pages
  "about.title": "Sobre a Calculadora de Financiamento",
  "about.subtitle":
    "Conheça a Calculadora de Financiamento: como funciona, sistemas de amortização, metodologia e avisos legais.",
  "authors.title": "Sobre os Autores",
  "authors.subtitle": "Conheça a equipe por trás da Calculadora de Financiamento.",
  "authors.bylineName": "Lucas, Daniel e André Prett Campagna",
  "authors.bylineRole": "Criadores da Calculadora de Financiamento",
  "byline.roleDeveloper": "Desenvolvedor de Software na HP",
  "byline.lastUpdated": "Setembro 2026",

  // SEO metadata
  "meta.home.title": "Calculadora de Financiamento — PRICE, SAC, SAM, Americano",
  "meta.home.description":
    "Simule financiamentos com os sistemas PRICE, SAC, SAM e Americano. Compare cenários, veja tabela de amortização e exporte resultados.",
  "meta.compare.title":
    "Comparar Sistemas de Amortização — PRICE vs SAC vs SAM vs Americano",
  "meta.compare.description":
    "Compare PRICE, SAC, SAM e Americano lado a lado. Veja qual sistema de amortização é mais vantajoso para o seu financiamento.",
  "meta.guides.title": "Guias — Calculadora de Financiamento",
  "meta.guides.description":
    "Guias detalhados sobre os sistemas de amortização PRICE, SAC, SAM e Americano. Aprenda a escolher o melhor sistema para o seu financiamento.",
  "meta.faq.title": "Perguntas Frequentes — FAQ — Calculadora de Financiamento",
  "meta.faq.description":
    "Respostas para as dúvidas mais comuns sobre financiamentos: PRICE, SAC, parcelas extras, CET, seguros e muito mais.",
  "meta.about.title": "Sobre — Calculadora de Financiamento",
  "meta.about.description":
    "Conheça a Calculadora de Financiamento: como funciona, sistemas de amortização (PRICE, SAC, SAM, Americano), metodologia e avisos legais.",
  "meta.authors.title": "Sobre os Autores — Calculadora de Financiamento",
  "meta.authors.description":
    "Conheça os três irmãos criadores da Calculadora de Financiamento: desenvolvedor, analista de dados e gerente bancário.",
  "meta.guidePrice.title": "Tabela PRICE — Como Funciona — Calculadora de Financiamento",
  "meta.guidePrice.description":
    "Entenda como funciona a Tabela PRICE (Sistema Francês de Amortização): parcelas fixas, cálculo de juros, vantagens e desvantagens para financiamentos.",
  "meta.guideSac.title": "Tabela SAC — Como Funciona — Calculadora de Financiamento",
  "meta.guideSac.description":
    "Entenda como funciona a Tabela SAC (Sistema de Amortização Constante): parcelas decrescentes, cálculo de juros, vantagens e economia total.",
  "meta.guideComparison.title":
    "PRICE vs SAC — Calculadora de Financiamento",
  "meta.guideComparison.description":
    "Guia completo para escolher entre PRICE e SAC: comparativa, cenários e decisão baseada no seu perfil.",
} as const;

export type TranslationKey = keyof typeof pt;

export const en: Record<TranslationKey, string> = {
  "nav.calculator": "Calculator",
  "nav.compare": "Compare",
  "nav.guides": "Guides",
  "nav.faq": "FAQ",
  "nav.about": "About",
  "nav.author": "Authors",
  "footer.disclaimer":
    "Financing Calculator — Educational simulation. Consult a professional before making financial decisions.",
  "language.label": "Language",
  "language.pt": "Português",
  "language.en": "English",

  "common.openCalculator": "Open calculator",
  "common.export": "Export",
  "common.copyLink": "Copy link",
  "common.copied": "Link copied!",
  "common.copyError": "Could not copy link",
  "common.month": "Month",
  "common.months": "months",
  "common.monthOne": "month",
  "common.years": "years",
  "common.yearOne": "year",
  "common.and": "and",
  "common.installments": "Installments",
  "common.firstInstallment": "1st Installment",
  "common.lastInstallment": "Last Installment",
  "common.totalPaid": "Total Paid",
  "common.totalInterest": "Total Interest",
  "common.interest": "Interest",
  "common.balance": "Balance",
  "common.amortizationShort": "Principal",
  "common.payment": "Payment",
  "common.extra": "Extra",
  "common.extraPayment": "Extra payment",
  "common.addExtraPayment": "Add extra payment",
  "common.editExtraPayment": "Edit Extra Payment",
  "common.remove": "Remove",
  "common.removeConfirm": "Remove?",
  "common.save": "Save",
  "common.add": "Add",
  "common.update": "Update",
  "common.study": "Study",
  "common.newStudy": "New Study",
  "common.editStudy": "Edit Study",
  "common.system": "System",
  "common.name": "Name",
  "common.studyName": "Study name",
  "common.principal": "Amount (R$)",
  "common.downPayment": "Down payment (R$)",
  "common.rate": "Rate",
  "common.termMonths": "Term (months)",
  "common.disabled": "disabled",
  "common.perAnnum": "p.a.",
  "common.perMonth": "p.m.",
  "common.exampleAmount": "E.g.: 5,000",
  "common.github": "GitHub",
  "common.by": "By",
  "common.updatedAt": "Updated on",

  "pwa.installMessage": "Install the app for quick offline access",
  "pwa.install": "Install",
  "ad.dialog": "Advertisement",
  "ad.calculating": "Calculating your financing...",
  "ad.message":
    "Advertising helps us keep this service free for you. Thanks for your understanding!",
  "ad.close": "Close and view result",
  "ad.wait": "Please wait {seconds}s",
  "ad.placeholder": "Advertisement space",
  "pwa.close": "Close",

  "home.title": "Financing Calculator",
  "home.subtitle":
    "Simulate PRICE, SAC, SAM, and Americano. Adjust the values and see the result automatically.",
  "home.tab.chart": "Chart",
  "home.tab.results": "Result",
  "home.tab.table": "Table",
  "home.scrollTop": "Back to top",
  "home.toggleTheme": "Toggle theme",

  "form.amount": "Amount (R$)",
  "form.downPayment": "Down payment (R$)",
  "form.rate": "Rate",
  "form.termMonths": "Term (months)",
  "form.financingAmount": "Financing Amount (R$)",
  "form.interestRate": "Interest Rate (% {period})",
  "form.term": "Term",
  "form.placeholderPrincipal": "E.g.: 500,000",
  "form.placeholderDownPayment": "E.g.: 100,000",
  "form.placeholderRate": "E.g.: 10.5",
  "form.placeholderMonth": "Month",
  "form.installApp": "Install app",
  "form.rateLabelMonthly": "{value}% p.m.",
  "form.rateLabelAnnual": "{value}% p.a.",

  "studies.add": "Add study",
  "studies.restore": "Restore studies",
  "studies.restoreDialog": "Confirm restore",
  "studies.restoreTitle": "Restore values?",
  "studies.restoreBody":
    "All studies will be reset to their initial values. This action cannot be undone.",
  "studies.restoreAction": "Restore",

  "results.title": "Result",
  "results.multiplierTitle": "Times the financed amount",

  "table.financing": "Financing",
  "table.financingShort": "Fin.",
  "table.compare": "Compare",
  "table.payment": "Payment",
  "table.amortization": "Principal",
  "table.interest": "Interest",
  "table.balance": "Balance",
  "table.previousRow": "Previous row",
  "table.nextRow": "Next row",
  "table.showSummary": "▲ Show summary",
  "table.showAll": "▼ Show all",
  "table.hint": "Tap an installment to add an extra payment.",
  "table.month": "Month",
  "table.paymentCurrency": "Payment (R$)",
  "table.amortizationCurrency": "Principal (R$)",
  "table.interestCurrency": "Interest (R$)",
  "table.balanceCurrency": "Balance (R$)",
  "table.extraCurrency": "Extra (R$)",

  "chart.balance": "Balance",
  "chart.payment": "Payment",
  "chart.amortization": "Principal",
  "chart.interest": "Interest",
  "chart.evolution.balance": "Balance Evolution",
  "chart.evolution.payment": "Payment Evolution",
  "chart.evolution.principal": "Principal Evolution",
  "chart.evolution.interest": "Interest Evolution",
  "chart.hint": "Click a chart point to add an extra payment.",
  "chart.aria": "Outstanding balance evolution chart",

  "export.title": "Export/Share",
  "export.filenamePrefix": "financing",
  "export.csv.month": "Month",
  "export.csv.payment": "Payment",
  "export.csv.amortization": "Principal",
  "export.csv.interest": "Interest",
  "export.csv.balance": "Balance",
  "export.csv.extra": "Extra_Payment",
  "export.pdf.title": "Simulation - {name}",
  "export.pdf.totalPaid": "Total Paid",
  "export.pdf.totalInterest": "Total Interest",
  "export.pdf.firstInstallment": "First Installment",
  "export.pdf.lastInstallment": "Last Installment",
  "export.pdf.installments": "Number of Installments",
  "export.pdf.amortizationTable": "Amortization Table",

  "extra.dialog": "Extra payment",
  "extra.title": "Extra Payment",
  "extra.editTitle": "Edit Extra Payment",
  "extra.selectStudy": "Select study",
  "extra.month": "Month",
  "extra.monthPlaceholder": "Month",
  "extra.reduceTerm": "Shorten term (R$)",
  "extra.reduceTermHint": "Keeps the payment, shortens the term",
  "extra.reduceInstallment": "Reduce payment (R$)",
  "extra.reduceInstallmentHint": "Keeps the term, reduces the payment",
  "extra.remove": "Remove extra payment",
  "extra.save": "Save",
  "extra.add": "Add",

  "study.dialog": "Study",
  "study.new": "New Study",
  "study.edit": "Edit Study",
  "study.changeColor": "Change study color",
  "study.clone": "Clone study",
  "study.enable": "Enable study",
  "study.disable": "Disable study",
  "study.name": "Name",
  "study.namePlaceholder": "Study name",
  "study.system": "System",
  "study.remove": "Remove study",
  "study.defaultName": "New",

  "compare.title": "Compare Amortization Systems",
  "compare.heading": "Compare Studies",
  "compare.subtitle": "Compare your financing studies side by side.",
  "compare.summary": "Comparison Summary",
  "compare.savings": "Interest Savings (compared with {name})",
  "compare.savingsLine": "saves {amount} in interest ({percent}% less)",
  "compare.howTitle": "How to Compare Studies",
  "compare.how1": "Create at least 2 studies in the main calculator",
  "compare.how2": "Each study can represent a different financing scenario",
  "compare.how3": "Compare total interest, payments, and final cost across systems",
  "compare.systemsTitle": "Amortization Systems",
  "compare.priceDesc":
    "Fixed payments, more interest upfront. Widely used for home loans.",
  "compare.sacDesc":
    "Decreasing payments, lower total interest. Best if you can pay more early on.",
  "compare.samDesc": "Average of PRICE and SAC. Intermediate payments.",
  "compare.americanDesc":
    "Interest on the outstanding balance. Last payment is usually larger.",
  "compare.backBefore": "Go back to the",
  "compare.backLink": "calculator",
  "compare.backAfter": "to create your studies.",

  "guides.title": "Financing Guides",
  "guides.subtitle":
    "Learn everything about the amortization systems used in Brazil. Choose the guide below that interests you most.",
  "guides.read": "Read guide",
  "guides.system.price": "PRICE",
  "guides.system.sac": "SAC",
  "guides.system.comparacao": "Comparison",
  "guides.helpTitle": "Need help choosing?",
  "guides.helpBody":
    "Use our interactive calculator to simulate different scenarios and compare the total cost of each amortization system with your specific financing data.",

  "guide.price.title": "PRICE Table (French Amortization System)",
  "guide.price.subtitle":
    "Understand how the fixed payments most common in Brazilian financing work.",
  "guide.price.ctaTitle": "Want to compare with SAC?",
  "guide.price.ctaBody":
    "Use our calculator to simulate the same financing in both systems and see the difference in total cost.",
  "guide.sac.title": "SAC Table (Constant Amortization System)",
  "guide.sac.subtitle":
    "Understand how decreasing payments work and how much SAC can save compared with PRICE.",
  "guide.sac.ctaTitle": "Want to compare with PRICE?",
  "guide.sac.ctaBody":
    "Use our calculator to simulate the same financing in both systems and see which one suits your profile.",
  "guide.comparison.title": "PRICE vs SAC: Which one to choose?",
  "guide.comparison.subtitle":
    "A complete guide to choosing the best amortization system for your financial profile.",
  "guide.comparison.ctaTitle": "Simulate your specific scenario",
  "guide.comparison.ctaBody":
    "Use our calculator to compare PRICE and SAC with your actual financing data.",

  "faq.title": "Frequently Asked Questions",
  "faq.subtitle":
    "Answers to the most common questions about financing and amortization systems.",
  "faq.noAnswer": "Didn't find your answer?",
  "faq.noAnswerBody":
    "Get in touch through the project's GitHub repository.",

  "about.title": "About the Financing Calculator",
  "about.subtitle":
    "Learn about the Financing Calculator: how it works, amortization systems, methodology, and legal notices.",
  "authors.title": "About the Authors",
  "authors.subtitle": "Meet the team behind the Financing Calculator.",
  "authors.bylineName": "Lucas, Daniel, and André Prett Campagna",
  "authors.bylineRole": "Creators of the Financing Calculator",
  "byline.roleDeveloper": "Software Developer at HP",
  "byline.lastUpdated": "September 2026",

  "meta.home.title": "Financing Calculator — PRICE, SAC, SAM, Americano",
  "meta.home.description":
    "Simulate financing with PRICE, SAC, SAM, and Americano. Compare scenarios, view the amortization table, and export results.",
  "meta.compare.title":
    "Compare Amortization Systems — PRICE vs SAC vs SAM vs Americano",
  "meta.compare.description":
    "Compare PRICE, SAC, SAM, and Americano side by side. See which amortization system is more advantageous for your financing.",
  "meta.guides.title": "Guides — Financing Calculator",
  "meta.guides.description":
    "Detailed guides on PRICE, SAC, SAM, and Americano amortization systems. Learn to choose the best system for your financing.",
  "meta.faq.title": "Frequently Asked Questions — FAQ — Financing Calculator",
  "meta.faq.description":
    "Answers to common financing questions: PRICE, SAC, extra payments, CET, insurance, and more.",
  "meta.about.title": "About — Financing Calculator",
  "meta.about.description":
    "Learn about the Financing Calculator: how it works, amortization systems (PRICE, SAC, SAM, Americano), methodology, and legal notices.",
  "meta.authors.title": "About the Authors — Financing Calculator",
  "meta.authors.description":
    "Meet the three brothers behind the Financing Calculator: a developer, a data analyst, and a bank manager.",
  "meta.guidePrice.title": "PRICE Table — How It Works — Financing Calculator",
  "meta.guidePrice.description":
    "Understand how the PRICE Table (French Amortization System) works: fixed payments, interest calculation, pros and cons for financing.",
  "meta.guideSac.title": "SAC Table — How It Works — Financing Calculator",
  "meta.guideSac.description":
    "Understand how the SAC Table (Constant Amortization System) works: decreasing payments, interest calculation, pros and total savings.",
  "meta.guideComparison.title": "PRICE vs SAC — Financing Calculator",
  "meta.guideComparison.description":
    "A complete guide to choosing between PRICE and SAC: comparison, scenarios, and a decision based on your profile.",
};

export const friendlyStudyNames: Record<"pt" | "en", string[]> = {
  pt: [
    "Minha Casa",
    "Moto dos Sonhos",
    "Casa na Praia",
    "Próximo Celular",
    "Sítio Sossego",
    "Carro Novo",
    "Apartamento",
    "Viagem dos Sonhos",
    "Escritório",
    "Quarto Mobiliado",
    "Chácara",
    "Reforma Total",
  ],
  en: [
    "My Home",
    "Dream Bike",
    "Beach House",
    "Next Phone",
    "Country Retreat",
    "New Car",
    "Apartment",
    "Dream Trip",
    "Office",
    "Furnished Room",
    "Weekend House",
    "Full Renovation",
  ],
};

export const translations = { pt, en };
