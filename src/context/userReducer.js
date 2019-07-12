export const SET_LOGIN = 'SET_LOGIN';
export const SET_LOGOUT = 'SET_LOGOUT';
export const SET_OPEN_LOGIN_DIALOG = 'SET_OPEN_LOGIN_DIALOG';
export const SET_CLOSE_LOGIN_DIALOG = 'SET_CLOSE_LOGIN_DIALOG';
export const SET_OPEN_POST_DIALOG = 'SET_OPEN_POST_DIALOG';
export const SET_CLOSE_POST_DIALOG = 'SET_CLOSE_POST_DIALOG';

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

const setOpenLoginDialog = state => ({ ...state, openLoginDialog: true });

const setCloseLoginDialog = state => ({ ...state, openLoginDialog: false });

const setOpenPostDialog = state => ({ ...state, openPostDialog: true });

const setClosePostDialog = state => ({ ...state, openPostDialog: false });

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_LOGIN:
      return setLogin(state, action.userInfo);
    case SET_LOGOUT:
      return setLogout();
    case SET_OPEN_LOGIN_DIALOG:
      return setOpenLoginDialog(state);
    case SET_CLOSE_LOGIN_DIALOG:
      return setCloseLoginDialog(state);
    case SET_OPEN_POST_DIALOG:
      return setOpenPostDialog(state);
    case SET_CLOSE_POST_DIALOG:
      return setClosePostDialog(state);
    default:
      return state;
  }
};
