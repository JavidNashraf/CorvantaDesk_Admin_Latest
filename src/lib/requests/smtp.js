import { getConfig } from 'lib';

// SMTP End-Points
const SmtpConfigurations = 'SmtpConfigurations';
const prefix = '/api/v1/admin/smtpconfigurations';
// Get List of All SMTP Configurations
export const getAllSMTPsConfig = () => ({
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
  config: getConfig({ module: SmtpConfigurations, action: 'View' }),
});
// Add SMTP Configuration
export const addSMTPConfig = () => ({
  url: `${prefix}`,
  config: getConfig({ module: SmtpConfigurations, action: 'Create' }),
});
// Edit SMTP Configuration
export const editSMTPConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  // config: getConfig({ module: SmtpConfigurations, action: 'Update' }),
});
// Delete SMTP Configuration
export const deleteSMTPConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: SmtpConfigurations, action: 'Remove' }),
});
