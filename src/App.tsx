// src/App.tsx - UPDATED

import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import HomePage from './pages/HomePage'
import LawsPage from './pages/LawsPage'
import LawDetailPage from './pages/LawDetailPage'
import VotingPage from './pages/VotingPage'
import DeputyDetailPage from './pages/DeputyDetailPage'
import SearchPage from './pages/SearchPage'
import AdminSyncPage from './pages/AdminSyncPage'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/laws" element={<LawsPage />} />
            <Route path="/laws/:id" element={<LawDetailPage />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/deputies/:id" element={<DeputyDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/admin/sync" element={<AdminSyncPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
)

export default App
