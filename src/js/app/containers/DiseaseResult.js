import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

import App from '../components/App';

function mapStateToProps(state) {
    console.debug("mapping state to props");
    return {
        gene: state.gene
    };
}

function mapDispatchToProps(dispatch) {
    console.debug("Mapping dispatch to props");
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
