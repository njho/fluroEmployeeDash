export default (
  state = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null
  },
  action
) => {
  switch (action.type) {
    case 'PREVIOUS_USER':
      return {
        ...state,
        previousUser: true
      };
    case 'SET_USER':
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
};
