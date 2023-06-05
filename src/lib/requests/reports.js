import { getConfig } from "lib";

// Reports End-Points
const Reports = "Reports";
const prefix = `api/v1/admin/reports/tickets`;

// Get data by Filter
export const getReportsByFilter = ({ reportType, StartDate, EndDate }) => ({
  url: `api/tickets/support/responsetime?reportType=${reportType}&StartDate=${StartDate}&EndDate=${EndDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// Get Replies Count
export const getReportsByReplyCount = ({ startDate, endDate }) => ({
  url: `${prefix}/repliespertickets/${startDate}/${endDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// Get Response Time
export const getReportsByResponseTime = ( reportType,StartDate, EndDate) => ({
  url: `api/tickets/support/responsetime?reportType=${reportType}&StartDate=${StartDate}&EndDate=${EndDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// annual income agains a year
export const getAnnualIncome = () => ({
  url: `/api/v1/admin/incomes/annual`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// Get Response Time
export const supportResponceTimeConfig = (startDate, endDate) => ({
  url: `/api/tickets/support/responsetime?reportType=100&StartDate=${startDate}&EndDate=${endDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// Get data by Filter 
export const suppotTicketdurationConfig = (reportType,StartDate, EndDate) => ({
  url: `/api/tickets/support/duration?reportType=${reportType}&StartDate=${StartDate}&EndDate=${EndDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

// Get Replies Count
export const suppotTicketreplycountConfig = (reportType,StartDate, EndDate) => ({
  url: `/api/tickets/support/replycount?reportType=${reportType}&StartDate=${StartDate}&EndDate=${EndDate}`,
  config: getConfig({ module: Reports, action: 'View' }),
});

export const getConfigReportsDownload = ({
  moduletype,
  userId,
  startDate,
  endDate,
}) => ({
  url: `${prefix}/exportexcel/${userId}/${moduletype}/${startDate}/${endDate}`,
  config: getConfig({ module: Reports, action: "View" }),
});
