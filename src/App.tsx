
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Lists from "./pages/dashboard/Lists";
import CreateList from "./pages/dashboard/CreateList";
import Campaigns from "./pages/dashboard/Campaigns";
import Teams from "./pages/dashboard/Teams";
import Settings from "./pages/dashboard/Settings";

// Placeholder admin pages - these will be implemented later
const AdminDashboard = () => (
  <div className="container p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
    <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
      <p className="text-muted-foreground">Admin dashboard content will be implemented here</p>
    </div>
  </div>
);

const ApiUsage = () => (
  <div className="container p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-6">API Usage</h1>
    <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
      <p className="text-muted-foreground">API usage statistics will be displayed here</p>
    </div>
  </div>
);

const ApiKeys = () => (
  <div className="container p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-6">API Key Configuration</h1>
    <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
      <p className="text-muted-foreground">API key management interface will be implemented here</p>
    </div>
  </div>
);

const ApiProviders = () => (
  <div className="container p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-6">API Provider Configuration</h1>
    <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
      <p className="text-muted-foreground">API provider management interface will be implemented here</p>
    </div>
  </div>
);

const Prompts = () => (
  <div className="container p-4 md:p-6">
    <h1 className="text-2xl font-bold mb-6">Prompt Configuration</h1>
    <div className="rounded-lg border bg-card p-4 md:p-8 shadow-sm">
      <p className="text-muted-foreground">Prompt management interface will be implemented here</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="lists" element={<Lists />} />
              <Route path="lists/new" element={<CreateList />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="teams" element={<Teams />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Admin Routes */}
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/api-usage" 
                element={
                  <ProtectedRoute adminOnly>
                    <ApiUsage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/api-keys" 
                element={
                  <ProtectedRoute adminOnly>
                    <ApiKeys />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/api-providers" 
                element={
                  <ProtectedRoute adminOnly>
                    <ApiProviders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/prompts" 
                element={
                  <ProtectedRoute adminOnly>
                    <Prompts />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
