import { combineReducers } from 'redux';
import { authReducer } from './auth/authReducer';
import { themeReducer } from './theme/themeReducer';
import { toastReducer } from './toast/toastReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  item: themeReducer,
  toast: toastReducer,
});

export default rootReducer;
