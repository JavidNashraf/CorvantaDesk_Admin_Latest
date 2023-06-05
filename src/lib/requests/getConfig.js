export const getConfig = ({ module, action, xForwardedFor }) => {
  const config = {
    headers: {
      modulename: module,
      moduleactionname: action,
      'X-Forwarded-For': xForwardedFor,
      'gen-api-key': process.env.REACT_APP_GEN_APIKEY,
    },
  };
  return config;
};
