import themeAction from '../../actions/themeAction';

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
  themeSetting: false,
  sidebarMenu: false,
  colorMode: '#03C9D7',
  colorName: 'greenTheme',
  themeMode: 'Light',
  pinChat: true,
  screenSize: 1000,
  lang: 'fa',
  direction: 'rtl',
};

export const themeReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case themeAction.SHOW_ITEM:
      return {
        ...state,
        chat: false,
        cart: false,
        userProfile: false,
        notification: state.pinChat?state.notification:false,
        themeSetting: false,
        [action.payload.value]: action.payload.show,
      };
    case themeAction.CLOSE_ITEM:
      return {
        ...state,
        chat: false,
        cart: false,
        userProfile: false,
        notification: (state.pinChat && action.value !== 'notification')?state.notification:false,
        themeSetting: false,
      };
    case themeAction.SHOW_SIDEBAR:
      return {
        ...state,
        sidebarMenu: action.sidebarMenu,
      };
    case themeAction.CHANGE_THEME:
      localStorage.setItem('themeMode', action.themeMode);
      return {
        ...state,
        themeMode: action.themeMode,
      };
    case themeAction.CHANGE_COLOR:
      localStorage.setItem('colorMode', action.payload.colorMode);
      localStorage.setItem('colorName', action.payload.colorName);
      return {
        ...state,
        colorMode: action.payload.colorMode,
        colorName: action.payload.colorName,
      };
    case themeAction.SCREEN_SIZE:
      return {
        ...state,
        screenSize: action.screenSize,
      };
    case themeAction.LANG:
      return {
        ...state,
        lang: action.lang,
      };
    case themeAction.DIR:
      return {
        ...state,
        direction: action.dir,
      };
    case themeAction.CHAT_SIDE:
      return {
        ...state,
        pinChat: action.pinChat,
      };
    default:
      return state;
  }
};
