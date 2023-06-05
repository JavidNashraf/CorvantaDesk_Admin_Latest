import { Route, Routes, Navigate } from 'react-router-dom';
import { Transactions } from './pages';
import { InvoiceList, InvoiceDetails } from './pages';
import { CreateInvoicePage } from './pages/InvoiceDetails/CreateInvoice';
import { InvoiceTab } from './pages/Invoicetab';

const Invoices = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/dashboard/billing/invoices/list/show" />}
      />
      <Route path="transactions" element={<Transactions />} />
      <Route path="list/show" element={<InvoiceList />} />
      <Route path="list/details/:id" element={<InvoiceTab />} />
      <Route path="list/create" element={<CreateInvoicePage />} />
    </Routes>
  );
};

export default Invoices;
