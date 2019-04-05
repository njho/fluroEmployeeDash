import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import common from './Reducers/common';
import user from './Reducers/user';
import company from './Reducers/company';

const reducer = combineReducers({
  common,
  user,
  company
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
