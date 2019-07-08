export const SET_LOGIN = 'SET_LOGIN';
export const SET_LOGOUT = 'SET_LOGOUT';
export const OPEN_LOGIN_DIALOG = 'OPEN_LOGIN_DIALOG';
export const CLOSE_LOGIN_DIALOG = 'CLOSE_LOGIN_DIALOG';

const setLogin = (state, userInfo) => {
  if (state.isLoggedIn) {
    return state;
  }

  localStorage.setItem('userInfo', JSON.stringify({
    ...state,
    ...userInfo,
  })); // 设置本地存储

  return {
    ...state,
    ...userInfo,
  };
};

const setLogout = () => {
  const initialState = {
    openLoginDialog: false,
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

const openLoginDialog = state => ({ ...state, openLoginDialog: true });

const closeLoginDialog = state => ({ ...state, openLoginDialog: false });

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return setLogin(state, action.userInfo);
    case SET_LOGOUT:
      return setLogout();
    case OPEN_LOGIN_DIALOG:
      return openLoginDialog(state);
    case CLOSE_LOGIN_DIALOG:
      return closeLoginDialog(state);
    default:
      return state;
  }
};
