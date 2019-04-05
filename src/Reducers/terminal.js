export default (
  state = {
    passengerTicket: null
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_PASSENGER_TICKET':
      return {
        ...state,
        passengerTicket: action.value
      };
    default:
      return state;
  }
};
