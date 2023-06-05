import { DashboardLayout } from 'layout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { pages } from './pages';
import './style.scss';

export function KnowledgeBase() {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/dashboard/knowledge-base/overview" />}
        />
        {pages?.map(({ path, Component }) => {
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </DashboardLayout>
  );
}
