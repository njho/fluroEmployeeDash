export default (
  state = {
    company: {
      name: null,
      phoneNumber: null,
      logoUrl: null,
      companyId: null
    },
    routes: [],
    employees: [],
    zones: [],
    vehicles: [],
    creditCards: [],
    subscription: null
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_COMPANY_EMPLOYEES':
      return {
        ...state,
        employees: action.value
      };
    case 'UPDATE_COMPANY_INFORMATION':
      return {
        ...state,
        company: { ...action.value }
      };
    case 'UPDATE_COMPANY_ZONES':
      return {
        ...state,
        zones: action.value
      };
    case 'UPDATE_COMPANY_VEHICLES':
      return {
        ...state,
        vehicles: action.value
      };
    case 'UPDATE_COMPANY_CREDIT_CARDS':
      return {
        ...state,
        creditCards: action.value
      };
    case 'UPDATE_COMPANY_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.value
      };
    default:
      return state;
  }
};
