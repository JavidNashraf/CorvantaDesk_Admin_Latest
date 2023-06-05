const prefix = `/api/v1/admin/credit`;

export const getCreditsConfig = () => ({
  url: `${prefix}/search`,
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
});

export const getCreditBalanceByClientConfig = (clientId) => ({
  url: `${prefix}/balance/${clientId}`,
});

export const createCreditConfig = (id) => ({
  url: `${prefix}/`,
});

export const updateCreditConfig = (id) => ({
  url: `${prefix}/${id}`,
});

export const increaseCreditConfig = () => ({
  url: `${prefix}/add`,
});

export const decreaseCreditConfig = () => ({
  url: `${prefix}/decrease`,
});

export const deleteCreditConfig = (id) => ({
  url: `${prefix}/${id}`,
});