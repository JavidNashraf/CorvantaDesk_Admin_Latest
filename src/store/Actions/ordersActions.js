import {
  getError,
  axios,
  getOrdersConfig,
  YoursOrdersConfig,
  createOrderConfig,
  getOrderTemplatesConfig,
  createOrderTemplateConfig,
  editOrderTemplateConfig,
  getOrderConfig,
  activateAdminUserConfig,
  deactivateAdminUserConfig,
  getalluserstotakeordersIDConfig,
  activateAdminUserforOrderConfig,
  deactivateAdminUserforOrderConfig,
  enabletakeorderConfig,
  disableautoassignOrdersConfig,
  enableautoassignOrdersConfig,
  disabletakeorderConfig,
  getAllUserstotakeOrdersconfig,
} from "lib";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getOrdersDispatch,
  getOrderTemplatesDispatch,
  setOrderLoading,
  getOrderTemplate,
  // getOrder,
} from "store/Slices";
import { activateAdmin, deactivateAdmin, getOrder, YourOrdersDispatch, YoursOrderPaginationProps, getOrderAdmin, getOrderAdminID, getAlluserstoTakeOrdersSlice } from "store/Slices/ordersSlice";
import { getDataCounts } from "./count";

export const createOrder = ({ data, navigate }) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = createOrderConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {      
        const { url, defaultData, config } = getOrdersConfig();
        const res1 = await axios.post(url, defaultData, config);  
        dispatch(getOrdersDispatch(res1?.data?.data));
        toast.success("Order created successfully");
        dispatch(getDataCounts());
        navigate(
          `/admin/dashboard/billing/orders/all-orders/list/edit/${res?.data?.data}`
        );
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const editOrder = (id, data) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = getOrderConfig(id);
      const res = await axios.put(url, { ...data }, config);
      if (res?.status === 200) {
        dispatch(getOrders());
        toast.success("Order status updated successfully");
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Get All Admin Orders
export const getOrders = (params) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, defaultData, config } = getOrdersConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getOrdersDispatch(res?.data?.data));
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    }
  };
};

export const getYoursOrderbyId = (id, params = []) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, defaultData, config } = YoursOrdersConfig(id);

      if (params?.orderstatus) {
        defaultData['orderstatus'] = Number(params?.orderstatus);
      }
      if (params?.startDate && params?.endDate) {
        defaultData['startDate'] = params?.startDate;
        defaultData['endDate'] = params?.endDate;
      }
      const res = await axios.get(url, defaultData, config);
      dispatch(YourOrdersDispatch(res?.data?.data));
      const PaginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(setOrderLoading(false));
      dispatch(YoursOrderPaginationProps(PaginationProps))
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const getSearchOrders = (data) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = getOrdersConfig();
      const res = await axios.post(url, data, config);

      dispatch(getOrdersDispatch(res?.data?.data));
      const PaginationProps = {
        currentPage: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        totalCount: res?.data?.totalCount,
        totalPages: res?.data?.totalPages,
      }
      dispatch(YoursOrderPaginationProps(PaginationProps))
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Delete Order Template By ID
export const deleteOrderByID = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));

    try {
      const res = await axios.delete(`/api/v1/admin/orders/${id}`);
      if (res.status === 200) {
        dispatch(getDataCounts());
        dispatch(getOrders());
        toast.success("Order deleted successfully");
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Get All Admin Orders
export const getOrderDetails = (params) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url } = getOrderConfig(params);
      const res = await axios.get(url);
      dispatch(getOrder(res?.data?.data));
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    }
  };
};

// Get All Order Templates
export const getOrderTemplates = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, defaultData, config } = getOrderTemplatesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getOrderTemplatesDispatch(res?.data?.data));
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Create Order Template
export const createOrderTemplate = ({ data }) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = createOrderTemplateConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        toast.success("Template created successfuly");
        const { url, defaultData, config } = getOrderTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getOrderTemplates(res?.data?.data));
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Get Order Template By ID
export const getOrderTemplateByID = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const res = await axios.get(`/api/v1/admin/ordertemplates/${id}`);
      dispatch(getOrderTemplate(res?.data?.data));
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Edit Order Template By ID
export const editOrderTemplateByID = (id, data) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const res = await axios.put(`/api/v1/admin/ordertemplates/${id}`, data);
      toast.success("Changes saved successfully");
      if (res?.status === 200) {
        const { url, defaultData, config } = getOrderTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getOrderTemplatesDispatch(res?.data?.data));
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Delete Order Template By ID
export const deleteOrderTemplateByID = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const res = await axios.delete(`/api/v1/admin/ordertemplates/${id}`);
      if (res?.status === 200) {
        const { url, defaultData, config } = getOrderTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getOrderTemplatesDispatch(res?.data?.data));
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Edit Order Template
export const editOrderTemplate = ({ data }) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = editOrderTemplateConfig({ id: data?.id });
      const res = await axios.put(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getOrderTemplatesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getOrderTemplates(res?.data?.data));
      }
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Get All Users to Take Orders
export const getAllAdminOrdersByID = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = getalluserstotakeordersIDConfig();
      const res = await axios.get(url, config);
      dispatch(getOrderAdminID(res?.data?.data));
      dispatch(setOrderLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setOrderLoading(false));
    }
    finally {
      dispatch(setOrderLoading(false));
    }
  };
};

