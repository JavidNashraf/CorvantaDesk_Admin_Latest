import { getConfig } from 'lib';

// UserAppSettings End-Points
// TODO: Fix module name once backend issue is resolved
const userAppSettingsConfig = (action) =>
  getConfig({ module: 'Setting', action });
// Get User Settings
export const getUserAppSettingsConfig = (id) => {
  return {
    url: `/api/v1/admin/userappsettings/getuserappsettingbyuserid/${id}`,
    config:  userAppSettingsConfig('View'),
  };
};
// Update User Settings
export const updateUserAppSettings = ({ id }) => {
  return {
    url: `/api/v1/admin/userappsettings/${id}`,
    config:  userAppSettingsConfig('Update'),
  };
};
// Update User Settings
export const addUserAppSettings = () => {
  return {
    url: `/api/v1/admin/userappsettings`,
    config:  userAppSettingsConfig('Create'),
  };
};
