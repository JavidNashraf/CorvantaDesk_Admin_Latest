import { getConfig } from 'lib';

// ModuleManagement End-Points
export const getAppModulesConfig = () => ({
  url: '/api/modulemanagement/getmodulebytenant/admin',
});

// UserModuleManagement End-Points
const UserModuleManagement = 'Admin';
// Get User Modules
export const getUserModulesConfig = (userId) => ({
  url: `/api/usermodulemanagement/getmodulebyuser/${userId}`,
});
// Add User Module
export const addUserModule = () => ({
  url: `/api/usermodulemanagement`,
  config:  getConfig({ module: UserModuleManagement, action: 'Create' }),
});
// Update User Module (mid = Module ID)
export const updateUserModule = (mid) => ({
  url: `/api/usermodulemanagement/${mid}`,
  config:  getConfig({ module: UserModuleManagement, action: 'Update' }),
});
