/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURAÇÃO CENTRAL DA MARCA
 *  Tudo o que é dado real do negócio mora aqui. Nada neste site
 *  inventa nome, endereço, telefone, preço, equipe ou avaliação:
 *  campos vazios simplesmente não aparecem para o público, e as
 *  seções sem dados (equipe, depoimentos) usam uma apresentação
 *  editorial neutra, sem nomes nem citações inventadas.
 * ─────────────────────────────────────────────────────────────
 */

export type Treatment = {
  id: string
  name: string
  category: string
  summary: string
  /** Ex.: "60 min". Deixe vazio para não exibir. */
  duration?: string
  /** Ex.: "R$ 280". Deixe vazio para não exibir preço. */
  price?: string
  image: Photo
}

export type Photo = {
  /** ID da foto no Unsplash (parte "photo-..." da URL) ou URL completa de uma imagem própria. */
  src: string
  alt: string
  /** Ponto focal para o recorte (CSS object-position). */
  focus?: string
  credit?: string
}

export type TeamMember = {
  name: string
  role: string
  /** Ex.: "CRBM 0000" — somente se for um registro real. */
  credential?: string
  bio?: string
  photo?: Photo
}

export type Testimonial = {
  quote: string
  author: string
  /** Ex.: "Avaliação no Google, mar. 2026" */
  source?: string
}

export const site = {
  /** Troque pelo nome real. É o único nome usado em todo o site. */
  brand: 'Sua Marca',

  /** Domínio público (usado em metadados). Ex.: "https://suamarca.com.br" */
  url: '',

  contact: {
    /** Somente números, com DDI e DDD. Ex.: "5521999999999" */
    whatsapp: '',
    phoneDisplay: '',
    email: '',
    address: '',
    /** Link do Google Maps para o endereço acima. */
    mapsUrl: '',
    hours: [] as { days: string; time: string }[],
  },

  social: [] as { label: string; url: string }[],
  // Exemplo: [{ label: 'Instagram', url: 'https://instagram.com/suamarca' }]

  booking: {
    /**
     * Para onde as solicitações de horário são encaminhadas.
     *  1. `endpoint`: URL que recebe um POST em JSON (Formspree, Make, Zapier,
     *     sua API ou uma função do Supabase). Tem prioridade se preenchido.
     *  2. `contact.whatsapp`: abre o WhatsApp com a mensagem pronta.
     * Sem nenhum dos dois, o formulário avisa que o canal não foi configurado
     * e nunca exibe uma confirmação falsa.
     */
    endpoint: '',
    /** Link de agenda on-line (Calendly, Trinks, Booksy…). Opcional. */
    externalSchedulerUrl: '',
    periods: ['Manhã', 'Tarde', 'Noite'],
  },

  offer: {
    enabled: true,
    eyebrow: 'Ritual da estação',
    title: 'Primeira visita, cuidado por inteiro',
    description:
      'Uma sessão pensada para quem chega pela primeira vez: conversa sobre a sua pele e a sua rotina, limpeza profunda, massagem facial e um protocolo de casa para continuar o cuidado.',
    includes: ['Avaliação de pele', 'Limpeza profunda', 'Massagem facial', 'Rotina para casa'],
    /** Preço e condições reais. Vazio = exibe "Condições sob consulta". */
    price: '',
    conditions: '',
    validUntil: '',
    treatmentId: 'facial-assinatura',
  },

  team: [] as TeamMember[],
  // Exemplo:
  // { name: 'Nome Sobrenome', role: 'Esteticista', credential: 'Registro profissional', bio: '…',
  //   photo: { src: '/equipe/nome.jpg', alt: 'Retrato de Nome Sobrenome' } }

  testimonials: [] as Testimonial[],
  // Use apenas avaliações reais, com autorização. Exemplo:
  // { quote: '…', author: 'Nome S.', source: 'Avaliação no Google' }
}

/* ── Fotografia ─────────────────────────────────────────────── */
/* Curadoria em tons rosados e luz natural. Para usar fotos próprias,
   coloque o arquivo em public/ e troque `src` por '/arquivo.jpg'. */

