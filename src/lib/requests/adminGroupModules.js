import { getConfig } from "lib";

// Admin Group Module Management
const AdminGroupModuleManagement = "ManageModule";
const adminGMMC = (action) =>
  getConfig({ module: AdminGroupModuleManagement, action });
// Get Admin Group Permissions
export const getAdminGroupPermissions = (groupId) => ({
  url: `/api/admingroupmodulemanagement/getmodulebyadmingroup/${groupId}`,
});
// Create Admin Group Permission
export const createAdminGroupPermission = () => ({
  url: `/api/admingroupmodulemanagement`,
});
// Update Admin Group Permission
export const updateAdminGroupPermission = (permissionId) => ({
  url: `/api/admingroupmodulemanagement/${permissionId}`,
});
  