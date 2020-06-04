import { REMOVE_ALERT, SET_ALERT } from '../actions/types';

const initialeState = [];

export default function (state = initialeState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
