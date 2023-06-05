import { Route, Routes } from 'react-router-dom';
import {
  ClientList,
  ClientDetails,
  MassEmailClients,
  EditNotification,
  ClientNotifications,
  AddNewNotification,
} from './pages';

const Clients = () => {
  return (
    <Routes>
      <Route path="list/show" element={<ClientList />} />
      <Route path="list/details/:id" element={<ClientDetails />} />
      <Route
        path="send-email/mass-email-clients"
        element={<MassEmailClients />}
      />
      <Route
        path="show-notifications/client-notifications"
        element={<ClientNotifications />}
      />
      <Route
        path="show-notifications/client-notifications/add/new"
        element={<AddNewNotification />}
      />
      <Route
        path="show-notifications/client-notifications/edit/:id"
        element={<EditNotification />}
      />
    </Routes>
  );
};

export default Clients;
