import { getConfig } from 'lib';

const Articles = 'KnowledgeBase';
const prefix = 'api/v1/admin/categories';
const articlesConfig = (action) => getConfig({ module: Articles, action });

// Get Articles
export const getArticleCategoriesConfig = () => ({
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
    categoryType: 1,
  },
 config: articlesConfig('View'),
});

// Create Article Category
export const createArticleCategoryConfig = () => ({
  url: prefix,
  config: articlesConfig('Create'),
});

// Delete Article Category
export const deleteArticleCategoryConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('Remove'),
});

// Update Article Category
export const updateArticleCategoryConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('Update'),
});

// Get Article Category By ID
export const getArticleCategoryByIDConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('View'),
});
