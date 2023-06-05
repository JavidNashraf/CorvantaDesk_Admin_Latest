import { asyncForEach, axios, getError } from 'lib';
import { getArticleFeedbacksByArticleIDConfig } from 'lib/requests/articleFeedbacks';
import {
  createArticleConfig,
  deleteArticleConfig,
  getArticleByIDConfig,
  getArticlesConfig,
  getDraftArticlesConfig,
  getPrivateArticlesConfig,
  getPublicArticlesConfig,
  getRecentArticlesConfig,
  updateArticleConfig,
  getUserSubmissionsConfig,
  getUserSubmissionsCountConfig,
  getApproveUserSubmissionConfig,
} from 'lib/requests/articles';
import { toast } from 'react-toastify';
import { getArticles, getArticle, 
  setArticlesLoading, getRecentArticles,
   getUserSubmissions,getUserSubmissionsCount,
   setCountLoading
  } from 'store/Slices';

// Get All Articles
export const getAllArticles = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getArticles(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get User Submissions
export const getUsersSubmissions = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getUserSubmissionsConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getUserSubmissions(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get User Submissions Count
export const getUsersSubmissionsCount = () => {
  return async (dispatch) => {
    dispatch(setCountLoading(true));
    try {
      const { url, config } = getUserSubmissionsCountConfig();
      const res = await axios.get(url, config);
      dispatch(getUserSubmissionsCount(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setCountLoading(false));
    }
  };
};

// Approve User Submission
export const approveUserSubmission = ({ id }) => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, config } = getApproveUserSubmissionConfig({ id });
      const res = await axios.put(url, {}, config);
      toast.success("Article Approved Successfully");
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get All Articles with Feedback
export const getAllArticlesWithFeedbacks = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      const articles = res?.data?.data;
      if (articles?.length) {
        await asyncForEach(articles, async (article, index) => {
          const { url, config } = getArticleFeedbacksByArticleIDConfig({
            id: article?.id,
          });
          const res = await axios.get(url, config);
          articles[index].articleFeedbacks = res?.data?.data;
        });
        dispatch(getArticles(articles));
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get Public Articles
export const getPublicArticles = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getPublicArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getArticles(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get Private Articles
export const getPrivateArticles = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getPrivateArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getArticles(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get Draft Articles
export const getDraftArticles = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getDraftArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getArticles(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Get Recent Articles
export const getAllRecentArticles = () => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, defaultData, config } = getRecentArticlesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getRecentArticles(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Create an Article
export const createArticle = (data) => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, config } = createArticleConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        const { url, defaultData, config } = getArticlesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticles(res?.data?.data));
      }
    } catch (e) {
      toast.error(getError(e));
    }
  };
};

// View an Article By Id
export const getArticleByID = ({ id }) => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, config } = getArticleByIDConfig(id);
      const res = await axios.get(url, config);
      dispatch(getArticle(res?.data?.data));
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Update an Article
export const updateArticle = ({ id, data }) => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, config } = updateArticleConfig(id);
      const res = await axios.put(url, data, config);
      if (res.status === 200) {
        const { url, defaultData, config } = getPublicArticlesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticles(res?.data?.data));
        toast.success('Article updated successfully');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};

// Delete an Article
export const deleteArticle = ({ id }) => {
  return async (dispatch) => {
    dispatch(setArticlesLoading(true));
    try {
      const { url, config } = deleteArticleConfig(id);
      const res = await axios.delete(url, config);
      if (res.status === 200) {
        const { url, defaultData, config } = getPublicArticlesConfig();
        const res = await axios.post(url, defaultData, config);
        dispatch(getArticles(res?.data?.data));
        toast.success('Article deleted successfully');
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setArticlesLoading(false));
    }
  };
};
