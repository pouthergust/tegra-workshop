import { Box, Stack, Typography, Button, ButtonBase } from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTreeOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useState, type ReactNode } from 'react';

type NavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        px: 3,
        py: 1.5,
        justifyContent: 'flex-start',
        color: 'rgba(255,255,255,0.85)',
        fontWeight: active ? 600 : 500,
        bgcolor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
        '&::before': active
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 4,
              borderRadius: '0 4px 4px 0',
              bgcolor: 'secondary.main',
            }
          : undefined,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? '#fff' : 'rgba(255,255,255,0.7)',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: active ? '#fff' : 'rgba(255,255,255,0.85)',
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}

export const SIDEBAR_WIDTH = 260;

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [active, setActive] = useState('overview');

  const select = (key: string) => {
    setActive(key);
    onNavigate?.();
  };

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: 'primary.main',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: { md: 'sticky' },
        top: 0,
        height: '100vh',
      }}
    >
      <Box sx={{ px: 3, pt: 4, pb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 800,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
          }}
        >
          LEXTECH
          <br />
          INTELLIGENCE
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, fontSize: '0.85rem' }}
        >
          Institutional Portal
        </Typography>
      </Box>

      <Stack sx={{ mt: 2, flex: 1 }}>
        <NavItem
          icon={<DashboardIcon fontSize="small" />}
          label="Visão Geral"
          active={active === 'overview'}
          onClick={() => select('overview')}
        />
        <NavItem
          icon={<AccountTreeIcon fontSize="small" />}
          label="Pipeline de Contratos"
          active={active === 'pipeline'}
          onClick={() => select('pipeline')}
        />
        <NavItem
          icon={<DescriptionIcon fontSize="small" />}
          label="Repositório"
          active={active === 'repo'}
          onClick={() => select('repo')}
        />
        <NavItem
          icon={<BarChartIcon fontSize="small" />}
          label="Relatórios"
          active={active === 'reports'}
          onClick={() => select('reports')}
        />
      </Stack>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ py: 1.4, fontSize: '0.95rem' }}
        >
          Novo Contrato
        </Button>
      </Box>

      <Stack sx={{ pb: 3 }}>
        <NavItem icon={<SettingsIcon fontSize="small" />} label="Configurações" />
        <NavItem icon={<HelpIcon fontSize="small" />} label="Suporte" />
      </Stack>
    </Box>
  );
}
