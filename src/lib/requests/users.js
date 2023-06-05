import { getConfig } from "lib";
const AdminUsers = "Admin";
const Identity = "Identity";
const adminConfig = (action) => getConfig({ module: AdminUsers, action });
const identityConfig = (action) => getConfig({ module: Identity, action });

// Users
// const Users = "Users";
export const getUsersConfig = () => ({
  url: `/api/users/getallusersbyrolename/admin`,
  config: adminConfig('View'),
});

export const deleteAdminConfig = (id) => ({
  url: `/api/users/${id}/delete`,
  config: identityConfig('Remove')
});

export const getOnlineUsersConfig = () => ({
  url: `/api/users/getallonlineuser`,
  config: adminConfig('View')
});

export const getUserConfig = (id, isClient) => ({
  url: `/api/identity/profile/${id}`,
  config: isClient ? identityConfig('View') : adminConfig('View'),
});
export const getClientsConfig = () => ({
  url: `/api/users/getallusersbyrolename/client`,
  config: identityConfig('View'),
});
export const getSpecificConfig = () => ({
  url: `/api/users/find/specific`,
  // config: identityConfig('ListAll')
});
export const deleteClientConfig = (id) => ({
  url: `/api/users/${id}/delete`,
  // confg: identityConfig('Remove')
});
export const deactivateClientConfig = (id, type) => ({
  url: `/api/users/${id}/${type}`,
  config: identityConfig('Update')
});
