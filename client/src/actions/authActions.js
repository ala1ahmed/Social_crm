import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';
import { setAlert } from './alertActions';
// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post('/api/users/register', userData)
    .then((res) => history.push('/login'))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
//Register Company
export const registerCompany = (userData, history) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/company', userData)
    .then((res) => {
      dispatch(
        setAlert('Account Created and need email verification', 'success')
      );
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};

// Login - Get Companies
export const getCompanies = () => (dispatch) => {
  axios
    .get('http://localhost:5000/api/company')
    .then((res) => {
      // Save to localStorage
      console.log(res.data);

      // Set token to ls
      let options = res.data.map((company) => ({
        value: company.id,
        label: company.name,
      }));
      return { options };
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - Get User Token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/auth', userData)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//Reset
export const resetPassword = (email) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/auth/reset', { email })
    .then((res) => dispatch(setAlert(res.data.msg, 'success')))
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};
//resetting the password
export const resettingPassword = (userData, history) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/auth/new-password', { userData })
    .then((res) => {
      dispatch(setAlert(res.data.msg, 'success'));
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};

export const verifyEmail = (token, history) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/auth/verification', { token })
    .then((res) => {
      dispatch(setAlert(res.data.msg, 'success'));
      setTimeout(() => {
        history.push('/login');
      }, 2000);
    })
    .catch((err) => dispatch(setAlert(err.response.data.msg, 'danger')));
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
