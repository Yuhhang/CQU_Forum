import React, { useReducer } from 'react';
import axios from 'axios';

import loginContext from './userContext';
import {
  userReducer,
  SET_LOGIN,
  SET_LOGOUT,
  OPEN_LOGIN_DIALOG,
  CLOSE_LOGIN_DIALOG,
} from './userReducer';


const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

const GlobalState = (props) => {
  let initialState = {
    openLoginDialog: false,
    isLoggedIn: false,
    userName: '',
    avatar: '',
    auth: {
      mode: 'visitor',
      sections: [],
    },
  };

  const userInfoTemp = localStorage.getItem('userInfo');
  if (userInfoTemp !== null) {
    initialState = JSON.parse(userInfoTemp);
  }

  const [userState, dispatch] = useReducer(userReducer, initialState);

  const openLoginDialog = () => {
    dispatch({ type: OPEN_LOGIN_DIALOG });
  };

  const closeLoginDialog = () => {
    dispatch({ type: CLOSE_LOGIN_DIALOG });
  };

  const setLogin = (userInfo) => {
    dispatch({ type: SET_LOGIN, userInfo });
  };

  const setLogout = () => {
    instance.get('/logout').then((res) => {
      if (res.data.success) {
        dispatch({ type: SET_LOGOUT });
        localStorage.clear();
      }
    });
  };

  const { children } = props;
  return (
    <loginContext.Provider
      value={{
        userState,
        setLogin,
        setLogout,
        openLoginDialog,
        closeLoginDialog,
      }}
    >
      {children}
    </loginContext.Provider>
  );
};

export default GlobalState;
