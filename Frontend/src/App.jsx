import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Queries from './pages/Queries/Queries.jsx';
import CreateQuery from './pages/CreateQuery/CreateQuery.jsx';
import QueryDetails from './pages/QueryDetails/QueryDetails.jsx';
import EditQuery from './pages/EditQuery/EditQuery.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Login from './pages/Login/Login.jsx';
import SubmitQuery from './pages/SubmitQuery/SubmitQuery.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/submit" element={<SubmitQuery />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="queries" element={<Queries />} />
        <Route path="queries/create" element={<AdminRoute><CreateQuery /></AdminRoute>} />
        <Route path="queries/:id" element={<QueryDetails />} />
        <Route path="queries/:id/edit" element={<AdminRoute><EditQuery /></AdminRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
