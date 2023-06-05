import { getConfig } from 'lib';

// Admin Groups
const AdminGroups = 'Admin';
const adminGroupsConfig = (action) =>
  getConfig({ module: AdminGroups, action });
// Get Admin Groups
export const getAdminGroupsConfig = () => ({
  url: '/api/admingroups/search',
  config: adminGroupsConfig('View'),
});
// Create Admin Group
export const createAdminGroup = () => ({
  url: '/api/admingroups',
  config: adminGroupsConfig('Create'),
});
// Get Admin Group By ID
export const getAdminGroupById = (id) => ({
  url: `/api/admingroups/${id}`,
  config: adminGroupsConfig('View'),
});
// Delete Group By ID
export const deleteAdminGroup = (id) => ({
  url: `/api/admingroups/${id}`,
  config: adminGroupsConfig('Remove'),
});
// Update Group By ID
export const updateAdminGroup = (id) => ({
  url: `/api/admingroups/${id}`,
  config: adminGroupsConfig('Update'),
});
