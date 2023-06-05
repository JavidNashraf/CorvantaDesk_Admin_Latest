import { getConfig } from './getConfig';

const getBillingSettingsConfig = (action) =>
  getConfig({ module: 'Settings', action });

// Get Billing Settings By Tenant
export const getBillingSettingsByTenantConfig = () => ({
  url: `/api/v1/admin/billingsettings/getsettingswithtenant/admin`,
  config: getBillingSettingsConfig('View'),
});

// Update Billing Settings
export const updateBillingSettingsConfig = (tenant) => ({
  url: `/api/v1/admin/billingsettings/${tenant}`,
  config: getBillingSettingsConfig('Update'),
});
