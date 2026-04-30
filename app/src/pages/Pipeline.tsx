import {
  Box,
  Stack,
  Typography,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Divider,
} from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import { useState, type ReactNode } from 'react';

const MAX_SCOPE = 5000;

const TIPOS_CONTRATACAO = [
  'Prestação de Serviços',
  'Fornecimento de Bens',
  'Locação',
  'Consultoria',
  'NDA / Confidencialidade',
];

type TimelineKind = 'pending' | 'active' | 'past' | 'discarded';

type TimelineEntry = {
  kind: TimelineKind;
  status: string;
  title: string;
  description?: string;
  timestamp?: string;
  badge?: ReactNode;
  highlight?: ReactNode;
};

const ENTRIES: TimelineEntry[] = [
  {
    kind: 'pending',
    status: 'PENDENTE',
    title: 'Assinatura Digital',
    description:
      'Aguardando geração do documento final para envio via plataforma Docusign.',
  },
  {
    kind: 'active',
    status: 'AGORA',
    title: 'Estruturação de Dados',
    highlight: (
      <Box
        sx={{
          mt: 1,
          bgcolor: '#FAFAFB',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          Formulário aberto pelo usuário{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Administrator
          </Box>{' '}
          para preenchimento dos parâmetros iniciais.
        </Typography>
      </Box>
    ),
  },
  {
    kind: 'past',
    status: 'Hoje, 09:41 AM',
    title: 'Análise Preliminar AI',
    description:
      "Sistema LexTech identificou padrão de 'Prestação de Serviços' baseado no pré-cadastro da contratante.",
    badge: (
      <Chip
        size="small"
        label="Score de Risco: Baixo"
        sx={{
          mt: 1,
          bgcolor: '#EDE9FE',
          color: '#6D28D9',
          fontWeight: 600,
          fontSize: '0.72rem',
          height: 22,
          '& .MuiChip-label': { px: 1 },
        }}
      />
    ),
  },
  {
    kind: 'discarded',
    status: 'Ontem, 16:30 PM',
    title: 'Rascunho Descartado',
    description:
      'Rascunho anterior sem dados preenchidos foi removido automaticamente pela política de retenção.',
  },
];

function TimelineDot({ kind }: { kind: TimelineKind }) {
  if (kind === 'active') {
    return (
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          bgcolor: '#2563EB',
          border: '3px solid #fff',
          boxShadow: '0 0 0 2px #2563EB',
          flexShrink: 0,
        }}
      />
    );
  }
  if (kind === 'pending') {
    return (
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          bgcolor: '#fff',
          border: '2px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: '#D1D5DB',
        flexShrink: 0,
        mt: '2px',
        ml: '2px',
      }}
    />
  );
}

function TimelineItem({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}) {
  const struck = entry.kind === 'discarded';
  const dimmed = entry.kind === 'discarded' || entry.kind === 'past';

  return (
    <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          width: 14,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          pt: 0.5,
        }}
      >
        <TimelineDot kind={entry.kind} />
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 22,
              bottom: -24,
              width: '1px',
              borderLeft: '1px solid',
              borderColor: 'divider',
              transform: 'translateX(-50%)',
            }}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform:
              entry.kind === 'pending' || entry.kind === 'active' ? 'uppercase' : 'none',
          }}
        >
          {entry.status}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: dimmed ? 'text.secondary' : 'primary.main',
            fontWeight: 700,
            mt: 0.25,
            textDecoration: struck ? 'line-through' : 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {entry.title}
          {entry.kind === 'past' && (
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#6D28D9' }} />
          )}
        </Typography>
        {entry.description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
              lineHeight: 1.55,
              fontSize: '0.85rem',
            }}
          >
            {entry.description}
          </Typography>
        )}
        {entry.badge}
        {entry.highlight}
      </Box>
    </Stack>
  );
}

function formatBRL(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Pipeline() {
  const [titulo, setTitulo] = useState('');
  const [razao, setRazao] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [escopo, setEscopo] = useState('');

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box>
        <Typography
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          Gestão de Contratos Inteligentes
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mt: 1,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Configure os parâmetros e utilize inteligência artificial para otimizar o fluxo de
          aprovação.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          gap: { xs: 3, md: 3 },
          alignItems: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(15,27,61,0.04)',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <EditNoteOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Formulário de Estruturação
              </Typography>
            </Stack>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '0.95rem !important' }} />}
              label="AI READY"
              size="small"
              sx={{
                bgcolor: '#EDE9FE',
                color: '#6D28D9',
                fontWeight: 700,
                letterSpacing: '0.04em',
                fontSize: '0.72rem',
                height: 26,
                flexShrink: 0,
                '& .MuiChip-icon': { color: '#6D28D9', ml: '6px', mr: '-2px' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            <TextField
              label="Título do Contrato"
              placeholder="Ex: Prestação de Serviços - TI"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Razão Social da Contratante"
              placeholder="Nome da Empresa LTDA"
              value={razao}
              onChange={(e) => setRazao(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Tipo de Contratação"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Selecione o tipo...
                </Box>
              </MenuItem>
              {TIPOS_CONTRATACAO.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Valor Mensal (BRL)"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(formatBRL(e.target.value))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>R$</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mt: { xs: 2, md: 2.5 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ mb: 1 }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontWeight: 500 }}
              >
                Escopo do Serviço / Objeto do Contrato
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {escopo.length}/{MAX_SCOPE}
              </Typography>
            </Stack>
            <TextField
              multiline
              minRows={5}
              fullWidth
              placeholder="Descreva em detalhes o objeto do contrato, responsabilidades e entregáveis..."
              value={escopo}
              onChange={(e) =>
                setEscopo(e.target.value.slice(0, MAX_SCOPE))
              }
              inputProps={{ maxLength: MAX_SCOPE }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<SettingsSuggestOutlinedIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                fontWeight: 600,
                py: 1.25,
                px: 2.5,
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Gerar Documento via IA
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveOutlinedIcon />}
              sx={{ fontWeight: 600, py: 1.25, px: 2.5 }}
            >
              Salvar Contrato
            </Button>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 2px rgba(15,27,61,0.04)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.5 }}>
            <HistoryToggleOffIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.2,
              }}
            >
              Histórico de Movimentações
            </Typography>
          </Stack>

          <Stack spacing={3}>
            {ENTRIES.map((entry, idx) => (
              <TimelineItem
                key={`${entry.title}-${idx}`}
                entry={entry}
                isLast={idx === ENTRIES.length - 1}
              />
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
