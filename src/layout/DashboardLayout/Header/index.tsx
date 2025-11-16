import { ReactNode, useMemo } from 'react';

// material-ui
import AppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// project import
import HeaderContent from './HeaderContent';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  // common header
  const mainHeader: ReactNode = (
    <Toolbar>
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar: AppBarProps = {
    position: 'fixed',
    elevation: 0,
    sx: {
      backgroundColor: '#424242',
      borderBottom: '1px solid',
      borderBottomColor: '#333',
      zIndex: 1200,
      width: '100%'
    }
  };

  return <AppBar {...appBar}>{mainHeader}</AppBar>;
}
