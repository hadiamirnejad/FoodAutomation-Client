import toastAction from '../../actions/toastAction';

const initialState = [];

export const toastReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case toastAction.ADDTOAST:
      return [...state, action.toast];
    case toastAction.REMOVETOAST:
      return state.filter((s,index)=>index>state.findIndex((t)=>t.id===action.id));
    default:
      return state;
  }
};