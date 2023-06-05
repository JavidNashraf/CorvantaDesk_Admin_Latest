import { getConfig } from './getConfig';

// const Products = 'Products';
const productsConfig = (action) => getConfig({ module: 'Products', action });

const prefix = process.env.REACT_APP_BASEURL;

// Get Invoice Overview
export const getIncomeOverviewConfig = () => ({
    url: `${prefix}/api/v1/admin/incomes/incomeoverview`,
    config: productsConfig('View'),
  });

  // Get Invoice Forecast
export const getIncomeForecastConfig = () => ({
    url: `${prefix}/api/v1/admin/incomes/incomeforecast`,
    config: productsConfig('View'),
  });

    // Get Invoice Overview List
export const getIncomeOverviewListConfig = () => ({
  url: `${prefix}/api/v1/admin/incomes/incometransactionoverview/Income`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 1,
    pageSize: 10,
    orderBy: [''],
  },
  config: productsConfig('View'),
});