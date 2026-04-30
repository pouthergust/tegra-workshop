# PRD — Frontend-only (React + MUI + localStorage) — Gestão de Contratos Inteligente

## Descrição

Este documento especifica a versão **frontend-only** do módulo **Gestão de Contratos Inteligente**, sem backend e sem APIs externas obrigatórias. Toda a persistência deve ocorrer em **localStorage** (e, quando necessário por limitação do navegador, em memória com degradação controlada).

Objetivo: permitir que uma LLM gere um projeto React completo (layout, navegação, componentes, estado, persistência, mocks e dados de demonstração), com **uso prioritário de componentes MUI**.

## Sumário

- Premissas e limitações
- Stack e dependências
- Arquitetura de informação e rotas
- Design system (MUI)
- Modelo de dados (frontend)
- Persistência (localStorage)
- Requisitos funcionais (frontend)
- Interações e estados de tela
- Dados de demonstração (seed)
- Critérios de aceite
- Changelog

## Premissas e Limitações

- Não há backend: autenticação, autorização e multi-tenant são simulados no cliente.
- O produto deve funcionar offline (quando possível) porque depende de dados locais.
- Upload e “documentos” devem ser tratados com estratégias compatíveis com navegador:
  - Para MVP: armazenar metadados e referência (nome, tamanho, tipo) e, opcionalmente, Base64 com limite (configurável).
  - PDFs grandes podem exceder o limite do localStorage; nesses casos, a UI deve avisar e permitir seguir sem armazenar o binário (apenas metadados).
- “IA” e “assinatura eletrônica” devem ser simuladas com um provedor mock determinístico (sem chamadas externas).

## Stack e Dependências

### Stack alvo

- React + TypeScript
- MUI (Material UI) como biblioteca padrão de componentes
- React Router (SPA) para rotas
- Gerenciamento de estado:
  - Preferência: Zustand ou Redux Toolkit
  - Alternativa: Context + useReducer

### Dependências mínimas sugeridas

- @mui/material, @emotion/react, @emotion/styled
- @mui/icons-material
- @mui/x-data-grid (opcional, para tabelas ricas; usar versão community)
- react-router-dom
- date-fns (opcional, datas)
- zod (opcional, validação de formulários)

## Arquitetura de Informação e Rotas

### Rotas públicas

- / (landing)
- /produto/gestao-contratos-inteligente (landing detalhada)

### Rotas do app (protegidas)

- /app/login
- /app (dashboard)
- /app/contratos
- /app/contratos/novo
- /app/contratos/:id
- /app/relatorios
- /app/configuracoes
  - /app/configuracoes/usuarios
  - /app/configuracoes/tipos-e-tags
  - /app/configuracoes/fluxos
  - /app/configuracoes/integracoes (apenas mock)
  - /app/configuracoes/auditoria

## Design System (MUI)

### Direção visual

- Tema escuro por padrão (modo dark), com:
  - Primary: teal/verde-água
  - Secondary/acento: laranja (CTAs)
  - Background: variações de cinza/azul escuro
- Tipografia forte em títulos e hierarquia clara.

### Componentes MUI obrigatórios por área

- Layout e navegação:
  - AppBar, Toolbar
  - Drawer (menu lateral) + List/ListItemButton
  - Breadcrumbs (quando útil)
  - Tabs (abas no detalhe do contrato)
- Conteúdo e feedback:
  - Card, Paper, Container, Box, Stack, Divider
  - Chip (tags/status)
  - Alert, Snackbar, Dialog, Backdrop + CircularProgress
  - Skeleton (carregamento)
- Formulários:
  - TextField, Select, MenuItem, Autocomplete
  - DatePicker (se usar MUI X) ou TextField com máscara simples
  - Switch/Checkbox/Radio
  - FormHelperText
- Dados:
  - DataGrid (preferencial) ou Table/TableBody/TableRow
  - Pagination (se usar Table simples)
