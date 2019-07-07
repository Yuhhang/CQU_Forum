import React, { useReducer } from 'react';

import loginContext from './userContext';
import { userReducer, LOGIN, LOGOUT } from './userReducer';

const GlobalState = (props) => {
  const initialState = {
    isLoggedIn: false,
    userName: '',
    avatar: '',
    auth: {
      mode: 'visitor',
      sections: [],
    },
  };

  const [userState, dispatch] = useReducer(userReducer, initialState);

  const login = (userInfo) => {
    dispatch({ type: LOGIN, userInfo });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <loginContext.Provider
      value={{
        userState,
        login,
        logout,
      }}
    >
      {props.children}
    </loginContext.Provider>
  );
};

export default GlobalState;
