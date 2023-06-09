import { getConfig } from 'lib';

const Articles = 'KnowledgeBase';
const prefix = '/api/v1/admin/articles';
const articlesConfig = (action) => getConfig({ module: Articles, action });

// Get Articles
export const getArticlesConfig = () => ({
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
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
    startDate: null,
    endDate: null,
  },
  config: articlesConfig('View'),
});

export const getUserSubmissionsConfig = () => ({
  url: `${prefix}/usersubmissions/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
    startDate: null,
    endDate: null,
  },
  config: articlesConfig('Search'),
});

export const getUserSubmissionsCountConfig = () => ({
  url: `${prefix}/usersubmissions/count`,
  config: articlesConfig('Search'),
});

export const getApproveUserSubmissionConfig = ({id}) => ({
  url: `${prefix}/usersubmissions/approve/${id}`,
  config: articlesConfig('Update'),
});

// Get Public Articles
export const getPublicArticlesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: ['visibility'],
      keyword: 'true',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
    startDate: null,
    endDate: null,
  },
  config: articlesConfig('View'),
});

// Get Private Articles
export const getPrivateArticlesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: ['visibility'],
      keyword: 'false',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
    startDate: null,
    endDate: null,
  },
  config: articlesConfig('View'),
});

// Get Draft Articles
export const getDraftArticlesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: ['articleStatus'],
      keyword: 'draft',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 0,
    orderBy: [''],
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
  },
  config: articlesConfig('View'),
});

// Get Recent Articles
export const getRecentArticlesConfig = () => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 5,
    orderBy: [''],
    categoryId: null,
    minimumRate: 0,
    maximumRate: 0,
  },
  config: articlesConfig('View'),
});

// Create Article
export const createArticleConfig = () => ({
  url: prefix,
  config: articlesConfig('Create'),
});

// Delete Article
export const deleteArticleConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('Remove'),
});

// Update Article
export const updateArticleConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('Update'),
});

// Get Article By ID
export const getArticleByIDConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: articlesConfig('View'),
});
