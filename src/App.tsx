import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { BottomNav } from './ui/AppShell';
import { useUser } from './user/store';
import SheikhsPage from './services/tube/pages/SheikhsPage';
import SheikhPage from './services/tube/pages/SheikhPage';
import SeriesPage from './services/tube/pages/SeriesPage';
import LessonPage from './services/tube/pages/LessonPage';
import FavPage from './services/tube/pages/FavPage';
import StatsPage from './services/tube/pages/StatsPage';

export default function App() {
  const theme = useUser((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
  }, [theme]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Navigate to="/tube" replace />} />
        <Route path="/tube" element={<SheikhsPage />} />
        <Route path="/tube/sheikh/:id" element={<SheikhPage />} />
        <Route path="/tube/series/:id" element={<SeriesPage />} />
        <Route path="/tube/v/:videoId" element={<LessonPage />} />
        <Route path="/tube/fav" element={<FavPage />} />
        <Route path="/tube/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/tube" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
