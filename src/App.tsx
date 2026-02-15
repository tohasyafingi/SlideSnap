import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const GlobalSoundEffect = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Play sound for button clicks or elements with role="button"
      if (target.closest('button') || target.closest('[role="button"]')) {
        const audio = new Audio("/klik.mp3");
        audio.volume = 0.25;
        audio.play().catch((err) => console.error("Audio playback error:", err));
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
};

const GlobalScrollLock = () => {
  const location = useLocation();

  useEffect(() => {
    const applyScrollRule = () => {
      const doc = document.documentElement;
      const needsScroll = doc.scrollHeight > window.innerHeight + 1;
      document.body.style.overflow = needsScroll ? "auto" : "hidden";
      document.body.style.overscrollBehavior = needsScroll ? "auto" : "none";
    };

    applyScrollRule();
    window.addEventListener("resize", applyScrollRule);
    window.addEventListener("orientationchange", applyScrollRule);

    return () => {
      window.removeEventListener("resize", applyScrollRule);
      window.removeEventListener("orientationchange", applyScrollRule);
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <GlobalSoundEffect />
      <GlobalScrollLock />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
