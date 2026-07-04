import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UiloraBiolumeGrain from "@/components/ui/uilora-biolume-grain";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UiloraBiolumeGrain />
      
      {/* Global Cinematic Tint / Overlays */}
      <div className="fixed inset-0 z-[-5] pointer-events-none bg-black/40 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      <div className="fixed inset-0 z-[-5] pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
