import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  GET_COMPANIES,
} from '../actions/types';

const initialState = {
  profile: false,
  companies: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null,
      };
    default:
      return state;
  }
}
