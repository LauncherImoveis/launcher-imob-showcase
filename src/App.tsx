import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PropertyNew from "./pages/PropertyNew";
import PropertyEdit from "./pages/PropertyEdit";
import PropertyView from "./pages/PropertyView";
import Plans from "./pages/Plans";
import Portal from "./pages/Portal";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Subscription from "./pages/Subscription";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import Demo from "./pages/Demo";
import EmailTest from "./pages/EmailTest";
import NotFound from "./pages/NotFound";
import CRMDashboard from "./pages/crm/CRMDashboard";
import Leads from "./pages/crm/Leads";
import Negocios from "./pages/crm/Negocios";
import Imoveis from "./pages/crm/Imoveis";
import Relatorios from "./pages/crm/Relatorios";
import Atividades from "./pages/crm/Atividades";
import Configuracoes from "./pages/crm/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new" element={<PropertyNew />} />
          <Route path="/dashboard/edit/:id" element={<PropertyEdit />} />
          <Route path="/property/:slug" element={<PropertyView />} />
          <Route path="/portal/:userSlug" element={<Portal />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/success" element={<CheckoutSuccess />} />
          <Route path="/cancel" element={<CheckoutCancel />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/recursos" element={<Resources />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/test-email" element={<EmailTest />} />
          <Route path="/crm" element={<CRMDashboard />} />
          <Route path="/crm/leads" element={<Leads />} />
          <Route path="/crm/negocios" element={<Negocios />} />
          <Route path="/crm/imoveis" element={<Imoveis />} />
          <Route path="/crm/relatorios" element={<Relatorios />} />
          <Route path="/crm/atividades" element={<Atividades />} />
          <Route path="/crm/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
