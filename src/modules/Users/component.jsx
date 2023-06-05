import { DashboardLayout } from 'layout';
import { InvoiceOverviewList } from 'modules/IncomeOverview/IncomeOverviewDetails';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UsersList, UsersGroups } from './pages';
import './style.scss';

export function Users() {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin/dashboard/users/list" />}
        />
        <Route path="list/*" element={<UsersList />} />
        <Route path="groups" element={<UsersGroups />} />
        <Route path="incomeOverview/details" element={<InvoiceOverviewList />} />
      </Routes>
    </DashboardLayout>
  );
}
