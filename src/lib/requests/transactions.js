import { getConfig } from 'lib';

// SMTP End-Points
const Transactions = 'Invoices';
const prefix = '/api/v1/admin/transactions';
// Get Transactions
export const getTransactionsConfig = () => ({
  url: `${prefix}/search`,
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
  config: getConfig({ module: Transactions, action: 'View' }),
});

// // Add SMTP Configuration
// export const addSMTPConfig = () => ({
//   url: `${prefix}`,
//   config: getConfig({ module: Transactions, action: 'Create' }),
// });
// // Edit SMTP Configuration
// export const editSMTPConfig = ({ id }) => ({
//   url: `${prefix}/${id}`,
//   config: getConfig({ module: Transactions, action: 'Update' }),
// });
// // Delete SMTP Configuration
// export const deleteSMTPConfig = ({ id }) => ({
//   url: `${prefix}/${id}`,
//   config: getConfig({ module: Transactions, action: 'Remove' }),
// });
