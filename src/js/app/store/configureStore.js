import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

import { routerMiddleware, push } from 'react-router-redux'


export default function configureStore(initialState, browserHistory) {
    // Apply the middleware to the store
    const middleware = routerMiddleware(browserHistory)
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, createLogger(), middleware)
    );

    return store;
}
