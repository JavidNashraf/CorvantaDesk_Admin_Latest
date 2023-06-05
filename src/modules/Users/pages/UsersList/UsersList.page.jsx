import { Route, Routes } from 'react-router-dom';
import { AdminDetails, UsersListPage } from './pages';

export const UsersList = () => {
  return (
    <Routes>
      <Route index element={<UsersListPage />} />
      <Route path="admin-details/:id" element={<AdminDetails />} />
    </Routes>
  );
};
