import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import rootReducer from './reducers';

import App from './containers/App';
import GeneResult from './components/GeneResult';
import DiseaseResult from './components/DiseaseResult';

console.debug("Creating store");

const store = createStore(rootReducer);

console.debug("Creating history");
const history = syncHistoryWithStore(browserHistory, store);

console.debug("Rendering App");
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="search/organism/:org/gene/:term" component={GeneResult} />
                <Route path="search/disease/:term" component={DiseaseResult} /> 
                <Route path="orthologs/:gene" component={GeneResult} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);
