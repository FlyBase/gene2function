import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';

import App from './containers/App';

import SearchResult from './components/results/SearchResult';
import OrthologResult from './components/results/OrthologResult';

console.debug("Creating store");
const initialState = {};
const store = configureStore(initialState, browserHistory);

console.debug("Creating history");
const history = syncHistoryWithStore(browserHistory, store);

console.debug("Rendering App");
render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="search/:term" component={SearchResult} />
                <Route path="search/gene/:taxid/symbol/:symbol" component={SearchResult} />
                <Route path="ortholog/:taxid/:gene" component={OrthologResult} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
