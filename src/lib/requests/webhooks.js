import { getConfig } from 'lib';

// WebHooks End-Points
const WebHooks = 'Webhooks';
const prefix = '/api/v1/admin/webhooks';
// Get List of All Web Hooks
export const getAllWebHooksConfig = () => ({
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
  config: getConfig({ module: WebHooks, action: 'View' }),
});
// Add WebHook
export const addWebHookConfig = () => ({
  url: `${prefix}`,
  config: getConfig({ module: WebHooks, action: 'Create' }),
});
// Edit WebHook
export const editWebHookConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: WebHooks, action: 'Update' }),
});
// Delete WebHook
export const deleteWebHookConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  config: getConfig({ module: WebHooks, action: 'Remove' }),
});
