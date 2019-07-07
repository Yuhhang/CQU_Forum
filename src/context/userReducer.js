export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const login = (state, userInfo) => {
  if (state.isLoggedIn) {
    return state;
  }

  return {
    ...state,
    isLoggedIn: true,
    userName: userInfo.userName,
    avatar: userInfo.avatar,
    auth: userInfo.auth,
  };
};

const logout = () => {
  const initialState = {
    isLoggedIn: false,
    userName: '',
    avatar: '',
    auth: {
      mode: 'visitor',
      sections: [],
    },
  };

  return initialState;
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return login(state, action.userInfo);
    case LOGOUT:
      return logout();
    default:
      return state;
  }
};
