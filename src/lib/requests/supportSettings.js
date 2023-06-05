import { getConfig } from './getConfig';

const supportConfig = (action) => getConfig({ module: 'Settings', action });
const prefix = `api/v1/admin/supportsettings`;

// Get Billing Settings By Tenant
export const getSupportSettingsByTenantConfig = () => ({
  url: `${prefix}/getsettingswithtenant/admin`,
  config: supportConfig('View'),
});

// Update Billing Settings
export const updateSupportSettingsConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: supportConfig('Update'),
});
