import React, { useReducer } from 'react';

import loginContext from './userContext';
import { userReducer, LOGIN, LOGOUT } from './userReducer';

const GlobalState = (props) => {
  let initialState = {
    isLoggedIn: false,
    userName: '',
    avatar: '',
    auth: {
      mode: 'visitor',
      sections: [],
    },
  };

  const userInfoTemp = localStorage.getItem('userInfo');
  if (userInfoTemp !== undefined) {
    initialState = JSON.parse(userInfoTemp);
  }

  const [userState, dispatch] = useReducer(userReducer, initialState);

  const login = (userInfo) => {
    dispatch({ type: LOGIN, userInfo });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const { children } = props;
  return (
    <loginContext.Provider
      value={{
        userState,
        login,
        logout,
      }}
    >
      {children}
    </loginContext.Provider>
  );
};

export default GlobalState;
