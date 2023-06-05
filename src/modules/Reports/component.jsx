import { DashboardLayout } from 'layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AnnualIncomeReport,
  SupportResponseTime,
  SupportTicketDuration,
  SupportTicketReplyCount,
  TicketsByFilter,
} from './pages';

export const Reports = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route
          index
          element={<Navigate to="/admin/dashboard/reports/anuual/income" />}
        />
        <Route path="anuual/income" element={<AnnualIncomeReport />} />
        <Route path="support-response/time" element={<SupportResponseTime />} />
        <Route
          path="support-ticket/duration"
          element={<SupportTicketDuration />}
        />
        <Route
          path="support-ticket-reply/count"
          element={<SupportTicketReplyCount />}
        />
        <Route path="tickets-by/filters" element={<SupportTicketDuration />} />
      </Routes>
    </DashboardLayout>
  );
};
