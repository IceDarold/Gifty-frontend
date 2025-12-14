import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';

const AppRoutes = () => {
    const location = useLocation();
    
    // User requested persistent navigation (always visible)
    const showNav = true;
    
    // Hide footer (copyrights etc) on Quiz to keep focus, but Nav remains
    const showFooter = location.pathname !== '/quiz';

    return (
        <Layout showNav={showNav} showFooter={showFooter}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Layout>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;