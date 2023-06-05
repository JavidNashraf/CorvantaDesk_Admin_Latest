import { getConfig } from './getConfig';

const dashboardConfig = (action) => getConfig({ module: 'Dashboard', action });

const prefix = process.env.REACT_APP_BASEURL;

// Get Dashboard Overview
export const getDataCountsConfig = () => ({
  url: `${prefix}/api/v1/admin/dashboard/getdatacounts`,
  config: dashboardConfig('View'),
});