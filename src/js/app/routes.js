import React from 'react';
import { Route } from 'react-router';
import { App } from './containers/App';
//import { GeneResult } from './components/GeneResult';

export default (
    <Route path="/" component={App}>
        <Route path="search/gene/:species/:term" component={GeneResult} />
        <Route path="search/disease/:term" component={GeneResult} /> 
    </Route>
)
