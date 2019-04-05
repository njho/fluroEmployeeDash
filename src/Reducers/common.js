export default (state = {}, action) => {
  switch (action.type) {
    case 'PREVIOUS_USER':
      return {
        ...state,
        previousUser: true
      };
    default:
      break;
  }
  return state;
};
