import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import gene from './gene';
import disease from './disease';

const rootReducer = combineReducers({
      gene,
      disease,
      routing: routerReducer
})

export default rootReducer;
