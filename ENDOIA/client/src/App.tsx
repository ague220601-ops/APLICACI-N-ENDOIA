import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import HomeClinico from "@/pages/Clinico/HomeClinico";
import RegistrarCaso from "@/pages/Clinico/RegistrarCaso";
import MisCasos from "@/pages/Clinico/MisCasos";
import HomeTutor from "@/pages/Tutor/HomeTutor";
import CasosPendientes from "@/pages/Tutor/CasosPendientes";
import ValidarCaso from "@/pages/Tutor/ValidarCaso";
import Dashboard from "@/pages/Investigador/Dashboard";
import BibliotecaPage from "@/pages/BibliotecaPage";
import AboutEndoia from "@/pages/AboutEndoia";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/">
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      </Route>

      <Route path="/clinico">
        <ProtectedRoute allowedRoles={['clinico', 'tutor', 'investigador']}>
          <Navbar />
          <HomeClinico />
        </ProtectedRoute>
      </Route>

      <Route path="/clinico/registrar">
        <ProtectedRoute allowedRoles={['clinico', 'tutor', 'investigador']}>
          <Navbar />
          <RegistrarCaso />
        </ProtectedRoute>
      </Route>

      <Route path="/clinico/mis-casos">
        <ProtectedRoute allowedRoles={['clinico', 'tutor', 'investigador']}>
          <Navbar />
          <MisCasos />
        </ProtectedRoute>
      </Route>

      <Route path="/tutor">
        <ProtectedRoute allowedRoles={['tutor', 'investigador']}>
          <Navbar />
          <CasosPendientes />
        </ProtectedRoute>
      </Route>

      <Route path="/tutor/validar/:case_id">
        <ProtectedRoute allowedRoles={['tutor', 'investigador']}>
          <Navbar />
          <ValidarCaso />
        </ProtectedRoute>
      </Route>

      <Route path="/investigador">
        <ProtectedRoute allowedRoles={['investigador']}>
          <Navbar />
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/investigador/dashboard">
        <ProtectedRoute allowedRoles={['investigador']}>
          <Navbar />
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/biblioteca">
        <ProtectedRoute allowedRoles={['clinico', 'tutor', 'investigador']}>
          <Navbar />
          <BibliotecaPage />
        </ProtectedRoute>
      </Route>

      <Route path="/sobre-endoia">
        <ProtectedRoute allowedRoles={['clinico', 'tutor', 'investigador']}>
          <Navbar />
          <AboutEndoia />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
