import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Weddings } from './pages/Weddings';
import { WeddingStory } from './pages/WeddingStory';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { GalleryPortal } from './pages/GalleryPortal';
import { ClientGalleryPage } from './pages/ClientGalleryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';

function ProtectedAdminRoute({ children }) {
  const { isStudioAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isStudioAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/weddings" element={<Weddings />} />
          <Route path="/weddings/:slug" element={<WeddingStory />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Client Portal & Private Galleries */}
          <Route path="/gallery" element={<GalleryPortal />} />
          <Route path="/gallery/:slug" element={<ClientGalleryPage />} />
          <Route path="/g/:code" element={<ClientGalleryPage />} />

          {/* Studio Admin Suite */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
