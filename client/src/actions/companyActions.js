import axios from 'axios';
import { GET_PROFILE, GET_COMPANIES } from './types';

export const getCompany = () => (dispatch) => {
  axios
    .get('http://localhost:5000/api/company')
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};

export const getCompanies = () => (dispatch) => {
  axios
    .get('http://localhost:5000/api/company/all')
    .then((res) => {
      dispatch({
        type: GET_COMPANIES,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
