import {
  Box,
  Stack,
  Typography,
  Paper,
  Chip,
  Link,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GavelIcon from '@mui/icons-material/Gavel';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { ReactNode } from 'react';

type StatusKind = 'ativo' | 'pendente' | 'rascunho';

type RecentContract = {
  id: string;
  party: string;
  status: StatusKind;
  date: string;
};

const recentContracts: RecentContract[] = [
  { id: '#CTR-2023-0891', party: 'TechSolutions Inc.', status: 'ativo', date: '12 Out 2023' },
  { id: '#CTR-2023-0890', party: 'Global Logistics Corp', status: 'pendente', date: '11 Out 2023' },
  { id: '#CTR-2023-0889', party: 'Nexus Financial', status: 'rascunho', date: '10 Out 2023' },
];

function StatusDot({ status }: { status: StatusKind }) {
  const config: Record<StatusKind, { label: string; color: string }> = {
    ativo: { label: 'Ativo', color: '#16A34A' },
    pendente: { label: 'Revisão Pendente', color: '#F26B2A' },
    rascunho: { label: 'Em Rascunho', color: '#2563EB' },
  };
  const { label, color } = config[status];
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" sx={{ color, fontWeight: 500, lineHeight: 1.2 }}>
        {label}
      </Typography>
    </Stack>
  );
}

type KPICardProps = {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  trend?: { label: string; tone: 'success' | 'warning' };
  highlight?: boolean;
};

function KPICard({ icon, iconBg, label, value, trend, highlight }: KPICardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: highlight ? 'transparent' : 'divider',
        boxShadow: highlight
          ? '0 0 0 2px #F26B2A, 0 8px 24px -16px rgba(242,107,42,0.4)'
          : '0 1px 2px rgba(15,27,61,0.04)',
        position: 'relative',
        bgcolor: '#fff',
        height: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ minHeight: 44, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: iconBg,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            '& .MuiSvgIcon-root': { fontSize: 22 },
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Chip
            size="small"
            icon={
              trend.tone === 'success' ? (
                <TrendingUpIcon sx={{ fontSize: '0.95rem !important' }} />
              ) : undefined
            }
            label={trend.label}
            sx={{
              bgcolor: trend.tone === 'success' ? '#DCFCE7' : '#FFE7D6',
              color: trend.tone === 'success' ? '#15803D' : '#C24E1A',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 26,
              '& .MuiChip-label': { px: 1 },
              '& .MuiChip-icon': { color: 'inherit', ml: '6px', mr: '-2px' },
            }}
          />
        )}
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          color: highlight ? 'secondary.main' : 'primary.main',
          fontWeight: 800,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function InteractionLogItem({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  time,
  showConnector,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  showConnector?: boolean;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Avatar
          sx={{
            bgcolor: iconBg,
            color: iconColor,
            width: 40,
            height: 40,
            '& .MuiSvgIcon-root': { fontSize: 20 },
          }}
        >
          {icon}
        </Avatar>
        {showConnector && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 44,
              bottom: -28,
              width: '1px',
              borderLeft: '1px dashed',
              borderColor: 'divider',
              transform: 'translateX(-50%)',
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          bgcolor: '#FAFAFB',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 2 }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {time}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.6 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

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
          sx={{ color: 'text.secondary', mt: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          Visão geral e métricas de desempenho em tempo real.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 2, md: 3 },
        }}
      >
        <KPICard
          icon={<FolderOutlinedIcon sx={{ color: '#6B7280' }} />}
          iconBg="#F3F4F6"
          label="Total de Contratos"
          value="2,458"
          trend={{ label: '12%', tone: 'success' }}
        />
        <KPICard
          icon={<CheckCircleOutlineIcon sx={{ color: '#16A34A' }} />}
          iconBg="#DCFCE7"
          label="Contratos Ativos"
          value="1,892"
        />
        <KPICard
          icon={<WarningAmberRoundedIcon sx={{ color: '#F26B2A' }} />}
          iconBg="#FFE7D6"
          label="Itens em Atenção"
          value="34"
          trend={{ label: 'Requer Ação', tone: 'warning' }}
          highlight
        />
        <KPICard
          icon={<PaymentsOutlinedIcon sx={{ color: '#2563EB' }} />}
          iconBg="#DBEAFE"
          label="Receita Estimada"
          value="R$ 4.2M"
        />
      </Box>

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
          spacing={2}
          sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: 1.2,
            }}
          >
            Log de Interações - Inteligência
          </Typography>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important' }} />}
            label="AI Active"
            size="small"
            sx={{
              bgcolor: '#EDE9FE',
              color: '#6D28D9',
              fontWeight: 600,
              flexShrink: 0,
              '& .MuiChip-icon': { color: '#6D28D9', ml: '8px', mr: '-4px' },
              '& .MuiChip-label': { px: 1 },
              px: 0.5,
              height: 28,
            }}
          />
        </Stack>

        <Stack spacing={3.5}>
          <InteractionLogItem
            icon={<GavelIcon fontSize="small" />}
            iconBg="#EDE9FE"
            iconColor="#6D28D9"
            title="Cláusula de Rescisão Revisada"
            description="O modelo detectou uma ambiguidade na cláusula 4.2 do contrato 'Alpha Corp'. Sugestão de revisão aplicada automaticamente com base no histórico jurídico."
            time="Agora mesmo"
            showConnector
          />
          <InteractionLogItem
            icon={<VerifiedUserOutlinedIcon fontSize="small" />}
            iconBg="#DBEAFE"
            iconColor="#2563EB"
            title="Conformidade Verificada"
            description="Lote de 50 novos templates processados e verificados contra as regulamentações vigentes da LGPD. Nenhuma anomalia encontrada."
            time="Há 2 horas"
          />
        </Stack>
      </Paper>

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
          spacing={2}
          sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Contratos Recentes
          </Typography>
          <Link
            href="#"
            underline="none"
            sx={{
              color: 'secondary.main',
              fontWeight: 600,
              fontSize: '0.95rem',
              flexShrink: 0,
            }}
          >
            Ver todos
          </Link>
        </Stack>

        {isMdDown ? (
          <Stack spacing={2}>
            {recentContracts.map((row) => (
              <Box
                key={row.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {row.id}
                  </Typography>
                  <StatusDot status={row.status} />
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                  {row.party}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {row.date}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.5fr 1.3fr 1fr',
              rowGap: 0,
              columnGap: 2,
            }}
          >
            {['ID Contrato', 'Parte Relacionada', 'Status', 'Data de Atualização'].map((h) => (
              <Typography
                key={h}
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  pb: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {h}
              </Typography>
            ))}

            {recentContracts.map((row, idx) => {
              const isLast = idx === recentContracts.length - 1;
              const cellSx = {
                py: 2.5,
                borderBottom: isLast ? 'none' : '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
              };
              return (
                <Box key={row.id} sx={{ display: 'contents' }}>
                  <Box sx={cellSx}>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      {row.id}
                    </Typography>
                  </Box>
                  <Box sx={cellSx}>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {row.party}
                    </Typography>
                  </Box>
                  <Box sx={cellSx}>
                    <StatusDot status={row.status} />
                  </Box>
                  <Box sx={cellSx}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {row.date}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
