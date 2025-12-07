'use client';

import { ReactNode } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

// project import
import Header from './Header';
import Footer from './Footer';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';

import useConfig from 'hooks/useConfig';

// ==============================|| MAIN LAYOUT ||============================== //

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { container } = useConfig();

  return (
    <Box sx={{ width: '100%' }}>
      <Header />
      <Box
        component="main"
        sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}
      >
        <Toolbar />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={[
            {
              position: 'relative',
              minHeight: 'calc(100vh - 110px)',
              display: 'flex',
              flexDirection: 'column',
            },
            container && { px: { xs: 0, sm: 2 } },
          ]}
        >
          {/* <Breadcrumbs /> */}
          {children}
          <Footer />
        </Container>
      </Box>
    </Box>
  );
}