- Ações:
  - Button, IconButton, ButtonGroup
  - SpeedDial (opcional, ações rápidas)

## Modelo de Dados (frontend)

### Entidades (interfaces TypeScript)

- Tenant
  - id, name
- User
  - id, tenantId, name, email, role, status, createdAt
- Contract
  - id, tenantId
  - title, counterparty, type, status
  - value (number), currency
  - startDate, endDate, autoRenew, renewalDate
  - ownerUserId
  - tags (string[])
  - createdAt, updatedAt, deletedAt?
- ContractFile
  - id, contractId, versionNumber
  - fileName, mimeType, sizeBytes
  - storageMode: "metadata_only" | "base64"
  - base64Data?: string
  - uploadedAt, uploadedByUserId
- Extraction
  - contractFileId, status: "idle" | "running" | "done" | "failed"
  - summary
  - fields: ExtractedField[]
  - clauses: CriticalClause[]
- ExtractedField
  - id, key, label, value, confidence (0–1)
  - evidenceSnippet
  - reviewedAt?, reviewedByUserId?
- CriticalClause
  - id, type, summary, riskLevel: "low" | "med" | "high"
  - evidenceSnippet
  - reviewedAt?
- ApprovalFlow
  - id, tenantId, contractType, steps: ApprovalStepTemplate[]
- ApprovalStepTemplate
  - stepIndex, name, role: "Admin" | "Gestor" | "Revisor" | "Leitor"
- ApprovalInstance
  - id, contractId, flowId
  - status: "not_started" | "in_progress" | "approved" | "changes_requested" | "rejected"
  - currentStepIndex
  - steps: ApprovalStepInstance[]
  - createdAt, completedAt?
- ApprovalStepInstance
  - stepIndex, status: "pending" | "approved" | "changes_requested" | "rejected"
  - decidedAt?, decidedByUserId?, comment?
- Comment
  - id, contractId, authorUserId, body, createdAt
- Task
  - id, contractId, title, assigneeUserId, dueDate, status, createdAt
- Notification
  - id, userId, type, payload, readAt?, createdAt
- AuditLog
  - id, tenantId, actorUserId
  - action, entityType, entityId, metadata, createdAt
- Lead
  - id, name, company, email, phone?, message?, createdAt, consentAt

## Persistência (localStorage)

### Estratégia

- Criar um “Storage Layer” com:
  - get/set/remove por chave
  - validação do shape (opcional com zod)
  - migração por versão
  - debounce para escrituras frequentes
- Estruturar keys por namespace e versão:
  - tegra:gci:v1:session
  - tegra:gci:v1:data
  - tegra:gci:v1:settings

### Shapes sugeridos

- Session
  - currentTenantId
  - currentUserId
  - loggedInAt
- Data
  - tenants[]
  - users[]
  - contracts[]
  - contractFiles[]
  - extractions[]
  - approvalFlows[]
  - approvalInstances[]
  - comments[]
  - tasks[]
  - notifications[]
  - auditLogs[]
  - leads[]

### Limites e UX

- Se falhar ao persistir (quota exceeded):
  - Exibir Dialog com explicação
  - Oferecer “salvar sem arquivo” (metadata_only)
  - Sugerir limpeza/expurgo de contratos antigos (soft delete + purge)

## Requisitos Funcionais (frontend)

### 1) Sessão e RBAC (simulado)

- Login com seletor de “conta/tenant” (demo) e e-mail.
- Senha não é necessária (MVP frontend-only) ou pode ser um campo com validação simples sem segurança real.
- A navegação deve respeitar RBAC:
  - Admin vê configurações e auditoria
  - Gestor/Revisor vê contratos e aprovações
  - Leitor vê apenas consulta e exportação
- Guard de rota: rotas /app exigem session válida.

### 2) Dashboard

- Cards com:
  - Contratos por status
  - Vencimentos próximos (próximos 30 dias)
  - Pendências de aprovação
  - Alertas ativos
- Lista rápida “Minhas tarefas”.

