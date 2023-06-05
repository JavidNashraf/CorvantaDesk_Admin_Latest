import { axios, getError } from 'lib';
import {
  createArticleCategoryConfig,
  deleteArticleCategoryConfig,
  getArticleCategoriesConfig,
  getArticleCategoryByIDConfig,
  updateArticleCategoryConfig,
} from 'lib/requests/articleCategories';
import { toast } from 'react-toastify';
import {
  setArticleCategoriesLoading,
  getArticleCategories,
  getArticleCategory,
} from 'store/Slices';

// Get All Categories
export const getAllArticleCategories = () => {
  return async (dispatch) => {
    dispatch(setArticleCategoriesLoading(true));
    try {
      const { url, defaultData, config } = getArticleCategoriesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getArticleCategories(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticleCategoriesLoading(false));
    }
  };
};

// Create an Article
export const createArticleCategory = (data) => {
  return async (dispatch) => {
    dispatch(setArticleCategoriesLoading(true));
    try {
      const { url, config } = createArticleCategoryConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getArticleCategoriesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticleCategories(res?.data?.data));
        toast.success('Article Category Created Successfully!');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticleCategoriesLoading(false));
    }
  };
};

// Get Article Category By ID
export const getArticleCategoryByID = (id) => {
  return async (dispatch) => {
    dispatch(setArticleCategoriesLoading(true));
    try {
      const { url, config } = getArticleCategoryByIDConfig(id);
      const res = await axios.get(url, config);
      dispatch(getArticleCategory(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticleCategoriesLoading(false));
    }
  };
};

// Update an Article Category
export const updateArticleCategory = ({ id, data }) => {
  return async (dispatch) => {
    dispatch(setArticleCategoriesLoading(true));
    try {
      const { url, config } = updateArticleCategoryConfig(id);
      const res = await axios.put(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getArticleCategoriesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticleCategories(res?.data?.data));
        toast.success('Article Category Updated Successfully!');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticleCategoriesLoading(false));
    }
  };
};

// Delete an Article
export const deleteArticleCategory = ({ id }) => {
  return async (dispatch) => {
    dispatch(setArticleCategoriesLoading(true));
    try {
      const { url, config } = deleteArticleCategoryConfig(id);
      const res = await axios.delete(url, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getArticleCategoriesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticleCategories(res?.data?.data));
        toast.success('Article Category Deleted Successfully!');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticleCategoriesLoading(false));
    }
  };
};
