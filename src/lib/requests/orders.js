 import { getConfig } from "lib";

 const ordersConfig = (action) => getConfig({ module: "Orders", action });

 const usersConfig = (action) => getConfig({ module: "Identity", action });

const prefix = `/api/v1/admin/orders`;
const otprefix = "/api/v1/admin/ordertemplates";

export const getOrdersConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: "",
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 1000,
    orderBy: ["lastModifiedOn"],
  },
   config: ordersConfig('View'),
});
export const YoursOrdersConfig = (id) => ({
  url: `${prefix}/getallordersbyadminid/${id}`,
  config: ordersConfig('View'),
});

export const createOrderConfig = () => ({
  url: `${prefix}`,
   config: ordersConfig('Create'),
});

export const getOrderConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: ordersConfig('View'),
});

export const getOrderTemplatesConfig = () => ({
  url: `${otprefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [],
      keyword: "",
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 0,
    orderBy: [""],
  },
   config: ordersConfig('View'),
});

export const createOrderTemplateConfig = () => ({
  url: `${otprefix}`,
   config: ordersConfig('Create'),
});

export const editOrderTemplateConfig = ({ id }) => ({
  url: `${otprefix}/${id}`,
   config: ordersConfig('Update'),
});

export const getalluserstotakeordersIDConfig = () => ({
  url: `api/users/getallusersbyrolename/admin`,
   config: usersConfig('View'),
})

export const activateAdminUserConfig = (id) => ({
  url: `/api/users/activateadminusertotakeorder/${id}`,
   config: ordersConfig('View'),
})

export const activateAdminUserforOrderConfig = (id) => ({
  url: `/api/users/activateadminuserforavailableorder/${id}`,
   config: ordersConfig('View'),
})

export const deactivateAdminUserConfig = (id) => ({
  url: `/api/users/deactivateadminusertotakeorder/${id}`,
   config: ordersConfig('View'),
})

export const deactivateAdminUserforOrderConfig = (id) => ({
  url: `/api/users/deactivateadminuserforavailableorder/${id}`,
   config: ordersConfig('View'),
})

export const enabletakeorderConfig = (id) => ({
  url: `/api/v1.0/admin/userappsettings/enabletakeorders/${id}`,
   config: ordersConfig('View'),
})

export const disabletakeorderConfig = (id) => ({
  url: `/api/v1.0/admin/userappsettings/disabletakeorders/${id}`,
   config: ordersConfig('View'),
})

export const enableautoassignOrdersConfig = (id) => ({
  url: `/api/v1.0/admin/userappsettings/enableautoassignorders/${id}`,
   config: ordersConfig('View'),
})

export const disableautoassignOrdersConfig = (id) => ({
  url: `/api/v1.0/admin/userappsettings/disableautoassignorders/${id}`,
   config: ordersConfig('View'),
})
