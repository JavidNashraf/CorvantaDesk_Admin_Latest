import {
  axios,
  createAdminGroup,
  createAdminGroupPermission,
  deleteAdminGroup,
  getAdminGroupById,
  getAdminGroupPermissions,
  getAdminGroupsConfig,
  getError,
  updateAdminGroup,
  updateAdminGroupPermission,
} from "lib";
import {
  getGroup,
  getUserGroupsDispatch,
  getUserPermissionsDispatch,
  setUserGroupsLoading,
} from "store/Slices";
import { toast } from "react-toastify";

// Get All Groups
export const getUserGroups = () => {
  return async (dispatch) => {
    dispatch(setUserGroupsLoading(true));
    try {
      const { url } = getAdminGroupsConfig();
      const groupsRes = await axios.post(url, {
        advancedSearch: {
          fields: [""],
          keyword: "",
        },
        keyword: "",
        pageNumber: 0,
        pageSize: 0,
        orderBy: [""],
      });
      const groupsData = groupsRes?.data?.data;
      dispatch(getUserGroupsDispatch(groupsData));
      dispatch(setUserGroupsLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserGroupsLoading(false));
    }
  };
};
// Get Permissions for One Group
export const getGroupPermissions = (gid) => {
  return async (dispatch) => {
    dispatch(setUserGroupsLoading(true));
    try {
      const { url, config } = getAdminGroupPermissions(gid);
      const res = await axios.get(url, config);
      dispatch(getUserPermissionsDispatch(res?.data?.data));
      dispatch(setUserGroupsLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserGroupsLoading(false));
    }
  };
};

// Edit Permissions of a group (gid = GroupID)
export const editGroupPermissions = ({ permission, gid }) => {
  return async (dispatch) => {
    dispatch(setUserGroupsLoading(true));
    try {
      if (permission?.id) {
        const { url, config } = updateAdminGroupPermission(permission?.id);
        const updateObj = {
          name: permission?.name,
          permissionDetail: JSON.stringify(permission?.permissionDetail),
          tenant: "Admin",
          isActive: true,
          adminGroupId: permission?.adminGroupId,
        };
        await axios.put(url, updateObj, config);
      } else {
        const { url, config } = createAdminGroupPermission();
        const createObj = {
          name: permission?.name,
          permissionDetail: JSON.stringify(permission?.permissionDetail),
          tenant: "Admin",
          isActive: true,
          adminGroupId: gid,
        };
        await axios.post(url, createObj, config);
      }
      dispatch(setUserGroupsLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setUserGroupsLoading(false));
    }
  };
};

// Create new group
export const addGroup = (groupData) => async (dispatch, getState) => {
  dispatch(setUserGroupsLoading(true));
  try {
    const { url, config } = createAdminGroup();
    const addData = {
      ...groupData,
      tenant: "Admin",
    };
    const res = await axios.post(url, addData, config);
    const getConfig = getAdminGroupById(res?.data?.data);
    const userGroup = await axios.get(getConfig?.url, getConfig?.config);
    dispatch(getGroup(userGroup?.data?.data));
    const newGroups = [
      ...getState().userGroups.userGroups,
      userGroup?.data?.data,
    ];
    dispatch(getUserGroups(newGroups));
    dispatch(setUserGroupsLoading(false));
  } catch (e) {
    toast.error(getError(e));
    dispatch(setUserGroupsLoading(false));
  }
};

// Update a group
export const updateGroup = (group) => async (dispatch, getState) => {
  dispatch(setUserGroupsLoading(true));
  try {
    const { url, config } = updateAdminGroup(group?.id);
    const updateData = {
      ...group,
      tenant: "Admin",
    };
    const res = await axios.put(url, updateData, config);
    const getConfig = getAdminGroupById(res?.data?.data);
    const userGroup = await axios.get(getConfig?.url, getConfig?.config);
    const updatedGroups = getState().userGroups.userGroups.filter((group) => {
      return group?.id !== userGroup?.data?.data?.id;
    });
    const newGroups = [userGroup?.data?.data, ...updatedGroups];
    dispatch(getUserGroups(newGroups));
    dispatch(setUserGroupsLoading(false));
  } catch (e) {
    toast.error(getError(e));
    dispatch(setUserGroupsLoading(false));
  }
};

// Delete a group
export const deleteGroup = (groupID) => async (dispatch, getState) => {
  dispatch(setUserGroupsLoading(true));
  try {
    const { url, config } = deleteAdminGroup(groupID);
    const res = await axios.delete(url, config);
    const updatedGroups = getState().userGroups.userGroups.filter((group) => {
      return group?.id !== res?.data?.data;
    });
    dispatch(getUserGroups(updatedGroups));
    dispatch(setUserGroupsLoading(false));
  } catch (e) {
    toast.error(getError(e));
    dispatch(setUserGroupsLoading(false));
  }
};
