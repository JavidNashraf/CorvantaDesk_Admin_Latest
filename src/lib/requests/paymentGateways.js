import { getConfig } from 'lib';

// PaymentGateway End-Points
const PaymentGateway = 'PaymentGateways';
// Get List of All Payment Gateways
export const getPaymentGatewaysConfig = () => ({
  url: `/api/paymentgateways/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
  },
  config: getConfig({ module: PaymentGateway, action: 'View' }),
});
// Add Payment Gateway
export const addPaymentGatewayConfig = () => ({
  url: `/api/paymentgateways`,
  config: getConfig({ module: PaymentGateway, action: 'Create' }),
});
// Edit Payment Gateway
export const editPaymentGatewayConfig = ({ id }) => ({
  url: `/api/paymentgateways/${id}`,
  config: getConfig({ module: PaymentGateway, action: 'Update' }),
});
// Delete Payment Gateway
export const deletePaymentGatewayConfig = ({ id }) => ({
  url: `/api/paymentgateways/${id}`,
  config: getConfig({ module: PaymentGateway, action: 'Remove' }),
});
