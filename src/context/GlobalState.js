import React, { useReducer } from 'react';
import instance from '../components/axios';

import loginContext from './userContext';
import {
  userReducer,
  SET_LOGIN,
  SET_LOGOUT,
  SET_OPEN_LOGIN_DIALOG,
  SET_CLOSE_LOGIN_DIALOG,
  SET_OPEN_POST_DIALOG,
  SET_CLOSE_POST_DIALOG,
  SET_SHOW_BACK_BUTTON,
  SET_UNSHOW_BACK_BUTTON,
  SET_SHOW_MSG,
  SET_UNSHOW_MSG,
} from './userReducer';


const GlobalState = (props) => {
  let initialState = {
    openLoginDialog: false,
    openPostDialog: false,
    openMsgBar: false,
    msgBarType: '',
    msgBarText: '',
    showBackButton: false,
    backFunction: null,
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

  const setOpenPostDialog = () => {
    dispatch({ type: SET_OPEN_POST_DIALOG });
  };

  const setClosePostDialog = () => {
    dispatch({ type: SET_CLOSE_POST_DIALOG });
  };

  const setOpenLoginDialog = () => {
    dispatch({ type: SET_OPEN_LOGIN_DIALOG });
  };

  const setCloseLoginDialog = () => {
    dispatch({ type: SET_CLOSE_LOGIN_DIALOG });
  };

  const setShowBackButton = (backFunction) => {
    dispatch({ type: SET_SHOW_BACK_BUTTON, backFunction });
  };

  const setunShowBackButton = () => {
    dispatch({ type: SET_UNSHOW_BACK_BUTTON });
  };

  const setShowMsgBar = (msgType, msg) => {
    dispatch({ type: SET_SHOW_MSG, msgType, msg });
  };

  const setunShowMsgBar = () => {
    dispatch({ type: SET_UNSHOW_MSG });
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
        setOpenLoginDialog,
        setCloseLoginDialog,
        setOpenPostDialog,
        setClosePostDialog,
        setShowBackButton,
        setunShowBackButton,
        setShowMsgBar,
        setunShowMsgBar,
      }}
    >
      {children}
    </loginContext.Provider>
  );
};

export default GlobalState;
