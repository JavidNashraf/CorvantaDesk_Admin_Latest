import { getConfig } from 'lib';

// User API Keys Management End-Points
// TODO: Change module name after fix from backend-devs
const apiKeyConfig = (action) => getConfig({ module: 'ManageUserApiKey', action });
// Get API Keys
export const getAPIKeysConfig = () => ({
  url: `/api/manageuserapikey/search`,
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
  config:  apiKeyConfig('View'),
});
// Get API Keys By User ID
export const getAPIKeysByUserIDConfig = (uid) => ({
  url: `/api/manageuserapikey/search`,
  defaultData: {
    advancedSearch: {
      fields: ['userIds'],
      keyword: uid,
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
  },
  config:  apiKeyConfig('View'),
});
// Get API Key by ID
export const getAPIKeyByIDConfig = (id) => ({
  url: `/api/manageuserapikey/${id}`,
  config:  apiKeyConfig('View'),
});
// Add API Key
export const addAPIKeyConfig = () => ({
  url: `/api/manageuserapikey`,
  config:  apiKeyConfig('Create'),
});
// Update API Key Settings
export const updateAPIKeySettingsConfig = (id) => ({
  url: `/api/manageuserapikey/userapikeyupdate/${id}`,
  config:  apiKeyConfig('Update'),
});
// Update API Key Permissions
export const updateAPIKeyPermissionsConfig = (id) => ({
  url: `/api/manageuserapikey/permissionsupdate/${id}`,
  config:  apiKeyConfig('Update'),
});
// Delete API Key
export const deleteAPIKeyConfig = (id) => ({
  url: `/api/manageuserapikey/${id}`,
  config:  apiKeyConfig('Remove'),
});
