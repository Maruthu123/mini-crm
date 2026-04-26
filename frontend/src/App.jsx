import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import theme from './utils/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LeadsListPage from './pages/leads/LeadsListPage';
import LeadFormPage from './pages/leads/LeadFormPage';
import CompaniesListPage from './pages/companies/CompaniesListPage';
import CompanyDetailPage from './pages/companies/CompanyDetailPage';
import CompanyFormPage from './pages/companies/CompanyFormPage';
import TasksPage from './pages/tasks/TasksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="leads" element={<LeadsListPage />} />
      <Route path="leads/new" element={<LeadFormPage />} />
      <Route path="leads/edit/:id" element={<LeadFormPage />} />
      <Route path="companies" element={<CompaniesListPage />} />
      <Route path="companies/new" element={<CompanyFormPage />} />
      <Route path="companies/:id" element={<CompanyDetailPage />} />
      <Route path="tasks" element={<TasksPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '10px',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
