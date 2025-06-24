
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MasterDashboard from "./pages/MasterDashboard";
import ChurchDashboard from "./pages/ChurchDashboard";
import MembersPage from "./pages/MembersPage";
import FinancesPage from "./pages/FinancesPage";
import EventsPage from "./pages/EventsPage";
import GroupsPage from "./pages/GroupsPage";
import ChurchesPage from "./pages/ChurchesPage";
import ChurchDetailsPage from "./pages/ChurchDetailsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros de autenticação
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Master Routes */}
            <Route path="/master" element={
              <ProtectedRoute requireMaster>
                <MasterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/master/churches" element={
              <ProtectedRoute requireMaster>
                <ChurchesPage />
              </ProtectedRoute>
            } />
            <Route path="/master/churches/:id" element={
              <ProtectedRoute requireMaster>
                <ChurchDetailsPage />
              </ProtectedRoute>
            } />
            <Route path="/master/analytics" element={
              <ProtectedRoute requireMaster>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            {/* Church Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <ChurchDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/finances" element={
              <ProtectedRoute>
                <FinancesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/groups" element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