export const photos = {
  hero: {
    src: 'photo-1531746020798-e6953c6e8e04',
    alt: 'Retrato de mulher com a pele natural e luminosa diante de um fundo rosa',
    focus: '50% 30%',
  },
  heroDetail: {
    src: 'photo-1600428877878-1a0fd85beda8',
    alt: 'Rolo facial de quartzo rosa e frasco de sérum sobre superfície clara',
    focus: '60% 50%',
  },
  heroTexture: {
    src: 'photo-1608068811588-3a67006b7489',
    alt: 'Textura de creme cosmético sobre fundo claro',
    focus: '50% 50%',
  },
  manifesto: {
    src: 'photo-1498843053639-170ff2122f35',
    alt: 'Mão delicada com um fio de creme escorrendo, sobre fundo rosa',
    focus: '50% 40%',
  },
  manifestoDetail: {
    src: 'photo-1576426863848-c21f53c60b19',
    alt: 'Frasco de sérum com conta-gotas dourado sobre pedra clara',
    focus: '50% 50%',
  },
  ritual1: {
    src: 'photo-1620733723572-11c53f73a416',
    alt: 'Difusor de varetas, toalha enrolada e velas acesas',
    focus: '50% 55%',
  },
  ritual2: {
    src: 'photo-1655026392641-bf283a5f12d4',
    alt: 'Mulher aplicando uma gota de sérum facial com conta-gotas',
    focus: '50% 35%',
  },
  ritual3: {
    src: 'photo-1544161515-4ab6ce6db874',
    alt: 'Óleo morno sendo aplicado nas costas durante uma massagem',
    focus: '50% 50%',
  },
  ritual4: {
    src: 'photo-1507652313519-d4e9174996dd',
    alt: 'Banheira oval clara em um ambiente de spa silencioso',
    focus: '50% 60%',
  },
  offer: {
    src: 'photo-1519699047748-de8e457a634e',
    alt: 'Retrato de mulher envolta em névoa suave diante de um fundo rosa',
    focus: '50% 28%',
  },
  craft1: {
    src: 'photo-1610992015732-2449b76344bc',
    alt: 'Mãos com unhas naturais em gesto suave sobre tecido macio',
    focus: '50% 50%',
  },
  craft2: {
    src: 'photo-1519824145371-296894a0daa9',
    alt: 'Mãos de terapeuta conduzindo uma massagem com movimentos lentos',
    focus: '50% 50%',
  },
  craft3: {
    src: 'photo-1617897903246-719242758050',
    alt: 'Frasco de óleo facial com ramos de eucalipto sobre tecido branco',
    focus: '50% 50%',
  },
  closing: {
    src: 'photo-1526047932273-341f2a7631f9',
    alt: 'Mãos segurando um coração feito de flores rosadas',
    focus: '50% 45%',
  },
} satisfies Record<string, Photo>

/* ── Tratamentos (descrições demonstrativas; ajuste à sua carta real) ── */

export const treatments: Treatment[] = [
  {
    id: 'facial-assinatura',
    name: 'Facial de assinatura',
    category: 'Rosto',
    summary:
      'Limpeza, esfoliação suave, máscara e massagem facial ajustadas ao que a sua pele pede naquele dia.',
    image: {
      src: 'photo-1512290923902-8a9f81dc236c',
      alt: 'Mulher de olhos fechados recebendo um tratamento facial',
      focus: '50% 40%',
    },
  },
  {
    id: 'renovacao',
    name: 'Renovação e viço',
    category: 'Rosto',
    summary:
      'Protocolos com ativos para textura, manchas e luminosidade, sempre a partir de uma avaliação.',
    image: {
      src: 'photo-1576426863848-c21f53c60b19',
      alt: 'Frasco de sérum com conta-gotas dourado sobre pedra clara',
      focus: '50% 50%',
    },
  },
  {
    id: 'massagem-relaxante',
    name: 'Massagem relaxante',
    category: 'Corpo',
    summary:
      'Movimentos lentos e contínuos com óleos mornos para soltar a tensão acumulada da semana.',
    image: {
      src: 'photo-1519823551278-64ac92734fb1',
      alt: 'Massagem relaxante nas costas com movimentos longos',
      focus: '50% 50%',
    },
  },
  {
    id: 'pedras-quentes',
    name: 'Pedras quentes',
    category: 'Corpo',
    summary:
      'O calor das pedras basálticas aprofunda o relaxamento muscular e desacelera a respiração.',
    image: {
      src: 'photo-1600334089648-b0d9d3028eb2',
      alt: 'Pedras pretas lisas sobre as costas de uma pessoa deitada na maca',
      focus: '50% 50%',
    },
  },
  {
    id: 'ritual-spa',
    name: 'Ritual de spa',
    category: 'Experiência',
    summary:
      'Rosto e corpo em uma única sessão longa, com chá, silêncio e tempo para voltar devagar.',
    image: {
      src: 'photo-1532926381893-7542290edf1d',
      alt: 'Mulher relaxando em uma banheira diante de uma janela ampla',
      focus: '50% 50%',
    },
  },
]

/* ── Navegação ─────────────────────────────────────────────── */

export const nav = [
  { label: 'Tratamentos', href: '#tratamentos' },
  { label: 'Experiência', href: '#ritual' },
  { label: 'Estação', href: '#oferta' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Contato', href: '#contato' },
]
