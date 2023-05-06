import authAction from '../../actions/authAction';

const initialState = {
  user: null,
};

export const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case authAction.LOGIN:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};