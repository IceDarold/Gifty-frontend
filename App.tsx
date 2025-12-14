import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Results } from './pages/Results';
import { Wishlist } from './pages/Wishlist';

const AppRoutes = () => {
    const location = useLocation();
    const showNav = location.pathname !== '/' && location.pathname !== '/quiz';

    return (
        <Layout showNav={showNav}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/wishlist" element={<Wishlist />} />
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