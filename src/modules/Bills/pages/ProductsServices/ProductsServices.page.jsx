import { Route, Routes, Navigate } from 'react-router-dom';
import { PSList, PSDetails, CancellationRequests } from './pages';

const ProductsServices = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/admin/dashboard/billing/products-services/list/show" />
        }
      />
      <Route path="list/show" element={<PSList />} />
      <Route path="list/details/:id" element={<PSDetails />} />
      <Route path="cancellation/requests" element={<CancellationRequests />} />
    </Routes>
  );
};

export default ProductsServices;
