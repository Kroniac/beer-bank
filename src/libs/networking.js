export const GetNetErrorCode = (err = {}) => {
  if (err.error && err.error.response) {
    return err.error.response.status;
  }
  if (err.response) {
    return err.response.status;
  }
  return null;
};
