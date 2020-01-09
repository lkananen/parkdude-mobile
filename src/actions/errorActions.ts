import {
  NETWORK_ERROR, RESERVATION_FAILED, CLEAR_ERRORS,
  GENERAL_ERROR, PASSWORD_LOGIN_ERROR, SIGNUP_ERROR
} from './actionTypes';

export const generalError = (errorString: string) => {
  return {
    type: GENERAL_ERROR,
    payload: errorString
  };
};

export const setPasswordLoginError = (errorString: string) => {
  return {
    type: PASSWORD_LOGIN_ERROR,
    payload: errorString
  };
};

export const setSignupError = (errorString: string) => {
  return {
    type: SIGNUP_ERROR,
    payload: errorString
  };
};

export const gotNetworkError = (errorString: string) => {
  return {
    type: NETWORK_ERROR,
    payload: errorString
  };
};

export const reservationFailed = (result) => {
  return {
    type: RESERVATION_FAILED,
    payload: result
  };
};

export const clearErrorState = () => {
  return {
    type: CLEAR_ERRORS
  };
};
