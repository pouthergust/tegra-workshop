import {
  Box,
  Stack,
  Button,
  IconButton,
  Avatar,
  ButtonBase,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HistoryIcon from '@mui/icons-material/History';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunchOutlined';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Tab = 'documentos' | 'templates' | 'workflow';

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        px: 1,
        py: 1.5,
        position: 'relative',
        color: active ? 'secondary.main' : 'text.primary',
        fontWeight: active ? 700 : 500,
        '&::after': active
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 6,
              height: 2,
              bgcolor: 'secondary.main',
              borderRadius: 1,
            }
          : undefined,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
        {label}
      </Typography>
    </ButtonBase>
  );
}

type TopbarProps = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

export default function Topbar({ onMenuClick, showMenuButton }: TopbarProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmDown = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(
    location.pathname === '/pipeline' ? 'workflow' : 'documentos',
  );

  useEffect(() => {
    if (location.pathname === '/pipeline') setTab('workflow');
    else setTab('documentos');
  }, [location.pathname]);

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 1.5,
          gap: { xs: 1, md: 4 },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={{ xs: 0.5, sm: 2, md: 3 }} sx={{ alignItems: 'center' }}>
          {showMenuButton && (
            <IconButton
              onClick={onMenuClick}
              size="small"
              sx={{ color: 'text.primary', mr: 0.5 }}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <TabButton
            label="Documentos"
            active={tab === 'documentos'}
            onClick={() => setTab('documentos')}
          />
          {!isXs && (
            <TabButton
              label="Templates"
              active={tab === 'templates'}
              onClick={() => setTab('templates')}
            />
          )}
          {!isXs && (
            <TabButton
              label="Workflow"
              active={tab === 'workflow'}
              onClick={() => setTab('workflow')}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5, md: 2 }} sx={{ alignItems: 'center' }}>
          {isSmDown ? (
            <IconButton
              size="medium"
              sx={{
                color: 'secondary.main',
                border: '1px solid',
                borderColor: 'secondary.main',
                borderRadius: 1.5,
              }}
              aria-label="Deploy Smart Contract"
            >
              <RocketLaunchIcon fontSize="small" />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: 'secondary.dark',
                  bgcolor: 'secondary.light',
                },
              }}
            >
              Deploy Smart Contract
            </Button>
          )}
          <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="Notificações">
            <NotificationsNoneIcon />
          </IconButton>
          {!isXs && (
            <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="Histórico">
              <HistoryIcon />
            </IconButton>
          )}
          {!isXs && (
            <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="Conta">
              <PersonOutlineIcon />
            </IconButton>
          )}
          <Avatar
            sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}
            src="https://i.pravatar.cc/72?img=12"
            alt="Avatar"
          />
        </Stack>
      </Stack>
    </Box>
  );
}
