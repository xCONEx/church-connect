
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MasterDashboard from "./pages/MasterDashboard";
import ChurchDashboard from "./pages/ChurchDashboard";
import MembersPage from "./pages/MembersPage";
import FinancesPage from "./pages/FinancesPage";
import EventsPage from "./pages/EventsPage";
import GroupsPage from "./pages/GroupsPage";
import ChurchesPage from "./pages/ChurchesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/master" element={<MasterDashboard />} />
          <Route path="/master/churches" element={<ChurchesPage />} />
          <Route path="/master/analytics" element={<AnalyticsPage />} />
          <Route path="/admin" element={<ChurchDashboard />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/finances" element={<FinancesPage />} />
          <Route path="/admin/events" element={<EventsPage />} />
          <Route path="/admin/groups" element={<GroupsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
