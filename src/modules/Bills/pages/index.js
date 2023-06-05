import Orders from './Orders/Orders.page';
import Clients from './Clients/Clients.page';
import ProductsServices from './ProductsServices/ProductsServices.page';
import Invoices from './Invoices/Invoices.page';
import WHMCS from './WHMCS/WHMCS.page';
// import Logs from './Logs/Logs.page';
import WebHooks from './Webhooks/Webhooks.page';

export const pages = [
  { path: '/orders/*', Component: Orders },
  { path: '/clients/*', Component: Clients },
  { path: '/products-services/*', Component: ProductsServices },
  { path: '/invoices/*', Component: Invoices },
  { path: '/WHMCS-import', Component: WHMCS },
  // { path: '/logs', Component: Logs },
  { path: '/webhooks', Component: WebHooks },
];
