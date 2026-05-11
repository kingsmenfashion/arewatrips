import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rides from "./pages/Rides";
import Hotels from "./pages/Hotels";
import StudentGroups from "./pages/StudentGroups";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import About from "./pages/about";
import Contact from "./pages/contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/student-groups" element={<StudentGroups />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
