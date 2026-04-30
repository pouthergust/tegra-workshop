# Test Case — Fluxo principal (Frontend-only + MUI + localStorage)

## Descrição

Este caso de teste valida o fluxo principal do produto **Gestão de Contratos Inteligente** na versão **frontend-only**, garantindo que:

- O usuário consegue navegar do marketing (landing) até o app.
- O CRUD de contratos funciona e persiste em **localStorage**.
- Upload lida com limite do **localStorage** (fallback para metadata_only).
- Fluxos simulados (extração IA, aprovação e assinatura) atualizam status e trilha de auditoria local.

## Sumário

- Objetivo
- Escopo
- Pré-requisitos
- Massa de dados
- Passo a passo
- Critérios de aceite
- Notas
- Changelog

## Objetivo

Validar a jornada end-to-end:

Landing → envio de lead → login simulado → criar contrato → upload → extração mock → revisão → aprovação mock → assinatura mock → auditoria.

## Escopo

### Inclui

- Rotas: /, /produto/gestao-contratos-inteligente, /app/login, /app, /app/contratos, /app/contratos/novo, /app/contratos/:id, /app/configuracoes/auditoria
- Persistência local: `tegra:gci:v1:session` e `tegra:gci:v1:data`
- Componentes MUI (mínimo verificável):
  - AppBar, Drawer, Tabs, Card, Dialog, Snackbar, DataGrid/Table, TextField, Select, Chip, Stepper, Backdrop/CircularProgress

### Não inclui

- Validação de integração real (IA/assinatura) com provedores externos
- Segurança real de credenciais (sem backend)

## Pré-requisitos

- Aplicação rodando em ambiente local (SPA).
- localStorage habilitado no navegador.
- Ambiente inicial limpo:
  - `localStorage.clear()` ou “Resetar dados demo” disponível na UI.

## Massa de dados

### Usuário

- Selecionar um usuário de demonstração com role “Gestor” (ou equivalente).

### Arquivos de teste

- Arquivo pequeno: `contrato_pequeno.pdf` (tamanho baixo o suficiente para Base64 caber no localStorage).
- Arquivo grande: `contrato_grande.pdf` (tamanho alto o suficiente para provocar fallback para `metadata_only`).

Se não houver arquivos reais, usar qualquer PDF e ajustar a condição pelo limiar configurado no app.

## Passo a passo

### Parte A — Lead na landing

1. Acessar `/`.
2. Clicar no CTA para formulário de lead.
3. Preencher nome, empresa, e-mail, telefone e mensagem.
4. Enviar o formulário.

**Resultados esperados**

- Exibir confirmação (Snackbar ou Alert).
- Persistir lead em `localStorage` (lista `leads[]` em `tegra:gci:v1:data`).
- Não navegar para /app automaticamente (exceto se definido como requisito).

### Parte B — Login simulado e sessão persistente

1. Acessar `/app/login`.
2. Selecionar tenant (se aplicável) e usuário demo.
3. Confirmar login.
4. Recarregar a página (F5).

**Resultados esperados**

- Redirecionar para `/app` após login.
- Sessão persistida em `tegra:gci:v1:session`.
- Após refresh, manter usuário logado e permanecer em rota protegida.

### Parte C — Criar contrato (CRUD + persistência)

1. Ir para `/app/contratos`.
2. Clicar em “Novo contrato”.
3. Preencher:
   - título, contraparte, tipo, valor, moeda, datas de início/fim, autoRenew
   - tags (ao menos 1)
   - responsável
4. Salvar.
5. Voltar para a lista de contratos.
6. Recarregar a página.

**Resultados esperados**

- Contrato aparece na listagem com status padrão.
- Contrato permanece após refresh (persistência em `contracts[]`).
- Listagem permite busca por título e filtro por status.

### Parte D — Upload com Base64 (arquivo pequeno)

1. Abrir o detalhe do contrato `/app/contratos/:id`.
2. Ir na aba “Documento”.
3. Fazer upload do arquivo pequeno.
4. Confirmar modo de armazenamento “base64” (se houver seletor).

**Resultados esperados**

- Criar nova versão em `contractFiles[]` com `storageMode = "base64"`.
- Se PDF, exibir preview (object/iframe) sem quebrar layout.
- Exibir status/feedback de sucesso (Snackbar).

### Parte E — Upload com fallback (arquivo grande)

1. Ainda no contrato, fazer upload do arquivo grande.

**Resultados esperados**

- Se ultrapassar quota:
  - Exibir Dialog explicando o limite.
  - Salvar versão com `storageMode = "metadata_only"`.
- No preview, exibir estado “arquivo não armazenado”.
- O app continua responsivo (sem travar) e sem quebrar navegação.

### Parte F — Extração IA (mock) + revisão

1. Ir na aba “Extração IA”.
2. Clicar em “Rodar extração”.
3. Aguardar a simulação (Backdrop/CircularProgress).
4. Revisar ao menos 2 campos:
  - editar valor
  - marcar como revisado
5. Ir em “Riscos/Cláusulas” e marcar 1 cláusula como revisada.

**Resultados esperados**

- Criar/atualizar registro em `extractions[]` com status `done`.
- Campos exibem confiança e evidência.
- Campos revisados armazenam `reviewedAt` e `reviewedByUserId`.
- Cláusula revisada persiste `reviewedAt`.
- Status do contrato evolui (ex.: “Em revisão”).

### Parte G — Aprovação (mock)

1. Ir na aba “Aprovações”.
2. Iniciar fluxo de aprovação (selecionar flow por tipo).
3. Executar decisão da etapa atual: “aprovar”.
4. Repetir até finalizar o fluxo (quando aplicável).

**Resultados esperados**

- Criar `approvalInstance` vinculada ao contrato.
- Registrar decisões em `approvalInstances[].steps[]`.
- Ao final, status do contrato evolui (ex.: “Aprovado”).
- Ações geram logs em `auditLogs[]` (ex.: approval_started, approval_decided).

### Parte H — Assinatura (mock)

1. Ir na aba “Assinatura”.
2. Clicar “Enviar para assinatura”.
3. Aguardar mudança de status (simulada).

**Resultados esperados**

- Atualizar estado de assinatura (ex.: enviado → concluído) em storage local.
- Status do contrato evolui para “Assinado/Concluído” (conforme regra definida no app).
- Registrar evento em `auditLogs[]`.

### Parte I — Auditoria

1. Ir em `/app/configuracoes/auditoria` (como Admin) ou tela equivalente.
2. Filtrar pelos eventos do contrato testado.

**Resultados esperados**

- Existem entradas para: login, contract_created/updated, file_uploaded, extraction_completed, field_reviewed, approval_started/decided, signature_sent/completed.
- Os registros contêm `actorUserId`, timestamps e metadata mínima (entityId).

## Critérios de aceite

- Todo o fluxo é concluído sem backend e sem falhas de navegação.
- Os dados persistem após refresh em pontos críticos: sessão, contrato, arquivos (quando aplicável), extração, aprovação, assinatura, auditoria.
- A UI utiliza componentes MUI conforme especificado (visualmente e estruturalmente).
- O fallback `metadata_only` ocorre com UX clara quando o localStorage não comporta Base64.

## Notas

- Este caso de teste pode ser executado manualmente (QA exploratório guiado).
- Para automação futura (Playwright/Cypress), os elementos críticos devem ter `data-testid`.

## Changelog

- 2026-04-30 14:39 — criação inicial