//Activate Admin User
export const activateOrderUser = (id, lastUser) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = activateAdminUserConfig(id);
      const res = await axios.put(url, config);
      dispatch(activateAdmin(res?.data?.data));
      if (res?.status === 200 && id === lastUser) {
        toast.success('User Can Take Order Now');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

//Activate Admin User For Orders
export const activateUserForOrder = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = activateAdminUserforOrderConfig(id);
      const res = await axios.put(url, config);
      dispatch(activateAdmin(res?.data?.data));
      if (res?.status === 200) {
        toast.success('User Can Take Order Now');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Deactivate Admin User
export const deactivateOrderUser = (id, lastUser) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = deactivateAdminUserConfig(id);
      const res = await axios.put(url, config);
      dispatch(deactivateAdmin(res?.data?.data));
      if (res?.status === 200 && id === lastUser) {
        toast.success("User Can't Take Order Now");
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Deactivate Admin User for Orders
export const deactivateOrderUserforOrder = (id) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = deactivateAdminUserforOrderConfig(id);
      const res = await axios.put(url, config);
      dispatch(deactivateAdmin(res?.data?.data));
      if (res?.status === 200) {
        toast.success("User Can't Take Order Now");
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};


// Enable Take Orders BY ID
export const enableTakeOrders = (id) => {
  return async (dispatch, getState) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = enabletakeorderConfig(id);
      const res = await axios.put(url, config);
      if (res.status === 200) {
        const { orderAdminID } = getState().orders;
        const index = orderAdminID.findIndex((key) => key.id === id)
        const orderStatusUpdate = [...orderAdminID]
        // let fullName =  "";
        if (index >= 0) {
          // fullName = orderStatusUpdate[index]?.fullName
          orderStatusUpdate[index] = {
            ...orderStatusUpdate[index],
            ['canTakeOrders']: true
          }
        }
        dispatch(getOrderAdminID(orderStatusUpdate));
        toast.success(`Order Enabled`);
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Disable Take Orders BY ID
export const disableTakeOrders = (id) => {
  return async (dispatch, getState) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = disabletakeorderConfig(id);
      const res = await axios.put(url, config);
      if (res.status === 200) {
        const { orderAdminID } = getState().orders;
        const index = orderAdminID.findIndex((key) => key.id === id)
        const orderStatusUpdate = [...orderAdminID]
        if (index >= 0) {
          orderStatusUpdate[index] = {
            ...orderStatusUpdate[index],
            ['canTakeOrders']: false
          }
        }
        dispatch(getOrderAdminID(orderStatusUpdate));
        toast.success(`Order Disabled`);
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};


// Enable Auto Assign Orders BY ID
export const enableautoassignOrders = (id) => {
  return async (dispatch, getState) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = enableautoassignOrdersConfig(id);
      const res = await axios.put(url, config);
      if (res.status === 200) {
        const { orderAdminID } = getState().orders;
        const index = orderAdminID.findIndex((key) => key.id === id)
        const autoAssignOrderUpdate = [...orderAdminID]
        if (index >= 0) {
          autoAssignOrderUpdate[index] = {
            ...autoAssignOrderUpdate[index],
            ['autoAssignOrders']: true
          }
        }
        dispatch(getOrderAdminID(autoAssignOrderUpdate));
        toast.success(`Auto Assign Orders Enabled`);
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

// Disable Auto Assign Orders BY ID
export const disableautoassignOrders = (id) => {
  return async (dispatch, getState) => {
    dispatch(setOrderLoading(true));
    try {
      const { url, config } = disableautoassignOrdersConfig(id);
      const res = await axios.put(url, config);
      if (res.status === 200) {
        const { orderAdminID } = getState().orders;
        const index = orderAdminID.findIndex((key) => key.id === id)
        const autoAssignOrderUpdate = [...orderAdminID]
        if (index >= 0) {
          autoAssignOrderUpdate[index] = {
            ...autoAssignOrderUpdate[index],
            ['autoAssignOrders']: false
          }
        }
        dispatch(getOrderAdminID(autoAssignOrderUpdate));
        toast.success(`Auto Assign Orders Disabled`);
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};