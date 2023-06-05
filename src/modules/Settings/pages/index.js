import { lazy } from 'react';
import '../style.scss';
export const pages = [
  { path: 'general', Component: lazy(() => import('./General/General.page')) },
  { path: 'tickets', Component: lazy(() => import('./Tickets/Tickets.page')) },
  { path: 'billing', Component: lazy(() => import('./Billing/Billing.page')) },
  {
    path: 'payment-gateways',
    Component: lazy(() => import('./PaymentGateways/PaymentGateways.page')),
  },
  {
    path: 'support',
    Component: lazy(() => import('./Support/Support.page')),
  },
  {
    path: 'smtp/*',
    Component: lazy(() => import('./SMTP/SMTP.page')),
  },
  {
    path: 'email-templates/*',
    Component: lazy(() => import('./EmailTemplates/EmailTemplates.page')),
  },
  {
    path: 'maintenance',
    Component: lazy(() => import('./Maintenance/Maintenance.page')),
  },
  {
    path: 'api',
    Component: lazy(() => import('./API/API.page')),
  },
  {
    path: 'portal',
    Component: lazy(() => import('./Portal/Portal.page')),
  },
  {
    path: 'brands',
    Component: lazy(() => import('./Brands/Brands.page')),
  },
  {
    path: 'departments',
    Component: lazy(() => import('./Departments/Departments.page')),
  },
];
