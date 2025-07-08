import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import ContentList from './pages/content/ContentList';
import ContentEdit from './pages/content/ContentEdit';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Wrapper component for protected routes with layout
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 240;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar drawerWidth={drawerWidth} handleDrawerToggle={() => setMobileOpen(!mobileOpen)} />
      <Sidebar 
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // Height of the AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppContent() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <LayoutWrapper>
              <Dashboard />
            </LayoutWrapper>
          }
        />
        <Route
          path="/content"
          element={
            <LayoutWrapper>
              <ContentList />
            </LayoutWrapper>
          }
        />
        <Route
          path="/content/:id"
          element={
            <LayoutWrapper>
              <ContentEdit />
            </LayoutWrapper>
          }
        />
        <Route
          path="/content/new"
          element={
            <LayoutWrapper>
              <ContentEdit />
            </LayoutWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <LayoutWrapper>
                <Settings />
              </LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
