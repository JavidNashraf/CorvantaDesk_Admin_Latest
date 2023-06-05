import GenerateNewTicket from "components/GenerateTicket/GenerateNewTicket";
import { DashboardLayout } from "layout";
import AdvancedSearch from "modules/KnowledgeBase/pages/Articles/pages/View/sections/AdvancedSearch/AdvancedSearch";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { getCurrentOnlineUsers } from "store";
import { getDepartments } from "store";
import { TicketDetails, MyTickets } from "./pages";
import Queue from "./pages/Queue/Queue";
import "./style.scss";

export const SupportTickets = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getCurrentOnlineUsers());
  }, []);
  return (
    <DashboardLayout>
      <Routes>
        {/* Admin's Ticket List */}
        <Route
          path="/"
          element={<Navigate to="/admin/dashboard/support/tickets/list" />}
        />
        <Route path="tickets/list" element={<MyTickets />} />
        <Route path="tickets/queue" element={<Queue type="queue" />} />
        <Route
          path="tickets/queue/:deptId"
          element={<Queue type="department" />}
        />
        <Route path="tickets/waiting" element={<Queue type="waiting" />} />
        <Route
          path="tickets/waiting/:deptId"
          element={<Queue type="departmentwaiting" />}
        />
        <Route
          path="tickets/show-all/list/generate-ticket"
          element={<GenerateNewTicket />}
          exact
        />
        <Route
          path="tickets/show-all/advanced-search"
          element={<AdvancedSearch />}
        />

        <Route
          path="tickets/by-departments/:deptId"
          element={<TicketDetails />}
        />
        <Route path="tickets/list/details" element={<TicketDetails />} />

        <Route path="tickets/show-all/list" element={<TicketDetails />} />
        <Route
          path="tickets/show-all/list/details/:id"
          element={<TicketDetails />}
        />
        {/* All Tickets */}
      </Routes>
    </DashboardLayout>
  );
};
