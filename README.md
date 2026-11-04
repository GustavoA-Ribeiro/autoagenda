# AutoAgenda — protótipo de agenda automotiva

Protótipo visual e navegável para validar o produto SaaS de agendamentos para estabelecimentos automotivos. Interface em português, com painel de gestão e página de solicitação de horários.

## Como executar

Requisitos: Node.js 20.9+ e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 e, para testar o agendamento público, http://localhost:3000/agendar/detail-auto-center.

## O que esta versão demonstra

- Painel inicial com indicadores simulados.
- Agenda em visualização diária, semanal e mensal.
- Inclusão de agendamentos pelo painel, somente durante a sessão da página.
- Mudança de status de atendimentos na demonstração.
- Listagem de clientes, catálogo de serviços e equipe ilustrativos.
- Página pública com seleção de serviço, dia, horário e solicitação de reserva de demonstração.
- Layout responsivo para celular e desktop.

## Limitações importantes

**Não é um sistema pronto para uso comercial.** Os dados são fictícios, estão definidos no código e não são persistidos no banco. Ao recarregar a página, alterações no painel desaparecem. Solicitações realizadas na página pública não chegam ao painel, não bloqueiam horários e não são enviadas a ninguém. Não há autenticação, notificações, pagamentos, regras de conflito de agenda, tenant real nem integração com Supabase implementados. Botões e campos auxiliares de configurações, clientes e equipe são ilustrativos, podendo não salvar dados.

Não use dados pessoais reais enquanto o backend, a autenticação e a proteção de dados não forem implementados.

## Próxima fase recomendada

1. Autenticação e identificação de cada estabelecimento com Supabase Auth.
2. PostgreSQL com políticas Row Level Security testadas, por estabelecimento.
3. CRUD real de serviços, funcionários, clientes, veículos e agendamentos.
4. API server-side para disponibilidade e reservas atômicas, prevenindo conflitos.
5. Página pública vinculada ao estabelecimento correto e consentimento/LGPD.
6. Testes de permissões, mobile, envio de confirmações e deploy.

## Estrutura

- `app/page.tsx`: painel administrativo demonstrativo.
- `app/agendar/[slug]/page.tsx`: página pública demonstrativa.
- `components/`: componentes React do painel e do agendamento.
- `lib/demo-data.ts`: dados fictícios.
- `app/globals.css`: aparência responsiva.