### 3) Lista de contratos

- Tabela com:
  - colunas: título, contraparte, tipo, status, vigência (fim), valor, responsável
  - filtros: status, tipo, tags, responsável, intervalo de datas
  - busca textual
- Ações por linha:
  - abrir detalhe
  - duplicar (criar novo contrato com base)
  - excluir (soft delete)

### 4) Criar/editar contrato

- Formulário com validação e autosave (salvar rascunho).
- Upload de arquivo (PDF/DOCX) com:
  - preview do nome/tamanho
  - escolha do modo de armazenamento (metadata_only/base64), com recomendação automática baseada no tamanho.

### 5) Detalhe do contrato (abas)

- Aba Visão geral:
  - metadados, tags, responsável, stepper de status
- Aba Documento:
  - lista de versões (ContractFile)
  - preview:
    - se PDF e base64 disponível: exibir em iframe/object
    - se apenas metadata: exibir placeholder de “arquivo não armazenado”
- Aba Extração IA (mock):
  - botão “Rodar extração” (simulado com delay)
  - tabela de campos com confiança, evidência e ação “Revisar”
  - resumo executivo gerado
- Aba Riscos/Cláusulas (mock):
  - lista de cláusulas críticas com riskLevel e evidência
  - ação “Marcar como revisado”
- Aba Comentários e Tarefas:
  - feed de comentários
  - criação de tarefa com responsável e data
- Aba Aprovações:
  - iniciar fluxo (seleciona flow por tipo)
  - decidir etapa (aprovar/solicitar ajustes/rejeitar)
  - trilha das decisões
- Aba Assinatura (mock):
  - botão “Enviar para assinatura”
  - simulação de status (enviado → aguardando → concluído)
  - salvar “comprovante” mock como texto/artefato local

### 6) Configurações (Admin)

- Usuários:
  - CRUD local de usuários
  - atribuição de tenant e role
- Tipos e tags:
  - CRUD local (string)
- Fluxos:
  - CRUD local de ApprovalFlow (por tipo)
- Auditoria:
  - tabela de AuditLog com filtros

### 7) Landing do produto

- Seções:
  - Hero (proposta de valor, CTA)
  - Benefícios por persona
  - “Como funciona” (Assessment → Prototipação → Execução → QA & Validação)
  - Prova social (texto)
  - Formulário de lead
- Ao enviar lead:
  - validação de campos
  - salvar em localStorage e exibir confirmação (Snackbar)

## Interações e Estados de Tela

- Carregamento:
  - Skeleton em listas e cards
  - Backdrop com progresso durante “extração” e “assinatura” mock
- Erros:
  - Alert inline no topo da página (com opção de detalhes)
  - Dialog para erros críticos (quota exceeded / corrupção de dados)
- Empty states:
  - ilustrações simples via MUI (ícone + texto) para “sem contratos”, “sem tarefas”, “sem comentários”.

## Dados de Demonstração (seed)

- Gerar automaticamente na primeira execução:
  - 2 tenants (ex.: “Tegra Demo” e “Cliente Piloto”)
  - 6 usuários (roles variadas)
  - 10 contratos com variação de status e datas
  - 3 fluxos de aprovação (por tipo)
- Deve existir uma ação em Configurações:
  - “Resetar dados demo” (limpar localStorage do app)

## Critérios de Aceite (frontend-only)

- A aplicação roda sem backend e sem dependências externas obrigatórias.
- A sessão de usuário e todos os dados CRUD persistem após refresh (localStorage).
- O layout principal usa componentes MUI (AppBar, Drawer, Cards, DataGrid/Table, Tabs, Dialog/Snackbar).
- Fluxo completo navegável:
  - login → criar contrato → upload → extração mock → revisão → aprovação → assinatura mock → alertas/pendências.
- O app lida com limites do localStorage para arquivos (metadata_only) com UX clara.

## Changelog

- 2026-04-30 13:49 — criação inicial

