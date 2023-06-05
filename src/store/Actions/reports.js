import {
  axios,
  getAnnualIncome,
  getError,
  getReportsByFilter,
  getReportsByReplyCount,
  getReportsByResponseTime,
  getConfigReportsDownload,
  getCurrentDate,
  suppotTicketdurationConfig,
  suppotTicketreplycountConfig,
  supportResponceTimeConfig,
} from "lib";
import { toast } from "react-toastify";
import {
  getAnnualReportsDispatch,
  getReplyReportsDispatch,
  getReportsByCustomerDispatch,
  getReportsByAgentDispatch,
  getReportsByDepartmentDispatch,
  getReportsByPriorityDispatch,
  getReportsByStatusDispatch,
  getResponseReportsDispatch,
  setReportsLoading,
  replyReportDispatch,
  ticketDurationDispatch,
  responceTimeDispatch,
  getReportsByNormalDispatch,
  getReportsByEmailDispatch,
  getReportsByLinkedIpDispatch,
} from "store/Slices";
import { saveAs } from "file-saver";
// Get Annual Reports By Year -1
export const getAnnualReports = () => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getAnnualIncome();
      const res = await axios.get(url, config);
      dispatch(getAnnualReportsDispatch(res?.data?.data?.incomeOveralls));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Support Response time -2
export const supportResponceTime = ({ reportType, startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByResponseTime(reportType, startDate, endDate);
      const res = await axios.get(url, config);
      const reportTypes = ["normal", "byCustomer", "byAgent", "byEmail", "linkedIP", "byStatus", "byDepartment"]
      const response = {
        type: reportTypes?.[reportType],
        data: res?.data?.data?.support
      }
      dispatch(
        responceTimeDispatch(response)
      );
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

//  support ticket Duration -3
export const supportTicketduration = ({ reportType,startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = suppotTicketdurationConfig(reportType,startDate, endDate);
      const res = await axios.get(url, config);
      const reportTypes = ["normal", "byCustomer", "byAgent", "byEmail", "linkedIP", "byStatus", "byDepartment"]
      const response = {
        type: reportTypes?.[reportType],
        data: res?.data?.data?.support
      }
      dispatch(
        ticketDurationDispatch(response)
      );
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Support ticket reply count -4
export const suppotTicketReplycount = ({ reportType,startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = suppotTicketreplycountConfig(reportType,startDate, endDate);
      const res = await axios.get(url, config);
      const reportTypes = ["normal", "byCustomer", "byAgent", "byEmail", "linkedIP"];
      const response = {
        type: reportTypes?.[reportType],
        data: res?.data?.data?.support
      }
      dispatch(
        getReplyReportsDispatch(response)
      );
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Get Reports By Normal
// export const getReportsByNormal = ({ startDate, endDate }) => {
//   return async (dispatch) => {
//     dispatch(setReportsLoading(true));
//     try {
//       const { url, config } = getReportsByFilter({
//         reportType: 0,
//         startDate,
//         endDate,
//       });
//       const res = await axios.get(url, config);
//       dispatch(getReportsByNormalDispatch(res?.data?.data));
//     } catch (error) {
//       toast.error(getError(error));
//     } finally {
//       dispatch(setReportsLoading(false));
//     }
//   };
// };

// Get Reports By Customers
export const getReportsByCustomer = ( reportType,startDate, endDate ) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByResponseTime({
        reportType,
        startDate,
        endDate,
    });
      const res = await axios.get(url, config);   
      dispatch(getReportsByCustomerDispatch(res?.data?.data?.support));
      // console.log("res in customr",res)
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Get Reports By Agent
export const getReportsByAgent = ({ startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByFilter({
        reportType: 2,
        startDate,
        endDate,
      });
      const res = await axios.get(url, config);
      dispatch(getReportsByAgentDispatch(res?.data?.data?.support));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Get Reports By Email
// export const getReportsByEmail = ({ startDate, endDate }) => {
//   return async (dispatch) => {
//     dispatch(setReportsLoading(true));
//     try {
//       const { url, config } = getReportsByFilter({
//         reportType: 3,
//         startDate,
//         endDate,
//       });
//       const res = await axios.get(url, config);
//       dispatch(getReportsByEmailDispatch(res?.data?.data?.support));
//     } catch (error) {
//       toast.error(getError(error));
//     } finally {
//       dispatch(setReportsLoading(false));
//     }
//   };
// };

// Get Reports By LinkedIp
// export const getReportsByLinkedIp = ({ startDate, endDate }) => {
//   return async (dispatch) => {
//     dispatch(setReportsLoading(true));
//     try {
//       const { url, config } = getReportsByFilter({
//         reportType: 4,
//         startDate,
//         endDate,
//       });
//       const res = await axios.get(url, config);
//       dispatch(getReportsByLinkedIpDispatch(res?.data?.data?.support));
//     } catch (error) {
//       toast.error(getError(error));
//     } finally {
//       dispatch(setReportsLoading(false));
//     }
//   };
// };

// Get Reports By Status
export const getReportsByStatus = ({ startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByFilter({
        reportType: 5,
        startDate,
        endDate,
      });
      const res = await axios.get(url, config);
      dispatch(getReportsByStatusDispatch(res?.data?.data?.support));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Get Reports By Department
export const getReportsByDepartment = ({ startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByFilter({
        reportType: 6,
        startDate,
        endDate,
      });
      const res = await axios.get(url, config);
      dispatch(getReportsByDepartmentDispatch(res?.data?.data?.support));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

// Get Reports By Priority
export const getReportsByPriority = ({ startDate, endDate }) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getReportsByFilter({
        reportType: 4,
        startDate,
        endDate,
      });
      const res = await axios.get(url, config);
      dispatch(getReportsByPriorityDispatch(res?.data?.data));
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};

//Get Reports For Download
export const getReportsForDownload = ({
  moduletype,
  userId,
  startDate,
  endDate,
  clientName,
}) => {
  return async (dispatch) => {
    dispatch(setReportsLoading(true));
    try {
      const { url, config } = getConfigReportsDownload({
        moduletype,
        userId,
        startDate,
        endDate,
      });
      const configT = { ...config, responseType: "blob" }
      const res = await axios.get(url, configT);
      const contentType = res.headers["content-type"];
      // console.log('res', contentType);
      const urlFile = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
      const date = getCurrentDate();
      const fileName = clientName + "-Download-" + date + ".xls";
      saveAs(urlFile, fileName)
      toast(`Downloaded file successfully`);
    } catch (error) {
      toast.error(getError(error));
    } finally {
      dispatch(setReportsLoading(false));
    }
  };
};
