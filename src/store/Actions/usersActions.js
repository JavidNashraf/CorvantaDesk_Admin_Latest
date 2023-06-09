import {
  getError,
  axios,
  getUsersConfig,
  getClientsConfig,
  getUserConfig,
  updateUserModule,
  addUserModule,
  getUserModulesConfig,
  updateUserProfileByIDConfig,
  registerAdminConfig,
  getUserAppSettingsConfig,
  updateUserAppSettings,
  addUserAppSettings,
  registerClientConfig,
  getSpecificConfig,
  updateUserPasswordConfig,
  getOnlineUsersConfig,
  deleteClientConfig,
  deleteAdminConfig,
  deactivateClientConfig,
} from "lib";
import { toast } from "react-toastify";
import {
  getUser,
  getOnlineUsers,
  getUserModule,
  getUsersDispatch,
  getSpecificUsersDispatch,
  getClientsDispatch,
  setUserLoading,
} from "store/Slices";
import { getUserSettingsSlice } from "store/Slices/usersSlice";

import { getDataCounts } from "./count";
// import { getDepartments } from "./departmentsActions";

// Get All Admin Users
export const getUsers = () => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = getUsersConfig();
      const res = await axios.get(url, config);
      // console.log("get user res", res);
      dispatch(getUsersDispatch(res?.data?.data));
      dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserLoading(false));
      // console.log("get users errrrr", e);
    }
  };
};

// Get Online Users
export const getCurrentOnlineUsers = (isInterval) => {
  return async (dispatch) => {
    !isInterval && dispatch(setUserLoading(true));
    try {
      const { url } = getOnlineUsersConfig();
      const res = await axios.get(url);
      // console.log(res);
      !isInterval && dispatch(getOnlineUsers(res?.data));
      if (isInterval && res?.data?.length > 0) {
        dispatch(getOnlineUsers(res?.data));
      }
      isInterval && dispatch(setUserLoading(false));
    } catch (e) {
      !isInterval && toast.error(getError(e));
      !isInterval && dispatch(setUserLoading(false));
    }
  };
};

// Get All Client Users
export const getClients = (isInterval) => {
  return async (dispatch) => {
    !isInterval && dispatch(setUserLoading(true));
    try {
      const { url, config } = getClientsConfig();
      const res = await axios.get(url, config);
      dispatch(getClientsDispatch(res?.data?.data));
      !isInterval && dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      !isInterval && dispatch(setUserLoading(false));
    }
  };
};

// Delete User By ID
export const deleteUserById = (id, isClient = false) => {
  const user = isClient ? "Client" : "Admin";
  // console.log(user)
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      if(isClient) {
        const { url } = deleteClientConfig(id);
        const res = await axios.delete(url);
        if (res?.status === 200) {
          dispatch(getClients());
        } 
      }
      else {
        const { url } = deleteAdminConfig(id);
        const res = await axios.delete(url);
        if (res?.status === 200) {
          dispatch(getUsers());
        } 
      }
      
      toast.success(`${user} deleted successfuly`);
      dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserLoading(false));
    }
  };
};

// Delete User By ID
export const userStatusChangeById = (id, type) => {
  return async (dispatch) => {
    // dispatch(setUserLoading(true));
    try {
      const { url } = deactivateClientConfig(id, type);
      const res = await axios.put(url);
      if (res?.status === 200) {
        dispatch(getClients());
        dispatch(getUserById(id, true));
      }
      toast.success(
        `Client ${
          type === "activate" ? "activated" : "deactivated"
        } successfuly`
      );
      // dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      // dispatch(setUserLoading(false));
    }
  };
};

// Get User By ID
export const getUserById = (id, isClient = false) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = getUserConfig(id, isClient);
      const res = await axios.get(url, config);
      dispatch(getUser(res?.data?.data));
      dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserLoading(false));
    }
  };
};

