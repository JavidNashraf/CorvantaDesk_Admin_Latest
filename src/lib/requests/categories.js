import { getConfig } from './getConfig';

// const Products = 'Products';
const categoriesConfig = (action) => getConfig({ module: 'Orders', action });
const prefix = '/api/v1/admin/categories';

// Get All Categories
export const getCategoriesConfig = () => ({
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
    categoryType: 0,
  },
  config: categoriesConfig('View'),
});

// Add Category
export const addCategoryConfig = () => ({
  url: `${prefix}`,
  config: categoriesConfig('Create'),
});
