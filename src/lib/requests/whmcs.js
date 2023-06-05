import { getConfig } from 'lib';

// Users
const WHMCS = 'WHMCS';
export const validateDataConfig = () => ({
  url: `/api/WHMCSimport/ValidateTheData`,
  config: getConfig({ module: WHMCS, action: 'View' }),
});

export const importDataConfig = () => ({
  url: `/api/WHMCSimport/ImportData`,
  config: getConfig({ module: WHMCS, action: 'View' }),
});