// Add User
export const addUser = (data) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = registerAdminConfig();
      const res = await axios.post(url, data, config);
      if (res.status === 200) {
        const { url, config } = getUsersConfig();
        const res = await axios.get(url, config);
        dispatch(getUsers(res?.data?.data));
        toast.success("User Added Successfully");
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

// Add Client User
export const addClientUser = (data) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = registerClientConfig();
      const res = await axios.post(url, data, config);
      if (res.status === 200) {
        const { url, config } = getClientsConfig();
        const res = await axios.get(url, config);
        dispatch(getClients(res?.data?.data));
        toast.success("Client Added Successfully");
        if (res.status === 200) dispatch(getDataCounts());
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

// Update User
export const updateUser = (id, data, isClient = false) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    // console.log("updated user", data);
    try {
      const { url, config } = updateUserProfileByIDConfig(id, isClient);
      const res = await axios.put(url, data, config);
      // If Updated Then Get User
      if (res.status === 200) {
        const { url, config } = getUserConfig(id);
        const res = await axios.get(url, config);
        dispatch(getUser(res?.data?.data));
        // If Get User Done Then Get All Users
        if (res?.status === 200) {
          dispatch(getClients());
          const { url, config } = getUsersConfig();
          const res = await axios.get(url, config);
          dispatch(getUsers(res?.data?.data));
        }
        toast.success("User Updated Successfully");
      }
    } catch (e) {
      toast.error(getError(e));
      // console.log("Update err", e);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

// Update User
export const updateUserPassword = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setUserLoading(true));
      const { url } = updateUserPasswordConfig();
      await axios.post(url, data);
      toast.success("User Password Successfully");
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserLoading(false));
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

// Get User Modules By ID
export const getUserModulesById = (id) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = getUserModulesConfig(id);
      const res = await axios.get(url, config);
      dispatch(getUserModule(res?.data?.data));
      dispatch(setUserLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserLoading(false));
    }
  };
};

// Edit Permissions of a group (gid = GroupID)
export const editUserPermissions = ({ permission, uid }) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      if (permission?.id) {
        const { url, config } = updateUserModule(permission?.id);
        const updateObj = {
          name: permission?.name,
          permissionDetail: JSON.stringify(permission?.permissionDetail),
          tenant: "Admin",
          isActive: true,
          adminGroupId: permission?.adminGroupId,
        };
        await axios.put(url, updateObj, config);
      } else {
        const { url, config } = addUserModule();
        const createObj = {
          name: permission?.name,
          permissionDetail: JSON.stringify(permission?.permissionDetail),
          tenant: "Admin",
          isActive: true,
          userId: uid,
        };
        await axios.post(url, createObj, config);
      }
      dispatch(setUserLoading(false));
    } catch (e) {
      // console.log(e);
      toast.error(getError(e));
      dispatch(setUserLoading(false));
    }
  };
};

// Get User Settings By ID
export const getUserSettingsById = (id) => {
  return async (dispatch) => {
    try {
      const { url, config } = getUserAppSettingsConfig(id);
      const res = await axios.get(url, config);
      dispatch(getUserSettingsSlice(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    }
  };
};

// Update User Settings By ID
export const updateUserSettings = ({ data }) => {
  return async (dispatch) => {
    try {
      let res;
      if (data?.id) {
        const { url, config } = updateUserAppSettings({ id: data?.id });
        res = await axios.put(url, data, config);
      } else {
        const { url, config } = addUserAppSettings();
        res = await axios.post(url, data, config);
      }
      if (res.status === 200) {
        const { url, config } = getUserAppSettingsConfig(data?.userId);
        const res = await axios.get(url, config);
        dispatch(getUserSettingsSlice(res?.data?.data));
        toast.success("User Settings Updated Successfully");
      }
    } catch (e) {
      toast.error(getError(e));
    }
  };
};

// Find Specific Users
export const findSpecificUsers = (data) => {
  return async (dispatch) => {
    dispatch(setUserLoading(true));
    try {
      const { url, config } = getSpecificConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        dispatch(getSpecificUsersDispatch(res?.data?.data));
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setUserLoading(false));
    }
  };
};

export const AutoRefreshApp = () => {
  return async (dispatch) => {
    // dispatch(getDepartments(true));
    // dispatch(getClients(true));
    // dispatch(getCurrentOnlineUsers(true));
  };
};
