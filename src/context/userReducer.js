export const SET_LOGIN = 'SET_LOGIN';
export const SET_LOGOUT = 'SET_LOGOUT';
export const SET_OPEN_LOGIN_DIALOG = 'SET_OPEN_LOGIN_DIALOG';
export const SET_CLOSE_LOGIN_DIALOG = 'SET_CLOSE_LOGIN_DIALOG';
export const SET_OPEN_POST_DIALOG = 'SET_OPEN_POST_DIALOG';
export const SET_CLOSE_POST_DIALOG = 'SET_CLOSE_POST_DIALOG';
export const SET_SHOW_BACK_BUTTON = 'SET_SHOW_BACK_BUTTON';
export const SET_UNSHOW_BACK_BUTTON = 'SET_UNSHOW_BACK_BUTTON';
export const SET_SHOW_MSG = 'SET_SHOW_MSG';
export const SET_UNSHOW_MSG = 'SET_UNSHOW_MSG';

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

const setShowBackButton = (state, backFunction) => ({
  ...state,
  showBackButton: true,
  backFunction,
});

const setunShowBackButton = state => ({
  ...state,
  showBackButton: false,
  backFunction: null,
});

const setShowMsgBar = (state, msg) => ({
  ...state,
  openMsgBar: true,
  msgBarText: msg,
});

const setunShowMsgBar = state => ({
  ...state,
  openMsgBar: false,
  msgBarText: '',
});

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
    case SET_SHOW_BACK_BUTTON:
      return setShowBackButton(state, action.backFunction);
    case SET_UNSHOW_BACK_BUTTON:
      return setunShowBackButton(state);
    case SET_SHOW_MSG:
      return setShowMsgBar(state, action.msg);
    case SET_UNSHOW_MSG:
      return setunShowMsgBar(state);
    default:
      return state;
  }
};
