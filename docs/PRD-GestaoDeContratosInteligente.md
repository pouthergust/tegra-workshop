# PRD — Gestão de Contratos Inteligente (Tegra)

## Descrição

Este PRD define um produto web (landing + aplicação) para lançamento em 30 dias: **Gestão de Contratos Inteligente**, um módulo SaaS B2B que centraliza contratos, automatiza extração e revisão com IA, padroniza aprovações e reduz risco operacional.

O documento foi escrito para permitir que uma LLM gere um projeto de ponta a ponta (UI, backend, dados, autenticação, auditoria, testes e deploy) com clareza de escopo, regras e critérios de aceite.

Para uma especificação **frontend-only** (sem backend), com **React + MUI** e persistência em **localStorage**, usar também: [PRD-FrontendOnly-MUI-LocalStorage.md](file:///Users/tegra/code/projects/tegra_ai_workshop/ws/docs/PRD-FrontendOnly-MUI-LocalStorage.md).

## Sumário

- Contexto e visão
- Objetivos e métricas
- Personas e JTBD
- Escopo (in/out)
- Requisitos funcionais
- Requisitos não-funcionais
- UX/UI e arquitetura da informação
- Modelo de dados
- APIs e integrações
- Segurança, compliance e auditoria
- Observabilidade e analytics
- Plano de entrega (30 dias)
- Critérios de aceite
- Riscos e decisões abertas
- Changelog

## Contexto e Visão

### Contexto

- Empresas médias e grandes lidam com contratos espalhados (e-mail, pastas, ERPs), aprovações manuais e pouca rastreabilidade.
- O custo de não conformidade (prazos, cláusulas críticas, renovações automáticas, multas) é alto.
- O módulo deve refletir a proposta de valor da Tegra: “simplificamos o complexo e aceleramos resultados com IA”.

### Visão do Produto

“Uma central de contratos que transforma documentos em dados confiáveis, automatiza revisões e aprovações e cria previsibilidade de risco e prazos com IA.”

## Objetivos e Métricas

### Objetivos (30 dias de go-live)

- Disponibilizar um MVP funcional para clientes piloto (multi-tenant) com fluxo completo de: cadastro → upload → extração → revisão → aprovação → assinatura (integração) → acompanhamento.
- Entregar uma landing page do produto para suporte a GTM (captação e demo).

### Métricas (KPIs)

- Tempo médio do upload à aprovação (baseline vs. após adoção).
- % de campos extraídos com confirmação do usuário (taxa de acerto percebida).
- % de contratos com alertas configurados (renovação/vencimento).
- Adoção: contratos ativos por conta, usuários ativos (WAU/MAU).
- Eficiência: redução de retrabalho (reuploads/erros), tempo de busca.

## Personas e JTBD

### Persona 1 — Jurídico/Contratos

- Objetivo: reduzir risco e padronizar cláusulas e aprovações.
- Dores: falta de rastreabilidade, versões, prazos e cláusulas críticas.
- Sucesso: auditoria fácil, alertas confiáveis, trilha de aprovação.

### Persona 2 — Compras/Procurement

- Objetivo: negociar melhor e reduzir tempo de ciclo.
- Dores: dependência do jurídico, contratos sem metadados, prazos perdidos.
- Sucesso: visão de valores/prazos/renovações e status do fluxo.

### Persona 3 — Financeiro

- Objetivo: previsibilidade de pagamentos e obrigações.
- Dores: anexos sem estrutura, datas divergentes, multas.
- Sucesso: campos confiáveis (valor, vigência, reajustes), exportações.

### Persona 4 — TI/Operações (Admin)

- Objetivo: governança, acesso, integrações e compliance.
- Dores: permissões, logs, SSO, dados sensíveis.
- Sucesso: RBAC, auditoria, integrações e controles LGPD.

## Escopo

### Dentro do escopo (MVP)

- Conta (tenant) + usuários + RBAC.
- Repositório de contratos (upload, versões, tags, pesquisa).
- Extração assistida por IA de campos e cláusulas.
- Checklist de risco e “itens críticos” com revisão humana.
- Fluxo de aprovação configurável (simples) + trilha de auditoria.
- Integração de assinatura eletrônica (1 provedor) e registro do status.
- Alertas de vencimento/renovação e tarefas.
- Relatórios básicos e exportação CSV.
- Landing page com formulário de lead e CTA de demo.

### Fora do escopo (por enquanto)

- Editor avançado de cláusulas (word-like) e comparação semântica profunda.
- Treinamento contínuo de modelos customizados por cliente.
- Gestão financeira completa (contas a pagar/receber).
- Marketplace de integrações.
- OCR avançado e suporte a dezenas de tipos de documentos complexos.

## Requisitos Funcionais

### 1) Autenticação, Conta e RBAC

- Login por e-mail e senha (MVP) e recuperação de senha.
- Estrutura multi-tenant: cada usuário pertence a uma organização.
- Perfis mínimos:
  - Admin (gestão de usuários, permissões, integrações, políticas)
  - Gestor (cria/edita contratos, configura fluxo, aprova)
  - Revisor (revisa extrações e cláusulas, comenta, aprova)
  - Leitor (consulta e exporta conforme permissão)
- Permissões por recurso: contratos, aprovações, relatórios, integrações.

### 2) Cadastro de Contrato

- Criar contrato via:
  - Upload de arquivo (PDF/DOCX) e metadados mínimos
  - Registro manual (sem arquivo) para casos de referência
- Campos mínimos (editáveis): título, contraparte, tipo, valor, moeda, datas (início/fim), renovação, status, centro de custo (opcional), responsável.
- Tags e categorias configuráveis por tenant.
- Versionamento do arquivo e do conjunto de metadados (registro histórico).

### 3) Extração Assistida por IA

- Após upload, executar pipeline:
  - (Opcional) OCR se PDF escaneado
  - Extração estruturada dos campos-chave
  - Identificação de cláusulas críticas (ex.: multa, renovação automática, reajuste, SLA, confidencialidade, rescisão)
  - Geração de “resumo executivo” do contrato
- A UI deve permitir:
  - Ver campos extraídos com confiança (confidence) e evidência (trecho/fonte)
  - Confirmar/editar campos (human-in-the-loop)
  - Marcar itens como “revisado”
- Persistir status: “Aguardando extração”, “Extraído”, “Em revisão”, “Aprovado”.

### 4) Revisão, Comentários e Tarefas

- Comentários por contrato (thread simples) e menções (@).
- Checklist de revisão (por tipo de contrato) com itens marcáveis.
- Tarefas: criar tarefas vinculadas ao contrato (ex.: “validar cláusula X”) com responsável e data.

### 5) Aprovação e Fluxo

- Fluxo simples configurável por tipo de contrato:
  - Etapas sequenciais (ex.: Revisor → Jurídico → Gestor)
  - Um aprovador por etapa (MVP) ou grupo (opcional)
- Ações: aprovar, solicitar ajuste (com comentário), rejeitar.
- Regra: não permitir envio para assinatura sem todas as etapas aprovadas.
- Registrar auditoria: quem fez, quando, ação e justificativa.

### 6) Assinatura Eletrônica (Integração)

- Integração com 1 provedor (ex.: DocuSign/Clicksign/Outro) via API.
- Fluxo:
  - Enviar documento final para assinatura
  - Acompanhar status (enviado, aguardando, concluído, expirado, cancelado)
  - Armazenar arquivo assinado e prova (quando disponível)
- Modo “simulador” para ambiente local/dev sem credenciais reais.

### 7) Alertas e Renovação

- Alertas automáticos com regras padrão por tenant:
  - X dias antes do vencimento
  - X dias antes da renovação automática
- Canal: e-mail (MVP) e centro de notificações in-app.
- Cada alerta gera uma tarefa/pendência para rastrear ação.

### 8) Busca, Filtros e Relatórios

- Busca por texto (título, contraparte, tags) + filtros (status, datas, tipo, responsável).
- Dashboard: contratos por status, vencimentos próximos, pendências de aprovação.
- Exportação CSV de lista filtrada.

### 9) Landing Page (GTM)

- Página pública do produto com:
  - Proposta de valor (IA + governança + redução de risco)
  - Benefícios por persona (jurídico, compras, financeiro, TI)
  - Seção de prova social (texto) e CTA para contato/demo
  - Formulário de lead (nome, empresa, e-mail, telefone, mensagem)
- Envio do lead para:
  - E-mail interno e/ou webhook (MVP)
  - Registro em banco para consulta interna (opcional)

## Requisitos Não-Funcionais

### Segurança

- Senhas com hashing forte (bcrypt/argon2).
- Cookies seguros (HttpOnly, Secure) e proteção CSRF conforme abordagem escolhida.
- Autorização sempre server-side por tenant e permissão.
- Upload seguro:
  - Limites de tamanho (ex.: 20–50MB configurável)
  - Whitelist de tipos (PDF/DOCX)
  - Antivirus/scan (planejar; MVP pode apenas registrar e limitar)
- Criptografia em repouso para arquivos e dados sensíveis (planejar; mínimo via storage seguro + secrets manager).

### Confiabilidade e Performance

- Processamento assíncrono de extração (fila/background worker).
- SLA MVP: p95 < 2s para páginas principais; extração depende do documento, com progresso.
- Backups diários (db) e retenção configurável.

### Compliance (LGPD)

- Base legal e propósito: gestão de contratos do cliente.
- Controles: RBAC, audit trail, retenção, exportação e exclusão sob solicitação (MVP: exclusão lógica + trilha).
- Registro de consentimento do formulário (landing).

### Acessibilidade e UX

- Navegação por teclado e contraste adequado.
- Estados de carregamento, vazio e erro bem definidos.

## UX/UI e Arquitetura da Informação

### Direção visual (referência)

- Seguir linguagem da Tegra: foco em clareza, IA aplicada, e estética moderna.
- Sugestão de tema compatível com a identidade observada no material: base escura, destaque em tons teal/verde-água e acentos em laranja para CTA.

### Mapa de telas (App)

- Autenticação
  - /app/login
  - /app/recuperar-senha
- Home/Dashboard
  - /app (KPIs, pendências, vencimentos próximos)
- Contratos
  - /app/contratos (lista + filtros)
  - /app/contratos/novo
  - /app/contratos/:id (detalhe com abas)
    - Visão geral (metadados, status, responsáveis)
    - Documento e versões
    - Extração IA (campos + evidências)
    - Riscos/Cláusulas críticas
    - Comentários e tarefas
    - Aprovações
    - Assinatura
- Relatórios
  - /app/relatorios
- Configurações (Admin)
  - /app/configuracoes/usuarios
  - /app/configuracoes/tipos-e-tags
  - /app/configuracoes/fluxos
  - /app/configuracoes/integracoes

### Mapa de telas (Público)

- /
- /produto/gestao-contratos-inteligente
- /contato (ou seção)

### Componentes de UI (mínimo)

- Tabela com filtros persistentes
- Drawer/modal para ações rápidas
- Stepper de status (extração → revisão → aprovação → assinatura)
- Visor de documento (PDF) com destaque de trechos referenciados pela extração
- Centro de notificações (in-app)

## Modelo de Dados (mínimo)

### Entidades

- Tenant
  - id, nome, dominio (opcional), createdAt
- User
  - id, tenantId, nome, email, passwordHash, status, createdAt, lastLoginAt
- Role / Permission (RBAC)
  - roleId, permissions[]
- Contract
  - id, tenantId, title, counterparty, type, status, value, currency
  - startDate, endDate, renewalDate (opcional), autoRenew (bool)
  - ownerUserId, tags[], createdAt, updatedAt, deletedAt (soft delete)
- ContractVersion
  - id, contractId, versionNumber, fileRef, fileName, fileMime, fileSize, uploadedByUserId, uploadedAt
- ExtractionJob
  - id, contractVersionId, status (queued/running/succeeded/failed), provider, startedAt, finishedAt, error
- ExtractedField
  - id, contractVersionId, fieldKey, value, confidence, sourceSnippet, sourcePage (opcional), reviewedByUserId, reviewedAt
- CriticalClause
  - id, contractVersionId, clauseType, summary, riskLevel (low/med/high), evidenceSnippet, reviewedAt
- ApprovalFlow
  - id, tenantId, contractType, steps[]
- ApprovalInstance
  - id, contractId, flowId, status, currentStepIndex, createdAt, completedAt
- ApprovalStepInstance
  - id, approvalInstanceId, stepIndex, assigneeUserId (ou groupId), status, decidedAt, comment
- Task
  - id, contractId, title, assigneeUserId, dueDate, status, createdAt
- Comment
  - id, contractId, authorUserId, body, createdAt
- Notification
  - id, tenantId, userId, type, payload, readAt, createdAt
- AuditLog
  - id, tenantId, actorUserId, action, entityType, entityId, metadataJson, createdAt, ip (opcional)
- Lead (landing)
  - id, name, company, email, phone, message, source, createdAt, consentAt, ip (opcional)

## APIs e Integrações

### API (padrão)

- REST JSON (MVP) com versionamento /api/v1.
- Autenticação por sessão (cookie) ou JWT (definir na implementação).

### Endpoints (mínimos)

- Auth
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - POST /api/v1/auth/forgot-password
  - POST /api/v1/auth/reset-password
- Users (Admin)
  - GET/POST /api/v1/users
  - PATCH /api/v1/users/:id
- Contracts
  - GET/POST /api/v1/contracts
  - GET/PATCH /api/v1/contracts/:id
  - POST /api/v1/contracts/:id/versions (upload)
  - POST /api/v1/contracts/:id/extract (trigger)
- Extraction
  - GET /api/v1/contracts/:id/extraction (status + fields)
  - PATCH /api/v1/contracts/:id/extracted-fields/:fieldId (review)
- Approvals
  - POST /api/v1/contracts/:id/approvals/start
  - POST /api/v1/contracts/:id/approvals/:approvalId/decide (approve/request_changes/reject)
- Signature
  - POST /api/v1/contracts/:id/signature/send
  - GET /api/v1/contracts/:id/signature/status
- Alerts/Notifications
  - GET /api/v1/notifications
  - POST /api/v1/contracts/:id/alerts (config)
- Leads (Landing)
  - POST /api/v1/leads

### Integração de IA (abstração)

- Camada “AI Provider” com interface única para:
  - extração de campos (schema definido por tipo de contrato)
  - identificação de cláusulas críticas
  - sumarização
- MVP: 1 provedor configurável por env; armazenar prompts e versões (sem logs de dados sensíveis em plaintext).

### Armazenamento de arquivos

- Storage compatível com S3 (ou equivalente) com URLs assinadas.
- Alternativa MVP local: filesystem + path seguro (apenas em dev).

## Segurança, Compliance e Auditoria

### Auditoria (MVP obrigatório)

- Registrar eventos: login, upload, alterações de campo, aprovação/rejeição, envio/retorno de assinatura, exclusão/restauração.
- Consultável por Admin (tela simples) e exportável (CSV).

### Proteção de dados

- Separação rígida por tenant em todas as queries.
- Sanitização de uploads e limites.
- Política de retenção e soft delete.

## Observabilidade e Analytics

### Logs e métricas

- Logs estruturados com correlationId por request.
- Métricas: tempo de resposta, fila de extração, taxa de erro, tempo de extração por tamanho.

### Eventos de produto (analytics)

- contract_uploaded
- extraction_completed
- field_reviewed
- approval_started
- approval_decided
- signature_sent
- signature_completed
- alert_triggered
- lead_submitted

## Plano de Entrega (30 dias)

### Fase 1 — Base (semana 1)

- Setup do repositório, CI, lint, testes base
- Auth + RBAC + multi-tenant
- Estrutura de contratos + upload + storage
- Landing page do produto + endpoint de lead

### Fase 2 — IA e revisão (semana 2)

- Pipeline assíncrono + UI de extração e revisão
- Campos e evidências + persistência
- Logs e auditoria base

### Fase 3 — Aprovação e alertas (semana 3)

- Fluxo de aprovação (config + execução)
- Notificações in-app + e-mail
- Alertas de vencimento/renovação

### Fase 4 — Assinatura e hardening (semana 4)

- Integração assinatura + sincronização status
- Relatórios e exportação
- Hardening: segurança, performance, observabilidade, backup
- Preparação de piloto (seed data, guia rápido)

## Critérios de Aceite (MVP)

- Usuário Admin cria tenant e gerencia usuários e permissões.
- Usuário Gestor cria contrato, faz upload e acompanha status.
- Extração IA roda de forma assíncrona e apresenta campos com evidência e edição.
- Revisão marca campos/cláusulas como revisados e registra trilha.
- Fluxo de aprovação bloqueia envio para assinatura até aprovação completa.
- Integração de assinatura atualiza status e armazena documento assinado.
- Alertas de vencimento/renovação disparam notificação e e-mail conforme regra.
- Busca e filtros funcionam para lista de contratos com exportação CSV.
- Landing page envia lead com validação e confirmação ao usuário.
- Auditoria registra ações críticas e pode ser consultada por Admin.

## Riscos e Decisões Abertas

### Riscos principais (para endereçar na implementação)

- Qualidade de extração em PDFs escaneados (necessidade de OCR).
- Segurança de arquivos e segregação multi-tenant (risco crítico).
- Complexidade de aprovação (pressão para fluxos mais avançados).
- Dependência de provedor de assinatura/IA e limites de API.
- LGPD e retenção (processos de exclusão/exportação).

### Decisões em aberto (a LLM deve assumir ou solicitar)

- Stack alvo (ex.: Next.js + API routes vs. frontend+backend separados).
- Estratégia de autenticação (sessão/cookie vs. JWT) e SSO futuro.
- Provedor de assinatura e provedor de IA (e fallback “simulador”).
- Infra: Vercel/Cloud Run/Kubernetes; storage e fila (SQS/Redis/etc.).
- Se OCR entra no MVP ou fica como “best effort”.

## Changelog

- 2026-04-30 13:49 — referência adicionada para PRD frontend-only (React + MUI + localStorage)
- 2026-04-30 00:00 — criação inicial
