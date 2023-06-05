import { getConfig } from 'lib';
import { nanoid } from 'nanoid';
const invoicesConfig = (action) => getConfig({ module: 'Invoices', action });

const prefix = `/api/v1/admin/bills`;

export const createInvoiceConfig = () => ({
  url: `/api/v1.0/admin/Orders`,
  config: invoicesConfig('View'),
})

export const editInvoiceConfig = (id) => ({
  url: `/api/v1.0/admin/Orders/${id}`,
  config: invoicesConfig('View'),
})

export const getInvoicesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
  },
  config: invoicesConfig('View'),
});

export const getInvoiceConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: invoicesConfig('View'),
});

export const addCreditConfig = () => ({
  url: `/api/v1.0/admin/credit/add`,
  defaultData: {
    Id: '',
    amount: '',
    tenant: '',
    description: '',
    ClientId:''
  },
  config: invoicesConfig('View'),
});

export const RemoveCreditConfig = () => ({
  url: `/api/v1.0/admin/credit/decrease`,
  defaultData: {
    tenant: '',
    DecreaseAmount: '',
    Description:'',
    ClientId:''
  },
  config: invoicesConfig('View'),
});

export const BalanceCreditConfig = (id) => ({
  url:`/api/v1.0/admin/credit/balance/${id}`
//config : invoicesConfig('View)
})