import type { Locale } from '$lib/i18n';

export interface GuideLink {
  path: string;
  title: string;
  description: string;
  system: string;
}

export const guideLinks: Record<Locale, GuideLink[]> = {
  pt: [
    {
      path: '/guias/tabela-price',
      title: 'Tabela PRICE',
      description: 'Entenda como funciona o sistema de parcelas fixas mais utilizado no Brasil para financiamentos imobiliários.',
      system: 'price'
    },
    {
      path: '/guias/tabela-sac',
      title: 'Tabela SAC',
      description: 'Conheça o sistema de amortização constante e descubra por que ele costuma ser mais econômico a longo prazo.',
      system: 'sac'
    },
    {
      path: '/guias/price-vs-sac',
      title: 'PRICE vs SAC',
      description: 'Compare os dois sistemas mais populares e descubra qual é o melhor para o seu perfil financeiro.',
      system: 'comparacao'
    }
  ],
  en: [
    {
      path: '/guias/tabela-price',
      title: 'PRICE Table',
      description: 'Learn how the fixed-installment system most widely used in Brazil for home financing works.',
      system: 'price'
    },
    {
      path: '/guias/tabela-sac',
      title: 'SAC Table',
      description: 'Discover the constant amortization system and why it tends to be more economical in the long run.',
      system: 'sac'
    },
    {
      path: '/guias/price-vs-sac',
      title: 'PRICE vs SAC',
      description: 'Compare the two most popular systems and find out which one best suits your financial profile.',
      system: 'comparacao'
    }
  ]
};
