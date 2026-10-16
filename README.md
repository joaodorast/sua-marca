# Sua Marca — site de estética e spa

React + TypeScript + Vite + Tailwind CSS + Motion + Lucide.

## Rodar e publicar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a pasta dist/, pronta para Vercel, Netlify ou qualquer hospedagem estática
```

Depois do `npm run build`, a pasta `dist/` pode ser arrastada direto para o Netlify Drop.

## O que configurar antes de publicar

Tudo fica em `src/config/site.ts`. O site não inventa nenhum dado do negócio: campo vazio não aparece, e nenhuma seção exibe avisos técnicos ao público.

| Campo | O que é |
|---|---|
| `brand` | Nome real da marca (troque também `<title>` e `og:` em `index.html`). |
| `contact.whatsapp` | Número com DDI e DDD, só dígitos (ex.: `5521999999999`). Ativa o envio de pedidos pelo WhatsApp e o botão "Conversar no WhatsApp". |
| `booking.endpoint` | Opcional. URL que recebe os pedidos em POST JSON (Formspree, Make, Zapier, função do Supabase, sua API). Tem prioridade sobre o WhatsApp. |
| `booking.externalSchedulerUrl` | Opcional. Link de agenda on-line (Calendly, Trinks, Booksy…). |
| `contact.*`, `social` | Telefone, e-mail, endereço, horários e redes do rodapé. |
| `offer` | Bloco promocional. Preencha `price`, `conditions` e `validUntil` com as condições reais ou use `enabled: false`. |
| `team` | Equipe real (nome, função, registro, bio, retrato). Vazia = a seção Especialistas apresenta a abordagem da equipe, sem nomes. |
| `testimonials` | Apenas avaliações reais e autorizadas. Vazia = bloco editorial neutro, sem citações. |
| `treatments` | Sua carta de tratamentos; `duration` e `price` são opcionais. |
| `photos` | IDs do Unsplash ou caminhos de fotos próprias (coloque em `public/` e use `/arquivo.jpg`). |

### Como o agendamento funciona

O formulário valida nome, celular, tratamento e período. Depois:

1. com `booking.endpoint`: envia o JSON e mostra "Pedido recebido" só se o servidor responder 2xx;
2. com `contact.whatsapp`: abre o WhatsApp com a mensagem pronta;
3. sem nenhum dos dois: avisa que o pedido não foi enviado.

Em nenhum caso o site diz que o horário está reservado. A confirmação é sempre da equipe.

Campos enviados ao endpoint: `nome`, `telefone`, `tratamento`, `tratamento_id`, `data_preferida`, `periodo`, `observacoes`, `origem`, `enviado_em`.

## Fotografias

Fotos do [Unsplash](https://unsplash.com), carregadas direto do CDN deles em tamanhos responsivos. Antes de publicar, abra o site e confira cada imagem; troque qualquer uma que não combine com a marca editando `src/config/site.ts`.
