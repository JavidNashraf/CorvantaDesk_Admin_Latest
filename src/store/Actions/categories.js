import { axios, getCategoriesConfig, getError } from 'lib';
import { toast } from 'react-toastify';
import { getCategoriesDispatch, setCategoriesLoading } from 'store/Slices';

// Get All Categories
export const getCategories = () => {
  return async (dispatch) => {
    dispatch(setCategoriesLoading(true));
    try {
      const { url, defaultData, config } = getCategoriesConfig();
      const res = await axios.post(url, defaultData, config);
      dispatch(getCategoriesDispatch(res?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setCategoriesLoading(false));
    }
  };
};

// Get Product By ID
// export const getProductByID = (id) => {
//   return async (dispatch) => {
//     dispatch(setProductsLoading(true));
//     try {
//       const product = await getProductsByIDCall(id);
//       dispatch(getProductDispatch(product?.data?.data));
//     } catch (error) {
//       toast.error(getError(error));
//     } finally {
//       dispatch(setProductsLoading(false));
//     }
//   };
// };
